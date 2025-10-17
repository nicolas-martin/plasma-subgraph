# Plasma Subgraph

A comprehensive monorepo workspace containing GraphQL subgraphs for indexing and querying blockchain data across multiple DeFi protocols on the Polygon Plasma network.

## 🎯 Project Summary

**plasma-subgraph** provides real-time blockchain data indexing for 10 different DeFi protocols using The Graph Protocol. The project creates queryable GraphQL APIs that enable developers to efficiently access on-chain data including user positions, protocol metrics, transaction history, and more.


## 📊 Indexed Protocols

| Protocol | Type | Description | Network |
|----------|------|-------------|---------|
| **RTB** | Gaming | On-chain "Ride The Bus" card game with house funding | Plasma Testnet |
| **Gluex** | DEX Router | Cross-protocol swap aggregator with fee tracking | Plasma Mainnet |
| **Aave** | Lending | Lending/borrowing positions, liquidations, flash loans | Plasma Mainnet |
| **Merkl** | Distribution | Token claims and merkle tree-based airdrops | Plasma Mainnet |
| **Euler** | Advanced Lending | Multi-vault lending system with dynamic templates | Plasma Mainnet |
| **Balancer** | AMM | Automated market maker with weighted pools | Plasma Mainnet |
| **Fluid** | Lending Vault | Vault deposits, withdrawals, and rebalancing | Plasma Mainnet |
| **Stargate** | Bridge | Cross-chain token transfers via LayerZero | Plasma Mainnet |
| **Gearbox** | Credit Protocol | Credit pool operations and leveraged positions | Plasma Mainnet |

## 🏗️ Project Structure

```
rtb-subgraph/
├── subgraphs/
│   ├── rtb/          # Ride The Bus game subgraph
│   ├── gluex/        # Swap router subgraph
│   ├── aave/         # Lending protocol subgraph
│   ├── merkl/        # Token distribution subgraph
│   ├── euler/        # Advanced lending subgraph
│   ├── balancer/     # AMM protocol subgraph
│   ├── fluid/        # Vault lending subgraph
│   ├── stargate/     # Cross-chain bridge subgraph
│   └── gearbox/      # Credit protocol subgraph
├── package.json      # Root workspace configuration
└── README.md         # This file
```

### Subgraph Structure
Each subgraph follows a standard layout:
```
subgraph-name/
├── package.json          # Subgraph metadata and scripts
├── subgraph.yaml         # Data sources and contract configuration
├── schema.graphql        # GraphQL entity definitions
├── src/                  # AssemblyScript mapping handlers
├── abi/                  # Smart contract ABIs
└── generated/           # Auto-generated types (after codegen)
```
