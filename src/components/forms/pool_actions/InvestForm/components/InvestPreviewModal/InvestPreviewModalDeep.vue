<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useNumbers from '@/composables/useNumbers';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';

import InvestSummary from './components/InvestSummary.vue';
import TokenAmounts from '../../../shared/TokenAmounts.vue';
import InvestActionsDeep from './components/InvestActionsDeep.vue';
import useJoinPool from '@/composables/pools/useJoinPool';
import { useIntervalFn } from '@vueuse/shared';
import { oneSecondInMs } from '@/composables/useTime';
import useTokens from '@/composables/useTokens';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
};

type AmountMap = {
  [address: string]: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'showStakeModal'): void;
}>();

/**
 * STATE
 */
const investmentConfirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { getToken } = useTokens();
const { toFiat } = useNumbers();
const {
  isSingleAssetJoin,
  amountsIn,
  bptOut,
  fiatValueIn,
  fiatValueOut,
  priceImpact,
  highPriceImpact,
  rektPriceImpact,
  isLoadingQuery,
  txInProgress,
  queryJoinQuery,
  missingPricesIn,
  canQueryJoin,
  shouldApproveRelayer,
  resetAmounts
} = useJoinPool();

/**
 * COMPUTED
 */
const title = computed((): string =>
  investmentConfirmed.value
    ? t('investment.preview.titles.confirmed')
    : t('investment.preview.titles.default')
);

const showTokensOut = computed<boolean>(
  () => !!Object.keys(tokenOutMap.value).length
);

const amountInMap = computed(
  (): AmountMap => {
    const amountMap = {};
    amountsIn.value.forEach(amountIn => {
      amountMap[amountIn.address] = amountIn.value;
    });
    return amountMap;
  }
);

const amountOutMap = computed(
  (): AmountMap => {
    const amountMap = {
      [props.pool.address]: bptOut.value
    };
    return amountMap;
  }
);

const tokenInMap = computed(
  (): TokenInfoMap => {
    const tokenMap = {};
    Object.keys(amountInMap.value).forEach(address => {
      tokenMap[address] = getToken(address);
    });
    return tokenMap;
  }
);

const tokenOutMap = computed(
  (): TokenInfoMap => {
    const tokenMap = {
      [props.pool.address]: getToken(props.pool.address)
    };
    return tokenMap;
  }
);

const fiatAmountInMap = computed(
  (): AmountMap => {
    const fiatAmountMap = {};
    Object.keys(amountInMap.value).forEach(address => {
      fiatAmountMap[address] = toFiat(amountInMap.value[address], address);
    });
    return fiatAmountMap;
  }
);

const fiatAmountOutMap = computed(
  (): AmountMap => {
    if (!fiatValueOut.value) return {};
    const fiatAmountMap = {
      [props.pool.address]: fiatValueOut.value
    };
    return fiatAmountMap;
  }
);

const fiatTotalOut = computed((): string =>
  Object.values(fiatAmountOutMap.value).reduce(
    (total, amount) =>
      bnum(total)
        .plus(amount)
        .toString(),
    '0'
  )
);

/**
 * METHODS
 */
function handleClose(): void {
  if (investmentConfirmed.value) {
    resetAmounts();
    investmentConfirmed.value = false;
  }
  emit('close');
}

function handleShowStakeModal() {
  handleClose();
  emit('showStakeModal');
}

/**
 * WATCHERS
 */
// Every 10s we should re-trigger queryJoin in case the expected output
// has changed as a result of pool state changing. This should only happen in
// the preview modal, not at the JoinPoolProvider level.
//
// Originally we did it every block but this is overfetching on short blocktime
// networks like Polygon.
useIntervalFn(() => {
  if (!isLoadingQuery.value && !txInProgress.value) {
    queryJoinQuery.refetch.value();
  }
}, oneSecondInMs * 10);
</script>

<template>
  <BalModal show :fireworks="investmentConfirmed" @close="handleClose">
    <template #header>
      <div class="flex items-center">
        <BalCircle
          v-if="investmentConfirmed"
          size="8"
          color="green"
          class="mr-2 text-white"
        >
          <BalIcon name="check" />
        </BalCircle>
        <h4>
          {{ title }}
        </h4>
      </div>
    </template>

    <TokenAmounts
      :title="$t('investment.preview.titles.tokenIn')"
      :amountMap="amountInMap"
      :tokenMap="tokenInMap"
      :fiatAmountMap="fiatAmountInMap"
      :fiatTotal="fiatValueIn"
      :hideAmountShare="isSingleAssetJoin"
    />
    <TokenAmounts
      v-if="showTokensOut && canQueryJoin"
      showZeroAmounts
      :title="$t('investment.preview.titles.tokenOut')"
      class="mt-4"
      :amountMap="amountOutMap"
      :tokenMap="tokenOutMap"
      :fiatAmountMap="fiatAmountOutMap"
      :fiatTotal="fiatTotalOut"
      hideAmountShare
    />

    <BalAlert
      v-if="missingPricesIn"
      type="warning"
      :title="$t('noPriceInfo')"
      class="mt-4"
      block
    />

    <InvestSummary
      v-if="canQueryJoin"
      :pool="pool"
      :fiatTotal="missingPricesIn ? '-' : fiatValueIn"
      :priceImpact="priceImpact"
      :highPriceImpact="highPriceImpact"
    />

    <BalAlert
      v-if="shouldApproveRelayer"
      type="info"
      title="Approve the Batch Relayer first"
      description="You need to give Holdr permission to add liquidity on your behalf. This is a one-time approval."
      class="mt-6 mb-2"
    />

    <BalAlert
      v-else-if="!canQueryJoin"
      type="info"
      title="Approve the following tokens"
      description="You need to approve the amount of each token you are adding liquidity with so Holdr can simulate the transaction and give you the best outcome."
      class="mt-6 mb-2"
    />

    <BalAlert
      v-if="rektPriceImpact && canQueryJoin"
      type="error"
      :title="$t('investment.error.rektPriceImpact.title')"
      :description="$t('investment.error.rektPriceImpact.description')"
      class="mt-6 mb-2"
    />

    <InvestActionsDeep
      :pool="pool"
      class="mt-4"
      @success="investmentConfirmed = true"
      @show-stake-modal="handleShowStakeModal"
    />
  </BalModal>
</template>
