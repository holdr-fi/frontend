<script setup lang="ts">
import { FullPool } from '@/services/balancer/subgraph/types';
import { configService } from '@/services/config/config.service';
// Composables
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
// Components
import WithdrawForm from '@/components/forms/pool_actions/WithdrawForm/WithdrawForm2.vue';
import TradeSettingsPopover, {
  TradeSettingsContext
} from '@/components/popovers/TradeSettingsPopover.vue';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
};

/**
 * PROPS
 */
defineProps<Props>();

/**
 * STATE
 */
const { network } = configService;
const { poolLoaded } = usePoolTransfers();
</script>

<template>
  <div>
    <BalLoadingBlock v-if="!poolLoaded" class="h-96" />
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
        </div>
      </template>
      <WithdrawForm :pool="pool" />
    </BalCard>
  </div>
</template>