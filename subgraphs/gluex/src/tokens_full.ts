export class TokenData {
	symbol: string;
	name: string;
	type: string;
	decimals: string;

	constructor(symbol: string, name: string, type: string, decimals: string) {
		this.symbol = symbol;
		this.name = name;
		this.type = type;
		this.decimals = decimals;
	}
}
export const INVEST_TOKENS = new Map<string, TokenData>();
INVEST_TOKENS.set(
	"0x9ecaf80c1303cca8791afbc0ad405c8a35e8d9f1",
	new TokenData("rsETH", "KelpDao Restaked ETH", "INVEST", "18")
);

export const LEND_TOKENS = new Map<string, TokenData>();
INVEST_TOKENS.set(
	"0xc1a318493ff07a68fe438cee60a7ad0d0dba300e",
	new TokenData("aPlasUSDe", "Aave Plasma sUSDe", "LEND", "18"),
);
INVEST_TOKENS.set("0x5d72a9d9a9510cd8cbdba12ac62593a58930a948",
	new TokenData("aPlaUSDT0", "Aave Plasma USDT0", "LEND", "6")
);
INVEST_TOKENS.set("0xaf1a7a488c8348b41d5860c04162af7d3d38a996",
	new TokenData("aPlaweETH", "Aave Plasma weETH", "LEND", "18")
);
INVEST_TOKENS.set("0x5c43d6c075c7cf95fb188fb2977eed3e3f2a92c2",
	new TokenData("aPlaXAUt0", "Aave Plasma XAUt0", "LEND", "6")
);
INVEST_TOKENS.set("0xf1ab7f60128924d69f6d7de25a20ef70bbd43d07",
	new TokenData("aPlaWETH", "Aave Plasma WETH", "LEND", "18")
);
INVEST_TOKENS.set("0x7519403e12111ff6b710877fcd821d0c12caf43a",
	new TokenData("aPlaUSDe", "Aave Plasma USDe", "LEND", "18")
);

export const LP_TOKENS = new Map<string, TokenData>();
LP_TOKENS.set("0x15bbbcf3edf4cca5a99147257b86562dbb995d9c",
	new TokenData("Print", "Printing", "LP", "18")
);
LP_TOKENS.set("0xbd6459e682a02b84a67d0b968c81148cdb54c0fa",
	new TokenData("Gazilly-WXPL", "Gazilly WXPL", "LP", "18")
);
LP_TOKENS.set("0x76470f19cc167cd1d2a0078e8aa11009748d8a93",
	new TokenData("xUSD-waPlaUSDT0", "xUSD waPlaUSDT0", "LP", "18")
);
LP_TOKENS.set("0xe080d14bf6ecec4c48ebe11055d4dea5dbc30e41",
	new TokenData("DoveXPL", "Dove/XPL", "LP", "18")
);
LP_TOKENS.set("0xa06954e78e1cebbbe9c3efd51ada9f9ce125ea83",
	new TokenData("PAOLO-WXPL", "PAOLO WXPL", "LP", "18")
);
LP_TOKENS.set("0xebed2dcfdf027f6dd4be2b6cfb8d0418d43714e6",
	new TokenData("50WXPL-50trillions", "50WXPL 50trillions", "LP", "18")
);
LP_TOKENS.set("0x11e7b1fe6fb6112ed72b0dd9985b4a5a50a43fc0",
	new TokenData("50PLAZIX-50WXPL", "50PLAZIX 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x21199862da98159e7e54d85011a41e0d0914cdd1",
	new TokenData("PLAZIX-WXPL", "PLAZIX WXPL", "LP", "18")
);
LP_TOKENS.set("0xd9ea02992c2ff27b0a64367ab41b522b962376d9",
	new TokenData("99MQ-1WXPL", "50MQ 50WXPL", "LP", "18")
);
LP_TOKENS.set("0xe3a3420b7ef5ba6734605dc62328334ab55f97df",
	new TokenData("USDe-USDT0", "USDe USDT0", "LP", "18")
);
LP_TOKENS.set("0x6a74be33b5393d8a3eba4d69b78f9d9da947c48c",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x968f7fba937ca70ed1e44e9a15e125f2a6ad4ca9",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x265c45757573ba264021e954b46bd5df530d12d2",
	new TokenData("XPLUSDT0", "XPL/USDT0", "LP", "18")
);
LP_TOKENS.set("0x0eac4526321866178c6444f0a211a21db4a0ed4c",
	new TokenData("asdasd", "asdasdas", "LP", "18")
);
LP_TOKENS.set("0x404e5bb94ad6335dc8f769a70a98d2320bfbef9c",
	new TokenData("50PEEP-50WXPL", "50PEEP 50WXPL", "LP", "18")
);
LP_TOKENS.set("0xd59aaecdc89c30438377f00ca62ce45f28628cbd",
	new TokenData("pdog", "pdog", "LP", "18")
);
LP_TOKENS.set("0xc36060ad9b7f1c5c20dedba0c25d41f0815a963c",
	new TokenData("wrsETH-waPlaWETH", "wrsETH waPlaWETH", "LP", "18")
);
LP_TOKENS.set("0x277af8acde6cb23c59142513fba49b82af8642e3",
	new TokenData("501-50WXPL", "501 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x694c009aa31b3f80ee18c218b02390ca2d7151e7",
	new TokenData("xUSD-waPlaUSDT0", "Stream Surge xUSD-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x95af759ec2f4385edbbba959a8a1cdc65610d080",
	new TokenData("PUSDUSDT0", "PlasmaUSD/USDT0", "LP", "18")
);
LP_TOKENS.set("0xe14ba497a7c51f34896d327ec075f3f18210a270",
	new TokenData("WXPL-USDT0", "reCLAMM WXPL-USDT0", "LP", "18")
);
LP_TOKENS.set("0xe5d7114cddcd694a3116037edd56542aeedb58f8",
	new TokenData("WXPL-PlasmaX", "WXPL PlasmaX", "LP", "18")
);
LP_TOKENS.set("0xcc7e72aedb385ae14a8b2e459f40dcb264d501ae",
	new TokenData("UCF-WXPL", "UCF WXPL", "LP", "18")
);
LP_TOKENS.set("0x8f6abb9a36137b2bff3dfea73fb81920d2cbfc88",
	new TokenData("501MEME-50WXPL", "501MEME 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x78051fbf40581619ffaadb6cd7e5856d4a327a6d",
	new TokenData("1", "1", "LP", "18")
);
LP_TOKENS.set("0xde710f0b1c2264e85b6d35d709d1f6ec4c44f564",
	new TokenData("RGN", "XPL", "LP", "18")
);
LP_TOKENS.set("0x1e8d78e9b3f0152d54d32904b7933f1cfe439df1",
	new TokenData("sUSDeUSDT0", "USDT0/sUSDe", "LP", "18")
);
LP_TOKENS.set("0xda51975d78cb172b46d7292cec9fa9e74723ef3b",
	new TokenData("weETH-waPlaWETH", "Ether.Fi Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0xc222148dcb4e5b5a2aaba2764bf13653619f58cf",
	new TokenData("WXPLXPLDOG", "WXPL/XPLDOG", "LP", "18")
);
LP_TOKENS.set("0xb3c9ae6688ff412534c1863ce264c4af534d5fe6",
	new TokenData("WXPL/PDOG", "PDOG", "LP", "18")
);
LP_TOKENS.set("0x4feb75181e63763d74346a098a43423894b119cc",
	new TokenData("BNKLUSDT0", "BANKLESS/USDT0", "LP", "18")
);
LP_TOKENS.set("0xae6419b2ff94a150ef5b3aa11414c9e1ba659575",
	new TokenData("asdasdasd", "asdasdasd", "LP", "18")
);
LP_TOKENS.set("0x000453ba4b018b815f359765d3079e36618ede7d",
	new TokenData("50PlasmaUSD-50waPlaUSDT0", "PlasmaUSD-USDT0", "LP", "18")
);
LP_TOKENS.set("0x5e8c003103fe6ce779b55f9e7f37c0dd8d27f460",
	new TokenData("USDT0-PlasmaUSD", "USDT0 PlasmaUSD", "LP", "18")
);
LP_TOKENS.set("0x31e098c9daf9cd478228b7544e99319c57ae50fa",
	new TokenData("sUSDe-waPlaUSDT0", "Ethena Surge sUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x61c9a8a54734025c5108b762ea8bdfea721ed696",
	new TokenData("weETH-waPlaWETH", "Ethena Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0x8e3da27b6496ca4373ad8261835f56d0107c8e25",
	new TokenData("PDogXPL", "PDog/XPL", "LP", "18")
);
LP_TOKENS.set("0x9638224cb4b4be9abf8ecfdcabe38a35558972a9",
	new TokenData("XMOON", "XMOON/XPL", "LP", "18")
);
LP_TOKENS.set("0xc0bcf41cc87c9b9ffc63d1fb30823f0b6094cc6a",
	new TokenData("RGN", "WXPL", "LP", "18")
);
LP_TOKENS.set("0x5618d0dc39c7e7e4ae798d4d09417863c4e739cd",
	new TokenData("WXPL-PLAZIX", "WXPL PLAZIX", "LP", "18")
);
LP_TOKENS.set("0x0c01d98c9d3fe67b76c2d536c44eccec23cd7a15",
	new TokenData("50BOOB-50WXPL", "50BOOB 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x6b9a44ba468afebc7dbc196f310ba9017c25de69",
	new TokenData("waPlaUSDT0-PlasmaUSD", "waPlaUSDT0 PlasmaUSD", "LP", "18")
);
LP_TOKENS.set("0xcce9af90cd1ea4b5eac60102f40c72bf361fc7ac",
	new TokenData("weETH-waPlaWETH", "EtherFi Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0x8518ae96fc7ee86b637f08a64bef912b213106d8",
	new TokenData("50WXPL-50PlasmaX", "50WXPL 50PlasmaX", "LP", "18")
);
LP_TOKENS.set("0x0fb23c6363626aadd9ebffc55fa951594f03c0b4",
	new TokenData("WXPL-PLAZIX", "WXPL PLAZIX", "LP", "18")
);
LP_TOKENS.set("0xfca64216dba4445f75525d5cb7fdcfa9243a6f4f",
	new TokenData("eyah", "test", "LP", "18")
);
LP_TOKENS.set("0xb3ca3ead1c59ded552cd30a6992038284b418b65",
	new TokenData("sUSDai-USDT0", "reCLAMM sUSDai-USDT0", "LP", "18")
);
LP_TOKENS.set("0x3183f5956a7b8cbaacea34401e227af1c6df6d34",
	new TokenData("XCURVE/XPL", "XPLCURVE/WXPL", "LP", "18")
);
LP_TOKENS.set("0xe6dee82ab43e86e54c275905ee102a23a287c56d",
	new TokenData("USDe-USDT0", "USDe USDT0", "LP", "18")
);
LP_TOKENS.set("0x2e8837fabc74b5731b468d9b94cde2513dd2d7a6",
	new TokenData("1WXPL-99UCF", "1WXPL 99UCF", "LP", "18")
);
LP_TOKENS.set("0x70cfbd3d004df8ac9462c29edc4a95e756c29b59",
	new TokenData("80DOLOLO-20WXPL", "80DOLOLO 20WXPL", "LP", "18")
);
LP_TOKENS.set("0xd993478b7cce98a0319660b4279602502684f45f",
	new TokenData("PLASMO/WXP", "PLASMO/WXPL", "LP", "18")
);
LP_TOKENS.set("0x942644106b073e30d72c2c5d7529d5c296ea91ab",
	new TokenData("USDt0USDai", "USDT0/USDai", "LP", "18")
);
LP_TOKENS.set("0x40981ce1595d7810b3cb26dd265d92fa6b421935",
	new TokenData("asdasdasd", "asdfasd", "LP", "18")
);
LP_TOKENS.set("0x436f36e9e975edeb1e3f161e3cef8571ee9c34e1",
	new TokenData("99MQ-1WXPL", "99MQ 1WXPL", "LP", "18")
);
LP_TOKENS.set("0xcef60f26a7d30e2b45e8743e87bc3e6e301a37f0",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0xc9d02b7c8df0ee505b4614ab36c0efb74745d169",
	new TokenData("PLASMO/WXP", "PLASMO/WXPL", "LP", "18")
);
LP_TOKENS.set("0xd1e89c7991a6c06b0bc8631f0b59553a2a130b8d",
	new TokenData("WXPL-Kei", "WXPL Kei", "LP", "18")
);
LP_TOKENS.set("0x01e2c7fcde2b8d5d1413732c4e274ba5b06b1e54",
	new TokenData("USDai-waPlaUSDT0", "Surge USDai-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x04efd07bcfc721b74f0fc41582cce8851980e62e",
	new TokenData("WXPLUCF", "WXPL/UCF", "LP", "18")
);
LP_TOKENS.set("0x625294c6163782d5b004e0231b681c0915183764",
	new TokenData("PEPE/XPL", "XPLPEPE/XPL", "LP", "18")
);
LP_TOKENS.set("0x269b47978f4348c96f521658ef452ff85906fcfe",
	new TokenData("syrupUSDT0", "USDT0/syrupUSDT", "LP", "18")
);
LP_TOKENS.set("0x0b6253f03255623643f254f41a22455050ddb416",
	new TokenData("PlasmaUSD-waPlaUSDT0", "PlasmaUSD-waPlaUSDT0", "LP", "18")
);
LP_TOKENS.set("0x5ff3c9f9e329824abacb44b5a724c9ef42f191aa",
	new TokenData("asdgasdg", "cgfag", "LP", "18")
);
LP_TOKENS.set("0xd9c4e277c93374a9f8c877a9d06707a88092e8f0",
	new TokenData("sUSDe-waPlaUSDT0", "Ethena Surge sUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x05eb2d848c431b1a37d0cf0eecc7f211b3bb1dee",
	new TokenData("wrsETH-waPlaWETH", "Kelp Surge wrsETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0xd26361a9e960e24f3502b3b08deddf24cc50b36c",
	new TokenData("waPlasUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x26c2030f6fa3e16de2d37ba12dccd7b1cfcaf99b",
	new TokenData("50WXPL-50USDe", "50WXPL-50USDe", "LP", "18")
);
LP_TOKENS.set("0xc9a38dfbca8b620ec10e7b7169ed3ff7338311fa",
	new TokenData("W-weETH-USDT", "Weighted weETH-USDT", "LP", "18")
);
LP_TOKENS.set("0x2d84d79c852f6842abe0304b70bbaa1506add457",
	new TokenData("USDT0-USDe", "USDT0/USDe", "LP", "18")
);
LP_TOKENS.set("0xd2df29c7bc0b95ff3a71fc1615787ac0732a0d12",
	new TokenData("50WETH-50PEEP", "50WETH 50PEEP", "LP", "18")
);
LP_TOKENS.set("0x32628388bc77878a741f029f20b13dedec8fb5b3",
	new TokenData("XMOON", "XMOON/XPL", "LP", "18")
);
LP_TOKENS.set("0x74d80ee400d3026fdd2520265cc98300710b25d4",
	new TokenData("asasdasd", "asdasd", "LP", "18")
);
LP_TOKENS.set("0x2bb0881311d9ce0c2b09bad8d10d0542b9273ec6",
	new TokenData("Trillady", "Trillady", "LP", "18")
);
LP_TOKENS.set("0x699153933db85fb32e8937fabeb8a16b3bace4a7",
	new TokenData("syrupUSDT-waPlaUSDT0", "syrupUSDT waPlaUSDT0", "LP", "18")
);
LP_TOKENS.set("0x93cba7aa78b205cf63ccce567665ba8994efda98",
	new TokenData("TrillWXPL", "TRILLIONS/WXPL", "LP", "18")
);

