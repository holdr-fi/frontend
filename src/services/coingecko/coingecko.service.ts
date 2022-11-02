import { SUPPORTED_FIAT } from '@/constants/currency';

import { PriceService } from './api/price.service';
import { coingeckoClient } from './coingecko.client';

const testnetToMainnetMapping = {
  '42': '1',
  '4': '1',
  '1313161555': '1313161554',
  '80001': '137'
};

export const getNativeAssetId = (chainId: string): string => {
  const mapping = {
    '1': 'ethereum',
    '42': 'ethereum',
    '137': 'matic-network',
    '42161': 'ethereum',
    '1313161554': 'ethereum'
  };

  return mapping[testnetToMainnetMapping[chainId] ?? chainId] || 'ethereum';
};

export const getPlatformId = (chainId: string): string => {
  const mapping = {
    '1': 'ethereum',
    '42': 'ethereum',
    '137': 'polygon-pos',
    '42161': 'arbitrum-one',
    '1313161554': 'aurora'
  };

  return mapping[testnetToMainnetMapping[chainId] ?? chainId] || 'ethereum';
};

export class CoingeckoService {
  supportedFiat: string;
  prices: PriceService;

  constructor(
    public readonly client = coingeckoClient,
    priceServiceClass = PriceService
  ) {
    this.supportedFiat = SUPPORTED_FIAT.join(',');
    this.prices = new priceServiceClass(this);
  }
}

export const coingeckoService = new CoingeckoService();
