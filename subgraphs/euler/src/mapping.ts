import {
	BigInt,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	AccountStatusCheck as AccountStatusCheckEvent,
	CallWithContext as CallWithContextEvent,
	CollateralStatus as CollateralStatusEvent,
	ControllerStatus as ControllerStatusEvent,
	VaultStatusCheck as VaultStatusCheckEvent,
	OperatorStatus as OperatorStatusEvent,
	NonceStatus as NonceStatusEvent
} from '../generated/Euler/euler'

import {
	Transfer as TransferEvent
} from '../generated/templates/EulerVault/ERC20'

import { EulerVault } from '../generated/templates'

import {
	Account,
	Collateral,
	Controller,
	AccountStatusCheck,
	VaultStatusCheck,
	CallWithContext,
	OperatorStatus,
	NonceStatus,
	Token,
	Transfer,
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
		protocol.uniqueAccounts = ZERO_BI
		protocol.totalCollaterals = ZERO_BI
		protocol.totalControllers = ZERO_BI
		protocol.totalStatusChecks = ZERO_BI
		protocol.totalCalls = ZERO_BI
		protocol.uniqueTokens = ZERO_BI
		protocol.totalTransfers = ZERO_BI
	}
	return protocol
}

function getOrCreateToken(address: Bytes, timestamp: BigInt): Token {
	let tokenId = address.toHexString().toLowerCase()
	let token = Token.load(tokenId)
	let isNew = false

	if (token == null) {
		token = new Token(tokenId)
		token.address = address
		token.firstSeenAt = timestamp
		isNew = true
	}

	token.lastSeenAt = timestamp

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueTokens = protocol.uniqueTokens.plus(ONE_BI)
		protocol.save()
	}

	return token
}

function getOrCreateAccount(address: Bytes, timestamp: BigInt): Account {
	let accountId = address.toHexString().toLowerCase()
	let account = Account.load(accountId)
	let isNew = false

	if (account == null) {
		account = new Account(accountId)
		account.owner = address
		account.firstInteractionAt = timestamp
		isNew = true
	}

	account.lastInteractionAt = timestamp

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueAccounts = protocol.uniqueAccounts.plus(ONE_BI)
		protocol.save()
	}

	return account
}

export function handleCollateralStatus(event: CollateralStatusEvent): void {
	let account = getOrCreateAccount(
		Bytes.fromHexString(event.params.account.toHexString().toLowerCase()),
		event.block.timestamp
	)
	account.save()

	let vaultAddress = Bytes.fromHexString(event.params.collateral.toHexString().toLowerCase())
	let collateralId = account.id.concat('-').concat(event.params.collateral.toHexString().toLowerCase())
	let collateral = Collateral.load(collateralId)

	if (collateral == null) {
		collateral = new Collateral(collateralId)
		collateral.account = account.id
		collateral.vault = vaultAddress

		let protocol = getOrCreateProtocol()
		protocol.totalCollaterals = protocol.totalCollaterals.plus(ONE_BI)
		protocol.save()
	}

	collateral.enabled = event.params.enabled
	collateral.lastUpdateTimestamp = event.block.timestamp
	collateral.blockNumber = event.block.number
	collateral.transactionHash = event.transaction.hash
	collateral.save()

	// When collateral is enabled, start tracking token transfers for this vault
	if (event.params.enabled) {
		EulerVault.create(event.params.collateral)

		// Initialize token entity
		let token = getOrCreateToken(vaultAddress, event.block.timestamp)
		token.save()
	}
}

export function handleControllerStatus(event: ControllerStatusEvent): void {
	let account = getOrCreateAccount(
		Bytes.fromHexString(event.params.account.toHexString().toLowerCase()),
		event.block.timestamp
	)
	account.save()

	let controllerId = account.id.concat('-').concat(event.params.controller.toHexString().toLowerCase())
	let controller = Controller.load(controllerId)

	if (controller == null) {
		controller = new Controller(controllerId)
		controller.account = account.id
		controller.controller = Bytes.fromHexString(event.params.controller.toHexString().toLowerCase())

		let protocol = getOrCreateProtocol()
		protocol.totalControllers = protocol.totalControllers.plus(ONE_BI)
		protocol.save()
	}

	controller.enabled = event.params.enabled
	controller.lastUpdateTimestamp = event.block.timestamp
	controller.blockNumber = event.block.number
	controller.transactionHash = event.transaction.hash
	controller.save()
}

export function handleAccountStatusCheck(event: AccountStatusCheckEvent): void {
	let account = getOrCreateAccount(
		Bytes.fromHexString(event.params.account.toHexString().toLowerCase()),
		event.block.timestamp
	)
	account.save()

	let statusCheck = new AccountStatusCheck(createEventID(event))
	statusCheck.account = account.id
	statusCheck.controller = Bytes.fromHexString(event.params.controller.toHexString().toLowerCase())
	statusCheck.timestamp = event.block.timestamp
	statusCheck.blockNumber = event.block.number
	statusCheck.transactionHash = event.transaction.hash
	statusCheck.save()

	let protocol = getOrCreateProtocol()
	protocol.totalStatusChecks = protocol.totalStatusChecks.plus(ONE_BI)
	protocol.save()
}

export function handleVaultStatusCheck(event: VaultStatusCheckEvent): void {
	let statusCheck = new VaultStatusCheck(createEventID(event))
	statusCheck.vault = Bytes.fromHexString(event.params.vault.toHexString().toLowerCase())
	statusCheck.timestamp = event.block.timestamp
	statusCheck.blockNumber = event.block.number
	statusCheck.transactionHash = event.transaction.hash
	statusCheck.save()
}

export function handleCallWithContext(event: CallWithContextEvent): void {
	let account = getOrCreateAccount(
		Bytes.fromHexString(event.params.onBehalfOfAccount.toHexString().toLowerCase()),
		event.block.timestamp
	)
	account.save()

	let call = new CallWithContext(createEventID(event))
	call.caller = Bytes.fromHexString(event.params.caller.toHexString().toLowerCase())
	call.onBehalfOfAddressPrefix = event.params.onBehalfOfAddressPrefix
	call.onBehalfOfAccount = account.id
	call.targetContract = Bytes.fromHexString(event.params.targetContract.toHexString().toLowerCase())
	call.selector = event.params.selector
	call.timestamp = event.block.timestamp
	call.blockNumber = event.block.number
	call.transactionHash = event.transaction.hash
	call.save()

	let protocol = getOrCreateProtocol()
	protocol.totalCalls = protocol.totalCalls.plus(ONE_BI)
	protocol.save()
}

export function handleOperatorStatus(event: OperatorStatusEvent): void {
	let operatorId = event.params.addressPrefix.toHexString().concat('-').concat(event.params.operator.toHexString().toLowerCase())
	let operatorStatus = new OperatorStatus(operatorId)
	operatorStatus.addressPrefix = event.params.addressPrefix
	operatorStatus.operator = Bytes.fromHexString(event.params.operator.toHexString().toLowerCase())
	operatorStatus.accountOperatorAuthorized = event.params.accountOperatorAuthorized
	operatorStatus.timestamp = event.block.timestamp
	operatorStatus.blockNumber = event.block.number
	operatorStatus.transactionHash = event.transaction.hash
	operatorStatus.save()
}

export function handleNonceStatus(event: NonceStatusEvent): void {
	let nonceStatus = new NonceStatus(createEventID(event))
	nonceStatus.addressPrefix = event.params.addressPrefix
	nonceStatus.nonceNamespace = event.params.nonceNamespace
	nonceStatus.oldNonce = event.params.oldNonce
	nonceStatus.newNonce = event.params.newNonce
	nonceStatus.timestamp = event.block.timestamp
	nonceStatus.blockNumber = event.block.number
	nonceStatus.transactionHash = event.transaction.hash
	nonceStatus.save()
}

// Handler for Transfer events from vault tokens (dynamically tracked)
export function handleVaultTransfer(event: TransferEvent): void {
	// event.address is the token/vault address that emitted this Transfer
	let token = getOrCreateToken(event.address, event.block.timestamp)
	token.save()

	// Create transfer record
	let transfer = new Transfer(createEventID(event))
	transfer.token = token.id
	transfer.from = event.params.from
	transfer.to = event.params.to
	transfer.value = event.params.value
	transfer.timestamp = event.block.timestamp
	transfer.blockNumber = event.block.number
	transfer.transactionHash = event.transaction.hash
	transfer.save()

	// Update protocol stats
	let protocol = getOrCreateProtocol()
	protocol.totalTransfers = protocol.totalTransfers.plus(ONE_BI)
	protocol.save()
}
