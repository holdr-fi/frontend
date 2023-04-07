import { UseQueryOptions } from 'react-query/types';
import { reactive, Ref, ref } from 'vue';
import { useQuery } from 'vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { sleep } from '@/lib/utils';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import { coingeckoService } from '@/services/coingecko/coingecko.service';
import { configService } from '@/services/config/config.service';

import useNetwork from '../useNetwork';
import useWeb3 from '@/services/web3/useWeb3';
import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import axios from 'axios';
import { formatUnits } from 'ethers/lib/utils';
import useAlerts, { AlertPriority, AlertType } from '../useAlerts';

/**
 * TYPES
 */
type QueryResponse = TokenPrices;

/**
 * CONSTANTS
 */
const PER_PAGE = 1000;

/**
 * Fetches token prices for all provided addresses.
 */
export default function useTokenPricesQuery(
  addresses: Ref<string[]> = ref([]),
  pricesToInject: Ref<TokenPrices> = ref({}),
  options: UseQueryOptions<QueryResponse> = {}
) {
  const { networkId } = useNetwork();
  const { getProvider, isWalletReady, connectToAppNetwork } = useWeb3();
  const { addAlert, removeAlert } = useAlerts();

  const queryKey = reactive(
    QUERY_KEYS.Tokens.Prices(networkId, addresses, pricesToInject)
  );

  function injectCustomTokens(
    prices: TokenPrices,
    pricesToInject: TokenPrices
  ): TokenPrices {
    for (const address of Object.keys(pricesToInject)) {
      prices[address] = pricesToInject[address];
    }
    return prices;
  }

  const queryFn = async () => {
    // Sequential pagination required to avoid coingecko rate limits.
    let prices: TokenPrices = {};

    console.log('Injecting price data', pricesToInject.value);
    prices = injectCustomTokens(prices, pricesToInject.value);
    const customPrices = await fetchCustomPricesForHoldrProtocol();
    prices = injectCustomTokens(prices, customPrices);

    const pageCount = Math.ceil(addresses.value.length / PER_PAGE);
    const pages = Array.from(Array(pageCount).keys());

    for (const page of pages) {
      if (page !== 0) await sleep(1000);
      const adjustedAddresses = addresses.value.filter(
        address => !prices[address]
      );
      const pageAddresses = adjustedAddresses.slice(
        PER_PAGE * page,
        PER_PAGE * (page + 1)
      );
      console.log('Fetching', pageAddresses.length, 'prices');
      prices = {
        ...prices,
        ...(await coingeckoService.prices.getTokens(pageAddresses))
      };
    }

    return prices;
  };

  /* HOLDR_INFO: This is where we inject the custom token prices we want to use in the app. */
  const fetchCustomPricesForHoldrProtocol = async (): Promise<TokenPrices> => {
    console.log('Fetching custom prices for Holdr Protocol');
    if (!isWalletReady.value) {
      addAlert({
        id: 'no-account',
        label: 'Please connect your wallet to use this app properly',
        type: AlertType.ERROR,
        persistent: true,
        actionLabel: 'Connect Wallet',
        priority: AlertPriority.HIGH
      });
      return {};
    }

    const customPrices = {};
    if (configService.network.chainId === 80001) {
      customPrices['0xEc1Fdb4E9f07111103F1EB3a60C314bd8E657c0d'] = {
        usd: 1
      };
    }

    if (configService.network.chainId === 1313161554) {
      const rateProviderABI = [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          inputs: [],
          name: 'getRate',
          outputs: [
            {
              internalType: 'uint256',
              name: 'rate',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ];

      // aurigami
      const auUSDCRateProvider = '0x247f8c7379C71d845687A7d9Ec642C3D09782Aa4';
      const auUSDCRateProviderContract = new Contract(
        auUSDCRateProvider,
        rateProviderABI,
        getProvider()
      );

      const auUSDTRateProvider = '0x9A1671e139332b7BfADc6E15360FD89da4399b52';
      const auUSDTRateProviderContract = new Contract(
        auUSDTRateProvider,
        rateProviderABI,
        getProvider()
      );

      // bastion
      const cUSDCRateProvider = '0x22dC4E88cEa43fC873fb5620874A0c45cbBb3635';
      const cUSDCRateProviderContract = new Contract(
        cUSDCRateProvider,
        rateProviderABI,
        getProvider()
      );

      const cUSDTRateProvider = '0x9865F88daad003b6F10FF59C0446E3Cd263076Af';
      const cUSDTRateProviderContract = new Contract(
        cUSDTRateProvider,
        rateProviderABI,
        getProvider()
      );

      const [
        tokenMap,
        holdrPrice,
        bn_auUSDCPrice,
        bn_auUSDTPrice,
        bn_cUSDCPrice,
        bn_cUSDTPrice
      ] = await Promise.all([
        coingeckoService.prices.getTokens([
          getAddress(configService.network.addresses.near),
          getAddress(configService.network.addresses.stnear),
          getAddress(configService.network.addresses.meta),
          getAddress(configService.network.addresses.nstart),
        ]),
        axios.get(
          'https://s3.us-west-2.amazonaws.com/price-feed.solace.fi.data/output/holdrPrice.json'
        ),
        auUSDCRateProviderContract.getRate(),
        auUSDTRateProviderContract.getRate(),
        cUSDCRateProviderContract.getRate(),
        cUSDTRateProviderContract.getRate()
      ]);

      const nearUsd =
        tokenMap[getAddress(configService.network.addresses.near)].usd;
      customPrices[configService.network.addresses.wnear] = {
        usd: nearUsd
      };

      const stNearUsd =
        tokenMap[getAddress(configService.network.addresses.stnear)].usd;
      customPrices[configService.network.addresses.wstnear] = {
        usd: stNearUsd
      };

      const wMETAUsd =
        tokenMap[getAddress(configService.network.addresses.meta)].usd;
      customPrices[configService.network.addresses.wmeta] = {
        usd: wMETAUsd
      };

      const wNSTARTUsd =
      tokenMap[getAddress(configService.network.addresses.nstart)].usd;
    customPrices[configService.network.addresses.wnstart] = {
      usd: wNSTARTUsd
    };

      // aurigami
      const auUSDCPrice = formatUnits(bn_auUSDCPrice, 18);
      const auUSDTPrice = formatUnits(bn_auUSDTPrice, 18);

      customPrices[getAddress(configService.network.addresses.auUSDC)] = {
        usd: Number(auUSDCPrice)
      };
      customPrices[getAddress(configService.network.addresses.auUSDT)] = {
        usd: Number(auUSDTPrice)
      };

      // bastion
      const cUSDCPrice = formatUnits(bn_cUSDCPrice, 18);
      const cUSDTPrice = formatUnits(bn_cUSDTPrice, 18);

      customPrices[getAddress(configService.network.addresses.cUSDC)] = {
        usd: Number(cUSDCPrice)
      };
      customPrices[getAddress(configService.network.addresses.cUSDT)] = {
        usd: Number(cUSDTPrice)
      };

      customPrices['0x1aaee8F00D02fcdb10cF1F0caB651dC83318c7AA'] = {
        usd: holdrPrice?.data || 0.0
      };
    }
    return customPrices;
  };

  const queryOptions = reactive({
    enabled: true,
    ...options
  });

  return useQuery<QueryResponse>(queryKey, queryFn, queryOptions);
}
