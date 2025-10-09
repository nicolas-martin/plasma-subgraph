import {
	BigInt,
	Bytes,
	ethereum,
	Address
} from '@graphprotocol/graph-ts'

import {
	Deposit as DepositEvent,
	Withdraw as WithdrawEvent,
	Borrow as BorrowEvent,
	Repay as RepayEvent,
	Transfer as TransferEvent,
	AddCreditManager as AddCreditManagerEvent,
	IncurUncoveredLoss as IncurUncoveredLossEvent,
	gearbox as GearboxContract
} from '../generated/GearboxPool/gearbox'

import {
	Pool,
	User,
	CreditManager,
	Deposit,
	Withdraw,
	Borrow,
	Repay,
	Transfer,
	UncoveredLoss
} from '../generated/schema'

const ZERO_BI = BigInt.fromI32(0)
const ONE_BI = BigInt.fromI32(1)
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function createEventID(event: ethereum.Event): string {
	return event.transaction.hash.toHexString()
		.concat('-')
		.concat(event.logIndex.toString())
}

function getOrCreatePool(address: Address, timestamp: BigInt): Pool {
	let poolId = address.toHexString().toLowerCase()
	let pool = Pool.load(poolId)

	if (pool == null) {
		pool = new Pool(poolId)
		let contract = GearboxContract.bind(address)

		// Try to load contract data
		let nameResult = contract.try_name()
		let symbolResult = contract.try_symbol()
		let underlyingResult = contract.try_underlyingToken()
		let totalDebtLimitResult = contract.try_totalDebtLimit()
		let baseInterestRateResult = contract.try_baseInterestRate()

		pool.name = nameResult.reverted ? '' : nameResult.value
		pool.symbol = symbolResult.reverted ? '' : symbolResult.value
		pool.underlyingToken = underlyingResult.reverted ? Bytes.fromHexString(ZERO_ADDRESS) : underlyingResult.value
		pool.totalAssets = ZERO_BI
		pool.totalShares = ZERO_BI
		pool.totalBorrowed = ZERO_BI
		pool.totalDebtLimit = totalDebtLimitResult.reverted ? ZERO_BI : totalDebtLimitResult.value
		pool.baseInterestRate = baseInterestRateResult.reverted ? ZERO_BI : baseInterestRateResult.value
		pool.depositCount = ZERO_BI
		pool.withdrawCount = ZERO_BI
		pool.borrowCount = ZERO_BI
		pool.repayCount = ZERO_BI
		pool.uniqueDepositors = ZERO_BI
		pool.creditManagers = []
		pool.createdAt = timestamp
		pool.lastUpdateAt = timestamp
	}

	return pool
}

function getOrCreateUser(address: Bytes, timestamp: BigInt, pool: Pool): User {
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

	user.lastActivityAt = timestamp

	if (isNew) {
		pool.uniqueDepositors = pool.uniqueDepositors.plus(ONE_BI)
		pool.save()
	}

	return user
}

function getOrCreateCreditManager(
	address: Bytes,
	poolAddress: Address,
	timestamp: BigInt
): CreditManager {
	let cmId = address.toHexString().toLowerCase()
	let cm = CreditManager.load(cmId)

	if (cm == null) {
		cm = new CreditManager(cmId)
		let pool = getOrCreatePool(poolAddress, timestamp)
		cm.pool = pool.id
		cm.totalBorrowed = ZERO_BI
		cm.currentDebt = ZERO_BI
		cm.debtLimit = ZERO_BI
		cm.borrowCount = ZERO_BI
		cm.repayCount = ZERO_BI
		cm.addedAt = timestamp

		// Try to get debt limit from contract
		let contract = GearboxContract.bind(poolAddress)
		let debtLimitResult = contract.try_creditManagerDebtLimit(Address.fromBytes(address))
		if (!debtLimitResult.reverted) {
			cm.debtLimit = debtLimitResult.value
		}
	}

	return cm
}

export function handleDeposit(event: DepositEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.owner.toHexString().toLowerCase()),
		event.block.timestamp,
		pool
	)

	user.totalDeposited = user.totalDeposited.plus(event.params.assets)
	user.currentShares = user.currentShares.plus(event.params.shares)
	user.depositCount = user.depositCount.plus(ONE_BI)
	user.save()

	let deposit = new Deposit(createEventID(event))
	deposit.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	deposit.user = user.id
	deposit.sender = Bytes.fromHexString(event.params.sender.toHexString().toLowerCase())
	deposit.assets = event.params.assets
	deposit.shares = event.params.shares
	deposit.timestamp = event.block.timestamp
	deposit.blockNumber = event.block.number
	deposit.transactionHash = event.transaction.hash
	deposit.save()

	pool.totalAssets = pool.totalAssets.plus(event.params.assets)
	pool.totalShares = pool.totalShares.plus(event.params.shares)
	pool.depositCount = pool.depositCount.plus(ONE_BI)
	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.owner.toHexString().toLowerCase()),
		event.block.timestamp,
		pool
	)

	user.totalWithdrawn = user.totalWithdrawn.plus(event.params.assets)
	user.currentShares = user.currentShares.minus(event.params.shares)
	user.withdrawCount = user.withdrawCount.plus(ONE_BI)
	user.save()

	let withdraw = new Withdraw(createEventID(event))
	withdraw.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	withdraw.user = user.id
	withdraw.sender = Bytes.fromHexString(event.params.sender.toHexString().toLowerCase())
	withdraw.receiver = Bytes.fromHexString(event.params.receiver.toHexString().toLowerCase())
	withdraw.assets = event.params.assets
	withdraw.shares = event.params.shares
	withdraw.timestamp = event.block.timestamp
	withdraw.blockNumber = event.block.number
	withdraw.transactionHash = event.transaction.hash
	withdraw.save()

	pool.totalAssets = pool.totalAssets.minus(event.params.assets)
	pool.totalShares = pool.totalShares.minus(event.params.shares)
	pool.withdrawCount = pool.withdrawCount.plus(ONE_BI)
	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}

export function handleBorrow(event: BorrowEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let cm = getOrCreateCreditManager(
		Bytes.fromHexString(event.params.creditManager.toHexString().toLowerCase()),
		event.address,
		event.block.timestamp
	)

	cm.totalBorrowed = cm.totalBorrowed.plus(event.params.amount)
	cm.currentDebt = cm.currentDebt.plus(event.params.amount)
	cm.borrowCount = cm.borrowCount.plus(ONE_BI)
	cm.save()

	let borrow = new Borrow(createEventID(event))
	borrow.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	borrow.creditManager = cm.id
	borrow.creditAccount = Bytes.fromHexString(event.params.creditAccount.toHexString().toLowerCase())
	borrow.amount = event.params.amount
	borrow.timestamp = event.block.timestamp
	borrow.blockNumber = event.block.number
	borrow.transactionHash = event.transaction.hash
	borrow.save()

	pool.totalBorrowed = pool.totalBorrowed.plus(event.params.amount)
	pool.borrowCount = pool.borrowCount.plus(ONE_BI)
	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}

export function handleRepay(event: RepayEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let cm = getOrCreateCreditManager(
		Bytes.fromHexString(event.params.creditManager.toHexString().toLowerCase()),
		event.address,
		event.block.timestamp
	)

	cm.currentDebt = cm.currentDebt.minus(event.params.borrowedAmount)
	cm.repayCount = cm.repayCount.plus(ONE_BI)
	cm.save()

	let repay = new Repay(createEventID(event))
	repay.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	repay.creditManager = cm.id
	repay.borrowedAmount = event.params.borrowedAmount
	repay.profit = event.params.profit
	repay.loss = event.params.loss
	repay.timestamp = event.block.timestamp
	repay.blockNumber = event.block.number
	repay.transactionHash = event.transaction.hash
	repay.save()

	pool.totalBorrowed = pool.totalBorrowed.minus(event.params.borrowedAmount)
	pool.totalAssets = pool.totalAssets.plus(event.params.profit).minus(event.params.loss)
	pool.repayCount = pool.repayCount.plus(ONE_BI)
	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}

export function handleTransfer(event: TransferEvent): void {
	// Skip mint/burn transfers (from/to zero address)
	if (
		event.params.from.toHexString().toLowerCase() == ZERO_ADDRESS ||
		event.params.to.toHexString().toLowerCase() == ZERO_ADDRESS
	) {
		return
	}

	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let transfer = new Transfer(createEventID(event))
	transfer.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	transfer.from = Bytes.fromHexString(event.params.from.toHexString().toLowerCase())
	transfer.to = Bytes.fromHexString(event.params.to.toHexString().toLowerCase())
	transfer.value = event.params.value
	transfer.timestamp = event.block.timestamp
	transfer.blockNumber = event.block.number
	transfer.transactionHash = event.transaction.hash
	transfer.save()

	// Update user balances
	let fromUser = getOrCreateUser(
		Bytes.fromHexString(event.params.from.toHexString().toLowerCase()),
		event.block.timestamp,
		pool
	)
	fromUser.currentShares = fromUser.currentShares.minus(event.params.value)
	fromUser.save()

	let toUser = getOrCreateUser(
		Bytes.fromHexString(event.params.to.toHexString().toLowerCase()),
		event.block.timestamp,
		pool
	)
	toUser.currentShares = toUser.currentShares.plus(event.params.value)
	toUser.save()
}

export function handleAddCreditManager(event: AddCreditManagerEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let cm = getOrCreateCreditManager(
		Bytes.fromHexString(event.params.creditManager.toHexString().toLowerCase()),
		event.address,
		event.block.timestamp
	)
	cm.save()

	// Add to pool's credit managers list
	let creditManagers = pool.creditManagers
	let cmBytes = Bytes.fromHexString(event.params.creditManager.toHexString().toLowerCase())

	// Check if not already in list
	let found = false
	for (let i = 0; i < creditManagers.length; i++) {
		if (creditManagers[i].equals(cmBytes)) {
			found = true
			break
		}
	}

	if (!found) {
		creditManagers.push(cmBytes)
		pool.creditManagers = creditManagers
	}

	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}

export function handleIncurUncoveredLoss(event: IncurUncoveredLossEvent): void {
	let pool = getOrCreatePool(event.address, event.block.timestamp)

	let loss = new UncoveredLoss(createEventID(event))
	loss.pool = Bytes.fromHexString(event.address.toHexString().toLowerCase())
	loss.creditManager = Bytes.fromHexString(event.params.creditManager.toHexString().toLowerCase())
	loss.loss = event.params.loss
	loss.timestamp = event.block.timestamp
	loss.blockNumber = event.block.number
	loss.transactionHash = event.transaction.hash
	loss.save()

	// Update pool total assets to reflect loss
	pool.totalAssets = pool.totalAssets.minus(event.params.loss)
	pool.lastUpdateAt = event.block.timestamp
	pool.save()
}
