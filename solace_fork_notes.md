*SOLACE FORK INSTRUCTIONS*

Commented out redundant frontend components
- Many Balancer features (such as veBAL) that we won't be needing in our fork

Change config to Rinkeby
- .env.development

Created custom token list, and pointed rinkeby settings to it
- src/constants/tokenlists.ts
- Fails to serve frontend otherwise

Change gas price provider from Blocknative to ethers.js provider
- src/store/modules/market.ts

Add initial tokens for Rinkeby
- src/constants/initialTokens.json

Add Rinkeby to supported network for SDK SOR
- src/lib/balancer.sdk.ts

Deploy Balancer Subgraph fork, pointing to forked contracts
- Frontend uses SDK for swap calculations and routing, SDK depends on subgraph
- `src/lib/balancer.sdk.ts` => add `customSubgraphUrl` field like so
- Change "subgraph" field in src/lib/config/rinkeby.json

Commented out useLock() import and dependent variables in `src/components/heros/AppHero.vue`
- Causes faulty useLock() query => faulty usePoolQuery() query

Modify BalancerSDK class object imported from @balancer-labs/sdk in src/lib/balancer.sdk.ts
- Swap UI doesn't work without changing hardcoded Vault address embedded in @balancer-labs/sdk & @balancer-labs/sor imports
- Need to prepend `// @ts-ignore` to overcome Typescript private field limitation

Changed vault address
- src/lib/config/rinkeby.json
