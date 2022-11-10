<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const router = useRouter();

/**
 * COMPUTED
 */
const benefits = computed(() => [
  // t('veBAL.hero.benefits.boost'),
  t('veBAL.hero.benefits.vote'),
  t('veBAL.hero.benefits.earn')
]);

/**
 * METHODS
 */
function navigateToGetVeHLDR() {
  router.push({
    name: 'get-vehldr',
    query: {
      returnRoute: 'vehldr'
    }
  });
}
</script>

<template>
  <div class="w-full bg-gray-850 hero-container">
    <div class="hero-content">
      <div
        class="hero-text py-8 lg:py-4 xl:pt-0 px-4 lg:px-8 2xl:px-0 w-full max-w-2xl mx-auto"
      >
        <p class="text-white font-medium mb-3">
          {{ $t('veBAL.hero.eyebrow') }}
        </p>
        <h1 class="title mb-6 text-white">{{ $t('veBAL.hero.title') }}</h1>
        <div
          v-for="(benefit, i) in benefits"
          :key="i"
          class="flex items-center mb-2 text-white"
        >
          <BalIcon name="check" class="text-green-500 mr-2" />
          {{ benefit }}
        </div>
        <div class="flex mt-6">
          <BalBtn
            color="gradient"
            @click="navigateToGetVeHLDR"
            class="mr-3 hero-btn"
          >
            {{ $t('veBAL.hero.buttons.getVeBAL') }}
          </BalBtn>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.hero-container {
  background-image: url('/images/backgrounds/spirograph.svg');
  background-repeat: no-repeat;
  background-position-x: right;
  background-size: cover;
  min-height: 440px;
  @apply flex content-center;
}
.hero-content {
  @apply flex flex-col md:flex-row md:items-center max-w-screen-2xl mx-auto md:gap-4 lg:gap-8 py-4 md:py-8 w-full;
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
