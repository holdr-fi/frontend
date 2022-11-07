import { BigNumber } from '@ethersproject/bignumber';

export interface Bribe {
  id: string;
  allocationPerVote: string;
  totalRewards: string;
}

export type Claim = {
  token: string;
  amount: BigNumber | string;
  claimParams: ClaimParams;
};

export type ClaimParams = {
  identifier: string;
  account: string;
  amount: string;
  merkleProof: string[];
};
