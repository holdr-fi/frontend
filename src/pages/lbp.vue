<script lang="ts" setup>
import axios from 'axios';
import { onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';

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

watch(tokenInAddress, () => {
  store.commit('trade/setInputAsset', tokenInAddress.value);
});

watch(tokenOutAddress, () => {
  store.commit('trade/setOutputAsset', tokenOutAddress.value);
});
</script>

<template>
  <div class="w-full">
    <div class="hero-content justify-center">
      <h2 class="mb-3">
        HLDR Liquidity Bootstrapping Pool
      </h2>
      <h3 class="mb-3">Time Remaining: {{ saleEnd }}</h3>
      <h3 class="mb-3">
        Starting Price
      </h3>
      <h3>Current Price: ${{ price }}</h3>
      <BalStack class="flex items-center">
        <BalBtn
          @click.prevent="redirectToTradePage"
          :disabled="!wNearAddress || !hldrAddress"
          :loading="loading"
        >
          Buy HLDR
        </BalBtn>
        <BalBtn>
          More Information
        </BalBtn>
      </BalStack>
    </div>
  </div>
</template>

<style scoped>
.hero-content {
  @apply flex flex-col md:items-center mx-auto md:gap-4 lg:gap-8 py-4 md:py-8 w-full;
}
</style>
