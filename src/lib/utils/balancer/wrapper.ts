import { getAddress } from '@ethersproject/address';
import { AddressZero, Zero } from '@ethersproject/constants';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';

import configs from '@/lib/config';
import { isSameAddress as same } from '@/lib/utils';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { configService } from '@/services/config/config.service';

import { getStETHByWstETH, getWstETHByStETH } from './lido';

export enum WrapType {
  NonWrap = 0,
  Wrap,
  Unwrap,
  PleaseWrapFirst,
  PleaseSwapInFirst
}

export const wrapNearSymbolMap = {
  NEAR: 'wNEAR',
  stNEAR: 'wstNEAR',
  META: 'wMETA'
};

const wrapNearAddressMap = {
  [getAddress(configService.network.addresses.near)]: getAddress(
    configService.network.addresses.wnear
  ),
  [getAddress(configService.network.addresses.stnear)]: getAddress(
    configService.network.addresses.wstnear
  ),
  [getAddress(configService.network.addresses.meta)]: getAddress(
    configService.network.addresses.wmeta
  )
};

export const getWrapNearAddressMap = (address: string): string => {
  return wrapNearAddressMap[getAddress(address)] ?? AddressZero;
};

export const isNativeAssetWrap = (
  tokenIn: string,
  tokenOut: string
): boolean => {
  const nativeAddress = configService.network.nativeAsset.address;
  const { weth } = configService.network.addresses;
  return same(tokenIn, nativeAddress) && same(tokenOut, weth);
};

export const getWrapAction = (tokenIn: string, tokenOut: string): WrapType => {
  const nativeAddress = configService.network.nativeAsset.address;
  const {
    weth,
    stETH,
    wstETH,
    near,
    wnear,
    stnear,
    wstnear,
    meta,
    wmeta
  } = configService.network.addresses;

  if (same(tokenIn, nativeAddress) && same(tokenOut, weth))
    return WrapType.Wrap;
  if (same(tokenIn, stETH) && same(tokenOut, wstETH)) return WrapType.Wrap;
  if (same(tokenIn, near) && same(tokenOut, wnear)) return WrapType.Wrap;
  if (same(tokenIn, near) && !same(tokenOut, wnear))
    return WrapType.PleaseWrapFirst;
  if (same(tokenIn, stnear) && same(tokenOut, wstnear)) return WrapType.Wrap;
  if (same(tokenIn, stnear) && !same(tokenOut, wstnear))
    return WrapType.PleaseWrapFirst;
  if (same(tokenIn, meta) && same(tokenOut, wmeta)) return WrapType.Wrap;
  if (same(tokenIn, meta) && !same(tokenOut, wmeta))
    return WrapType.PleaseWrapFirst;

  if (same(tokenOut, nativeAddress) && same(tokenIn, weth))
    return WrapType.Unwrap;
  if (same(tokenOut, stETH) && same(tokenIn, wstETH)) return WrapType.Unwrap;
  if (same(tokenOut, near) && same(tokenIn, wnear)) return WrapType.Unwrap;
  if (same(tokenOut, near) && !same(tokenIn, wnear))
    return WrapType.PleaseSwapInFirst;
  if (same(tokenOut, stnear) && same(tokenIn, wstnear)) return WrapType.Unwrap;
  if (same(tokenOut, stnear) && !same(tokenIn, wstnear))
    return WrapType.PleaseSwapInFirst;
  if (same(tokenOut, meta) && same(tokenIn, wmeta)) return WrapType.Unwrap;
  if (same(tokenOut, meta) && !same(tokenIn, wmeta))
    return WrapType.PleaseSwapInFirst;

  return WrapType.NonWrap;
};

export const getWrapOutput = (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumberish
): BigNumber => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const {
    weth,
    wstETH,
    wnear,
    wstnear,
    wmeta
  } = configService.network.addresses;

  if (same(wrapper, weth)) return BigNumber.from(wrapAmount);
  if (same(wrapper, wstETH)) {
    return wrapType === WrapType.Wrap
      ? getWstETHByStETH(wrapAmount)
      : getStETHByWstETH(wrapAmount);
  }
  if (same(wrapper, wnear) || same(wrapper, wstnear) || same(wrapper, wmeta)) {
    return wrapType === WrapType.Wrap
      ? BigNumber.from(wrapAmount)
          .div('1000000')
          .mul('1000000')
      : wrapType === WrapType.PleaseWrapFirst ||
        wrapType === WrapType.PleaseSwapInFirst
      ? Zero
      : BigNumber.from(wrapAmount).mul('1000000');
  }
  throw new Error('Unknown wrapper');
};

export async function wrap(
  network: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  const {
    weth,
    wstETH,
    wnear,
    wstnear,
    wmeta
  } = configService.network.addresses;

  try {
    if (same(wrapper, weth)) {
      return wrapNative(network, web3, amount);
    } else if (same(wrapper, wstETH)) {
      return wrapLido(network, web3, amount);
    } else if (
      same(wrapper, wnear) ||
      same(wrapper, wstnear) ||
      same(wrapper, wmeta)
    ) {
      return wrapNearFrom24To18(wrapper, network, web3, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
    return Promise.reject(e);
  }
}

export async function unwrap(
  network: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  const {
    weth,
    wstETH,
    wnear,
    wstnear,
    wmeta
  } = configService.network.addresses;

  try {
    if (same(wrapper, weth)) {
      return unwrapNative(network, web3, amount);
    } else if (same(wrapper, wstETH)) {
      return unwrapLido(network, web3, amount);
    } else if (
      same(wrapper, wnear) ||
      same(wrapper, wstnear) ||
      same(wrapper, wmeta)
    ) {
      return unwrapNearFrom18To24(wrapper, network, web3, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e);
    return Promise.reject(e);
  }
}

const wrapNative = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function deposit() payable'],
    'deposit',
    [],
    { value: amount }
  );

const unwrapNative = (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function withdraw(uint256 wad)'],
    'withdraw',
    [amount]
  );

const wrapLido = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function wrap(uint256 _stETHAmount) returns (uint256)'],
    'wrap',
    [amount]
  );

const unwrapLido = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function unwrap(uint256 _wstETHAmount) returns (uint256)'],
    'unwrap',
    [amount]
  );

/* HOLDR_INFO: Near token has 24 tokens, incompatible with Balancer protocol, 
    so we created our own wrapped Near token with 6 decimals less to compile 
    with Balancer protocol, it might be confusing since the name of the official 
    Near token on the blockchain is called 'Wrapped Near'.
*/
const wrapNearFrom24To18 = async (
  nearContractAddress: string,
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    nearContractAddress,
    ['function deposit(uint256 amount) nonpayable'],
    'deposit',
    [amount]
  );

const unwrapNearFrom18To24 = async (
  nearContractAddress: string,
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    nearContractAddress,
    ['function withdraw(uint256 amount) nonpayable'],
    'withdraw',
    [amount]
  );
