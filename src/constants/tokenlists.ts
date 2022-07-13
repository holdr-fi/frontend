export interface TokenListMap {
  Balancer: {
    Default: string;
    Vetted: string;
  };
  External: string[];
}

interface TokenListMapByNetwork {
  [networkKey: string]: TokenListMap;
}

/**
 * Mapping of the TokenLists used on each network
 */
export const TOKEN_LIST_MAP: TokenListMapByNetwork = {
  '1': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer-labs/assets/master/generated/listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer-labs/assets/master/generated/vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      'https://www.gemini.com/uniswap/manifest.json'
    ]
  },
  '4': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/tokenlists.json',
      Vetted:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/tokenlists.json'
    },
    External: [
      'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/tokenlists.json'
    ]
  },
  '42': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/kovan.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/kovan.vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      'https://umaproject.org/uma.tokenlist.json'
    ]
  },
  '137': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/polygon.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/polygon.vetted.tokenlist.json'
    },
    External: [
      'https://unpkg.com/quickswap-default-token-list@1.0.67/build/quickswap-default.tokenlist.json'
    ]
  },
  '42161': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/arbitrum.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer-labs/assets/refactor-for-multichain/generated/arbitrum.vetted.tokenlist.json'
    },
    External: ['https://tracer.finance/tokens']
  },
  '1313161554': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_tokenlist.json'
    },
    External: [
      'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_tokenlist.json'
    ]
  },
  '1313161555': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_testnet_tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_testnet_tokenlist.json'
    },
    External: [
      'https://raw.githubusercontent.com/solace-fi/balancer-frontend-v2/develop/src/solace_fork/constants/aurora_testnet_tokenlist.json'
    ]
  }
};
