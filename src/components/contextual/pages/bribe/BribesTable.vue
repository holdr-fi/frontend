<script setup lang="ts">
import { compact } from 'lodash';
import { computed, ref } from 'vue';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import BribeModal from '@/components/contextual/pages/bribe/BribeModal.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useVeBal from '@/composables/useVeBAL';
import { Bribe } from '@/constants/bribe';
import router from '@/plugins/router';
import useWeb3 from '@/services/web3/useWeb3';

const emit = defineEmits<{
  (e: 'clickedVote', token: string): void;
  (e: 'clickedAdd', bribe: Bribe): void;
}>();

const selectedBribeForModal = ref<Bribe | undefined>(undefined);

const data = [
  { id: 'A', allocationPerVote: '1', totalRewards: '5' },
  { id: 'B', allocationPerVote: '1', totalRewards: '4' },
  { id: 'C', allocationPerVote: '10', totalRewards: '3' },
  { id: 'D', allocationPerVote: '19', totalRewards: '2' },
  { id: 'E', allocationPerVote: '13', totalRewards: '1' }
];

const { upToLargeBreakpoint } = useBreakpoints();
const { isWalletReady } = useWeb3();
const { veBalTokenInfo } = useVeBal();

const columns = computed<ColumnDefinition<Bribe>[]>(() => [
  {
    name: 'Name',
    id: 'bribeName',
    accessor: 'id',
    Cell: 'poolNameCell',
    align: 'center',
    width: 350
  },
  {
    name: 'Allocation Per Vote',
    Cell: 'allocationPerVoteCell',
    id: 'allocationPerVote',
    accessor: 'allocationPerVote',
    align: 'center'
  },
  {
    name: 'Total Rewards',
    Cell: 'totalRewardsCell',
    accessor: 'totalRewards',
    align: 'center',
    id: 'totalRewards'
  },
  {
    name: '',
    Cell: 'voteBribeCell',
    accessor: 'id',
    align: 'center',
    id: 'vote',
    width: 150,
    hidden: !isWalletReady.value
  },
  {
    name: '',
    Cell: 'addBribeCell',
    accessor: 'id',
    align: 'center',
    id: 'add',
    width: 150,
    hidden: !isWalletReady.value
  }
]);

function navigateToVeBAL(bribe: Bribe) {
  emit('clickedVote', bribe.id);
  router.push({
    name: 'vebal'
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
      :data="data"
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
          :key="bribe.id"
        >
          <span>{{ bribe.id }}</span>
        </div>
      </template>
      <template v-slot:allocationPerVoteCell="bribe">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="bribe.id"
        >
          <span>{{ bribe.allocationPerVote }}</span>
        </div>
      </template>
      <template v-slot:totalRewardsCell="bribe">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="bribe.id"
        >
          <span>{{ bribe.totalRewards }}</span>
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
            @click.prevent="navigateToVeBAL(bribe)"
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
      @close="selectedBribeForModal = undefined"
    />
  </teleport>
</template>
