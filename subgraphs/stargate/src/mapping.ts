import {
	BigInt,
	Bytes,
	ethereum,
	log
} from '@graphprotocol/graph-ts'

import {
	Stargate,
	OFTSent as OFTSentEvent,
	OFTReceived as OFTReceivedEvent
} from '../generated/Stargate/Stargate'

import {
	User,
	Bridge,
	Token,
	DailyBridgeMetrics,
	Protocol
} from '../generated/schema'

const ONE_BI = BigInt.fromI32(1)
const SECONDS_PER_DAY = BigInt.fromI32(86400)

function getDayID(timestamp: BigInt, token: Bytes): string {
	let day = timestamp.div(SECONDS_PER_DAY)
	return day.toString().concat('-').concat(token.toHexString())
}

function getDayStartTimestamp(timestamp: BigInt): BigInt {
	return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
}

function createEventID(event: ethereum.Event): string {
	return event.transaction.hash
		.toHexString()
		.concat('-')
		.concat(event.logIndex.toString())
}

function getOrCreateUser(address: Bytes, timestamp: BigInt): User {
	let userId = address.toHexString().toLowerCase()
	let user = User.load(userId)
	
	if (user == null) {
		user = new User(userId)
		user.address = address
		user.totalBridges = BigInt.fromI32(0)
		user.totalVolume = BigInt.fromI32(0)
		user.firstBridgeAt = timestamp
		user.lastBridgeAt = timestamp
	}
	
	user.lastBridgeAt = timestamp
	return user
}

function getOrCreateToken(address: Bytes, timestamp: BigInt): Token {
	let tokenId = address.toHexString().toLowerCase()
	let token = Token.load(tokenId)
	
	if (token == null) {
		token = new Token(tokenId)
		token.address = address
		token.symbol = ''
		token.decimals = 18
		token.totalBridges = BigInt.fromI32(0)
		token.totalVolume = BigInt.fromI32(0)
	}
	
	return token
}

function getOrCreateDailyMetrics(token: Bytes, timestamp: BigInt): DailyBridgeMetrics {
	let dayId = getDayID(timestamp, token)
	let metrics = DailyBridgeMetrics.load(dayId)
	
	if (metrics == null) {
		metrics = new DailyBridgeMetrics(dayId)
		metrics.date = timestamp.div(SECONDS_PER_DAY).toI32()
		metrics.token = token
		metrics.bridgeCount = BigInt.fromI32(0)
		metrics.totalVolume = BigInt.fromI32(0)
		metrics.totalFees = BigInt.fromI32(0)
		metrics.uniqueUsers = BigInt.fromI32(0)
	}
	
	return metrics
}

function getOrCreateProtocol(): Protocol {
	let protocolId = "stargate"
	let protocol = Protocol.load(protocolId)
	
	if (protocol == null) {
		protocol = new Protocol(protocolId)
		protocol.totalBridges = BigInt.fromI32(0)
		protocol.totalVolume = BigInt.fromI32(0)
		protocol.totalFees = BigInt.fromI32(0)
		protocol.uniqueUsers = BigInt.fromI32(0)
		protocol.supportedChains = []
		protocol.supportedTokens = []
	}
	
	return protocol
}

export function handleOFTSent(event: OFTSentEvent): void {
	log.info('OFTSent event detected - Token bridge initiated', [
		event.params.guid.toHexString(),
		event.params.dstEid.toString(),
		event.params.fromAddress.toHexString(),
		event.params.amountSentLD.toString(),
		event.params.amountReceivedLD.toString()
	])
	
	// Create bridge entity for the outgoing transfer
	let bridge = new Bridge(createEventID(event))
	
	// Get or create user
	let user = getOrCreateUser(event.params.fromAddress, event.block.timestamp)
	user.totalBridges = user.totalBridges.plus(ONE_BI)
	user.totalVolume = user.totalVolume.plus(event.params.amountSentLD)
	user.save()
	
	bridge.user = user.id
	bridge.transactionHash = event.transaction.hash
	bridge.blockNumber = event.block.number
	bridge.timestamp = event.block.timestamp
	
	// Bridge details from OFTSent event
	bridge.srcChainId = BigInt.fromI32(0) // Current chain (Plasma)
	bridge.dstChainId = BigInt.fromI32(event.params.dstEid.toI32())
	bridge.amount = event.params.amountSentLD
	bridge.fee = event.params.amountSentLD.minus(event.params.amountReceivedLD)
	bridge.status = "SENT"
	bridge.guid = event.params.guid
	
	// Get the token address from the contract
	let stargateContract = Stargate.bind(event.address)
	let tokenAddress = stargateContract.try_token()
	
	if (!tokenAddress.reverted) {
		let token = getOrCreateToken(tokenAddress.value, event.block.timestamp)
		token.totalBridges = token.totalBridges.plus(ONE_BI)
		token.totalVolume = token.totalVolume.plus(event.params.amountSentLD)
		token.save()
		
		bridge.token = token.id
		
		// Update daily metrics
		let dailyMetrics = getOrCreateDailyMetrics(token.address, event.block.timestamp)
		dailyMetrics.bridgeCount = dailyMetrics.bridgeCount.plus(ONE_BI)
		dailyMetrics.totalVolume = dailyMetrics.totalVolume.plus(event.params.amountSentLD)
		dailyMetrics.totalFees = dailyMetrics.totalFees.plus(bridge.fee)
		dailyMetrics.save()
	}
	
	bridge.save()
	
	// Update protocol
	let protocol = getOrCreateProtocol()
	protocol.totalBridges = protocol.totalBridges.plus(ONE_BI)
	protocol.totalVolume = protocol.totalVolume.plus(event.params.amountSentLD)
	protocol.save()
}

export function handleOFTReceived(event: OFTReceivedEvent): void {
	log.info('OFTReceived event detected - Token bridge received', [
		event.params.guid.toHexString(),
		event.params.srcEid.toString(),
		event.params.toAddress.toHexString(),
		event.params.amountReceivedLD.toString()
	])
	
	// Create bridge entity for the incoming transfer
	let bridge = new Bridge(createEventID(event))
	
	// Get or create user
	let user = getOrCreateUser(event.params.toAddress, event.block.timestamp)
	user.totalBridges = user.totalBridges.plus(ONE_BI)
	user.totalVolume = user.totalVolume.plus(event.params.amountReceivedLD)
	user.save()
	
	bridge.user = user.id
	bridge.transactionHash = event.transaction.hash
	bridge.blockNumber = event.block.number
	bridge.timestamp = event.block.timestamp
	
	// Bridge details from OFTReceived event
	bridge.srcChainId = BigInt.fromI32(event.params.srcEid.toI32())
	bridge.dstChainId = BigInt.fromI32(0) // Current chain (Plasma)
	bridge.amount = event.params.amountReceivedLD
	bridge.fee = BigInt.fromI32(0) // No fee info in received event
	bridge.status = "RECEIVED"
	bridge.guid = event.params.guid
	
	// Get the token address from the contract
	let stargateContract = Stargate.bind(event.address)
	let tokenAddress = stargateContract.try_token()
	
	if (!tokenAddress.reverted) {
		let token = getOrCreateToken(tokenAddress.value, event.block.timestamp)
		token.totalBridges = token.totalBridges.plus(ONE_BI)
		token.totalVolume = token.totalVolume.plus(event.params.amountReceivedLD)
		token.save()
		
		bridge.token = token.id
		
		// Update daily metrics
		let dailyMetrics = getOrCreateDailyMetrics(token.address, event.block.timestamp)
		dailyMetrics.bridgeCount = dailyMetrics.bridgeCount.plus(ONE_BI)
		dailyMetrics.totalVolume = dailyMetrics.totalVolume.plus(event.params.amountReceivedLD)
		dailyMetrics.save()
	}
	
	bridge.save()
	
	// Update protocol
	let protocol = getOrCreateProtocol()
	protocol.totalBridges = protocol.totalBridges.plus(ONE_BI)
	protocol.totalVolume = protocol.totalVolume.plus(event.params.amountReceivedLD)
	protocol.save()
}