<script lang="ts" setup>
import axios from 'axios';
import { onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CustomPairPriceGraph from '@/components/contextual/pages/lbp/CustomPairPriceGraph.vue';
import Col3Layout from '@/components/layouts/Col3Layout.vue';
import { useTradeState } from '@/composables/trade/useTradeState';
import useTokens from '@/composables/useTokens';
import router from '@/plugins/router';

const store = useStore();
const { prices, tokens } = useTokens();
const {
  tokenInAddress,
  tokenOutAddress,
  tokenInAmount,
  tokenOutAmount,
  setTokenInAddress,
  setTokenOutAddress
} = useTradeState();
const saleEnd = ref<string>('-');
const price = ref<string>('-');
const wNearAddress = ref<string>('');
const hldrAddress = ref<string>('');
const loading = ref<boolean>(true);
const showPriceGraphModal = ref(false);

const priceData = ref<[string, number][]>([
  ['2022/11/16 00:00', 1.0],
  ['2022/11/16 01:00', 0.959],
  ['2022/11/16 02:00', 0.92],
  ['2022/11/16 03:00', 0.882],
  ['2022/11/16 04:00', 0.847],
  ['2022/11/16 05:00', 0.813],
  ['2022/11/16 06:00', 0.781],
  ['2022/11/16 07:00', 0.751],
  ['2022/11/16 08:00', 0.722],
  ['2022/11/16 09:00', 0.695],
  ['2022/11/16 10:00', 0.67],
  ['2022/11/16 11:00', 0.647],
  ['2022/11/16 12:00', 0.625],
  ['2022/11/16 13:00', 0.605],
  ['2022/11/16 14:00', 0.587],
  ['2022/11/16 15:00', 0.57],
  ['2022/11/16 16:00', 0.556],
  ['2022/11/16 17:00', 0.542],
  ['2022/11/16 18:00', 0.531],
  ['2022/11/16 19:00', 0.521],
  ['2022/11/16 20:00', 0.514],
  ['2022/11/16 21:00', 0.508],
  ['2022/11/16 22:00', 0.503],
  ['2022/11/16 23:00', 0.501],
  ['2022/11/16 24:00', 0.5]
]);

function calculateEnd(timestamp: number) {
  const diff = timestamp * 1000 - Date.now();
  let seconds = parseInt((diff / 1000).toString());
  const days = parseInt((seconds / 86400).toString());
  seconds = seconds % 86400;
  const hours = parseInt((seconds / 3600).toString());
  seconds = seconds % 3600;
  const minutes = parseInt((seconds / 60).toString());
  seconds = seconds % 60;

  saleEnd.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function init() {
  const timestampData = await axios.get('https://api.holdr.fi/lbp/time');
  const priceData = await axios.get('https://api.holdr.fi/lbp/price');
  const _price = priceData.data;
  price.value = _price;
  const timestamp = timestampData.data;
  const wNEAR = Object.values(tokens.value).find(p => p.symbol === 'NEAR');
  const HLDR = Object.values(tokens.value).find(p => p.symbol === 'HLDR');
  if (HLDR) hldrAddress.value = HLDR.address;
  if (wNEAR) wNearAddress.value = wNEAR.address;
  loading.value = false;
  setInterval(() => {
    calculateEnd(timestamp);
  }, 1000);
}

onBeforeMount(() => {
  init();
});

function redirectToTradePage() {
  if (wNearAddress.value && hldrAddress.value) {
    setTokenInAddress(wNearAddress.value);
    setTokenOutAddress(hldrAddress.value);
    router.push({
      name: 'trade'
    });
  }
}

function onPriceGraphModalClose() {
  showPriceGraphModal.value = false;
}

function togglePairPriceGraphModal() {
  showPriceGraphModal.value = !showPriceGraphModal.value;
}

watch(tokenInAddress, () => {
  store.commit('trade/setInputAsset', tokenInAddress.value);
});

watch(tokenOutAddress, () => {
  store.commit('trade/setOutputAsset', tokenOutAddress.value);
});
</script>

<template>
  <div class="w-full app-hero h-56 flex-col gap-3">
    <h1 class="headline">
      HLDR Liquidity Bootstrapping Pool
    </h1>
  </div>
  <div class="hero-content justify-center">
    <Col3Layout class="mt-8  w-full">
      <template #gutterLeft>
        <BalCard>
          <p class="text-sm text-gray-500 inline mr-1 text-center">
            Time Remaining:
          </p>
          <BalLoadingBlock v-if="saleEnd == ''" />
          <p v-else class="text-lg font-semibold tabular-nums text-center">
            <span>
              {{ saleEnd }}
            </span>
          </p>
        </BalCard>
      </template>

      <BalStack class="flex flex-col justify-center gap-4">
        <BalBtn
          color="gradient"
          @click.prevent="redirectToTradePage"
          :disabled="!wNearAddress || !hldrAddress"
          :loading="loading"
          class="hero-btn"
        >
          Buy HLDR
        </BalBtn>
        <!-- <BalBtn>
          More Information
        </BalBtn> -->
        <BalLink external noStyle class="mx-auto">
          More Information
          <BalIcon
            name="arrow-up-right"
            size="sm"
            class="ml-px group-hover:text-pink-500 transition-colors"
          />
        </BalLink>
      </BalStack>

      <template #gutterRight>
        <BalLoadingBlock v-if="!wNearAddress || !hldrAddress" :class="'h-64'" />
        <CustomPairPriceGraph
          v-else
          :priceData="priceData"
          :tokenInAddress="wNearAddress"
          :tokenOutAddress="hldrAddress"
          :toggleModal="togglePairPriceGraphModal"
        />
      </template>
    </Col3Layout>
  </div>

  <teleport to="#modal">
    <BalModal :show="showPriceGraphModal" @close="onPriceGraphModalClose">
      <div class="graph-modal">
        <CustomPairPriceGraph
          :priceData="priceData"
          :tokenInAddress="wNearAddress"
          :tokenOutAddress="hldrAddress"
          :toggleModal="togglePairPriceGraphModal"
          isModal
          :onCloseModal="onPriceGraphModalClose"
        />
      </div>
    </BalModal>
  </teleport>
</template>

<style scoped>
.app-hero {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;
  transition: all 0.3s ease-in-out;
  background-image: url('/images/backgrounds/bg-header.svg');
}

.hero-content {
  @apply flex flex-col md:items-center mx-auto md:gap-4 lg:gap-8 py-4 md:py-8 w-full;
}

.headline {
  @apply text-white text-center text-4xl md:text-5xl pb-2 font-display font-black;
  font-weight: 600;
  font-variation-settings: 'wght' 700;
  font-family: system-ui;
}

.hero-btn {
  min-width: 140px;
}
</style>
