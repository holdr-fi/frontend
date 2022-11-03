import { Contract } from '@ethersproject/contracts';
import axios from 'axios';

import BribeAbi from '@/lib/abi/Bribe.json';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { web3Service } from '@/services/web3/web3.service';

export class Bribe {
  instance: Contract;
  apiUrl: string;

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
    this.apiUrl = 'https://v6jd9srk2c.execute-api.us-west-2.amazonaws.com/dev/';
  }

  async getWhitelistedTokens(): Promise<string[]> {
    if (configService.network.addresses.bribe === '') return [];
    return this.instance.getWhitelistedTokens();
  }

  async transferBribes() {
    const data = await axios.get(`${this.apiUrl}transferBribes`);
    return data;
  }

  async rewardsMetadata() {
    const data = await axios.get(`${this.apiUrl}rewardsmetadata`);
    return data;
  }

  async claims(address: string) {
    const data = await axios.get(`${this.apiUrl}claims?address=${address}`);
    return data;
  }
}

export const bribeService = new Bribe();
