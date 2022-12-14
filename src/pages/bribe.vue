<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import BribesTable from '@/components/contextual/pages/bribe/BribesTable.vue';
import ClaimTable from '@/components/contextual/pages/bribe/ClaimTable.vue';
import Hero from '@/components/contextual/pages/bribe/Hero.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { isVeBalSupported } from '@/composables/useVeBAL';
import { Bribe } from '@/constants/bribe';
import { bribeService } from '@/services/bribe/bribe.service';

/**
 * DATA
 */

const { upToLargeBreakpoint } = useBreakpoints();
const seeClaims = ref(false);
const data = ref<Bribe[]>([]);
const bribeTokens = ref<string[]>([]);

const showBribeMarket = ref(false);

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
  <div v-if="isVeBalSupported" class="">
    <div>
      <Hero />
    </div>
  </div>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <BalStack v-if="showBribeMarket" vertical spacing="sm">
      <BalStack justify="between">
        <h3 class="px-4 lg:px-0">Bribe Market</h3>
        <BalBtn size="sm" @click.prevent="seeClaims = !seeClaims">{{
          !seeClaims ? 'See My Claims' : 'See Bribes'
        }}</BalBtn>
      </BalStack>
      <BalCard
        shadow="lg"
        :square="upToLargeBreakpoint"
        :noBorder="upToLargeBreakpoint"
        noPad
      >
        <BribesTable
          v-if="!seeClaims"
          :data="data"
          :bribeTokens="bribeTokens"
        />
        <ClaimTable v-else />
      </BalCard>
    </BalStack>
    <BalCard v-else square class="p-8">
      <div class="text-center">
        <span class="text-3xl">Bribes coming Soon</span>
      </div>
    </BalCard>
  </div>
</template>
