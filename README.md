# Multi-Subgraph Workspace

This repository contains multiple subgraph projects organized in a monorepo structure.

## Structure

```
├── subgraphs/
│   ├── rtb/          # Ride The Bus game subgraph
│   └── [other]/      # Future subgraphs
├── package.json      # Root workspace configuration
└── README.md
```

## Available Subgraphs

### RTB (Ride The Bus)
A subgraph for the Ride The Bus card game on-chain implementation.

## Commands

### RTB Subgraph
```bash
# Generate TypeScript types
npm run rtb:codegen

# Build the subgraph
npm run rtb:build

# Deploy the subgraph
npm run rtb:deploy

# Run tests
npm run rtb:test
```

### Gluex Subgraph
```bash
# Generate TypeScript types
npm run gluex:codegen

# Build the subgraph
npm run gluex:build

# Deploy the subgraph
npm run gluex:deploy

# Run tests
npm run gluex:test
```

### All Subgraphs
```bash
# Generate all subgraphs
npm run codegen

# Build all subgraphs
npm run build

# Test all subgraphs
npm run test
```

## Adding a New Subgraph

1. Create a new directory under `subgraphs/`
2. Add a `package.json` with the subgraph name
3. Add the standard subgraph files:
   - `schema.graphql`
   - `subgraph.yaml`
   - `src/` directory with mappings
   - `abis/` directory with contract ABIs
4. Add commands to root `package.json` following the pattern:
   ```json
   "name:codegen": "cd subgraphs/name && npm run codegen"
   ```

## Development

Each subgraph is independent and can be developed separately. Use the workspace commands to manage individual subgraphs or all at once.