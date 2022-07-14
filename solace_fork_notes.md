*AWS deploy commands*

```bash
npm run build
aws s3 rm s3://balancer.solace.fi --include "*" --recursive
aws s3 cp --recursive --cache-control="max-age=86400" dist/ s3://balancer.solace.fi/
aws cloudfront create-invalidation --distribution-id E1V3D8UDKD2YUE --paths "/*"
```

*Aurora fork deploy steps*

1. Removed the following code from `public/index.html` to silence undefined VUE_APP_GA_ID and VUE_APP_FATHOM_ID errors

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=<%= VUE_APP_GA_ID %>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '<%= VUE_APP_GA_ID %>', { 'client_storage': 'none', 'anonymize_ip': true });
</script>

<!-- Fathom Analytics -->
<script src="https://quality-yellow.balancer.fi/script.js" data-spa="hash" data-site="<%= VUE_APP_FATHOM_SITE_ID %>" defer></script>

<!-- Intercom -->
<script>
  window.intercomSettings = {
    app_id: "odpifrqb",
    custom_launcher_selector: '#intercom-activator'
  };
</script>
```

2. Commented out initSentry function in `src/main.ts` to silence POST request to Sentry URL

*Aurora fork steps*

1. Deploy the following smart contracts: TimelockAuthorizer, Vault, BalancerHelpers, InvestmentPoolFactory, Multicall2, BatchRelayerLibrary, WeightedPoolFactory, WeightedPool2TokensFactory
2. Deploy Aurora subgraph
3. Copy .env.aurora_testnet.development to .env.development
4. Added new tokenlist `src/solace_fork/constants/aurora_testnet_tokenlist.json`
5. Created aurora testnet config in `src/constants/tokenlists.ts` to point to new tokenlist 
6. Added Aurora testnet switch cases for `src/lib/balancer.sdk.ts`
7. Created config in `src/lib/config/aurora_testnet.json`
8. Imported above config into `src/lib/config/index.ts`
9. Add Aurora config values in `src/constants/initialTokens.json`
10. Added network config to BALANCER_NETWORK_CONFIG variable in `src/forked_node_modules/balancer-labs/sdk/index.js`

*Aurora tesnet fork steps*

Prerequisite - Deployed smart contracts and subgraph

1. Copy .env.aurora_testnet.development to .env.development
2. Added new tokenlist `src/solace_fork/constants/aurora_testnet_tokenlist.json`
3. Created aurora testnet config in `src/constants/tokenlists.ts` to point to new tokenlist 
4. Added Aurora testnet switch cases for `src/lib/balancer.sdk.ts`
5. Created config in `src/lib/config/aurora_testnet.json`
6. Imported above config into `src/lib/config/index.ts`
7. Forked @balancer-labs/sdk & associated dependency @balancer-labs/sor to `src/forked_node_modules`. Added config for Aurora and Aurora testnet, made forked @balancer-labs/sdk import from forked @balancer-labs/sor (Multiple SOR classes in the @balancer-labs/sor and @balancer-labs/sdk, also the @balancer-labs/sor in first level of node_modules is different to the @balancer-labs/sor which is a dependency of @balancer-labs/sdk)
- Added network config to BALANCER_NETWORK_CONFIG variable in `src/forked_node_modules/balancer-labs/sdk/index.js`
8. Changed imports from `@balancer-labs/sdk` to relative path of local forked version in `src/lib/utils/balancer/helpers/sor/sorManager.ts` and `src/components/forms/pool_actions/MigrateForm/composables/useMigrateMath.ts`. Some error about incorrect SOR type. Giving absolute path caused an error. 
9. Deploy BatchRelayer.sol and MultiCall.sol contracts on Aurora testnet, provide addresses to `src/lib/config/aurora_testnet.json`
10. Add Aurora config values in `src/constants/initialTokens.json`
11. Commented out line `npm run lint:fix` in `.husky/pre-commit` because it screamed errors at the forked dependencies, and stopped git commits. Couldn't find a way for `vue-cli-service lint` to ignore chosen folders - zero config?
12. Commented out WS connection (listens to new blocks?) in `src/services/rpc-provider/rpc-provider.service.ts` and `src/services/web3/useWeb3.ts`

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

Remove subgauge Subgraph query on frontpage
- `isLoadingUserStakingData` is flag for pulling gauge data
- Queries for "Unstaked pools" section on frontpage in `src/providers/local/staking/userUserStakingData.ts`
- Forced early `return []` from multiple query functions
- Commented out refetchUserStakingData variable
- Commented out instances of useGaugesQuery()

Removed redundant data queries
- src/services/token/concerns/metadata.concern.ts


