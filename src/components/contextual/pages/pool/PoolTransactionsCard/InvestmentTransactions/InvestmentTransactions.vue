<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePool } from '@/composables/usePool';
import { Pool } from '@/services/pool/types';

import BoostedActivities from '../BoostedPoolActivities/Activities.vue';
import Activities from '../PoolActivities/Activities.vue';
import { PoolTransactionsTab } from '../types';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  loading: boolean;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false
});

/**
 * COMPUTED
 */
const tabs = computed(() =>
  isDeepPool.value || isStablePhantomPool.value
    ? [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allTransactions')
        },
        {
          value: PoolTransactionsTab.USER_ACTIVITY,
          label: t('poolTransactions.tabs.myTransactions')
        }
      ]
    : [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allInvestments')
        },
        {
          value: PoolTransactionsTab.USER_ACTIVITY,
          label: t('poolTransactions.tabs.myInvestments')
        }
      ]
);

/**
 * COMPOSABLES
 */
const { isStablePhantomPool, isDeepPool } = usePool(toRef(props, 'pool'));
const { t } = useI18n();

/**
 * STATE
 */
const activeTab = ref(tabs.value[0].value);

const title = computed((): string => {
  if (isDeepPool.value || isStablePhantomPool.value) return t('poolActivity');

  return t('liquidityProvision');
});
</script>

<template>
  <div>
    <h4 class="px-4 lg:px-0 mb-5" v-text="title" />
    <div
      class="px-4 sm:px-0 flex justify-between items-end border-b dark:border-gray-900 mb-6"
    >
      <BalTabs v-model="activeTab" :tabs="tabs" no-pad class="-mb-px" />
    </div>
  </div>

  <template v-if="isStablePhantomPool || isDeepPool">
    <BoostedActivities
      v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY"
      :pool-activity-type="PoolTransactionsTab.ALL_ACTIVITY"
      :pool="pool"
      :loading="loading"
    />
    <BoostedActivities
      v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY"
      :pool-activity-type="PoolTransactionsTab.USER_ACTIVITY"
      :pool="pool"
      :loading="loading"
    />
  </template>
  <template v-else>
    <div class="mb-20">
      <Activities
        v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY"
        :pool-activity-type="PoolTransactionsTab.ALL_ACTIVITY"
        :pool="pool"
        :loading="loading"
      />
      <Activities
        v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY"
        :pool-activity-type="PoolTransactionsTab.USER_ACTIVITY"
        :pool="pool"
        :loading="loading"
      />
    </div>
  </template>
</template>
