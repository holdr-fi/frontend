// import { BalancerSDK, BalancerSdkConfig, Network } from '@balancer-labs/sdk';
// import { Sor } from '../forked_node_modules/balancer-labs/sdk'
import { configService } from '@/services/config/config.service';

import {
  BalancerSDK,
  BalancerSdkConfig,
  Network
} from '../forked_node_modules/balancer-labs/sdk';

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
    case '80001':
      return Network.MUMBAI;
    case '42161':
      return Network.ARBITRUM;
    case '1313161554':
      return Network.AURORA;
    case '1313161555':
      return Network.AURORA_TESTNET;
    default:
      return Network.MAINNET;
  }
})();

const balancerConfig = ((): BalancerSdkConfig => {
  switch (configService.network.key) {
    case '4':
      return {
        network,
        rpcUrl: configService.rpc,
        customSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/kyzooghost/bebe'
      };
    case '80001':
      return {
        network,
        rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
        customSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/kyzooghost/solace-swap-test'
      };
    case '1313161554':
      return {
        network,
        rpcUrl: 'https://mainnet.aurora.dev',
        customSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/kyzooghost/balancer_aurora_fork'
      };
    case '1313161555':
      return {
        network,
        rpcUrl: 'https://testnet.aurora.dev',
        customSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/kyzooghost/solace_pool'
      };
    default:
      return {
        network,
        rpcUrl: 'https://mainnet.aurora.dev',
        customSubgraphUrl:
          'https://api.thegraph.com/subgraphs/name/kyzooghost/balancer_aurora_fork'
      };
  }
})();

// const sor = new Sor(balancerConfig);

const balancer = new BalancerSDK(balancerConfig);

// const balancer = ((): BalancerSDK => {
//   switch (configService.network.key) {
//     case '4':
//       return new BalancerSDK({
//         network,
//         rpcUrl: configService.rpc,
//         customSubgraphUrl:
//           'https://api.thegraph.com/subgraphs/name/kyzooghost/bebe'
//       });
//     case '1313161555':
//       return new BalancerSDK({
//         network,
//         rpcUrl: 'https://testnet.aurora.dev',
//         customSubgraphUrl:
//           'https://api.thegraph.com/subgraphs/name/kyzooghost/solace_pool'
//       });
//     default:
//       return new BalancerSDK({
//         network,
//         rpcUrl: configService.rpc,
//         customSubgraphUrl:
//           'https://api.thegraph.com/subgraphs/name/kyzooghost/bebe'
//       });
//   }
// })();

// @ts-ignore
// balancer.sor.config.addresses.contracts.vault = ((): string => {
//   switch (configService.network.key) {
//     case '4':
//       return '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';
//     case '1313161555':
//       return '0x39526464ac81f75009a8c1e425f2340e7f1ddfd4';
//     default:
//       return '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';
//   }
// })();

// @ts-ignore
// balancer.sor.poolCacher.poolDataService.network.addresses.contracts.vault = ((): string => {
//   switch (configService.network.key) {
//     case '4':
//       return '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';
//     case '1313161555':
//       return '0x39526464ac81f75009a8c1e425f2340e7f1ddfd4';
//     default:
//       return '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';
//   }
// })();

// balancer.sor.poolCacher.poolDataService.network.addresses.contracts.vault =
// '0x0FFf9f3044244048802B5AB4540e2014d1C0688A';

export { balancer };
