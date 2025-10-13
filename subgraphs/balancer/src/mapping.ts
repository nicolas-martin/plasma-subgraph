import {
	BigInt,
	Bytes,
	ethereum,
	log
} from '@graphprotocol/graph-ts'

import {
	Swap as SwapEvent,
	LiquidityAdded as LiquidityAddedEvent,
	LiquidityRemoved as LiquidityRemovedEvent,
	PoolRegistered as PoolRegisteredEvent,
	SwapFeePercentageChanged as SwapFeePercentageChangedEvent
} from '../generated/Balancer/Balancer'

import {
	Pool,
	User,
	Swap,
	LiquidityAdd,
	LiquidityRemove,
	SwapFeeUpdate,
	TokenVolume,
	DailyPoolMetrics,
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

function getDayID(timestamp: BigInt, poolAddress: string): string {
	let day = timestamp.div(SECONDS_PER_DAY)
	return poolAddress.concat('-').concat(day.toString())
}

function getDayStartTimestamp(timestamp: BigInt): BigInt {
	return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
}

function getOrCreateVault(): Vault {
	let vault = Vault.load(VAULT_ID)
	if (vault == null) {
		vault = new Vault(VAULT_ID)
		vault.totalPools = ZERO_BI
		vault.totalSwaps = ZERO_BI
		vault.totalLiquidityAdds = ZERO_BI
		vault.totalLiquidityRemoves = ZERO_BI
		vault.uniqueUsers = ZERO_BI
		vault.totalFees = ZERO_BI
	}
	return vault
}

function getOrCreateUser(address: Bytes, timestamp: BigInt): User {
	let userId = address.toHexString().toLowerCase()
	let user = User.load(userId)
	let isNew = false

	if (user == null) {
		user = new User(userId)
		user.totalSwaps = ZERO_BI
		user.totalLiquidityProvided = ZERO_BI
		user.firstActivityAt = timestamp
		isNew = true
	}

	user.lastActivityAt = timestamp

	if (isNew) {
		let vault = getOrCreateVault()
		vault.uniqueUsers = vault.uniqueUsers.plus(ONE_BI)
		vault.save()
	}

	return user
}

function getOrCreateTokenVolume(token: Bytes, timestamp: BigInt): TokenVolume {
	let tokenId = token.toHexString().toLowerCase()
	let volume = TokenVolume.load(tokenId)
	
	if (volume == null) {
		volume = new TokenVolume(tokenId)
		volume.token = token
		volume.totalVolumeIn = ZERO_BI
		volume.totalVolumeOut = ZERO_BI
		volume.totalVolume = ZERO_BI
		volume.swapCount = ZERO_BI
		volume.lastUpdated = timestamp
	}
	
	return volume
}

function getOrCreateDailyMetrics(poolAddress: string, timestamp: BigInt): DailyPoolMetrics {
	let dayId = getDayID(timestamp, poolAddress)
	let metrics = DailyPoolMetrics.load(dayId)
	
	if (metrics == null) {
		metrics = new DailyPoolMetrics(dayId)
		metrics.pool = poolAddress
		metrics.date = getDayStartTimestamp(timestamp)
		metrics.swapCount = ZERO_BI
		metrics.volumeIn = ZERO_BI
		metrics.volumeOut = ZERO_BI
		metrics.liquidityAdds = ZERO_BI
		metrics.liquidityRemoves = ZERO_BI
		metrics.uniqueSwappers = ZERO_BI
	}
	
	return metrics
}

export function handlePoolRegistered(event: PoolRegisteredEvent): void {
	let poolId = event.params.pool.toHexString().toLowerCase()
	let pool = new Pool(poolId)
	
	pool.factory = Bytes.fromHexString(event.params.factory.toHexString().toLowerCase())
	
	// Extract token addresses from TokenConfig array
	let tokens: Bytes[] = []
	for (let i = 0; i < event.params.tokenConfig.length; i++) {
		tokens.push(Bytes.fromHexString(event.params.tokenConfig[i].token.toHexString().toLowerCase()))
	}
	pool.tokens = tokens
	
	pool.swapFeePercentage = event.params.swapFeePercentage
	pool.pauseWindowEndTime = event.params.pauseWindowEndTime.toI32()
	pool.pauseManager = Bytes.fromHexString(event.params.roleAccounts.pauseManager.toHexString().toLowerCase())
	pool.swapFeeManager = Bytes.fromHexString(event.params.roleAccounts.swapFeeManager.toHexString().toLowerCase())
	pool.poolCreator = Bytes.fromHexString(event.params.roleAccounts.poolCreator.toHexString().toLowerCase())
	pool.totalSwaps = ZERO_BI
	pool.totalLiquidityAdded = ZERO_BI
	pool.totalLiquidityRemoved = ZERO_BI
	pool.registeredAt = event.block.timestamp
	pool.registeredAtBlock = event.block.number
	pool.lastActivityAt = event.block.timestamp
	pool.save()
	
	let vault = getOrCreateVault()
	vault.totalPools = vault.totalPools.plus(ONE_BI)
	vault.save()
}

export function handleSwap(event: SwapEvent): void {
	let poolId = event.params.pool.toHexString().toLowerCase()
	let pool = Pool.load(poolId)
	
	// If pool doesn't exist, create a basic one
	if (pool == null) {
		pool = new Pool(poolId)
		pool.factory = Bytes.fromHexString("0x0000000000000000000000000000000000000000") // placeholder
		pool.tokens = []
		pool.swapFeePercentage = BigInt.fromI32(0)
		pool.pauseWindowEndTime = 0
		pool.pauseManager = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		pool.swapFeeManager = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		pool.poolCreator = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
		pool.totalSwaps = BigInt.fromI32(0)
		pool.totalLiquidityAdded = BigInt.fromI32(0)
		pool.totalLiquidityRemoved = BigInt.fromI32(0)
		pool.registeredAt = event.block.timestamp
		pool.registeredAtBlock = event.block.number
		pool.lastActivityAt = event.block.timestamp
		pool.save()
	}
	
	pool.totalSwaps = pool.totalSwaps.plus(ONE_BI)
	pool.lastActivityAt = event.block.timestamp
	pool.save()
	
	// Get or create user from transaction sender
	let user = getOrCreateUser(
		Bytes.fromHexString(event.transaction.from.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalSwaps = user.totalSwaps.plus(ONE_BI)
	user.save()
	
	let swap = new Swap(createEventID(event))
	swap.pool = pool.id
	swap.user = user.id
	swap.tokenIn = Bytes.fromHexString(event.params.tokenIn.toHexString().toLowerCase())
	swap.tokenOut = Bytes.fromHexString(event.params.tokenOut.toHexString().toLowerCase())
	swap.amountIn = event.params.amountIn
	swap.amountOut = event.params.amountOut
	swap.swapFeePercentage = event.params.swapFeePercentage
	swap.swapFeeAmount = event.params.swapFeeAmount
	swap.timestamp = event.block.timestamp
	swap.blockNumber = event.block.number
	swap.transactionHash = event.transaction.hash
	swap.save()
	
	// Update token volumes
	let tokenInVolume = getOrCreateTokenVolume(swap.tokenIn, event.block.timestamp)
	tokenInVolume.totalVolumeIn = tokenInVolume.totalVolumeIn.plus(event.params.amountIn)
	tokenInVolume.totalVolume = tokenInVolume.totalVolumeIn.plus(tokenInVolume.totalVolumeOut)
	tokenInVolume.swapCount = tokenInVolume.swapCount.plus(ONE_BI)
	tokenInVolume.lastUpdated = event.block.timestamp
	tokenInVolume.save()
	
	let tokenOutVolume = getOrCreateTokenVolume(swap.tokenOut, event.block.timestamp)
	tokenOutVolume.totalVolumeOut = tokenOutVolume.totalVolumeOut.plus(event.params.amountOut)
	tokenOutVolume.totalVolume = tokenOutVolume.totalVolumeIn.plus(tokenOutVolume.totalVolumeOut)
	tokenOutVolume.swapCount = tokenOutVolume.swapCount.plus(ONE_BI)
	tokenOutVolume.lastUpdated = event.block.timestamp
	tokenOutVolume.save()
	
	// Update daily metrics
	let dailyMetrics = getOrCreateDailyMetrics(poolId, event.block.timestamp)
	dailyMetrics.swapCount = dailyMetrics.swapCount.plus(ONE_BI)
	dailyMetrics.volumeIn = dailyMetrics.volumeIn.plus(event.params.amountIn)
	dailyMetrics.volumeOut = dailyMetrics.volumeOut.plus(event.params.amountOut)
	dailyMetrics.save()
	
	// Update vault
	let vault = getOrCreateVault()
	vault.totalSwaps = vault.totalSwaps.plus(ONE_BI)
	vault.totalFees = vault.totalFees.plus(event.params.swapFeeAmount)
	vault.save()
}

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
	let poolId = event.params.pool.toHexString().toLowerCase()
	let pool = Pool.load(poolId)
	
	if (pool == null) {
		log.warning('Pool not found for liquidity add: {}', [poolId])
		return
	}
	
	pool.totalLiquidityAdded = pool.totalLiquidityAdded.plus(ONE_BI)
	pool.lastActivityAt = event.block.timestamp
	pool.save()
	
	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.liquidityProvider.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalLiquidityProvided = user.totalLiquidityProvided.plus(ONE_BI)
	user.save()
	
	let liquidityAdd = new LiquidityAdd(createEventID(event))
	liquidityAdd.pool = pool.id
	liquidityAdd.user = user.id
	liquidityAdd.liquidityProvider = Bytes.fromHexString(event.params.liquidityProvider.toHexString().toLowerCase())
	liquidityAdd.kind = event.params.kind
	liquidityAdd.totalSupply = event.params.totalSupply
	liquidityAdd.amountsAdded = event.params.amountsAddedRaw
	liquidityAdd.swapFeeAmounts = event.params.swapFeeAmountsRaw
	liquidityAdd.timestamp = event.block.timestamp
	liquidityAdd.blockNumber = event.block.number
	liquidityAdd.transactionHash = event.transaction.hash
	liquidityAdd.save()
	
	// Update daily metrics
	let dailyMetrics = getOrCreateDailyMetrics(poolId, event.block.timestamp)
	dailyMetrics.liquidityAdds = dailyMetrics.liquidityAdds.plus(ONE_BI)
	dailyMetrics.save()
	
	// Update vault
	let vault = getOrCreateVault()
	vault.totalLiquidityAdds = vault.totalLiquidityAdds.plus(ONE_BI)
	vault.save()
}

export function handleLiquidityRemoved(event: LiquidityRemovedEvent): void {
	let poolId = event.params.pool.toHexString().toLowerCase()
	let pool = Pool.load(poolId)
	
	if (pool == null) {
		log.warning('Pool not found for liquidity remove: {}', [poolId])
		return
	}
	
	pool.totalLiquidityRemoved = pool.totalLiquidityRemoved.plus(ONE_BI)
	pool.lastActivityAt = event.block.timestamp
	pool.save()
	
	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.liquidityProvider.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.save()
	
	let liquidityRemove = new LiquidityRemove(createEventID(event))
	liquidityRemove.pool = pool.id
	liquidityRemove.user = user.id
	liquidityRemove.liquidityProvider = Bytes.fromHexString(event.params.liquidityProvider.toHexString().toLowerCase())
	liquidityRemove.kind = event.params.kind
	liquidityRemove.totalSupply = event.params.totalSupply
	liquidityRemove.amountsRemoved = event.params.amountsRemovedRaw
	liquidityRemove.swapFeeAmounts = event.params.swapFeeAmountsRaw
	liquidityRemove.timestamp = event.block.timestamp
	liquidityRemove.blockNumber = event.block.number
	liquidityRemove.transactionHash = event.transaction.hash
	liquidityRemove.save()
	
	// Update daily metrics
	let dailyMetrics = getOrCreateDailyMetrics(poolId, event.block.timestamp)
	dailyMetrics.liquidityRemoves = dailyMetrics.liquidityRemoves.plus(ONE_BI)
	dailyMetrics.save()
	
	// Update vault
	let vault = getOrCreateVault()
	vault.totalLiquidityRemoves = vault.totalLiquidityRemoves.plus(ONE_BI)
	vault.save()
}

export function handleSwapFeePercentageChanged(event: SwapFeePercentageChangedEvent): void {
	let poolId = event.params.pool.toHexString().toLowerCase()
	let pool = Pool.load(poolId)
	
	if (pool == null) {
		log.warning('Pool not found for fee change: {}', [poolId])
		return
	}
	
	pool.swapFeePercentage = event.params.swapFeePercentage
	pool.save()
	
	let feeUpdate = new SwapFeeUpdate(createEventID(event))
	feeUpdate.pool = pool.id
	feeUpdate.newFeePercentage = event.params.swapFeePercentage
	feeUpdate.timestamp = event.block.timestamp
	feeUpdate.blockNumber = event.block.number
	feeUpdate.transactionHash = event.transaction.hash
	feeUpdate.save()
}