import {
	BigInt,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	Borrow as BorrowEvent,
	FlashLoan as FlashLoanEvent,
	LiquidationCall as LiquidationCallEvent,
	Repay as RepayEvent,
	ReserveDataUpdated as ReserveDataUpdatedEvent,
	Supply as SupplyEvent,
	Withdraw as WithdrawEvent
} from '../generated/Aave/aave'

import {
	Reserve,
	User,
	UserReservePosition,
	Supply,
	Borrow,
	Withdraw,
	Repay,
	Liquidation,
	FlashLoan,
	ReserveDataUpdate,
	Protocol
} from '../generated/schema'

const PROTOCOL_ID = "protocol"
const ZERO_BI = BigInt.fromI32(0)
const ONE_BI = BigInt.fromI32(1)

function createEventID(event: ethereum.Event): string {
	return event.transaction.hash.toHexString()
		.concat('-')
		.concat(event.logIndex.toString())
}

function getOrCreateProtocol(): Protocol {
	let protocol = Protocol.load(PROTOCOL_ID)
	if (protocol == null) {
		protocol = new Protocol(PROTOCOL_ID)
		protocol.totalSupply = ZERO_BI
		protocol.totalBorrows = ZERO_BI
		protocol.totalRepays = ZERO_BI
		protocol.totalLiquidations = ZERO_BI
		protocol.totalFlashLoans = ZERO_BI
		protocol.uniqueUsers = ZERO_BI
		protocol.uniqueReserves = ZERO_BI
	}
	return protocol
}

function getOrCreateReserve(asset: Bytes): Reserve {
	let reserveId = asset.toHexString().toLowerCase()
	let reserve = Reserve.load(reserveId)
	let isNew = false

	if (reserve == null) {
		reserve = new Reserve(reserveId)
		reserve.asset = asset
		reserve.aTokenAddress = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		reserve.variableDebtTokenAddress = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		reserve.totalSupplied = ZERO_BI
		reserve.totalBorrowed = ZERO_BI
		reserve.liquidityRate = ZERO_BI
		reserve.variableBorrowRate = ZERO_BI
		reserve.liquidityIndex = ZERO_BI
		reserve.variableBorrowIndex = ZERO_BI
		reserve.lastUpdateTimestamp = ZERO_BI
		isNew = true
	}

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueReserves = protocol.uniqueReserves.plus(ONE_BI)
		protocol.save()
	}

	return reserve
}

function getOrCreateUser(address: Bytes, timestamp: BigInt): User {
	let userId = address.toHexString().toLowerCase()
	let user = User.load(userId)
	let isNew = false

	if (user == null) {
		user = new User(userId)
		user.totalSupplied = ZERO_BI
		user.totalBorrowed = ZERO_BI
		user.totalRepaid = ZERO_BI
		user.firstInteractionAt = timestamp
		isNew = true
	}

	user.lastInteractionAt = timestamp

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueUsers = protocol.uniqueUsers.plus(ONE_BI)
		protocol.save()
	}

	return user
}

function getOrCreateUserReservePosition(userId: string, reserveId: string, timestamp: BigInt): UserReservePosition {
	let positionId = userId.concat('-').concat(reserveId)
	let position = UserReservePosition.load(positionId)

	if (position == null) {
		position = new UserReservePosition(positionId)
		position.user = userId
		position.reserve = reserveId
		position.currentSupplied = ZERO_BI
		position.currentBorrowed = ZERO_BI
		position.lastUpdateTimestamp = timestamp
	}

	return position
}

export function handleSupply(event: SupplyEvent): void {
	let reserve = getOrCreateReserve(event.params.reserve)
	reserve.totalSupplied = reserve.totalSupplied.plus(event.params.amount)
	reserve.save()

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.onBehalfOf.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalSupplied = user.totalSupplied.plus(event.params.amount)
	user.save()

	let position = getOrCreateUserReservePosition(user.id, reserve.id, event.block.timestamp)
	position.currentSupplied = position.currentSupplied.plus(event.params.amount)
	position.lastUpdateTimestamp = event.block.timestamp
	position.save()

	let supply = new Supply(createEventID(event))
	supply.reserve = reserve.id
	supply.user = user.id
	supply.onBehalfOf = Bytes.fromHexString(event.params.onBehalfOf.toHexString().toLowerCase())
	supply.amount = event.params.amount
	supply.referralCode = event.params.referralCode
	supply.timestamp = event.block.timestamp
	supply.blockNumber = event.block.number
	supply.transactionHash = event.transaction.hash
	supply.save()

	let protocol = getOrCreateProtocol()
	protocol.totalSupply = protocol.totalSupply.plus(event.params.amount)
	protocol.save()
}

export function handleBorrow(event: BorrowEvent): void {
	let reserve = getOrCreateReserve(event.params.reserve)
	reserve.totalBorrowed = reserve.totalBorrowed.plus(event.params.amount)
	reserve.save()

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.onBehalfOf.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalBorrowed = user.totalBorrowed.plus(event.params.amount)
	user.save()

	let position = getOrCreateUserReservePosition(user.id, reserve.id, event.block.timestamp)
	position.currentBorrowed = position.currentBorrowed.plus(event.params.amount)
	position.lastUpdateTimestamp = event.block.timestamp
	position.save()

	let borrow = new Borrow(createEventID(event))
	borrow.reserve = reserve.id
	borrow.user = user.id
	borrow.onBehalfOf = Bytes.fromHexString(event.params.onBehalfOf.toHexString().toLowerCase())
	borrow.amount = event.params.amount
	borrow.interestRateMode = event.params.interestRateMode
	borrow.borrowRate = event.params.borrowRate
	borrow.referralCode = event.params.referralCode
	borrow.timestamp = event.block.timestamp
	borrow.blockNumber = event.block.number
	borrow.transactionHash = event.transaction.hash
	borrow.save()

	let protocol = getOrCreateProtocol()
	protocol.totalBorrows = protocol.totalBorrows.plus(event.params.amount)
	protocol.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
	let reserve = getOrCreateReserve(event.params.reserve)
	reserve.totalSupplied = reserve.totalSupplied.minus(event.params.amount)
	reserve.save()

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.user.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.save()

	let position = getOrCreateUserReservePosition(user.id, reserve.id, event.block.timestamp)
	position.currentSupplied = position.currentSupplied.minus(event.params.amount)
	position.lastUpdateTimestamp = event.block.timestamp
	position.save()

	let withdraw = new Withdraw(createEventID(event))
	withdraw.reserve = reserve.id
	withdraw.user = user.id
	withdraw.to = Bytes.fromHexString(event.params.to.toHexString().toLowerCase())
	withdraw.amount = event.params.amount
	withdraw.timestamp = event.block.timestamp
	withdraw.blockNumber = event.block.number
	withdraw.transactionHash = event.transaction.hash
	withdraw.save()
}

export function handleRepay(event: RepayEvent): void {
	let reserve = getOrCreateReserve(event.params.reserve)
	reserve.totalBorrowed = reserve.totalBorrowed.minus(event.params.amount)
	reserve.save()

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.user.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalRepaid = user.totalRepaid.plus(event.params.amount)
	user.save()

	let position = getOrCreateUserReservePosition(user.id, reserve.id, event.block.timestamp)
	position.currentBorrowed = position.currentBorrowed.minus(event.params.amount)
	position.lastUpdateTimestamp = event.block.timestamp
	position.save()

	let repay = new Repay(createEventID(event))
	repay.reserve = reserve.id
	repay.user = user.id
	repay.repayer = Bytes.fromHexString(event.params.repayer.toHexString().toLowerCase())
	repay.amount = event.params.amount
	repay.useATokens = event.params.useATokens
	repay.timestamp = event.block.timestamp
	repay.blockNumber = event.block.number
	repay.transactionHash = event.transaction.hash
	repay.save()

	let protocol = getOrCreateProtocol()
	protocol.totalRepays = protocol.totalRepays.plus(event.params.amount)
	protocol.save()
}

export function handleLiquidationCall(event: LiquidationCallEvent): void {
	let collateralReserve = getOrCreateReserve(event.params.collateralAsset)
	collateralReserve.save()

	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.user.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.save()

	let liquidation = new Liquidation(createEventID(event))
	liquidation.collateralReserve = collateralReserve.id
	liquidation.debtReserve = Bytes.fromHexString(event.params.debtAsset.toHexString().toLowerCase())
	liquidation.user = user.id
	liquidation.debtToCover = event.params.debtToCover
	liquidation.liquidatedCollateralAmount = event.params.liquidatedCollateralAmount
	liquidation.liquidator = Bytes.fromHexString(event.params.liquidator.toHexString().toLowerCase())
	liquidation.receiveAToken = event.params.receiveAToken
	liquidation.timestamp = event.block.timestamp
	liquidation.blockNumber = event.block.number
	liquidation.transactionHash = event.transaction.hash
	liquidation.save()

	let protocol = getOrCreateProtocol()
	protocol.totalLiquidations = protocol.totalLiquidations.plus(ONE_BI)
	protocol.save()
}

export function handleFlashLoan(event: FlashLoanEvent): void {
	let flashLoan = new FlashLoan(createEventID(event))
	flashLoan.target = Bytes.fromHexString(event.params.target.toHexString().toLowerCase())
	flashLoan.initiator = Bytes.fromHexString(event.params.initiator.toHexString().toLowerCase())
	flashLoan.asset = Bytes.fromHexString(event.params.asset.toHexString().toLowerCase())
	flashLoan.amount = event.params.amount
	flashLoan.interestRateMode = event.params.interestRateMode
	flashLoan.premium = event.params.premium
	flashLoan.referralCode = event.params.referralCode
	flashLoan.timestamp = event.block.timestamp
	flashLoan.blockNumber = event.block.number
	flashLoan.transactionHash = event.transaction.hash
	flashLoan.save()

	let protocol = getOrCreateProtocol()
	protocol.totalFlashLoans = protocol.totalFlashLoans.plus(ONE_BI)
	protocol.save()
}

export function handleReserveDataUpdated(event: ReserveDataUpdatedEvent): void {
	let reserve = getOrCreateReserve(event.params.reserve)
	reserve.liquidityRate = event.params.liquidityRate
	reserve.variableBorrowRate = event.params.variableBorrowRate
	reserve.liquidityIndex = event.params.liquidityIndex
	reserve.variableBorrowIndex = event.params.variableBorrowIndex
	reserve.lastUpdateTimestamp = event.block.timestamp
	reserve.save()

	let update = new ReserveDataUpdate(createEventID(event))
	update.reserve = Bytes.fromHexString(event.params.reserve.toHexString().toLowerCase())
	update.liquidityRate = event.params.liquidityRate
	update.stableBorrowRate = event.params.stableBorrowRate
	update.variableBorrowRate = event.params.variableBorrowRate
	update.liquidityIndex = event.params.liquidityIndex
	update.variableBorrowIndex = event.params.variableBorrowIndex
	update.timestamp = event.block.timestamp
	update.blockNumber = event.block.number
	update.transactionHash = event.transaction.hash
	update.save()
}
