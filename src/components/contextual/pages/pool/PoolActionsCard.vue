<script setup lang="ts">
import { computed, toRef } from 'vue';

import useWithdrawMath from '@/components/forms/pool_actions/WithdrawForm/composables/useWithdrawMath';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { lpTokensFor, flatTokenTree } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { bnum, isSameAddress } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { POOLS } from '@/constants/pools';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { hasBpt } = useWithdrawMath(toRef(props, 'pool'));
const { balanceFor, nativeAsset, wrappedNativeAsset } = useTokens();
const { fNum2, toFiat } = useNumbers();
const { isWalletReady, toggleWalletSelectModal } = useWeb3();

const poolsToRedirectWithdrawFor = [
  '0x0ee0b472b996b8fd565c319ccdbdadcdd3e98c17000000000000000000000035',
  '0x118c81ddecadb13608b90634ec1135b8e27f3590000000000000000000000038'
];

/**
 * COMPUTED
 */
const fiatTotal = computed(() => {
  const fiatValue = flatTokenTree(props.pool)
    .map(poolToken => poolToken.address)
    .map(address => {
      let tokenBalance = '0';

      if (isSameAddress(address, wrappedNativeAsset.value.address)) {
        const wrappedBalance = balanceFor(address);
        const nativeBalance = balanceFor(nativeAsset.address);
        tokenBalance = bnum(nativeBalance).gt(wrappedBalance)
          ? nativeBalance
          : wrappedBalance;
      } else {
        tokenBalance = balanceFor(address);
      }

      return toFiat(tokenBalance, address);
    })
    .reduce((total, value) =>
      bnum(total)
        .plus(value)
        .toString()
    );

  return fNum2(fiatValue, FNumFormats.fiat);
});
</script>

<template>
  <div
    class="p-4 w-full bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-900"
  >
    <div
      v-if="
        !POOLS.HideList.find(
          _pool => _pool.toLowerCase() == pool.id.toLowerCase()
        )
      "
    >
      <div class="text-gray-500 text-sm">
        {{ $t('basedOnTokensInWallet') }}
      </div>
      <div class="flex justify-between items-center mb-4">
        <h5>
          {{ $t('youCanInvest') }}
        </h5>
        <h5>
          {{ isWalletReady ? fiatTotal : '-' }}
        </h5>
      </div>
    </div>

    <BalBtn
      v-if="!isWalletReady"
      :label="$t('connectWallet')"
      color="gradient"
      block
      @click="toggleWalletSelectModal"
    />
    <BalBtn
      v-if="
        POOLS.HideList.find(
          _pool => _pool.toLowerCase() == pool.id.toLowerCase()
        )
      "
      :tag="hasBpt ? 'router-link' : 'div'"
      :to="{ name: 'withdraw' }"
      :label="$t('withdraw.label')"
      :disabled="!hasBpt"
      block
    />
    <div v-else class="grid gap-2 grid-cols-2">
      <BalBtn
        tag="router-link"
        :to="{ name: 'invest' }"
        :label="$t('invest')"
        color="gradient"
        block
      />
      <BalBtn
        v-if="poolsToRedirectWithdrawFor.includes(pool.id.toLowerCase())"
        tag="a"
        :href="'https://clone.holdr.fi/#/pool/' + pool.id + '/withdraw'"
        :label="$t('withdraw.label')"
        color="gradient"
        block
      />
      <BalBtn
        v-else
        :tag="hasBpt ? 'router-link' : 'div'"
        :to="{ name: 'withdraw' }"
        :label="$t('withdraw.label')"
        :disabled="!hasBpt"
        block
      />
    </div>
  </div>
</template>
