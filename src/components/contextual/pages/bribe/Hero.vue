<script setup lang="ts">

/**
 * COMPOSABLES
 */
</script>

<template>
  <div class="w-full bg-gray-850 hero-container">
    <div class="hero-content">
      <BalCard>
        <div class="label font-medium">
          VeBAL Balance
        </div>
        <div class="value">
          <span class="font-bold truncate">000</span>
        </div>
      </BalCard>
      <BalCard>
        <div class="label font-medium">
          BAL Balance
        </div>
        <div class="value">
          <span class="font-bold truncate">000</span>
        </div>
      </BalCard>
      <BalCard>
        <div class="label font-medium">
          Total Vote Power
        </div>
        <div class="value">
          <span class="font-bold truncate">000</span>
        </div>
      </BalCard>
      <BalCard>
        <div class="flex items-center">
          <p class="text-sm text-gray-500 inline mr-1">
            Voting period ends
          </p>
        </div>
        <p class="text-lg font-semibold tabular-nums">
          <span>
            time
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
