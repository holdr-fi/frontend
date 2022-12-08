<script lang="ts" setup>
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';

import { isMumbai } from '@/composables/useNetwork';
import useNumbers from '@/composables/useNumbers';
const { fNum, fNum2 } = useNumbers();

const data = ref<any[]>(Array(13).fill(0));

function convertSeconds(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + 'd ' : '';
  const hDisplay = h > 0 ? h + 'h ' : '';
  const mDisplay = m > 0 ? m + 'm ' : '';
  const sDisplay = s > 0 ? s + 's ' : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function init() {
  const url = `https://api.holdr.fi/analytics${isMumbai ? '-mumbai' : ''}`;
  const dataArray = await Promise.all([
    axios.get(`${url}/pools/poolcount`),
    axios.get(`${url}/pools/lpcount`),
    axios.get(`${url}/pools/tvl`),
    axios.get(`${url}/governance/tokenholders`),
    axios.get(`${url}/governance/tokensminted`),
    axios.get(`${url}/governance/tokenholdersandlp`),
    axios.get(`${url}/exchange/24hvolume`),
    axios.get(`${url}/exchange/7dvolume`),
    axios.get(`${url}/vehldr/totalvehldr`),
    axios.get(`${url}/vehldr/totalhpt`),
    axios.get(`${url}/vehldr/lockedhpt`),
    axios.get(`${url}/vehldr/locktime`),
    axios.get(`${url}/vehldr/percentagehptlocked`)
  ]);
  data.value = dataArray.map((d: any) => d.data);
}

onBeforeMount(() => {
  init();
});
</script>

<template>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <h3 class="px-4 lg:px-0">Exchange</h3>
    <div class="stats-content">
      <BalCard square class="p-8">
        <div class="label text-center font-medium text-2xl">
          24H Volume
        </div>
        <div class="value text-center">
          <span class="text-5xl">{{ fNum(data[6], 'usd_lg') }}</span>
        </div>
      </BalCard>
      <BalCard square class="p-8">
        <div class="label text-center font-medium text-2xl">
          7D Volume
        </div>
        <div class="value text-center">
          <span class="text-5xl">{{ fNum(data[7], 'usd_lg') }}</span>
        </div>
      </BalCard>
    </div>
    <h3 class="px-4 lg:px-0">veHLDR</h3>
    <div class="stats-content">
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          Total veHLDR
        </div>
        <div class="value text-center">
          <span class="text-lg">{{ fNum(data[8], 'token') }}</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          80HLDR-20WNEAR Locked
        </div>
        <div class="value text-center">
          <span class="text-lg">{{ fNum(data[10], 'token') }}</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          80HLDR-20WNEAR
        </div>
        <div class="value text-center">
          <span class="text-lg">{{ fNum(data[9], 'token') }}</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          Percentage Locked
        </div>
        <div class="value text-center">
          <span class="text-lg">{{ fNum(data[12], 'percent') }}</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          veHLDR Average Lock Time
        </div>
        <div class="value text-center">
          <span class="text-lg">{{ convertSeconds(data[11]) }}</span>
        </div>
      </BalCard>
    </div>
    <h3 class="px-4 lg:px-0">Pools</h3>
    <div class="stats-content">
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          Total Value Locked
        </div>
        <div class="value text-center">
          <span class="text-3xl">{{ fNum(data[2], 'usd') }}</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # Pools
        </div>
        <div class="value text-center">
          <span class="text-3xl">{{ fNum(data[0], 'default') }}</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          LPs
        </div>
        <div class="value text-center">
          <span class="text-3xl">{{ fNum(data[1], 'default') }}</span>
        </div>
      </BalCard>
    </div>
    <h3 class="px-4 lg:px-0">Governance</h3>
    <div class="stats-content">
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          HLDR Minted
        </div>
        <div class="value text-center">
          <span class="text-3xl"> {{ fNum(data[4], 'token') }} </span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # HLDR Holders
        </div>
        <div class="value text-center">
          <span class="text-3xl">{{ fNum(data[3], 'default') }}</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # HLDR Holders and LPs
        </div>
        <div class="value text-center">
          <span class="text-3xl">{{ fNum(data[5], 'default') }}</span>
        </div>
      </BalCard>
    </div>
  </div>
</template>

<style scoped>
.stats-content {
  @apply flex flex-col gap-3 justify-center md:flex-row w-full p-4;
}
</style>
