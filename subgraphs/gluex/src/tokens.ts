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
LP_TOKENS.set("0x8d03ab50db7d3840304036286406e72b3ee60a5b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x15bbbcf3edf4cca5a99147257b86562dbb995d9c",
	new TokenData("Print", "Printing", "LP", "18")
);
LP_TOKENS.set("0x2f3eb8090b6e230b9cf1bfaf1280279cce817ea7",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xbd6459e682a02b84a67d0b968c81148cdb54c0fa",
	new TokenData("Gazilly-WXPL", "Gazilly WXPL", "LP", "18")
);
LP_TOKENS.set("0x76470f19cc167cd1d2a0078e8aa11009748d8a93",
	new TokenData("xUSD-waPlaUSDT0", "xUSD waPlaUSDT0", "LP", "18")
);
LP_TOKENS.set("0x912e601f576bf3483daf4d066362db3bfc50d27a",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3d10430234b6470f47cb3d311366ef18e17dc7d4",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x03e9d6bc8ff5169479f31234f96346bb226c586d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe080d14bf6ecec4c48ebe11055d4dea5dbc30e41",
	new TokenData("DoveXPL", "Dove/XPL", "LP", "18")
);
LP_TOKENS.set("0xe548011dd85582fbb719614c3ca6fdd9ba7790cb",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x7e618fff20bb635f764242653c7607eaa6342721",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xa06954e78e1cebbbe9c3efd51ada9f9ce125ea83",
	new TokenData("PAOLO-WXPL", "PAOLO WXPL", "LP", "18")
);
LP_TOKENS.set("0x718cc4378aa603a96474e5c4506959965427787f",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xebed2dcfdf027f6dd4be2b6cfb8d0418d43714e6",
	new TokenData("50WXPL-50trillions", "50WXPL 50trillions", "LP", "18")
);
LP_TOKENS.set("0xae8abb8afc4f566256722d4dc5aeefbe6ce83cbd",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x5dd08744dd0214e962bb49253f327da6ea055e5c",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3437fb65375d02bd589b7effae063b561076e5ef",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x708f0a2758ae883bc72328fae3795fa9e29e8e9d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x11e7b1fe6fb6112ed72b0dd9985b4a5a50a43fc0",
	new TokenData("50PLAZIX-50WXPL", "50PLAZIX 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x8ff73bbad247c2c84cb9824523d0afd326166896",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x42280bf43ad8c41a526e515cf5efd8c0c751fdcd",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x21199862da98159e7e54d85011a41e0d0914cdd1",
	new TokenData("PLAZIX-WXPL", "PLAZIX WXPL", "LP", "18")
);
LP_TOKENS.set("0x75bac5aa17e04ea92b5ec15273b3eb9c2b4044e2",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x4e0eea7aac0de62f9a47b6f1bf3a781e59713881",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x33ee859d1bea2574a8595a72d50c3e1992f701fb",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x99b5d22c50f0edcab81ef0d6778b5e2f857cb261",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xdb44441eb24e71350b248bf38454358dfcfd6765",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xedc2fa8d10a46573d6700a5d3239176f346badb6",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x217d3b0d76b63cfc37dfc71ee030ffae12ed58ee",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x638f567d445e60e1ac1afd369f53176fe9d5f93d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb2f0693efddc48c4af1cb892dad1f6dd502f94ed",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xa042d00f50dcc4626ee623f54f641462ac977442",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xcbd77e11b2c9c386a16a5bdafec4c1e37f5ae7c2",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xf930f11910720b2b367d42f4f32d9d09e89860c1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x7b218271455d49e60e9fbe1604c5ca38c1facbae",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd9ea02992c2ff27b0a64367ab41b522b962376d9",
	new TokenData("99MQ-1WXPL", "50MQ 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x28bfc91b947fd01ac4b988d060989d2feaf88065",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xedce935561e9e07a1b634b142559bc157fde4d82",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd5493c5fe10b68fc323d8b6317340ec6b7bd4495",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe3a3420b7ef5ba6734605dc62328334ab55f97df",
	new TokenData("USDe-USDT0", "USDe USDT0", "LP", "18")
);
LP_TOKENS.set("0x2ad16f3739b893a73aa79a6094041e59d988462c",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3bd4cb13d66ed3ae80e3a68dcd8525147fa4a0cb",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd4f1378b514cef3844cdd5d03fc7c91b04246e0b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x33540adba9ba9ae0d6891437f40af70997ce2f1d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x95bb94ead7478e4cf5d0ad440517428b0b91d886",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x6a74be33b5393d8a3eba4d69b78f9d9da947c48c",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0xa6735696010ad9a5da3b3f4d3f6587b850a112a6",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x968f7fba937ca70ed1e44e9a15e125f2a6ad4ca9",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x265c45757573ba264021e954b46bd5df530d12d2",
	new TokenData("XPLUSDT0", "XPL/USDT0", "LP", "18")
);
LP_TOKENS.set("0xa90b71ec4b4da5f314bd362b7d38726e7ca3a1ee",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0eac4526321866178c6444f0a211a21db4a0ed4c",
	new TokenData("asdasd", "asdasdas", "LP", "18")
);
LP_TOKENS.set("0x404e5bb94ad6335dc8f769a70a98d2320bfbef9c",
	new TokenData("50PEEP-50WXPL", "50PEEP 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x759f77fc713c245f6b6930307f003510903ca07e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x6709505a88d3fccb6b764183026d46710dfc5e8b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd59aaecdc89c30438377f00ca62ce45f28628cbd",
	new TokenData("pdog", "pdog", "LP", "18")
);
LP_TOKENS.set("0x6359f4af514f8a040ac18dbdf1442f2ee4209ad9",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x49e88ce99b056e50c2f1c34169e4d41f48edbb89",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xc36060ad9b7f1c5c20dedba0c25d41f0815a963c",
	new TokenData("wrsETH-waPlaWETH", "wrsETH waPlaWETH", "LP", "18")
);
LP_TOKENS.set("0xadf8e35a5fa351fc6a464d39d201494f9ca4f121",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0796a17ca0b0067909ef7ba0c55341a9e750c4d2",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0xf84b1b7cfe83c0e811351ba626d395a3ae872cae",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xed359e47db358b375b16792b251c1c56875229cf",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x95f55f843a00e69ea9b7c5e8e403830844c45e9d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe5d7114cddcd694a3116037edd56542aeedb58f8",
	new TokenData("WXPL-PlasmaX", "WXPL PlasmaX", "LP", "18")
);
LP_TOKENS.set("0x4dcf7a381000b2449c27108a183309160e51712e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x146f342af4fb1f6fed992da5b9658d89407e8777",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x08eb0c26fd1cdf5f7ddd7d227aaef5365eb7b652",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0xcd7052e6e259ddffea25ede311a17eda2758a602",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xef748fe18a10fbe513feb3e48dd8910d91cad8d2",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xf3d5bfe1fd1e419784935efe699eef1a60395390",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xde710f0b1c2264e85b6d35d709d1f6ec4c44f564",
	new TokenData("RGN", "XPL", "LP", "18")
);
LP_TOKENS.set("0x694b58ecf5acce06c918e3e7eabb5a8718987116",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x2f61876b865001e62fb5c66cf4ac3ab2fd00edf1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xfb6ee4012b0e62ac813486076ff19bd8f0ecd991",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x1e8d78e9b3f0152d54d32904b7933f1cfe439df1",
	new TokenData("sUSDeUSDT0", "USDT0/sUSDe", "LP", "18")
);
LP_TOKENS.set("0xda51975d78cb172b46d7292cec9fa9e74723ef3b",
	new TokenData("weETH-waPlaWETH", "Ether.Fi Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0x4bb7cefe50379c7a57e96425f3a28cd1f2402df5",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3997adc449076aaa7d3a5439aebb8aa9237bc3f1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x5c3df30a7b0b7cd3d10d8cda9036026fed929510",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xa09affeaf57646d9a72ec483b44bb5bd5ed9609b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x50740b97650106708c939231ff357c986f96fbb0",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x62fa0a389bc014ed588766c75ed60b45786a681c",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x961efa56d2aab75409eecca5a1602de30393b63d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb1e07b23d1993cf5e2155a4b40b0a95d71b7055e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x4d15ae4616a5080683d1f87433bdb544a1b8d2b9",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xc222148dcb4e5b5a2aaba2764bf13653619f58cf",
	new TokenData("WXPLXPLDOG", "WXPL/XPLDOG", "LP", "18")
);
LP_TOKENS.set("0x387a691b71ad37f94c36a39ec7efde09727682e8",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb31f828d647ccf04a2c65715c932a0d42ad362fa",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0xc05e1851e36e53dd72188508fda630d4d22970c8",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe6a59f69c0a8d69a9e10201cacd91b588f02a37b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x31e098c9daf9cd478228b7544e99319c57ae50fa",
	new TokenData("sUSDe-waPlaUSDT0", "Ethena Surge sUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0x61c9a8a54734025c5108b762ea8bdfea721ed696",
	new TokenData("weETH-waPlaWETH", "Ethena Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0xe87ca1a8aefa411179807317fb668f81c3508402",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x8e3da27b6496ca4373ad8261835f56d0107c8e25",
	new TokenData("PDogXPL", "PDog/XPL", "LP", "18")
);
LP_TOKENS.set("0x24e1b8f964d0df59770f56f25e55b769471c2452",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x9638224cb4b4be9abf8ecfdcabe38a35558972a9",
	new TokenData("XMOON", "XMOON/XPL", "LP", "18")
);
LP_TOKENS.set("0x3a2b237230d6b51a8dc71e54f2b7c05c2cb0cdae",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x8e0181e0a85edc22f514983f6581ae7d51ea7e2c",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xf05ca55338e4d2868a9299aa9845cb8bce484cd9",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x52fc811aaeb4762a3e3550e29806878793aa827a",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xc0bcf41cc87c9b9ffc63d1fb30823f0b6094cc6a",
	new TokenData("RGN", "WXPL", "LP", "18")
);
LP_TOKENS.set("0xc44984fac7ef3cc8fee9112d02e0a9390fe54e66",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x5618d0dc39c7e7e4ae798d4d09417863c4e739cd",
	new TokenData("WXPL-PLAZIX", "WXPL PLAZIX", "LP", "18")
);
LP_TOKENS.set("0xfc0a1da5c7363101425df7f6fa2d995679e906c5",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0c01d98c9d3fe67b76c2d536c44eccec23cd7a15",
	new TokenData("50BOOB-50WXPL", "50BOOB 50WXPL", "LP", "18")
);
LP_TOKENS.set("0x6b9a44ba468afebc7dbc196f310ba9017c25de69",
	new TokenData("waPlaUSDT0-PlasmaUSD", "waPlaUSDT0 PlasmaUSD", "LP", "18")
);
LP_TOKENS.set("0xd104124f3a7a0c276f718c9932038150cdc2b255",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb19570d41c4fb24248b9ea20d3fe78f2bed82441",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xcce9af90cd1ea4b5eac60102f40c72bf361fc7ac",
	new TokenData("weETH-waPlaWETH", "EtherFi Surge weETH-waWETH", "LP", "18")
);
LP_TOKENS.set("0xe8f762aef1a537d36134ff5bc47ab2633d89485f",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x011ee0cca8c50f64ea257293ce0f856775da5aa8",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x07910c187f2f15067c4da0e8857925602b722361",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x8518ae96fc7ee86b637f08a64bef912b213106d8",
	new TokenData("50WXPL-50PlasmaX", "50WXPL 50PlasmaX", "LP", "18")
);
LP_TOKENS.set("0xf46c70664cb30b36d8a8498976c78d333459d7a9",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x12a7387780728f48da547b2fd698aedc76c076b7",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x22f78107e67d2790b04f09a77ae1c57141af5c67",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0fb23c6363626aadd9ebffc55fa951594f03c0b4",
	new TokenData("WXPL-PLAZIX", "WXPL PLAZIX", "LP", "18")
);
LP_TOKENS.set("0xee8ab461b3c80d213833eac4c9206cf9bae199e0",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xcd745763f98cb0dac0597eb3f01f590aaa94de88",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3242a684e41db58eda0abed736ee06fe8db8c754",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xfca64216dba4445f75525d5cb7fdcfa9243a6f4f",
	new TokenData("eyah", "test", "LP", "18")
);
LP_TOKENS.set("0x8848a9e8ca11b39021f7b4b44885aef7a14e8366",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb3ca3ead1c59ded552cd30a6992038284b418b65",
	new TokenData("sUSDai-USDT0", "reCLAMM sUSDai-USDT0", "LP", "18")
);
LP_TOKENS.set("0xde60d7842eff9aae0a2a97ba67c071047a157f6d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3183f5956a7b8cbaacea34401e227af1c6df6d34",
	new TokenData("XCURVE/XPL", "XPLCURVE/WXPL", "LP", "18")
);
LP_TOKENS.set("0x9e4e76a4d863371aedba6e096ca6f4e209a1a704",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xc45dee3c4ba5cc0134209befc45fbad93574103d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xbec86ee02a7b9fe7af8ba3f6c9191854791dfc05",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe6dee82ab43e86e54c275905ee102a23a287c56d",
	new TokenData("USDe-USDT0", "USDe USDT0", "LP", "18")
);
LP_TOKENS.set("0xbfb3e0032e4942c09721d8521e3d9a471ebf0bb3",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x72cebaa33a042072919645ee5b0817eeafeee50b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd3c2769e963b75f8c0ae64a5b30d432154890379",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd377f993b6356e19ed0195b6c89d4a85212bfe05",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xf143907081a2c6d42cbc0b44b14969720c9114b3",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x7f432e005fe6ffbcaf1414f486028a55d8433e49",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xd431db1cf48b560c25e1c8de6726ffbfa5439bcc",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb69f058a29674dc52c7f5b68d3a47b5fbd9cf834",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0x8784fca5d2344a434cd48bf34f51cd6dcf1248ef",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x9533b9cc314447d17f02f766b5174ea18a49325f",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x40981ce1595d7810b3cb26dd265d92fa6b421935",
	new TokenData("asdasdasd", "asdfasd", "LP", "18")
);
LP_TOKENS.set("0x00cd31d00f49e68482dc8a50cbd3f64c46ecbbc8",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x436f36e9e975edeb1e3f161e3cef8571ee9c34e1",
	new TokenData("99MQ-1WXPL", "99MQ 1WXPL", "LP", "18")
);
LP_TOKENS.set("0x7804ac050a144bc266f0fa23a2c0390ef3f31b4d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xcef60f26a7d30e2b45e8743e87bc3e6e301a37f0",
	new TokenData("waPlaUSDe-waPlaUSDT0", "Ethena Surge waUSDe-waUSDT0", "LP", "18")
);
LP_TOKENS.set("0xdea449bfb26971e01630b2fd1e315207ce859d65",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xa0811d30bb041b01524caf3b7d8b3cbd069eb96e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xffca05b947cd4d25568a3b8b3f69ba546b3e9fe3",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0xd19a02bf6e05a51b434a48d36d41f1f392673f81",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xba2990e8805b3f42ed1c6a22a7f06c544e48902b",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0a1b30b94c2d87bc4c22312eee6f18d3d2609380",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x4d31d48dfd5770acf80e1b918630f938f89cc054",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x21c0f3a6174e6932c873818f394a09899a13f365",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x04efd07bcfc721b74f0fc41582cce8851980e62e",
	new TokenData("WXPLUCF", "WXPL/UCF", "LP", "18")
);
LP_TOKENS.set("0x93073be1b2da432f5a5bcd8e9533642fb8cc435d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x995fc1ee37e86653e6ad134dcffb5bc0c201a51e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x920b80b2683b34f12519cfcd0509ba90c897fb5d",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x625294c6163782d5b004e0231b681c0915183764",
	new TokenData("PEPE/XPL", "XPLPEPE/XPL", "LP", "18")
);
LP_TOKENS.set("0x98c289be941cdfd1d5be40b857703c22681b73a1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xacca56533f45402661f52a1fda1674d2aac2af1c",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x6523ebc3723e368e99b9847edd6ea4c330b70749",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xb43760e6b7cd10da8880c90056e9521b5e49bb02",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0xea34aa71c4390597a58dff8bcf00c75a15c7f958",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x3a037608b33d198a095e89d66827abeaa0b236d0",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0x29ed2acfcf508fc52f38b242bfebbed9508d33b7",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x5241f786e6058c2bd075af4d6955f63c52f848f5",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x8e4dfe1c9c13d2cf02de1a6a74ad2c2d50544c12",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x495609585dfdad0c0f96888fab34fcc5dac11f12",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x8f0faca0be3fd9e358a910669b9aa751d1c40549",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x1ff722c92218d362a217458aedaba8c00bda89fc",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xe736db1d516125427840b11ccbb0e3951564cb66",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xc9a38dfbca8b620ec10e7b7169ed3ff7338311fa",
	new TokenData("W-weETH-USDT", "Weighted weETH-USDT", "LP", "18")
);
LP_TOKENS.set("0x0b8b55ff5907262f29d97a4d4143a0a02f7d66e1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x2d84d79c852f6842abe0304b70bbaa1506add457",
	new TokenData("USDT0-USDe", "USDT0/USDe", "LP", "18")
);
LP_TOKENS.set("0x97d31a3985f7f70050b07d2378b13b7a1cbec7f1",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0xeff09c51194dc623f7c90e9cc640a59b9c61d38f",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
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
LP_TOKENS.set("0x9ec0f9106bb1e7debda8416938a6be3ff65ab37a",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x699bb25360eeef4345bc9005eaac2bfe809af10e",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x699153933db85fb32e8937fabeb8a16b3bace4a7",
	new TokenData("syrupUSDT-waPlaUSDT0", "syrupUSDT waPlaUSDT0", "LP", "18")
);
LP_TOKENS.set("0x45390f17e9bbcf89a4fb2cb11f2ec88b55182d73",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x93cba7aa78b205cf63ccce567665ba8994efda98",
	new TokenData("TrillWXPL", "TRILLIONS/WXPL", "LP", "18")
);
LP_TOKENS.set("0xf0de39a7816ea001db95da6ceb751b72f069a4d7",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x0cfd94b5874d4f067142de71defeb650f8a5f752",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);
LP_TOKENS.set("0x170b8472723252189f5b39137a1adb758cfaa015",
	new TokenData("DYOR-LP", "DYOR LPs", "LP", "18")
);

