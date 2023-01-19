<script setup lang="ts">
import WithdrawForm from '@/components/forms/pool_actions/WithdrawForm/WithdrawForm.vue';
import TradeSettingsPopover, {
  TradeSettingsContext
} from '@/components/popovers/TradeSettingsPopover.vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { usePool } from '@/composables/usePool';
import { oneMinInMs } from '@/composables/useTime';
import { configService } from '@/services/config/config.service';
import { useIntervalFn } from '@vueuse/core';
import useWithdrawPageTabs, {
  tabs,
  Tab,
} from '@/composables/pools/useWithdrawPageTabs';
import { computed, onMounted } from 'vue';
import { hasFetchedPoolsForSor } from '@/lib/balancer.sdk';
import WithdrawFormDeep from '@/components/forms/pool_actions/WithdrawForm/WithdrawFormDeep.vue';
import { ExitPoolProvider } from '@/providers/local/exit-pool.provider';

/**
 * STATE
 */
const { network } = configService;
const { pool, poolQuery, loadingPool, transfersAllowed } = usePoolTransfers();
const { isDeepPool, isPreMintedBptPool } = usePool(pool);
const { activeTab, resetTabs } = useWithdrawPageTabs();

// Instead of refetching pool data on every block, we refetch every minute to prevent
// overfetching a heavy request on short blocktime networks like Polygon.
// TODO: Don't refetch whole pool, only update balances and weights with
// onchain calls. i.e. only refetch what's required to be up to date for joins/exits.
useIntervalFn(poolQuery.refetch.value, oneMinInMs);

/**
 * COMPUTED
 */
// We only need to wait for SOR if it's a deep pool.
const isLoadingSor = computed(
  (): boolean => isDeepPool.value && !hasFetchedPoolsForSor.value
);

const isLoading = computed(
  (): boolean =>
    loadingPool.value || !transfersAllowed.value || isLoadingSor.value
);

onMounted(() => resetTabs());
</script>

<template>
  <div>
    <BalLoadingBlock v-if="isLoading || !transfersAllowed" class="h-96" />
    <BalCard v-else shadow="xl" exposeOverflow noBorder>
      <template #header>
        <div class="w-full">
          <div class="text-xs text-gray-500 leading-none">
            {{ network.chainName }}
          </div>
          <div class="flex items-center justify-between">
            <h4>{{ $t('withdrawFromPool') }}</h4>
            <TradeSettingsPopover :context="TradeSettingsContext.invest" />
          </div>
          <!-- <BalTabs
            v-if="isDeepPool && isPreMintedBptPool"
            v-model="activeTab"
            :tabs="tabs"
            class="p-0 m-0 -mb-px whitespace-nowrap"
            noPad
          /> -->
        </div>
      </template>
      <ExitPoolProvider
        v-if="isDeepPool"
        :isSingleAssetExit="activeTab === Tab.SingleToken"
        :pool="pool"
      >
        <WithdrawFormDeep />
      </ExitPoolProvider>
      <WithdrawForm v-else :pool="pool" />
    </BalCard>
  </div>
</template>
