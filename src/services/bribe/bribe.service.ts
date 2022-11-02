import { Contract } from '@ethersproject/contracts';

import BribeAbi from '@/lib/abi/Bribe.json';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { web3Service } from '@/services/web3/web3.service';

export class Bribe {
  instance: Contract;

  constructor(
    private readonly provider = rpcProviderService.jsonProvider,
    private readonly abi = BribeAbi,
    private readonly config = configService,
    private readonly web3 = web3Service
  ) {
    this.instance = new Contract(
      configService.network.addresses.bribe,
      this.abi,
      this.provider
    );
  }

  async getWhitelistedTokens(): Promise<string[]> {
    if (configService.network.addresses.bribe === '') return [];
    return this.instance.getWhitelistedTokens();
  }
}

export const bribeService = new Bribe();
