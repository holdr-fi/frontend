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
  },
  {
    address: '0x4d2c52eEeA7fc6fb9c6BdBa073310557367a2d1e',
    network: 1313161554,
    pool: {
      id: '0x190185164382d388ef829a3ad67998ab5792eea3000200000000000000000010',
      address: '0x190185164382D388ef829a3Ad67998Ab5792EeA3',
      poolType: 'Stable',
      symbol: 'veHLDR',
      tokens: [
        {
          address: '0x5ed1e3D53AfdB0d0bc8661e056dffCD51c95bb9D',
          weight: 'null',
          symbol: 'veHLDR'
        }
      ]
    },
    tokenLogoURIs: {
      '0x5ed1e3D53AfdB0d0bc8661e056dffCD51c95bb9D':
        'https://raw.githubusercontent.com/solace-fi/brand-kit/main/circle-sign/solace-circle-medium.png'
    }
  },
  {
    // HLDR50-USDC25-WETH25
    address: '0xe1bC70BA4D240d4c85ae0D395459A5fF824BD2b8',
    network: 1313161554,
    pool: {
      id: '0x00055c916d93bb1809552430119149af858fbf06000100000000000000000015',
      address: '0x00055c916d93bb1809552430119149af858fbf06',
      poolType: 'Weighted',
      symbol: 'HLDR50-USDC25-WETH25',
      tokens: [
        {
          address: '0x1aaee8F00D02fcdb10cF1F0caB651dC83318c7AA',
          weight: '0.5',
          symbol: 'HLDR'
        },
        {
          address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
          weight: '0.25',
          symbol: 'USDC'
        },
        {
          address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
          weight: '0.25',
          symbol: 'WETH'
        }
      ]
    },
    tokenLogoURIs: {
      '0x1aaee8F00D02fcdb10cF1F0caB651dC83318c7AA':
        'https://raw.githubusercontent.com/solace-fi/brand-kit/main/circle-sign/solace-circle-medium.png',
      '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    }
  },
  {
    // 40USDC-40USDT-20wNEAR
    address: '0x2742E598626a05D4257a68525a530cBAf068B7Ec',
    network: 1313161554,
    pool: {
      id: '0x89bdd5d6b426c535127819abab51c4c2724d4e03000100000000000000000017',
      address: '0x89bdd5d6b426c535127819abab51c4c2724d4e03',
      poolType: 'Weighted',
      symbol: 'USDC40-USDT40-wNEAR20',
      tokens: [
        {
          address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
          weight: '0.4',
          symbol: 'USDT'
        },
        {
          address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
          weight: '0.4',
          symbol: 'USDC'
        },
        {
          address: '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94',
          weight: '0.2',
          symbol: 'wNEAR'
        }
      ]
    },
    tokenLogoURIs: {
      '0x4988a896b1227218e4A686fdE5EabdcAbd91571f':
        'https://raw.githubusercontent.com/trustwallet/assets/ad3cfa2e1c8e4b295cd81d64ecc5ab2a9514f79e/blockchains/binance/assets/USDT-6D8/logo.png',
      '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png'
    }
  },
  {
    // 80wNEAR-20wETH
    address: '0x40dA42a06F530690782a268C092FcB01C6e5412c',
    network: 1313161554,
    pool: {
      id: '0x9eeebb9184031fbb78a4959ef820d8119d433979000200000000000000000018',
      address: '0x9eeebb9184031fbb78a4959ef820d8119d433979',
      poolType: 'Weighted',
      symbol: 'wNEAR80-wETH20',
      tokens: [
        {
          address: '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94',
          weight: '0.8',
          symbol: 'wNEAR'
        },
        {
          address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
          weight: '0.2',
          symbol: 'WETH'
        }
      ]
    },
    tokenLogoURIs: {
      '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
      '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    }
  },
  {
    // 80wNEAR-20wBTC
    address: '0x53407b4350FF1a9a92c8793740A9161Ef44E7943',
    network: 1313161554,
    pool: {
      id: '0xdb6b3d53d6f1087eac3f51dd803ccce54f607a6e000200000000000000000019',
      address: '0xdb6b3d53d6f1087eac3f51dd803ccce54f607a6e',
      poolType: 'Weighted',
      symbol: 'wNEAR80-WBTC20',
      tokens: [
        {
          address: '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94',
          weight: '0.8',
          symbol: 'wNEAR'
        },
        {
          address: '0xf4eb217ba2454613b15dbdea6e5f22276410e89e',
          weight: '0.2',
          symbol: 'WBTC'
        }
      ]
    },
    tokenLogoURIs: {
      '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
      '0xf4eb217ba2454613b15dbdea6e5f22276410e89e':
        'https://raw.githubusercontent.com/trustwallet/assets/17d956dc22e8c9895dd52d93dea7ec6cdb2d882a/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
    }
  },
  {
    // 80wNEAR-20AURORA
    address: '0xC13F70a233062082bCcD05C827c83044EB738F45',
    network: 1313161554,
    pool: {
      id: '0x2524a4d5588d15e10b7495edd548cc53b18db78000020000000000000000001e',
      address: '0x2524a4d5588d15e10b7495edd548cc53b18db780',
      poolType: 'Weighted',
      symbol: 'wNEAR80-AURORA20',
      tokens: [
        {
          address: '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94',
          weight: '0.8',
          symbol: 'wNEAR'
        },
        {
          address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
          weight: '0.2',
          symbol: 'AURORA'
        }
      ]
    },
    tokenLogoURIs: {
      '0x6BB0c4d909a84d118B5e6c4b17117e79E621ae94':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
      '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/assets/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/logo.png'
    }
  },
  {
    // AURORA25-BSTN25-PLY25-TRI25
    address: '0xDE37F8a48C41F6C1A92Ac6792927F5151C7C4ba2',
    network: 1313161554,
    pool: {
      id: '0x4ab6f40241f01c9f6dcf8cc154d54b05477551c700010000000000000000001b',
      address: '0x4ab6f40241f01c9f6dcf8cc154d54b05477551c7',
      poolType: 'Weighted',
      symbol: 'AURORA25-BSTN25-PLY25-TRI25',
      tokens: [
        {
          address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
          weight: '0.25',
          symbol: 'AURORA'
        },
        {
          address: '0x9f1f933c660a1dc856f0e0fe058435879c5ccef0',
          weight: '0.25',
          symbol: 'BSTN'
        },
        {
          address: '0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f',
          weight: '0.25',
          symbol: 'PLY'
        },
        {
          address: '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
          weight: '0.25',
          symbol: 'TRI'
        }
      ]
    },
    tokenLogoURIs: {
      '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/assets/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/logo.png',
      '0x9f1f933c660a1dc856f0e0fe058435879c5ccef0':
        'https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens/bstn.svg',
      '0x09c9d464b58d96837f8d8b6f4d9fe4ad408d3a4f':
        'https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens/ply.svg',
      '0xFa94348467f64D5A457F75F8bc40495D33c65aBB':
        'https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens/tri.svg'
    }
  },
  // ComposableStablePool, not currently supported in frontend.
  // {
  //   // USDT-USDC Stablepool
  //   address: '0x652DabE7b0b724d828DC51c08a8c59db9e018F70',
  //   network: 1313161554,
  //   pool: {
  //     id: '0x480edf7ecb52ef9eace2346b84f29795429aa9c9000000000000000000000007',
  //     address: '0x480edf7ecb52ef9eace2346b84f29795429aa9c9',
  //     poolType: 'Stable',
  //     symbol: 'USDC-USDT',
  //     tokens: [
  //       {
  //         address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
  //         weight: 'null',
  //         symbol: 'USDC'
  //       },
  //       {
  //         address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
  //         weight: 'null',
  //         symbol: 'USDT'
  //       }
  //     ]
  //   },
  //   tokenLogoURIs: {
  //     '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802':
  //       'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  //     '0x4988a896b1227218e4A686fdE5EabdcAbd91571f':
  //       'https://raw.githubusercontent.com/trustwallet/assets/ad3cfa2e1c8e4b295cd81d64ecc5ab2a9514f79e/blockchains/binance/assets/USDT-6D8/logo.png'
  //   }
  // },
  {
    // USDT-USDC Weighted Pool
    address: '0xbC4B15225b06429ADCC990788b01C17aDbb1b315',
    network: 1313161554,
    pool: {
      id: '0x4b5648133ea518c3ac47f7159cf998c6ff15f435000200000000000000000024',
      address: '0x4b5648133eA518C3Ac47f7159cF998c6ff15F435',
      poolType: 'Weighted',
      symbol: 'USDC50-USDT50',
      tokens: [
        {
          address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
          weight: '0.5',
          symbol: 'USDC'
        },
        {
          address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
          weight: '0.5',
          symbol: 'USDT'
        }
      ]
    },
    tokenLogoURIs: {
      '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802':
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      '0x4988a896b1227218e4A686fdE5EabdcAbd91571f':
        'https://raw.githubusercontent.com/trustwallet/assets/ad3cfa2e1c8e4b295cd81d64ecc5ab2a9514f79e/blockchains/binance/assets/USDT-6D8/logo.png'
    }
  },
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
  gauge => gauge.network === 1313161554
);

export const VEBAL_VOTING_GAUGE:
  | VotingGauge
  | undefined = (CHANGED_ALL_VOTING_GAUGES as VotingGauge[]).find(
  gauge => gauge.pool.symbol === 'veBAL'
);
