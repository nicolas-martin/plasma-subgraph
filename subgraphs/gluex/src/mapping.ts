import {
	BigInt,
	BigDecimal,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	Routed as RoutedEvent
} from '../generated/GluexRouter/GluexRouter'

import {
	Swap,
	DailyVolume,
	TotalVolume,
	User,
	Protocol
} from '../generated/schema'

const PROTOCOL_ID = "protocol"
const ZERO_BI = BigInt.fromI32(0)
const ZERO_BD = BigDecimal.fromString("0")
const ONE_BI = BigInt.fromI32(1)
const SECONDS_PER_DAY = BigInt.fromI32(86400)

function createEventID(event: ethereum.Event): string {
	return event.block.number.toString()
		.concat('-')
		.concat(event.logIndex.toString())
}

function getDayID(timestamp: BigInt): string {
	let day = timestamp.div(SECONDS_PER_DAY)
	return day.toString()
}

function getDailyVolumeID(timestamp: BigInt, token: Bytes): string {
	let day = getDayID(timestamp)
	return day.concat('-').concat(token.toHexString())
}

export function handleRouted(event: RoutedEvent): void {
	// Update User entity first
	let user = User.load(event.params.userAddress.toHexString())
	if (user == null) {
		user = new User(event.params.userAddress.toHexString())
		user.totalSwaps = ZERO_BI
		user.totalVolumeUSD = ZERO_BD
		user.firstSwapAt = event.block.timestamp
	}
	user.totalSwaps = user.totalSwaps.plus(ONE_BI)
	user.lastSwapAt = event.block.timestamp
	user.save()

	// Create Swap entity
	let swap = new Swap(createEventID(event))
	swap.uniquePID = event.params.uniquePID
	swap.user = user.id
	swap.userAddress = event.params.userAddress
	swap.outputReceiver = event.params.outputReceiver
	swap.inputToken = event.params.inputToken
	swap.inputAmount = event.params.inputAmount
	swap.outputToken = event.params.outputToken
	swap.finalOutputAmount = event.params.finalOutputAmount
	swap.partnerFee = event.params.partnerFee
	swap.routingFee = event.params.routingFee
	swap.partnerShare = event.params.partnerShare
	swap.protocolShare = event.params.protocolShare
	swap.timestamp = event.block.timestamp
	swap.blockNumber = event.block.number
	swap.transactionHash = event.transaction.hash
	swap.save()

	// Update DailyVolume for input token
	let inputDailyVolumeID = getDailyVolumeID(event.block.timestamp, event.params.inputToken)
	let inputDailyVolume = DailyVolume.load(inputDailyVolumeID)
	if (inputDailyVolume == null) {
		inputDailyVolume = new DailyVolume(inputDailyVolumeID)
		inputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		inputDailyVolume.token = event.params.inputToken
		inputDailyVolume.volume = ZERO_BI
		inputDailyVolume.swapCount = ZERO_BI
	}
	inputDailyVolume.volume = inputDailyVolume.volume.plus(event.params.inputAmount)
	inputDailyVolume.swapCount = inputDailyVolume.swapCount.plus(ONE_BI)
	inputDailyVolume.save()

	// Update DailyVolume for output token
	let outputDailyVolumeID = getDailyVolumeID(event.block.timestamp, event.params.outputToken)
	let outputDailyVolume = DailyVolume.load(outputDailyVolumeID)
	if (outputDailyVolume == null) {
		outputDailyVolume = new DailyVolume(outputDailyVolumeID)
		outputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		outputDailyVolume.token = event.params.outputToken
		outputDailyVolume.volume = ZERO_BI
		outputDailyVolume.swapCount = ZERO_BI
	}
	outputDailyVolume.volume = outputDailyVolume.volume.plus(event.params.finalOutputAmount)
	outputDailyVolume.swapCount = outputDailyVolume.swapCount.plus(ONE_BI)
	outputDailyVolume.save()

	// Update TotalVolume for input token
	let inputTotalVolume = TotalVolume.load(event.params.inputToken.toHexString())
	if (inputTotalVolume == null) {
		inputTotalVolume = new TotalVolume(event.params.inputToken.toHexString())
		inputTotalVolume.token = event.params.inputToken
		inputTotalVolume.totalVolume = ZERO_BI
		inputTotalVolume.totalSwapCount = ZERO_BI
	}
	inputTotalVolume.totalVolume = inputTotalVolume.totalVolume.plus(event.params.inputAmount)
	inputTotalVolume.totalSwapCount = inputTotalVolume.totalSwapCount.plus(ONE_BI)
	inputTotalVolume.save()

	// Update TotalVolume for output token
	let outputTotalVolume = TotalVolume.load(event.params.outputToken.toHexString())
	if (outputTotalVolume == null) {
		outputTotalVolume = new TotalVolume(event.params.outputToken.toHexString())
		outputTotalVolume.token = event.params.outputToken
		outputTotalVolume.totalVolume = ZERO_BI
		outputTotalVolume.totalSwapCount = ZERO_BI
	}
	outputTotalVolume.totalVolume = outputTotalVolume.totalVolume.plus(event.params.finalOutputAmount)
	outputTotalVolume.totalSwapCount = outputTotalVolume.totalSwapCount.plus(ONE_BI)
	outputTotalVolume.save()

	// Update Protocol entity
	let protocol = Protocol.load(PROTOCOL_ID)
	if (protocol == null) {
		protocol = new Protocol(PROTOCOL_ID)
		protocol.totalSwaps = ZERO_BI
		protocol.totalVolumeUSD = ZERO_BD
		protocol.totalPartnerFees = ZERO_BI
		protocol.totalRoutingFees = ZERO_BI
		protocol.totalProtocolShare = ZERO_BI
		protocol.totalPartnerShare = ZERO_BI
		protocol.uniqueUsers = ZERO_BI
	}

	// Check if this is a new user
	if (user.totalSwaps.equals(ONE_BI)) {
		protocol.uniqueUsers = protocol.uniqueUsers.plus(ONE_BI)
	}

	protocol.totalSwaps = protocol.totalSwaps.plus(ONE_BI)
	protocol.totalPartnerFees = protocol.totalPartnerFees.plus(event.params.partnerFee)
	protocol.totalRoutingFees = protocol.totalRoutingFees.plus(event.params.routingFee)
	protocol.totalProtocolShare = protocol.totalProtocolShare.plus(event.params.protocolShare)
	protocol.totalPartnerShare = protocol.totalPartnerShare.plus(event.params.partnerShare)
	protocol.save()
}
