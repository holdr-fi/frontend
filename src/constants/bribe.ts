import { BigNumber } from '@ethersproject/bignumber';

export interface Bribe {
  gaugeName: string;
  votes: string;
  gaugeId: string;
  poolId: string;
  proposalId: string;
  usdValuePerVote: string;
  totalUsdValue: string;
  deadline: string;
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
