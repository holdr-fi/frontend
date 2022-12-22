import { Network } from '@balancer-labs/sdk';

import arbitrum from './arbitrum.json';
import aurora from './aurora.json'; // HOLDR_TODO: Add Aurora subgraph gauge
import aurora_testnet from './aurora_testnet.json';
import docker from './docker.json';
import homestead from './homestead.json';
import kovan from './kovan.json';
import mumbai from './mumbai.json';
import polygon from './polygon.json';
import rinkeby from './rinkeby.json';
import test from './test.json';

export interface Config {
  key: string;
  chainId: Network | 12345 | 17 | 1313161554 | 1313161555 | 80001;
  chainName: string;
  name: string;
  shortName: string;
  network: string;
  portisNetwork?: string;
  unknown: boolean;
  rpc: string;
  publicRpc?: string;
  ws: string;
  loggingRpc: string;
  explorer: string;
  explorerName: string;
  subgraph: string;
  poolsUrlV2: string;
  subgraphs: {
    aave: string;
    gauge: string;
  };
  supportsEIP1559: boolean;
  supportsElementPools: boolean;
  nativeAsset: {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    deeplinkId: string;
    logoURI: string;
    minTransactionBuffer: string;
  };
  addresses: {
    merkleRedeem: string;
    merkleOrchard: string;
    multicall: string;
    vault: string;
    weightedPoolFactory: string;
    stablePoolFactory: string;
    weth: string;
    stETH: string;
    wstETH: string;
    near: string;
    wnear: string;
    lidoRelayer: string;
    balancerHelpers: string;
    batchRelayer: string;
    veBAL: string;
    gaugeFactory: string;
    balancerMinter: string;
    tokenAdmin: string;
    veDelegationProxy: string;
    veBALHelpers: string;
    feeDistributor: string;
    bribe: string;
    bribeVault: string;
    rewardDistributor: string;
    votingEscrow: string;
    gaugeController: string;
  };
  keys: {
    infura: string;
    alchemy: string;
  };
  strategies: Record<
    string,
    {
      type: string;
      name: string;
    }
  >;
  gauges: {
    type: number;
    weight: number;
  };
}

const config: Record<Network | number, Config> = {
  [Network.MAINNET]: homestead,
  [Network.KOVAN]: kovan,
  [Network.RINKEBY]: rinkeby,
  [Network.POLYGON]: polygon,
  [Network.ARBITRUM]: arbitrum,
  1313161554: aurora,
  1313161555: aurora_testnet,
  80001: mumbai,
  12345: test,
  // @ts-ignore
  17: docker
};

export default config;
