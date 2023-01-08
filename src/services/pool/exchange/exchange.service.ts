import {
  BalancerHelpers__factory,
  Vault__factory
} from '@balancer-labs/typechain';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Ref } from 'vue';

import { callStatic, sendTransaction } from '@/lib/utils/balancer/web3';
import ConfigService, { configService } from '@/services/config/config.service';
import { Pool } from '@/services/pool/types';

import ExitParams from './serializers/ExitParams';
import JoinParams from './serializers/JoinParams';

export default class ExchangeService {
  pool: Ref<Pool>;
  vaultAddress: string;
  helpersAddress: string;

  constructor(
    pool: Ref<Pool>,
    public readonly config: ConfigService = configService
  ) {
    this.pool = pool;
    this.vaultAddress = this.config.network.addresses.vault;
    this.helpersAddress = this.config.network.addresses.balancerHelpers;
  }

  public async queryJoin(
    provider: Web3Provider | JsonRpcProvider,
    account: string,
    amountsIn: string[],
    tokensIn: string[],
    bptOut = '0'
  ) {
    const txParams = this.joinParams.serialize(
      account,
      amountsIn,
      tokensIn,
      bptOut
    );

    return await callStatic(
      provider,
      this.helpersAddress,
      BalancerHelpers__factory.abi,
      'queryJoin',
      txParams
    );
  }

  public async join(
    provider: Web3Provider | JsonRpcProvider,
    account: string,
    amountsIn: string[],
    tokensIn: string[],
    bptOut = '0',
    customGasLimitNumber?: number
  ): Promise<TransactionResponse> {
    const txParams = this.joinParams.serialize(
      account,
      amountsIn,
      tokensIn,
      bptOut
    );
    const value = this.joinParams.value(amountsIn, tokensIn);

    return await sendTransaction(
      provider,
      this.vaultAddress,
      Vault__factory.abi,
      'joinPool',
      txParams,
      { value },
      false,
      customGasLimitNumber
    );
  }

  public async queryExit(
    provider: Web3Provider | JsonRpcProvider,
    account: string,
    amountsOut: string[],
    tokensOut: string[],
    bptIn: string,
    exitTokenIndex: number | null,
    exactOut: boolean
  ) {
    const txParams = this.exitParams.serialize(
      account,
      amountsOut,
      tokensOut,
      bptIn,
      exitTokenIndex,
      exactOut
    );

    return await callStatic(
      provider,
      this.helpersAddress,
      BalancerHelpers__factory.abi,
      'queryExit',
      txParams
    );
  }

  public async exit(
    provider: Web3Provider | JsonRpcProvider,
    account: string,
    amountsOut: string[],
    tokensOut: string[],
    bptIn: string,
    exitTokenIndex: number | null,
    exactOut: boolean,
    customGasLimitNumber?: number
  ): Promise<TransactionResponse> {
    const txParams = this.exitParams.serialize(
      account,
      amountsOut,
      tokensOut,
      bptIn,
      exitTokenIndex,
      exactOut
    );

    return await sendTransaction(
      provider,
      this.vaultAddress,
      Vault__factory.abi,
      'exitPool',
      txParams,
      {},
      false,
      customGasLimitNumber
    );
  }

  private get joinParams() {
    return new JoinParams(this);
  }

  private get exitParams() {
    return new ExitParams(this);
  }
}
