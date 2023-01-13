import { getAddress } from '@ethersproject/address';
import { AddressZero, Zero } from '@ethersproject/constants';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';

import configs from '@/lib/config';
import { isSameAddress } from '@/lib/utils';
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
  stNEAR: 'wstNEAR'
};

const wrapNearAddressMap = {
  [getAddress(configService.network.addresses.near)]: getAddress(
    configService.network.addresses.wnear
  ),
  [getAddress(configService.network.addresses.stnear)]: getAddress(
    configService.network.addresses.wstnear
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
  return isSameAddress(tokenIn, nativeAddress) && isSameAddress(tokenOut, weth);
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
    wstnear
  } = configService.network.addresses;

  if (isSameAddress(tokenIn, nativeAddress) && isSameAddress(tokenOut, weth))
    return WrapType.Wrap;
  if (isSameAddress(tokenIn, stETH) && isSameAddress(tokenOut, wstETH))
    return WrapType.Wrap;
  if (isSameAddress(tokenIn, near) && isSameAddress(tokenOut, wnear))
    return WrapType.Wrap;
  if (isSameAddress(tokenIn, near) && !isSameAddress(tokenOut, wnear))
    return WrapType.PleaseWrapFirst;
  if (isSameAddress(tokenIn, stnear) && isSameAddress(tokenOut, wstnear))
    return WrapType.Wrap;
  if (isSameAddress(tokenIn, stnear) && !isSameAddress(tokenOut, wstnear))
    return WrapType.PleaseWrapFirst;

  if (isSameAddress(tokenOut, nativeAddress) && isSameAddress(tokenIn, weth))
    return WrapType.Unwrap;
  if (isSameAddress(tokenOut, stETH) && isSameAddress(tokenIn, wstETH))
    return WrapType.Unwrap;
  if (isSameAddress(tokenOut, near) && isSameAddress(tokenIn, wnear))
    return WrapType.Unwrap;
  if (isSameAddress(tokenOut, near) && !isSameAddress(tokenIn, wnear))
    return WrapType.PleaseSwapInFirst;
  if (isSameAddress(tokenOut, stnear) && isSameAddress(tokenIn, wstnear))
    return WrapType.Unwrap;
  if (isSameAddress(tokenOut, stnear) && !isSameAddress(tokenIn, wstnear))
    return WrapType.PleaseSwapInFirst;

  return WrapType.NonWrap;
};

export const getWrapOutput = (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumberish
): BigNumber => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const { weth, wstETH, wnear, wstnear } = configService.network.addresses;

  if (isSameAddress(wrapper, weth)) return BigNumber.from(wrapAmount);
  if (isSameAddress(wrapper, wstETH)) {
    return wrapType === WrapType.Wrap
      ? getWstETHByStETH(wrapAmount)
      : getStETHByWstETH(wrapAmount);
  }
  if (isSameAddress(wrapper, wnear) || isSameAddress(wrapper, wstnear)) {
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
  const { weth, wstETH, wnear, wstnear } = configService.network.addresses;

  try {
    if (isSameAddress(wrapper, weth)) {
      return wrapNative(network, web3, amount);
    } else if (isSameAddress(wrapper, wstETH)) {
      return wrapLido(network, web3, amount);
    } else if (
      isSameAddress(wrapper, wnear) ||
      isSameAddress(wrapper, wstnear)
    ) {
      return wrapNear(wrapper, network, web3, amount);
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
  const { weth, wstETH, wnear, wstnear } = configService.network.addresses;

  try {
    if (isSameAddress(wrapper, weth)) {
      return unwrapNative(network, web3, amount);
    } else if (isSameAddress(wrapper, wstETH)) {
      return unwrapLido(network, web3, amount);
    } else if (
      isSameAddress(wrapper, wnear) ||
      isSameAddress(wrapper, wstnear)
    ) {
      return unwrapNear(wrapper, network, web3, amount);
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
const wrapNear = async (
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

const unwrapNear = async (
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
