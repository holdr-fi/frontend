import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import BigNumber from 'bignumber.js';

import { toUnixTimestamp } from '@/composables/useTime';
import { getPreviousEpoch } from '@/composables/useVeBAL';
import { TOKENS } from '@/constants/tokens';
import FeeDistributorABI from '@/lib/abi/FeeDistributor.json';
import StablePhantomAbi from '@/lib/abi/StablePhantomPool.json';
import veBalAbi from '@/lib/abi/veBalAbi.json';
import { bnum } from '@/lib/utils';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import { configService } from '@/services/config/config.service';
import { Multicaller } from '@/services/multicalls/multicaller';

export class VeBalAprCalc {
  constructor(
    private readonly config = configService,
    private readonly balAddress = getAddress(TOKENS.Addresses.BAL),
    private readonly bbAUSDAddress = getAddress(
      TOKENS.Addresses.bbaUSD as string
    )
  ) {}

  public async calc(
    totalLiquidity: string,
    totalSupply: string,
    prices: TokenPrices
  ) {
    const {
      balAmount,
      bbAUSDAmount,
      bbaUSDPrice,
      veBalCurrentSupply
    } = await this.getData();
    const aggregateWeeklyRevenue = this.calcAggregateWeeklyRevenue(
      balAmount || '0.0',
      bbAUSDAmount || '0.0',
      bbaUSDPrice || '0.0',
      prices
    );

    const bptPrice = bnum(totalLiquidity).div(totalSupply);

    const apr = aggregateWeeklyRevenue
      .times(52)
      .div(bptPrice.times(veBalCurrentSupply))
      .toString();

    return apr
  }

  private async getData(): Promise<{
    balAmount: string;
    bbAUSDAmount: string;
    bbaUSDPrice: string;
    veBalCurrentSupply: string;
  }> {
    const epochBeforeLast = toUnixTimestamp(getPreviousEpoch(1).getTime());
    const multicaller = new Multicaller();

    // HOLDR_WARN: All values are being returned 0 from smart contract.
    if (this.config.network.addresses.feeDistributor !== '') {
      multicaller
        .call({
          key: 'balAmount',
          address: this.config.network.addresses.feeDistributor,
          function: 'getTokensDistributedInWeek',
          abi: FeeDistributorABI,
          params: [this.balAddress, epochBeforeLast]
        })
        .call({
          key: 'bbAUSDAmount',
          address: this.config.network.addresses.feeDistributor,
          function: 'getTokensDistributedInWeek',
          abi: FeeDistributorABI,
          params: [this.bbAUSDAddress, epochBeforeLast]
        })
        .call({
          key: 'veBalCurrentSupply',
          address: this.config.network.addresses.veBAL,
          function: 'totalSupply()',
          abi: veBalAbi
        });
      // HOLDR_EDIT: Commented out following to remove invalid smart contract query.
      // .call({
      //   key: 'bbaUSDPrice',
      //   address: this.bbAUSDAddress,
      //   function: 'getRate',
      //   abi: StablePhantomAbi
      // });
    } else {
      multicaller.call({
        key: 'veBalCurrentSupply',
        address: this.config.network.addresses.veBAL,
        function: 'totalSupply()',
        abi: veBalAbi
      });
    }

    const result = await multicaller.execute();

    for (const key in result) {
      result[key] = formatUnits(result[key], 18);
    }
    
    return result;
  }

  private calcAggregateWeeklyRevenue(
    balAmount: string,
    bbAUSDAmount: string,
    bbaUSDPrice: string,
    prices: TokenPrices
  ) {
    if (parseInt(balAmount, 10) == 0 && parseInt(bbAUSDAmount, 10) == 0) {
      return new BigNumber(0);
    }

    const balPrice = prices[this.balAddress];

    const balValue = bnum(balAmount).times(balPrice.usd);
    const bbaUSDValue = bnum(bbAUSDAmount).times(bbaUSDPrice);

    return balValue.plus(bbaUSDValue);
  }
}
