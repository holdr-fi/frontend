<script lang="ts" setup></script>

<template>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <h3 class="px-4 lg:px-0">Exchange</h3>
    <div class="stats-content">
      <BalCard square class="p-8">
        <div class="label text-center font-medium text-2xl">
          24H Volume
        </div>
        <div class="value text-center">
          <span class="truncate text-5xl">hi</span>
        </div>
      </BalCard>
      <BalCard square class="p-8">
        <div class="label text-center font-medium text-2xl">
          7D Volume
        </div>
        <div class="value text-center">
          <span class="truncate text-5xl">hi</span>
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
          <span class="truncate text-lg">hi</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          80HLDR-20WNEAR Locked
        </div>
        <div class="value text-center">
          <span class="truncate text-lg">hi</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          80HLDR-20WNEAR
        </div>
        <div class="value text-center">
          <span class="truncate text-lg">hi</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          Percentage Locked
        </div>
        <div class="value text-center">
          <span class="truncate text-lg">hi</span>
        </div>
      </BalCard>
      <BalCard square>
        <div class="label text-center font-medium text-sm">
          veHLDR Average Lock Time
        </div>
        <div class="value text-center">
          <span class="truncate text-lg">hi</span>
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
          <span class="truncate text-3xl">hi</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # Pools
        </div>
        <div class="value text-center">
          <span class="truncate text-3xl">hi</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          LPs
        </div>
        <div class="value text-center">
          <span class="truncate text-3xl">hi</span>
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
          <span class="truncate text-3xl">hi</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # HLDR Holders
        </div>
        <div class="value text-center">
          <span class="truncate text-3xl">hi</span>
        </div>
      </BalCard>
      <BalCard square class="p-5">
        <div class="label text-center font-medium text-xl">
          # HLDR Holders and LPs
        </div>
        <div class="value text-center">
          <span class="truncate text-3xl">hi</span>
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
