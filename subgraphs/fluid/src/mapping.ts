import {
	BigInt,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	Deposit as DepositEvent,
	Withdraw as WithdrawEvent,
	Transfer as TransferEvent,
	Approval as ApprovalEvent,
	LogRebalance as LogRebalanceEvent,
	LogRescueFunds as LogRescueFundsEvent,
	LogUpdateRates as LogUpdateRatesEvent,
	LogUpdateRebalancer as LogUpdateRebalancerEvent,
	LogUpdateRewards as LogUpdateRewardsEvent
} from '../generated/Fluid/Fluid'

import {
	User,
	UserPosition,
	Deposit,
	Withdrawal,
	Transfer,
	Rebalance,
	RateUpdate,
	RebalancerUpdate,
	RewardsUpdate,
	RescueFunds,
	DailyVaultMetrics,
	Vault
} from '../generated/schema'

const VAULT_ID = "vault"
const ZERO_BI = BigInt.fromI32(0)
const ONE_BI = BigInt.fromI32(1)
const SECONDS_PER_DAY = BigInt.fromI32(86400)

function createEventID(event: ethereum.Event): string {
	return event.transaction.hash.toHexString()
		.concat('-')
		.concat(event.logIndex.toString())
}

function getDayID(timestamp: BigInt): string {
	let day = timestamp.div(SECONDS_PER_DAY)
	return day.toString()
}

function getDayStartTimestamp(timestamp: BigInt): BigInt {
	return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
}

function getOrCreateVault(): Vault {
	let vault = Vault.load(VAULT_ID)
	if (vault == null) {
		vault = new Vault(VAULT_ID)
		vault.totalDeposits = ZERO_BI
		vault.totalWithdrawals = ZERO_BI
		vault.totalShares = ZERO_BI
		vault.depositCount = ZERO_BI
		vault.withdrawalCount = ZERO_BI
		vault.transferCount = ZERO_BI
		vault.rebalanceCount = ZERO_BI
		vault.uniqueUsers = ZERO_BI
		vault.currentRebalancer = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		vault.currentRewardsModel = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		vault.latestTokenExchangePrice = ZERO_BI
		vault.latestLiquidityExchangePrice = ZERO_BI
		vault.lastRateUpdateAt = ZERO_BI
	}
	return vault
}

function getOrCreateUser(address: Bytes, timestamp: BigInt): User {
	let userId = address.toHexString().toLowerCase()
	let user = User.load(userId)
	let isNew = false

	if (user == null) {
		user = new User(userId)
		user.totalDeposited = ZERO_BI
		user.totalWithdrawn = ZERO_BI
		user.currentShares = ZERO_BI
		user.depositCount = ZERO_BI
		user.withdrawCount = ZERO_BI
		user.firstDepositAt = timestamp
		isNew = true
	}

	user.lastInteractionAt = timestamp

	if (isNew) {
		let vault = getOrCreateVault()
		vault.uniqueUsers = vault.uniqueUsers.plus(ONE_BI)
		vault.save()
	}

	return user
}

function getOrCreateUserPosition(userId: string, timestamp: BigInt): UserPosition {
	let position = UserPosition.load(userId)
	if (position == null) {
		position = new UserPosition(userId)
		position.user = userId
		position.currentShares = ZERO_BI
		position.totalDeposited = ZERO_BI
		position.totalWithdrawn = ZERO_BI
		position.lastUpdated = timestamp
	}
	return position
}

function getOrCreateDailyMetrics(timestamp: BigInt): DailyVaultMetrics {
	let dayId = getDayID(timestamp)
	let metrics = DailyVaultMetrics.load(dayId)
	
	if (metrics == null) {
		metrics = new DailyVaultMetrics(dayId)
		metrics.date = getDayStartTimestamp(timestamp)
		metrics.totalDeposits = ZERO_BI
		metrics.totalWithdrawals = ZERO_BI
		metrics.depositCount = ZERO_BI
		metrics.withdrawalCount = ZERO_BI
		metrics.netFlow = ZERO_BI
		metrics.uniqueDepositors = ZERO_BI
		metrics.uniqueWithdrawers = ZERO_BI
	}
	
	return metrics
}

export function handleDeposit(event: DepositEvent): void {
	let ownerAddress = Bytes.fromHexString(event.params.owner.toHexString().toLowerCase())
	let user = getOrCreateUser(ownerAddress, event.block.timestamp)
	
	user.totalDeposited = user.totalDeposited.plus(event.params.assets)
	user.currentShares = user.currentShares.plus(event.params.shares)
	user.depositCount = user.depositCount.plus(ONE_BI)
	user.save()

	let position = getOrCreateUserPosition(user.id, event.block.timestamp)
	position.currentShares = position.currentShares.plus(event.params.shares)
	position.totalDeposited = position.totalDeposited.plus(event.params.assets)
	position.lastUpdated = event.block.timestamp
	position.save()

	let deposit = new Deposit(createEventID(event))
	deposit.user = user.id
	deposit.sender = Bytes.fromHexString(event.params.sender.toHexString().toLowerCase())
	deposit.owner = ownerAddress
	deposit.assets = event.params.assets
	deposit.shares = event.params.shares
	deposit.timestamp = event.block.timestamp
	deposit.blockNumber = event.block.number
	deposit.transactionHash = event.transaction.hash
	deposit.save()

	let vault = getOrCreateVault()
	vault.totalDeposits = vault.totalDeposits.plus(event.params.assets)
	vault.totalShares = vault.totalShares.plus(event.params.shares)
	vault.depositCount = vault.depositCount.plus(ONE_BI)
	vault.save()

	let dailyMetrics = getOrCreateDailyMetrics(event.block.timestamp)
	dailyMetrics.totalDeposits = dailyMetrics.totalDeposits.plus(event.params.assets)
	dailyMetrics.depositCount = dailyMetrics.depositCount.plus(ONE_BI)
	dailyMetrics.netFlow = dailyMetrics.totalDeposits.minus(dailyMetrics.totalWithdrawals)
	dailyMetrics.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
	let ownerAddress = Bytes.fromHexString(event.params.owner.toHexString().toLowerCase())
	let user = getOrCreateUser(ownerAddress, event.block.timestamp)
	
	user.totalWithdrawn = user.totalWithdrawn.plus(event.params.assets)
	user.currentShares = user.currentShares.minus(event.params.shares)
	user.withdrawCount = user.withdrawCount.plus(ONE_BI)
	user.save()

	let position = getOrCreateUserPosition(user.id, event.block.timestamp)
	position.currentShares = position.currentShares.minus(event.params.shares)
	position.totalWithdrawn = position.totalWithdrawn.plus(event.params.assets)
	position.lastUpdated = event.block.timestamp
	position.save()

	let withdrawal = new Withdrawal(createEventID(event))
	withdrawal.user = user.id
	withdrawal.sender = Bytes.fromHexString(event.params.sender.toHexString().toLowerCase())
	withdrawal.receiver = Bytes.fromHexString(event.params.receiver.toHexString().toLowerCase())
	withdrawal.owner = ownerAddress
	withdrawal.assets = event.params.assets
	withdrawal.shares = event.params.shares
	withdrawal.timestamp = event.block.timestamp
	withdrawal.blockNumber = event.block.number
	withdrawal.transactionHash = event.transaction.hash
	withdrawal.save()

	let vault = getOrCreateVault()
	vault.totalWithdrawals = vault.totalWithdrawals.plus(event.params.assets)
	vault.totalShares = vault.totalShares.minus(event.params.shares)
	vault.withdrawalCount = vault.withdrawalCount.plus(ONE_BI)
	vault.save()

	let dailyMetrics = getOrCreateDailyMetrics(event.block.timestamp)
	dailyMetrics.totalWithdrawals = dailyMetrics.totalWithdrawals.plus(event.params.assets)
	dailyMetrics.withdrawalCount = dailyMetrics.withdrawalCount.plus(ONE_BI)
	dailyMetrics.netFlow = dailyMetrics.totalDeposits.minus(dailyMetrics.totalWithdrawals)
	dailyMetrics.save()
}

export function handleTransfer(event: TransferEvent): void {
	let transfer = new Transfer(createEventID(event))
	transfer.from = Bytes.fromHexString(event.params.from.toHexString().toLowerCase())
	transfer.to = Bytes.fromHexString(event.params.to.toHexString().toLowerCase())
	transfer.value = event.params.value
	transfer.timestamp = event.block.timestamp
	transfer.blockNumber = event.block.number
	transfer.transactionHash = event.transaction.hash
	transfer.save()

	let vault = getOrCreateVault()
	vault.transferCount = vault.transferCount.plus(ONE_BI)
	vault.save()

	// Update sender position
	let fromAddress = event.params.from.toHexString().toLowerCase()
	if (fromAddress != "0x0000000000000000000000000000000000000000") {
		let fromUser = getOrCreateUser(
			Bytes.fromHexString(fromAddress),
			event.block.timestamp
		)
		fromUser.currentShares = fromUser.currentShares.minus(event.params.value)
		fromUser.save()

		let fromPosition = getOrCreateUserPosition(fromUser.id, event.block.timestamp)
		fromPosition.currentShares = fromPosition.currentShares.minus(event.params.value)
		fromPosition.lastUpdated = event.block.timestamp
		fromPosition.save()
	}

	// Update receiver position
	let toAddress = event.params.to.toHexString().toLowerCase()
	if (toAddress != "0x0000000000000000000000000000000000000000") {
		let toUser = getOrCreateUser(
			Bytes.fromHexString(toAddress),
			event.block.timestamp
		)
		toUser.currentShares = toUser.currentShares.plus(event.params.value)
		toUser.save()

		let toPosition = getOrCreateUserPosition(toUser.id, event.block.timestamp)
		toPosition.currentShares = toPosition.currentShares.plus(event.params.value)
		toPosition.lastUpdated = event.block.timestamp
		toPosition.save()
	}
}

export function handleLogRebalance(event: LogRebalanceEvent): void {
	let rebalance = new Rebalance(createEventID(event))
	rebalance.assets = event.params.assets
	rebalance.timestamp = event.block.timestamp
	rebalance.blockNumber = event.block.number
	rebalance.transactionHash = event.transaction.hash
	rebalance.save()

	let vault = getOrCreateVault()
	vault.rebalanceCount = vault.rebalanceCount.plus(ONE_BI)
	vault.save()
}

export function handleLogUpdateRates(event: LogUpdateRatesEvent): void {
	let rateUpdate = new RateUpdate(createEventID(event))
	rateUpdate.tokenExchangePrice = event.params.tokenExchangePrice
	rateUpdate.liquidityExchangePrice = event.params.liquidityExchangePrice
	rateUpdate.timestamp = event.block.timestamp
	rateUpdate.blockNumber = event.block.number
	rateUpdate.transactionHash = event.transaction.hash
	rateUpdate.save()

	let vault = getOrCreateVault()
	vault.latestTokenExchangePrice = event.params.tokenExchangePrice
	vault.latestLiquidityExchangePrice = event.params.liquidityExchangePrice
	vault.lastRateUpdateAt = event.block.timestamp
	vault.save()
}

export function handleLogUpdateRebalancer(event: LogUpdateRebalancerEvent): void {
	let update = new RebalancerUpdate(createEventID(event))
	update.rebalancer = Bytes.fromHexString(event.params.rebalancer.toHexString().toLowerCase())
	update.timestamp = event.block.timestamp
	update.blockNumber = event.block.number
	update.transactionHash = event.transaction.hash
	update.save()

	let vault = getOrCreateVault()
	vault.currentRebalancer = update.rebalancer
	vault.save()
}

export function handleLogUpdateRewards(event: LogUpdateRewardsEvent): void {
	let update = new RewardsUpdate(createEventID(event))
	update.rewardsRateModel = Bytes.fromHexString(event.params.rewardsRateModel.toHexString().toLowerCase())
	update.timestamp = event.block.timestamp
	update.blockNumber = event.block.number
	update.transactionHash = event.transaction.hash
	update.save()

	let vault = getOrCreateVault()
	vault.currentRewardsModel = update.rewardsRateModel
	vault.save()
}

export function handleLogRescueFunds(event: LogRescueFundsEvent): void {
	let rescue = new RescueFunds(createEventID(event))
	rescue.token = Bytes.fromHexString(event.params.token.toHexString().toLowerCase())
	rescue.timestamp = event.block.timestamp
	rescue.blockNumber = event.block.number
	rescue.transactionHash = event.transaction.hash
	rescue.save()
}