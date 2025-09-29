import {
	BigInt,
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
	GlobalTokenVolume,
	User,
	UserTokenVolume,
	Protocol
} from '../generated/schema'

const PROTOCOL_ID = "protocol"
const ZERO_BI = BigInt.fromI32(0)
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
	return day.concat('-').concat(token.toHexString().toLowerCase())
}

export function handleRouted(event: RoutedEvent): void {
	// Normalize all addresses to lowercase for case-insensitive lookups
	let userAddressLower = event.params.userAddress.toHexString().toLowerCase()

	// Update User entity with lowercase ID
	let user = User.load(userAddressLower)
	if (user == null) {
		user = new User(userAddressLower)
		user.totalSwaps = ZERO_BI
		user.firstSwapAt = event.block.timestamp
	}
	user.totalSwaps = user.totalSwaps.plus(ONE_BI)
	user.lastSwapAt = event.block.timestamp
	user.save()

	// Create Swap entity with lowercase addresses for consistency
	let swap = new Swap(createEventID(event))
	swap.uniquePID = event.params.uniquePID
	swap.user = user.id
	swap.userAddress = Bytes.fromHexString(userAddressLower)
	swap.outputReceiver = Bytes.fromHexString(event.params.outputReceiver.toHexString().toLowerCase())
	swap.inputToken = Bytes.fromHexString(event.params.inputToken.toHexString().toLowerCase())
	swap.inputAmount = event.params.inputAmount
	swap.outputToken = Bytes.fromHexString(event.params.outputToken.toHexString().toLowerCase())
	swap.finalOutputAmount = event.params.finalOutputAmount
	swap.partnerFee = event.params.partnerFee
	swap.routingFee = event.params.routingFee
	swap.partnerShare = event.params.partnerShare
	swap.protocolShare = event.params.protocolShare
	swap.timestamp = event.block.timestamp
	swap.blockNumber = event.block.number
	swap.transactionHash = event.transaction.hash
	swap.save()

	// Update UserTokenVolume for input token
	let inputTokenLower = event.params.inputToken.toHexString().toLowerCase()
	let inputVolumeId = userAddressLower.concat('-').concat(inputTokenLower)
	let inputVolume = UserTokenVolume.load(inputVolumeId)
	let isNewInputTokenUser = false
	if (inputVolume == null) {
		inputVolume = new UserTokenVolume(inputVolumeId)
		inputVolume.user = user.id
		inputVolume.token = Bytes.fromHexString(inputTokenLower)
		inputVolume.totalVolume = ZERO_BI
		inputVolume.swapCount = ZERO_BI
		isNewInputTokenUser = true
	}
	inputVolume.totalVolume = inputVolume.totalVolume.plus(event.params.inputAmount)
	inputVolume.swapCount = inputVolume.swapCount.plus(ONE_BI)
	inputVolume.lastUpdated = event.block.timestamp
	inputVolume.save()

	// Update UserTokenVolume for output token
	let outputTokenLower = event.params.outputToken.toHexString().toLowerCase()
	let outputVolumeId = userAddressLower.concat('-').concat(outputTokenLower)
	let outputVolume = UserTokenVolume.load(outputVolumeId)
	let isNewOutputTokenUser = false
	if (outputVolume == null) {
		outputVolume = new UserTokenVolume(outputVolumeId)
		outputVolume.user = user.id
		outputVolume.token = Bytes.fromHexString(outputTokenLower)
		outputVolume.totalVolume = ZERO_BI
		outputVolume.swapCount = ZERO_BI
		isNewOutputTokenUser = true
	}
	outputVolume.totalVolume = outputVolume.totalVolume.plus(event.params.finalOutputAmount)
	outputVolume.swapCount = outputVolume.swapCount.plus(ONE_BI)
	outputVolume.lastUpdated = event.block.timestamp
	outputVolume.save()

	// Update DailyVolume for input token
	let inputTokenBytes = Bytes.fromHexString(inputTokenLower)
	let inputDailyVolumeID = getDailyVolumeID(event.block.timestamp, inputTokenBytes)
	let inputDailyVolume = DailyVolume.load(inputDailyVolumeID)
	if (inputDailyVolume == null) {
		inputDailyVolume = new DailyVolume(inputDailyVolumeID)
		inputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		inputDailyVolume.token = inputTokenBytes
		inputDailyVolume.volume = ZERO_BI
		inputDailyVolume.swapCount = ZERO_BI
	}
	inputDailyVolume.volume = inputDailyVolume.volume.plus(event.params.inputAmount)
	inputDailyVolume.swapCount = inputDailyVolume.swapCount.plus(ONE_BI)
	inputDailyVolume.save()

	// Update DailyVolume for output token
	let outputTokenBytes = Bytes.fromHexString(outputTokenLower)
	let outputDailyVolumeID = getDailyVolumeID(event.block.timestamp, outputTokenBytes)
	let outputDailyVolume = DailyVolume.load(outputDailyVolumeID)
	if (outputDailyVolume == null) {
		outputDailyVolume = new DailyVolume(outputDailyVolumeID)
		outputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		outputDailyVolume.token = outputTokenBytes
		outputDailyVolume.volume = ZERO_BI
		outputDailyVolume.swapCount = ZERO_BI
	}
	outputDailyVolume.volume = outputDailyVolume.volume.plus(event.params.finalOutputAmount)
	outputDailyVolume.swapCount = outputDailyVolume.swapCount.plus(ONE_BI)
	outputDailyVolume.save()

	// Update TotalVolume for input token
	let inputTotalVolume = TotalVolume.load(inputTokenLower)
	if (inputTotalVolume == null) {
		inputTotalVolume = new TotalVolume(inputTokenLower)
		inputTotalVolume.token = inputTokenBytes
		inputTotalVolume.totalVolume = ZERO_BI
		inputTotalVolume.totalSwapCount = ZERO_BI
	}
	inputTotalVolume.totalVolume = inputTotalVolume.totalVolume.plus(event.params.inputAmount)
	inputTotalVolume.totalSwapCount = inputTotalVolume.totalSwapCount.plus(ONE_BI)
	inputTotalVolume.save()

	// Update TotalVolume for output token
	let outputTotalVolume = TotalVolume.load(outputTokenLower)
	if (outputTotalVolume == null) {
		outputTotalVolume = new TotalVolume(outputTokenLower)
		outputTotalVolume.token = outputTokenBytes
		outputTotalVolume.totalVolume = ZERO_BI
		outputTotalVolume.totalSwapCount = ZERO_BI
	}
	outputTotalVolume.totalVolume = outputTotalVolume.totalVolume.plus(event.params.finalOutputAmount)
	outputTotalVolume.totalSwapCount = outputTotalVolume.totalSwapCount.plus(ONE_BI)
	outputTotalVolume.save()

	// Update GlobalTokenVolume for input token
	let inputGlobalVolume = GlobalTokenVolume.load(inputTokenLower)
	if (inputGlobalVolume == null) {
		inputGlobalVolume = new GlobalTokenVolume(inputTokenLower)
		inputGlobalVolume.token = inputTokenBytes
		inputGlobalVolume.totalVolumeIn = ZERO_BI
		inputGlobalVolume.totalVolumeOut = ZERO_BI
		inputGlobalVolume.totalVolume = ZERO_BI
		inputGlobalVolume.totalSwapsAsInput = ZERO_BI
		inputGlobalVolume.totalSwapsAsOutput = ZERO_BI
		inputGlobalVolume.totalSwaps = ZERO_BI
		inputGlobalVolume.uniqueUsers = ZERO_BI
	}
	inputGlobalVolume.totalVolumeIn = inputGlobalVolume.totalVolumeIn.plus(event.params.inputAmount)
	inputGlobalVolume.totalVolume = inputGlobalVolume.totalVolumeIn.plus(inputGlobalVolume.totalVolumeOut)
	inputGlobalVolume.totalSwapsAsInput = inputGlobalVolume.totalSwapsAsInput.plus(ONE_BI)
	inputGlobalVolume.totalSwaps = inputGlobalVolume.totalSwapsAsInput.plus(inputGlobalVolume.totalSwapsAsOutput)
	if (isNewInputTokenUser) {
		inputGlobalVolume.uniqueUsers = inputGlobalVolume.uniqueUsers.plus(ONE_BI)
	}
	inputGlobalVolume.lastUpdated = event.block.timestamp
	inputGlobalVolume.save()

	// Update GlobalTokenVolume for output token
	let outputGlobalVolume = GlobalTokenVolume.load(outputTokenLower)
	if (outputGlobalVolume == null) {
		outputGlobalVolume = new GlobalTokenVolume(outputTokenLower)
		outputGlobalVolume.token = outputTokenBytes
		outputGlobalVolume.totalVolumeIn = ZERO_BI
		outputGlobalVolume.totalVolumeOut = ZERO_BI
		outputGlobalVolume.totalVolume = ZERO_BI
		outputGlobalVolume.totalSwapsAsInput = ZERO_BI
		outputGlobalVolume.totalSwapsAsOutput = ZERO_BI
		outputGlobalVolume.totalSwaps = ZERO_BI
		outputGlobalVolume.uniqueUsers = ZERO_BI
	}
	outputGlobalVolume.totalVolumeOut = outputGlobalVolume.totalVolumeOut.plus(event.params.finalOutputAmount)
	outputGlobalVolume.totalVolume = outputGlobalVolume.totalVolumeIn.plus(outputGlobalVolume.totalVolumeOut)
	outputGlobalVolume.totalSwapsAsOutput = outputGlobalVolume.totalSwapsAsOutput.plus(ONE_BI)
	outputGlobalVolume.totalSwaps = outputGlobalVolume.totalSwapsAsInput.plus(outputGlobalVolume.totalSwapsAsOutput)
	if (isNewOutputTokenUser) {
		outputGlobalVolume.uniqueUsers = outputGlobalVolume.uniqueUsers.plus(ONE_BI)
	}
	outputGlobalVolume.lastUpdated = event.block.timestamp
	outputGlobalVolume.save()

	// Update Protocol entity
	let protocol = Protocol.load(PROTOCOL_ID)
	if (protocol == null) {
		protocol = new Protocol(PROTOCOL_ID)
		protocol.totalSwaps = ZERO_BI
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
