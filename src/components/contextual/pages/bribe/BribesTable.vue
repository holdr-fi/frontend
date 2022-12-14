<script setup lang="ts">
import { computed, ref } from 'vue';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import BribeModal from '@/components/contextual/pages/bribe/BribeModal.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { Bribe } from '@/constants/bribe';
import router from '@/plugins/router';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * TYPES
 */
type Props = {
  data: Bribe[];
  bribeTokens: string[];
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  bribeTokens: () => []
});

const emit = defineEmits<{
  (e: 'clickedVote', token: string): void;
  (e: 'clickedAdd', bribe: Bribe): void;
}>();

const selectedBribeForModal = ref<Bribe | undefined>(undefined);

const { upToLargeBreakpoint } = useBreakpoints();
const { isWalletReady } = useWeb3();

const columns = computed<ColumnDefinition<Bribe>[]>(() => [
  {
    name: 'Name',
    id: 'bribeName',
    accessor: 'gaugeName',
    Cell: 'poolNameCell',
    align: 'center',
    width: 250
  },
  {
    name: 'USD Value Per Vote',
    Cell: 'usdValuePerVoteCell',
    id: 'usdValuePerVote',
    accessor: 'usdValuePerVote',
    align: 'center',
    width: 150
  },
  {
    name: 'Total USD Value',
    Cell: 'totalUsdValueCell',
    accessor: 'totalUsdValue',
    align: 'center',
    id: 'totalUsdValue',
    width: 150
  },
  {
    name: '',
    Cell: 'voteBribeCell',
    accessor: 'gaugeId',
    align: 'center',
    id: 'vote',
    width: 150,
    hidden: !isWalletReady.value
  },
  {
    name: '',
    Cell: 'addBribeCell',
    accessor: 'gaugeId',
    align: 'center',
    id: 'add',
    width: 150,
    hidden: !isWalletReady.value
  }
]);

function navigateToVeHLDR(bribe: Bribe) {
  emit('clickedVote', bribe.gaugeId);
  router.push({
    name: 'vehldr'
  });
}

function selectBribe(bribe: Bribe) {
  selectedBribeForModal.value = bribe;
  emit('clickedAdd', bribe);
}
</script>

<template>
  <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :key="data"
      :columns="columns"
      :data="props.data"
      skeleton-class="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :initial-state="{
        sortColumn: 'totalRewards',
        sortDirection: 'desc'
      }"
    >
      <template v-slot:poolNameCell="bribe">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="bribe.gaugeId"
        >
          <span>{{ bribe.gaugeName }}</span>
        </div>
      </template>
      <template v-slot:usdValuePerVoteCell="bribe">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="bribe.gaugeId"
        >
          <span>{{ bribe.usdValuePerVote }}</span>
        </div>
      </template>
      <template v-slot:totalUsdValueCell="bribe">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="bribe.gaugeId"
        >
          <span>{{ bribe.totalUsdValue }}</span>
        </div>
      </template>
      <template v-slot:voteBribeCell="bribe">
        <div class="px-2 py-4 flex justify-center">
          <BalBtn
            color="blue"
            :outline="true"
            size="sm"
            class="hover:text-white hover:bg-blue-500 focus:text-white focus:bg-blue-500"
            flat
            block
            @click.prevent="navigateToVeHLDR(bribe)"
          >
            Vote
          </BalBtn>
        </div>
      </template>
      <template v-slot:addBribeCell="bribe">
        <div v-if="isWalletReady" class="px-2 py-4 flex justify-center">
          <BalBtn
            color="blue"
            :outline="true"
            size="sm"
            class="hover:text-white hover:bg-blue-500 focus:text-white"
            flat
            block
            @click.prevent="selectBribe(bribe)"
            :disabled="Number(bribe.deadline) * 1000 < Date.now()"
          >
            Add Bribe
          </BalBtn>
        </div>
      </template>
    </BalTable>
  </BalCard>
  <teleport to="#modal">
    <BribeModal
      v-if="selectedBribeForModal != undefined"
      :selectedBribe="selectedBribeForModal"
      :bribeTokens="props.bribeTokens"
      @close="selectedBribeForModal = undefined"
    />
  </teleport>
</template>
