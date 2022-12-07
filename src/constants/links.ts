export const EXTERNAL_LINKS = {
  Balancer: {
    Home: 'https://balancer.fi',
    BalForGas:
      'https://docs.balancer.finance/core-concepts/bal-balancer-governance-token/bal-for-gas',
    Social: {
      Discord: 'https://discord.gg/jjwUvr4CzK',
      Github: 'https://github.com/holdr-fi/',
      Mirror: 'https://mirror.xyz/0xEF013a60f765f34b0FD7C5aAf83b9C65BB10A9af',
      Twitter: 'https://twitter.com/HoldrFi'
    }
  },
  Gauntlet: {
    Home: 'https://gauntlet.network'
  },
  Ethereum: {
    Wallets: 'https://ethereum.org/en/wallets'
  },
  Element: {
    Home: 'https://element.fi',
    Earn: 'https://app.element.fi/mint',
    Pools: {
      LUSD:
        'https://app.element.fi/pools/0x56F30398d13F111401d6e7ffE758254a0946687d',
      USDC:
        'https://app.element.fi/pools/0x7Edde0CB05ED19e03A9a47CD5E53fC57FDe1c80c'
    }
  },
  Copper: {
    Home: 'https://copperlaunch.com/',
    Auctions: (poolAddress: string, networkPrefix = '') =>
      `https://${networkPrefix}copperlaunch.com/auctions/${poolAddress}`
  },
  Tracer: {
    Home: 'https://tracer.finance/'
  },
  Sense: {
    Home: 'https://sense.finance/'
  }
};
