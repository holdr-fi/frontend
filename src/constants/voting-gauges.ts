// import { Network } from '@balancer-labs/sdk';

import { Network } from '@/forked_node_modules/balancer-labs/sdk';
import { PoolToken } from '@/services/pool/types';
import { PoolType } from '@/services/pool/types';

import ALL_VOTING_GAUGES from '../../public/data/voting-gauges.json';

export type VotingGauge = {
  address: string;
  network: Network;
  pool: {
    id: string;
    address: string;
    poolType: PoolType;
    symbol: string | undefined;
    tokens: Pick<PoolToken, 'address' | 'weight' | 'symbol'>[];
  };
  tokenLogoURIs: Record<string, string | undefined>;
};

export const CHANGED_ALL_VOTING_GAUGES = [
  ...ALL_VOTING_GAUGES,
  {
    address: '0x83C76f5E2BDe48E28D0039950d91EbdfB2427fAC',
    network: 80001,
    pool: {
      id: '0xf695b07661b2a8b83c52bab38d37dfefdeb4dfbb000200000000000000000000',
      address: '0xF695b07661B2a8B83C52BAB38d37DFEFdEb4dfBb',
      poolType: 'Stable',
      symbol: 'veHLDR',
      tokens: [
        {
          address: '0xC3Ba2291E0A3C87A83eC9A259BaBA3779738A47d',
          weight: 'null',
          symbol: 'veHLDR'
        }
      ]
    },
    tokenLogoURIs: {
      '0xc128a9954e6c874ea3d62ce62b468ba073093f25':
        'https://raw.githubusercontent.com/balancer-labs/assets/master/assets/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56.png'
    }
  }
] as VotingGauge[];

export const KOVAN_VOTING_GAUGES: VotingGauge[] = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).filter(
  gauge => gauge.network === Network.KOVAN
);

export const MAINNET_VOTING_GAUGES: VotingGauge[] = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).filter(
  gauge => gauge.network !== Network.KOVAN
);

export const MUMBAI_VOTING_GAUGES: VotingGauge[] = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).filter(
  gauge => gauge.network === 80001
);

export const AURORA_VOTING_GAUGES: VotingGauge[] = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).filter(
  gauge => gauge.network !== 80001
);

export const VEBAL_VOTING_GAUGE:
  | VotingGauge
  | undefined = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).find(
  gauge => gauge.pool.symbol === 'veBAL'
);
