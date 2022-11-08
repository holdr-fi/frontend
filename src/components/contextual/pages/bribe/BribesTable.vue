<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import BribeModal from '@/components/contextual/pages/bribe/BribeModal.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { Bribe } from '@/constants/bribe';
import router from '@/plugins/router';
import { bribeService } from '@/services/bribe/bribe.service';
import useWeb3 from '@/services/web3/useWeb3';

const emit = defineEmits<{
  (e: 'clickedVote', token: string): void;
  (e: 'clickedAdd', bribe: Bribe): void;
}>();

const selectedBribeForModal = ref<Bribe | undefined>(undefined);
const bribeTokens = ref<string[]>([]);

const data = ref<Bribe[]>([]);

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

function navigateToVeBAL(bribe: Bribe) {
  emit('clickedVote', bribe.gaugeId);
  router.push({
    name: 'vebal'
  });
}

function selectBribe(bribe: Bribe) {
  selectedBribeForModal.value = bribe;
  emit('clickedAdd', bribe);
}

async function init() {
  const depositBribeData = await bribeService.getDepositBribe();
  const _data = depositBribeData.data;
  const proposalInfo = _data.proposalInfo;
  const proposals = proposalInfo.map(item => item.proposal);
  const deadlines = await Promise.all(
    proposals.map(proposal => bribeService.proposalDeadlines(proposal))
  );
  data.value = proposalInfo.map((item, index) => ({
    gaugeName: item.gaugeName,
    gaugeId: item.gauge,
    poolId: item.pool,
    proposalId: item.proposal,
    usdValuePerVote: item.USDValuePerVote ?? '0',
    totalUsdValue: item.totalUSDValue ?? '0',
    votes: item.votes,
    deadline: deadlines[index]
  }));
  const tokens = depositBribeData.data.tokens;
  bribeTokens.value = tokens;
}

onBeforeMount(() => {
  init();
});
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
      :bribeTokens="bribeTokens"
      @close="selectedBribeForModal = undefined"
    />
  </teleport>
</template>
