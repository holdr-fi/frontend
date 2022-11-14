import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';

import { ClaimParams } from '@/constants/bribe';
import BribeAbi from '@/lib/abi/Bribe.json';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { web3Service } from '@/services/web3/web3.service';

export class BribeService {
  bribeContract: Contract;
  rewardContract: Contract;
  votingEscrowContract: Contract;
  apiUrl: string;

  constructor(
    private readonly provider = rpcProviderService.jsonProvider,
    private readonly bribeAbi = BribeAbi,
    private readonly rewardDistributorAbi = BribeAbi,
    private readonly votingEscrowAbi = BribeAbi,
    private readonly config = configService,
    private readonly web3 = web3Service
  ) {
    this.bribeContract = new Contract(
      configService.network.addresses.bribe,
      this.bribeAbi,
      this.provider
    );
    this.votingEscrowContract = new Contract(
      configService.network.addresses.votingEscrow,
      this.votingEscrowAbi,
      this.provider
    );
    this.rewardContract = new Contract(
      configService.network.addresses.rewardDistributor,
      this.rewardDistributorAbi,
      this.provider
    );
    this.apiUrl = 'https://api.holdr.fi/bribe/';
  }

  async getWhitelistedTokens(): Promise<string[]> {
    if (configService.network.addresses.bribe === '') return [];
    return this.bribeContract.getWhitelistedTokens();
  }

  // async transferBribes() {
  //   const data = await axios.get(`${this.apiUrl}transferBribes`);
  //   return data;
  // }

  async rewardsMetadata() {
    const data = await axios.get(`${this.apiUrl}rewardsmetadata`);
    return data;
  }

  async claims(address: string) {
    const data = await axios.get(`${this.apiUrl}claims?address=${address}`);
    return data;
  }

  async epochEnd() {
    const data = await axios.get(`${this.apiUrl}epochend`);
    return data;
  }

  async getDepositBribe() {
    const data = await axios.get(`${this.apiUrl}depositbribe`);
    return data;
  }

  public depositBribe(
    userProvider: Web3Provider,
    maticAmount: BigNumber,
    proposal: string
  ): Promise<TransactionResponse> {
    return sendTransaction(
      userProvider,
      this.bribeContract.address,
      this.bribeAbi,
      'depositBribe',
      [proposal],
      { value: maticAmount }
    );
  }

  public depositBribeERC20(
    userProvider: Web3Provider,
    proposal: string,
    tokenAddress: string,
    amount: BigNumber
  ): Promise<TransactionResponse> {
    return sendTransaction(
      userProvider,
      this.bribeContract.address,
      this.bribeAbi,
      'depositBribeERC20',
      [proposal, tokenAddress, amount]
    );
  }

  public claim(
    userProvider: Web3Provider,
    claims: ClaimParams[]
  ): Promise<TransactionResponse> {
    return sendTransaction(
      userProvider,
      this.rewardContract.address,
      this.rewardDistributorAbi,
      'claim',
      [claims]
    );
  }

  public veBALBalanceOf(address: string): Promise<BigNumber> {
    return this.votingEscrowContract.balanceOf(address);
  }

  public proposalDeadlines(proposal: string): Promise<BigNumber> {
    return this.bribeContract.proposalDeadlines(proposal);
  }
}

export const bribeService = new BribeService();
