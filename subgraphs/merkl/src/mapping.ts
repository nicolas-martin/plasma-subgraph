import {
	BigInt,
	Bytes,
	ethereum
} from '@graphprotocol/graph-ts'

import {
	Claimed as ClaimedEvent,
	ClaimRecipientUpdated as ClaimRecipientUpdatedEvent,
	Disputed as DisputedEvent,
	DisputeResolved as DisputeResolvedEvent,
	TreeUpdated as TreeUpdatedEvent
} from '../generated/Merkl/merkl'

import {
	User,
	Token,
	Claim,
	UserTokenClaim,
	MerkleTree,
	Dispute,
	ClaimRecipientUpdate,
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
		protocol.totalClaimed = ZERO_BI
		protocol.totalClaimCount = ZERO_BI
		protocol.uniqueUsers = ZERO_BI
		protocol.uniqueTokens = ZERO_BI
		protocol.treeUpdateCount = ZERO_BI
		protocol.disputeCount = ZERO_BI
		protocol.currentMerkleRoot = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000")
		protocol.currentIpfsHash = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000")
		protocol.lastTreeUpdateAt = ZERO_BI
	}
	return protocol
}

function getOrCreateUser(address: Bytes, timestamp: BigInt): User {
	let userId = address.toHexString().toLowerCase()
	let user = User.load(userId)
	let isNew = false

	if (user == null) {
		user = new User(userId)
		user.totalClaimed = ZERO_BI
		user.claimCount = ZERO_BI
		user.firstClaimAt = timestamp
		isNew = true
	}

	user.lastClaimAt = timestamp

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueUsers = protocol.uniqueUsers.plus(ONE_BI)
		protocol.save()
	}

	return user
}

function getOrCreateToken(address: Bytes): Token {
	let tokenId = address.toHexString().toLowerCase()
	let token = Token.load(tokenId)
	let isNew = false

	if (token == null) {
		token = new Token(tokenId)
		token.totalClaimed = ZERO_BI
		token.claimCount = ZERO_BI
		token.uniqueClaimers = ZERO_BI
		isNew = true
	}

	if (isNew) {
		let protocol = getOrCreateProtocol()
		protocol.uniqueTokens = protocol.uniqueTokens.plus(ONE_BI)
		protocol.save()
	}

	return token
}

function getOrCreateUserTokenClaim(userId: string, tokenAddress: Bytes, timestamp: BigInt): UserTokenClaim {
	let tokenId = tokenAddress.toHexString().toLowerCase()
	let userTokenId = userId.concat('-').concat(tokenId)
	let userTokenClaim = UserTokenClaim.load(userTokenId)
	let isNew = false

	if (userTokenClaim == null) {
		userTokenClaim = new UserTokenClaim(userTokenId)
		userTokenClaim.user = userId
		userTokenClaim.token = Bytes.fromHexString(tokenId)
		userTokenClaim.totalClaimed = ZERO_BI
		userTokenClaim.claimCount = ZERO_BI
		userTokenClaim.lastClaimAt = timestamp
		isNew = true
	}

	if (isNew) {
		let token = Token.load(tokenId)
		if (token != null) {
			token.uniqueClaimers = token.uniqueClaimers.plus(ONE_BI)
			token.save()
		}
	}

	return userTokenClaim
}

export function handleClaimed(event: ClaimedEvent): void {
	let user = getOrCreateUser(
		Bytes.fromHexString(event.params.user.toHexString().toLowerCase()),
		event.block.timestamp
	)
	user.totalClaimed = user.totalClaimed.plus(event.params.amount)
	user.claimCount = user.claimCount.plus(ONE_BI)
	user.save()

	let token = getOrCreateToken(
		Bytes.fromHexString(event.params.token.toHexString().toLowerCase())
	)
	token.totalClaimed = token.totalClaimed.plus(event.params.amount)
	token.claimCount = token.claimCount.plus(ONE_BI)
	token.save()

	let userTokenClaim = getOrCreateUserTokenClaim(
		user.id,
		Bytes.fromHexString(event.params.token.toHexString().toLowerCase()),
		event.block.timestamp
	)
	userTokenClaim.totalClaimed = userTokenClaim.totalClaimed.plus(event.params.amount)
	userTokenClaim.claimCount = userTokenClaim.claimCount.plus(ONE_BI)
	userTokenClaim.lastClaimAt = event.block.timestamp
	userTokenClaim.save()

	let claim = new Claim(createEventID(event))
	claim.user = user.id
	claim.token = token.id
	claim.amount = event.params.amount
	claim.timestamp = event.block.timestamp
	claim.blockNumber = event.block.number
	claim.transactionHash = event.transaction.hash
	claim.save()

	let protocol = getOrCreateProtocol()
	protocol.totalClaimed = protocol.totalClaimed.plus(event.params.amount)
	protocol.totalClaimCount = protocol.totalClaimCount.plus(ONE_BI)
	protocol.save()
}

export function handleTreeUpdated(event: TreeUpdatedEvent): void {
	let merkleRoot = event.params.merkleRoot.toHexString()
	let tree = new MerkleTree(merkleRoot)
	tree.merkleRoot = event.params.merkleRoot
	tree.ipfsHash = event.params.ipfsHash
	tree.endOfDisputePeriod = event.params.endOfDisputePeriod
	tree.timestamp = event.block.timestamp
	tree.blockNumber = event.block.number
	tree.transactionHash = event.transaction.hash
	tree.disputed = false
	tree.disputeResolved = false
	tree.save()

	let protocol = getOrCreateProtocol()
	protocol.currentMerkleRoot = event.params.merkleRoot
	protocol.currentIpfsHash = event.params.ipfsHash
	protocol.treeUpdateCount = protocol.treeUpdateCount.plus(ONE_BI)
	protocol.lastTreeUpdateAt = event.block.timestamp
	protocol.save()
}

export function handleDisputed(event: DisputedEvent): void {
	let protocol = getOrCreateProtocol()
	let merkleRoot = protocol.currentMerkleRoot.toHexString()

	let tree = MerkleTree.load(merkleRoot)
	if (tree != null) {
		tree.disputed = true
		tree.save()
	}

	let dispute = new Dispute(createEventID(event))
	dispute.merkleTree = merkleRoot
	dispute.disputer = event.transaction.from
	dispute.reason = event.params.reason
	dispute.resolved = false
	dispute.timestamp = event.block.timestamp
	dispute.blockNumber = event.block.number
	dispute.transactionHash = event.transaction.hash
	dispute.save()

	protocol.disputeCount = protocol.disputeCount.plus(ONE_BI)
	protocol.save()
}

export function handleDisputeResolved(event: DisputeResolvedEvent): void {
	let protocol = getOrCreateProtocol()
	let merkleRoot = protocol.currentMerkleRoot.toHexString()

	let tree = MerkleTree.load(merkleRoot)
	if (tree != null) {
		tree.disputeResolved = true
		tree.disputeValid = event.params.valid
		tree.save()
	}

	// Find the most recent dispute for this tree
	// Note: In a real implementation, you might want to track dispute IDs more explicitly
	// This is a simplified approach assuming one dispute per tree
}

export function handleClaimRecipientUpdated(event: ClaimRecipientUpdatedEvent): void {
	let update = new ClaimRecipientUpdate(createEventID(event))
	update.user = Bytes.fromHexString(event.params.user.toHexString().toLowerCase())
	update.token = Bytes.fromHexString(event.params.token.toHexString().toLowerCase())
	update.recipient = Bytes.fromHexString(event.params.recipient.toHexString().toLowerCase())
	update.timestamp = event.block.timestamp
	update.blockNumber = event.block.number
	update.transactionHash = event.transaction.hash
	update.save()
}
