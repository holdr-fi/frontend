import { BalancerSDK, Network } from '@balancer-labs/sdk';

import { configService } from '@/services/config/config.service';

const network = ((): Network => {
  switch (configService.network.key) {
    case '1':
      return Network.MAINNET;
    case '4':
      return Network.RINKEBY;
    case '42':
      return Network.KOVAN;
    case '137':
      return Network.POLYGON;
    case '42161':
      return Network.ARBITRUM;
    default:
      return Network.MAINNET;
  }
})();

const balancer = new BalancerSDK({
  network,
  rpcUrl: configService.rpc,
  customSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/kyzooghost/bebe'
});

// @ts-ignore
balancer.sor.config.addresses.contracts.vault =
  '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';

// @ts-ignore
balancer.sor.poolCacher.poolDataService.network.addresses.contracts.vault =
  '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';

export { balancer };

// export const balancer = new BalancerSDK({
//   network,
//   rpcUrl: configService.rpc,
//   customSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/kyzooghost/bebe'
// });
