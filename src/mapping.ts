import {
	ethereum, BigInt, Bytes
} from '@graphprotocol/graph-ts'

import {
	Busted as BustedEvent,
	CashedOut as CashedOutEvent,
	GameStarted as GameStartedEvent,
	HouseFunded as HouseFundedEvent,
	HouseWithdrawn as HouseWithdrawnEvent,
	OwnershipTransferred as OwnershipTransferredEvent,
	RoundPlayed as RoundPlayedEvent,
} from '../generated/RTB/rtb'

import {
	Game,
	Player,
	Round,
	House,
	HouseFunding,
	HouseWithdrawal,
} from '../generated/schema'

const HOUSE_ID = "0"

function createEventID(event: ethereum.Event): string {
	return event.block.number.toString().concat('-').concat(event.logIndex.toString());
}

export function handleGameStarted(ev: GameStartedEvent): void {
	let game = new Game(ev.params.gameId.toString());
	let player = Player.load(ev.params.player.toHex());

	if (player == null) {
		player = new Player(ev.params.player.toHex());
		player.totalWagered = BigInt.fromI32(0);
		player.totalPayout = BigInt.fromI32(0);
		player.totalGames = BigInt.fromI32(0);
		player.firstPlayedAt = ev.block.timestamp;
	}

	player.totalWagered = player.totalWagered.plus(ev.params.wager);
	player.totalGames = player.totalGames.plus(BigInt.fromI32(1));
	player.lastPlayedAt = ev.block.timestamp;
	player.save();

	game.player = player.id;
	game.playerGameIndex = player.totalGames;
	game.wager = ev.params.wager;
	game.status = "ACTIVE";
	game.startedAt = ev.block.timestamp;
	game.startedAtBlock = ev.block.number;
	game.transactionHash = ev.transaction.hash;
	game.save();
}

export function handleCashedOut(ev: CashedOutEvent): void {
	let game = Game.load(ev.params.gameId.toString());
	if (game == null) return;

	let player = Player.load(game.player);
	if (player != null) {
		player.totalPayout = player.totalPayout.plus(ev.params.amount);
		player.save();
	}

	game.status = "CASHED_OUT";
	game.payout = ev.params.amount;
	game.endedAt = ev.block.timestamp;
	game.endedAtBlock = ev.block.number;
	game.save();
}

export function handleBusted(ev: BustedEvent): void {
	let game = Game.load(ev.params.gameId.toString());
	if (game == null) return;

	game.status = "BUSTED";
	game.payout = BigInt.fromI32(0);
	game.endedAt = ev.block.timestamp;
	game.endedAtBlock = ev.block.number;
	game.save();
}

export function handleRoundPlayed(ev: RoundPlayedEvent): void {
	let roundId = ev.params.gameId.toString() + "-" + ev.params.roundIndex.toString();
	let round = new Round(roundId);

	round.game = ev.params.gameId.toString();
	round.roundIndex = ev.params.roundIndex;
	round.roundOutcome = ev.params.card;  // Using card as round outcome
	round.cards = ev.params.extra;  // Using extra bytes as cards data
	round.isDoubleDown = ev.params.win;  // Using win as a placeholder for double down
	round.multiplier = ev.params.newPayout;  // Using newPayout as multiplier
	round.timestamp = ev.block.timestamp;
	round.transactionHash = ev.transaction.hash;
	round.save();
}

export function handleHouseFunded(ev: HouseFundedEvent): void {
	let house = House.load(HOUSE_ID);
	if (house == null) {
		house = new House(HOUSE_ID);
		house.totalFunded = BigInt.fromI32(0);
		house.totalWithdrawn = BigInt.fromI32(0);
		house.balance = BigInt.fromI32(0);
		house.owner = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
	}

	house.totalFunded = house.totalFunded.plus(ev.params.amount);
	house.balance = house.balance.plus(ev.params.amount);
	house.save();

	let funding = new HouseFunding(createEventID(ev));
	funding.house = house.id;
	funding.amount = ev.params.amount;
	funding.timestamp = ev.block.timestamp;
	funding.transactionHash = ev.transaction.hash;
	funding.save();
}

export function handleHouseWithdrawn(ev: HouseWithdrawnEvent): void {
	let house = House.load(HOUSE_ID);
	if (house == null) {
		house = new House(HOUSE_ID);
		house.totalFunded = BigInt.fromI32(0);
		house.totalWithdrawn = BigInt.fromI32(0);
		house.balance = BigInt.fromI32(0);
		house.owner = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
	}

	house.totalWithdrawn = house.totalWithdrawn.plus(ev.params.amount);
	house.balance = house.balance.minus(ev.params.amount);
	house.save();

	let withdrawal = new HouseWithdrawal(createEventID(ev));
	withdrawal.house = house.id;
	withdrawal.amount = ev.params.amount;
	withdrawal.timestamp = ev.block.timestamp;
	withdrawal.transactionHash = ev.transaction.hash;
	withdrawal.save();
}

export function handleOwnershipTransferred(ev: OwnershipTransferredEvent): void {
	let house = House.load(HOUSE_ID);
	if (house == null) {
		house = new House(HOUSE_ID);
		house.totalFunded = BigInt.fromI32(0);
		house.totalWithdrawn = BigInt.fromI32(0);
		house.balance = BigInt.fromI32(0);
	}

	house.owner = ev.params.newOwner;
	house.save();
}
