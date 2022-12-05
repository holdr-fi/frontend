<script setup lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch
} from 'vue';

import useNumbers from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import useVeBal from '@/composables/useVeBAL';
import { TOKENS } from '@/constants/tokens';
import { bribeService } from '@/services/bribe/bribe.service';
import { configService } from '@/services/config/config.service';

const {
  tokens,
  balances,
  getToken,
  approvalRequired,
  balanceFor
} = useTokens();
const { veBalBalance } = useVeBal();
const { fNum } = useNumbers();
const balanceInBAL = ref<string>('-');
const balanceInVeBAL = ref<string>('-');
const epochEnd = ref<string>('-');

watch(balances, () => {
  balanceInBAL.value = balances.value[TOKENS.Addresses.BAL];
});

watch(veBalBalance, () => {
  balanceInVeBAL.value = veBalBalance.value;
});

function calculateEpochEnd(timestamp: number) {
  const diff = Math.max(timestamp * 1000 - Date.now(), 0);
  let seconds = parseInt((diff / 1000).toString());
  const days = parseInt((seconds / 86400).toString());
  seconds = seconds % 86400;
  const hours = parseInt((seconds / 3600).toString());
  seconds = seconds % 3600;
  const minutes = parseInt((seconds / 60).toString());
  seconds = seconds % 60;

  epochEnd.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function init() {
  const epochEndData = await bribeService.epochEnd();
  balanceInBAL.value = balances.value[TOKENS.Addresses.BAL];
  balanceInVeBAL.value = veBalBalance.value;
  setInterval(() => {
    calculateEpochEnd(epochEndData.data);
  }, 1000);
}

onBeforeMount(() => {
  init();
});
</script>

<template>
  <div class="w-full bg-gray-850 hero-container">
    <div class="hero-content">
      <BalCard>
        <div class="label font-medium">
          HLDR Balance
        </div>
        <div class="value">
          <span class="font-bold truncate">{{
            balanceInBAL != '-' ? fNum(balanceInBAL, 'token') : balanceInBAL
          }}</span>
        </div>
      </BalCard>
      <BalCard>
        <div class="label font-medium">
          Total Vote Power
        </div>
        <div class="value">
          <span class="font-bold truncate">{{
            balanceInVeBAL != '-'
              ? fNum(balanceInVeBAL, 'token')
              : balanceInVeBAL
          }}</span>
        </div>
      </BalCard>
      <BalCard>
        <div class="flex items-center">
          <p class="text-sm text-gray-500 inline mr-1">
            Voting period ends in
          </p>
        </div>
        <p class="text-lg font-semibold tabular-nums">
          <span>
            {{ epochEnd }}
          </span>
        </p>
      </BalCard>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;
  transition: all 0.3s ease-in-out;
  background-image: url('/images/backgrounds/bg-header.svg');
}
.hero-content {
  @apply flex flex-col gap-3 justify-center md:flex-row md:items-center max-w-screen-2xl mx-auto md:gap-4 lg:gap-8 py-4 md:py-8 w-full;
}
.hero-text {
  opacity: 0;
  animation: fadeIn 1s ease-out 0.1s both;
}
.title {
  max-width: 820px;
}
.hero-btn {
  min-width: 140px;
}
.coins {
  @apply flex lg:gap-8;
  flex-grow: 1;
}
.coin-wrapper {
  aspect-ratio: 7 / 8;
}
.coin {
  @apply w-full flex flex-col items-center justify-end;
}

.coin:hover .graphic {
  transform: translateY(-8px);
}
.graphic {
  @apply transition-transform duration-300;
}
.caption {
  @apply font-semibold text-sm md:text-base text-gray-400 transition-colors text-center group-hover:text-white;
  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}

@media (min-width: 768px) {
  .hero-text {
    min-width: 400px;
  }
}
</style>

<style>
.caption .bal-icon {
  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}
</style>
