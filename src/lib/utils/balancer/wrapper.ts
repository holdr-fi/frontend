import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';

import configs from '@/lib/config';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { configService } from '@/services/config/config.service';

import { getStETHByWstETH, getWstETHByStETH } from './lido';

export enum WrapType {
  NonWrap = 0,
  Wrap,
  Unwrap,
  PleaseWrapFirst,
  PleaseSwapInNear
}

export const isNativeAssetWrap = (
  tokenIn: string,
  tokenOut: string
): boolean => {
  const nativeAddress = configService.network.nativeAsset.address;
  const { weth } = configService.network.addresses;
  return tokenIn === nativeAddress && tokenOut === weth;
};

export const getWrapAction = (tokenIn: string, tokenOut: string): WrapType => {
  const nativeAddress = configService.network.nativeAsset.address;
  const { weth, stETH, wstETH, near, wnear } = configService.network.addresses;

  if (tokenIn === nativeAddress && tokenOut === weth) return WrapType.Wrap;
  if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap;
  if (tokenIn === near && tokenOut === wnear) return WrapType.Wrap;
  if (tokenIn === near && tokenOut !== wnear) return WrapType.PleaseWrapFirst;

  if (tokenOut === nativeAddress && tokenIn === weth) return WrapType.Unwrap;
  if (tokenOut === stETH && tokenIn === wstETH) return WrapType.Unwrap;
  if (tokenOut === near && tokenIn === wnear) return WrapType.Unwrap;
  if (tokenOut === near && tokenIn !== wnear) return WrapType.PleaseSwapInNear;

  return WrapType.NonWrap;
};

export const getWrapOutput = (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumberish
): BigNumber => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const { weth, wstETH, wnear } = configService.network.addresses;

  if (wrapper === weth) return BigNumber.from(wrapAmount);
  if (wrapper === wstETH) {
    return wrapType === WrapType.Wrap
      ? getWstETHByStETH(wrapAmount)
      : getStETHByWstETH(wrapAmount);
  }
  if (wrapper === wnear) {
    return wrapType === WrapType.Wrap
      ? BigNumber.from(wrapAmount)
          .div('1000000')
          .mul('1000000')
      : wrapType === WrapType.PleaseWrapFirst ||
        wrapType === WrapType.PleaseSwapInNear
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
  try {
    if (wrapper === configs[network].addresses.weth) {
      return wrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return wrapLido(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wnear) {
      return wrapNear(network, web3, amount);
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
  try {
    if (wrapper === configs[network].addresses.weth) {
      return unwrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return unwrapLido(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wnear) {
      return unwrapNear(network, web3, amount);
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

/* SOLACE_INFO: Near token has 24 tokens, incompatible with Balancer protocol, 
    so we created our own wrapped Near token with 6 decimals less to compile 
    with Balancer protocol, it might be confusing since the name of the official 
    Near token on the blockchain is called 'Wrapped Near'.
*/
const wrapNear = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wnear,
    ['function deposit(uint256 amount) nonpayable'],
    'deposit',
    [amount]
  );

const unwrapNear = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wnear,
    ['function withdraw(uint256 amount) nonpayable'],
    'withdraw',
    [amount]
  );
