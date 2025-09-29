import {
	BigInt,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	Routed as RoutedEvent
} from '../generated/GluexRouter/GluexRouter'

import {
	LEND_TOKENS,
	INVEST_TOKENS,
	LP_TOKENS,
	ALL_TOKENS
} from './tokens'

import {
	Swap,
	LendSwap,
	InvestSwap,
	LPSwap,
	DailyVolume,
	TotalVolume,
	GlobalTokenVolume,
	User,
	UserTokenVolume,
	Protocol,
	ProtocolTokenVolume,
	Token,
	TokenAmount
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

function getDailyVolumeID(timestamp: BigInt, tokenAddress: string): string {
	let day = getDayID(timestamp)
	return day.concat('-').concat(tokenAddress)
}

function getOrCreateToken(tokenAddress: string): Token {
	let token = Token.load(tokenAddress)
	if (token == null) {
		token = new Token(tokenAddress)

		// Try to find token data in our dictionaries
		let tokenData = ALL_TOKENS[tokenAddress]
		if (tokenData) {
			token.symbol = tokenData.symbol
			token.name = tokenData.name
			token.type = tokenData.type
			token.decimals = BigInt.fromString(tokenData.decimals).toI32()
		} else {
			// Default values if token is not in our dictionary
			token.symbol = "UNKNOWN"
			token.name = "Unknown Token"
			token.type = "SWAP"
			token.decimals = 18
		}

		token.save()
	}
	return token
}

function getTokenType(inputToken: string, outputToken: string): string {
	// Check if either input or output token is in the categorized lists
	if (LEND_TOKENS[inputToken] || LEND_TOKENS[outputToken]) {
		return "LEND"
	}
	if (INVEST_TOKENS[inputToken] || INVEST_TOKENS[outputToken]) {
		return "INVEST"
	}
	if (LP_TOKENS[inputToken] || LP_TOKENS[outputToken]) {
		return "LP"
	}
	return "SWAP"
}

function createTokenAmount(swapId: string, suffix: string, tokenAddress: string, amount: BigInt): TokenAmount {
	let tokenAmountId = swapId.concat('-').concat(suffix)
	let tokenAmount = new TokenAmount(tokenAmountId)
	tokenAmount.token = tokenAddress
	tokenAmount.amount = amount
	tokenAmount.save()
	return tokenAmount
}

function createSwapEntity(
	id: string,
	event: RoutedEvent,
	userAddressLower: string,
	userId: string
): void {
	let inputTokenLower = event.params.inputToken.toHexString().toLowerCase()
	let outputTokenLower = event.params.outputToken.toHexString().toLowerCase()
	let tokenType = getTokenType(inputTokenLower, outputTokenLower)

	// Ensure tokens exist
	getOrCreateToken(inputTokenLower)
	getOrCreateToken(outputTokenLower)

	// Create TokenAmount entities
	let inputTokenAmount = createTokenAmount(id, "input", inputTokenLower, event.params.inputAmount)
	let outputTokenAmount = createTokenAmount(id, "output", outputTokenLower, event.params.finalOutputAmount)

	if (tokenType == "LEND") {
		let swap = new LendSwap(id)
		swap.type = "LEND"
		swap.uniquePID = event.params.uniquePID
		swap.user = userId
		swap.userAddress = Bytes.fromHexString(userAddressLower)
		swap.outputReceiver = Bytes.fromHexString(event.params.outputReceiver.toHexString().toLowerCase())
		swap.input = inputTokenAmount.id
		swap.output = outputTokenAmount.id
		swap.partnerFee = event.params.partnerFee
		swap.routingFee = event.params.routingFee
		swap.partnerShare = event.params.partnerShare
		swap.protocolShare = event.params.protocolShare
		swap.timestamp = event.block.timestamp
		swap.blockNumber = event.block.number
		swap.transactionHash = event.transaction.hash
		swap.save()
	} else if (tokenType == "INVEST") {
		let swap = new InvestSwap(id)
		swap.type = "INVEST"
		swap.uniquePID = event.params.uniquePID
		swap.user = userId
		swap.userAddress = Bytes.fromHexString(userAddressLower)
		swap.outputReceiver = Bytes.fromHexString(event.params.outputReceiver.toHexString().toLowerCase())
		swap.input = inputTokenAmount.id
		swap.output = outputTokenAmount.id
		swap.partnerFee = event.params.partnerFee
		swap.routingFee = event.params.routingFee
		swap.partnerShare = event.params.partnerShare
		swap.protocolShare = event.params.protocolShare
		swap.timestamp = event.block.timestamp
		swap.blockNumber = event.block.number
		swap.transactionHash = event.transaction.hash
		swap.save()
	} else if (tokenType == "LP") {
		let swap = new LPSwap(id)
		swap.type = "LP"
		swap.uniquePID = event.params.uniquePID
		swap.user = userId
		swap.userAddress = Bytes.fromHexString(userAddressLower)
		swap.outputReceiver = Bytes.fromHexString(event.params.outputReceiver.toHexString().toLowerCase())
		swap.input = inputTokenAmount.id
		swap.output = outputTokenAmount.id
		swap.partnerFee = event.params.partnerFee
		swap.routingFee = event.params.routingFee
		swap.partnerShare = event.params.partnerShare
		swap.protocolShare = event.params.protocolShare
		swap.timestamp = event.block.timestamp
		swap.blockNumber = event.block.number
		swap.transactionHash = event.transaction.hash
		swap.save()
	} else {
		let swap = new Swap(id)
		swap.type = "SWAP"
		swap.uniquePID = event.params.uniquePID
		swap.user = userId
		swap.userAddress = Bytes.fromHexString(userAddressLower)
		swap.outputReceiver = Bytes.fromHexString(event.params.outputReceiver.toHexString().toLowerCase())
		swap.input = inputTokenAmount.id
		swap.output = outputTokenAmount.id
		swap.partnerFee = event.params.partnerFee
		swap.routingFee = event.params.routingFee
		swap.partnerShare = event.params.partnerShare
		swap.protocolShare = event.params.protocolShare
		swap.timestamp = event.block.timestamp
		swap.blockNumber = event.block.number
		swap.transactionHash = event.transaction.hash
		swap.save()
	}
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

	// Get token addresses
	let inputTokenLower = event.params.inputToken.toHexString().toLowerCase()
	let outputTokenLower = event.params.outputToken.toHexString().toLowerCase()

	// Create appropriate swap entity based on token type
	createSwapEntity(createEventID(event), event, userAddressLower, user.id)

	// Update UserTokenVolume for input token only
	let inputVolumeId = userAddressLower.concat('-').concat(inputTokenLower)
	let inputVolume = UserTokenVolume.load(inputVolumeId)
	let isNewInputTokenUser = false
	if (inputVolume == null) {
		inputVolume = new UserTokenVolume(inputVolumeId)
		inputVolume.user = user.id
		inputVolume.token = inputTokenLower
		inputVolume.totalVolume = ZERO_BI
		inputVolume.swapCount = ZERO_BI
		isNewInputTokenUser = true
	}
	inputVolume.totalVolume = inputVolume.totalVolume.plus(event.params.inputAmount)
	inputVolume.swapCount = inputVolume.swapCount.plus(ONE_BI)
	inputVolume.lastUpdated = event.block.timestamp
	inputVolume.save()

	let isNewOutputTokenUser = false
	// Check if output token volume exists for unique user tracking
	let outputVolumeId = userAddressLower.concat('-').concat(outputTokenLower)
	let outputVolume = UserTokenVolume.load(outputVolumeId)
	if (outputVolume == null) {
		isNewOutputTokenUser = true
	}

	// Update DailyVolume for input token
	let inputDailyVolumeID = getDailyVolumeID(event.block.timestamp, inputTokenLower)
	let inputDailyVolume = DailyVolume.load(inputDailyVolumeID)
	if (inputDailyVolume == null) {
		inputDailyVolume = new DailyVolume(inputDailyVolumeID)
		inputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		inputDailyVolume.token = inputTokenLower
		inputDailyVolume.volume = ZERO_BI
		inputDailyVolume.swapCount = ZERO_BI
	}
	inputDailyVolume.volume = inputDailyVolume.volume.plus(event.params.inputAmount)
	inputDailyVolume.swapCount = inputDailyVolume.swapCount.plus(ONE_BI)
	inputDailyVolume.save()

	// Update DailyVolume for output token
	let outputDailyVolumeID = getDailyVolumeID(event.block.timestamp, outputTokenLower)
	let outputDailyVolume = DailyVolume.load(outputDailyVolumeID)
	if (outputDailyVolume == null) {
		outputDailyVolume = new DailyVolume(outputDailyVolumeID)
		outputDailyVolume.date = event.block.timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY)
		outputDailyVolume.token = outputTokenLower
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
		inputTotalVolume.token = inputTokenLower
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
		outputTotalVolume.token = outputTokenLower
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
		inputGlobalVolume.token = inputTokenLower
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
		outputGlobalVolume.token = outputTokenLower
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

	// Update ProtocolTokenVolume for input token only
	let inputProtocolVolume = ProtocolTokenVolume.load(inputTokenLower)
	if (inputProtocolVolume == null) {
		inputProtocolVolume = new ProtocolTokenVolume(inputTokenLower)
		inputProtocolVolume.protocol = PROTOCOL_ID
		inputProtocolVolume.token = inputTokenLower
		inputProtocolVolume.totalVolume = ZERO_BI
		inputProtocolVolume.swapCount = ZERO_BI
	}
	inputProtocolVolume.totalVolume = inputProtocolVolume.totalVolume.plus(event.params.inputAmount)
	inputProtocolVolume.swapCount = inputProtocolVolume.swapCount.plus(ONE_BI)
	inputProtocolVolume.lastUpdated = event.block.timestamp
	inputProtocolVolume.save()
}
