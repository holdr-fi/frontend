<script setup lang="ts">
import { ref } from 'vue';

import BribesTable from '@/components/contextual/pages/bribe/BribesTable.vue';
// import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import Hero from '@/components/contextual/pages/bribe/Hero.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { isVeBalSupported } from '@/composables/useVeBAL';

// SOLACE_TODO: finish bribe page, copy table thing from index.vue

/**
 * DATA
 */

const data = [
  { id: 'A', allocationPerVote: '1', totalRewards: '5' },
  { id: 'B', allocationPerVote: '1', totalRewards: '4' },
  { id: 'C', allocationPerVote: '10', totalRewards: '3' },
  { id: 'D', allocationPerVote: '19', totalRewards: '2' },
  { id: 'E', allocationPerVote: '13', totalRewards: '1' }
];

const selectedRewardToken = ref<string | null>(null);

const { upToLargeBreakpoint } = useBreakpoints();

function selectRewardToken(token: string) {
  selectedRewardToken.value = token;
}
</script>

<template>
  <div v-if="isVeBalSupported" class="">
    <div>
      <Hero />
    </div>
  </div>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <BalStack vertical spacing="sm">
      <h3 class="px-4 lg:px-0">Bribe Market</h3>
      <!-- <BalStack vertical>
        <div class="px-4 lg:px-0">
          <h3 class="mb-3">{{ $t('investmentPools') }}</h3>
          <div
            class="flex flex-col md:flex-row w-full justify-between items-end lg:items-center"
          >
            <TokenSearchInput
              v-model="selectedTokens"
              :loading="isLoadingPools"
              @add="addSelectedToken"
              @remove="removeSelectedToken"
              class="w-full md:w-2/3"
            />
          </div>
        </div>
      </BalStack> -->
      <BalCard
        shadow="lg"
        :square="upToLargeBreakpoint"
        :noBorder="upToLargeBreakpoint"
        noPad
      >
        <BribesTable :data="data" @selectRewardToken="selectRewardToken" />
      </BalCard>
    </BalStack>
  </div>
</template>
