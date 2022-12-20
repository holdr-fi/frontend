<script lang="ts" setup>
import { useRoute } from 'vue-router';

import DesktopLinkItem from './DesktopLinkItem.vue';

/**
 * COMPOSABLES
 */
const route = useRoute();

/**
 * METHODS
 */
function isActive(page: string): boolean {
  if (route.name === page) return true;
  return false;
}
</script>

<template>
  <div class="desktop-links">
    <DesktopLinkItem to="/" :active="isActive('home')">
      {{ $t('invest') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/trade" :active="isActive('trade')">
      {{ $t('trade') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/vehldr" :active="isActive('vehldr')">
      veHLDR
    </DesktopLinkItem>
    <DesktopLinkItem to="/bribe" :active="isActive('bribe')">
      Bribe
    </DesktopLinkItem>
    <DesktopLinkItem to="/claim" :active="isActive('claim')">
      <!-- <div class="flex items-center">
        {{ $t('claim') }}
        <StarsIcon class="ml-1 h-5 w-4" />
      </div> -->
      {{ $t('claim') }}
    </DesktopLinkItem>
    <!-- <DesktopLinkItem to="/lbp" :active="isActive('lbp')" class="special">
      <div class="flex items-center gap-2">
        HLDR Token Launch
        <img
          src="@/assets/images/icons/rocket.svg"
          class="rocket-ship"
          width="24"
        />
      </div>
    </DesktopLinkItem> -->
    <!-- <DesktopLinkItem to="/analytics" :active="isActive('analytics')">
      Analytics
    </DesktopLinkItem> -->
  </div>
</template>

<style scoped>
.desktop-links {
  @apply grid gap-6 grid-flow-col grid-rows-1 h-full content-center;
}

/* .rocket-ship {
  animation: bounce 1s infinite;
  animation-duration: 1s;
  animation-iteration-count: infinite;
} */

@keyframes bounce {
  0%,
  100% {
    transform: translate(0, 0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translate(15%, -15%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

/* .special {
  background-image: url('/images/backgrounds/hldr.png');
  background-size: 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-repeat: repeat;
  background-size: cover;
  animation: shine 15s linear infinite;
} */

@-webkit-keyframes shine {
  0% {
    text-shadow: rgba(255, 226, 10, 0.5) 1px 0 3px;
    background-position: 0 0;
  }
  50% {
    text-shadow: rgba(255, 226, 10, 0.9) 1px 0 9px;
  }
  100% {
    text-shadow: rgba(255, 226, 10, 0.5) 1px 0 3px;
    background-position: 1300px 0;
  }
}
@keyframes shine {
  0% {
    text-shadow: rgba(255, 226, 10, 0.5) 1px 0 3px;
    background-position: 0 0;
  }
  50% {
    text-shadow: rgba(255, 226, 10, 0.9) 1px 0 9px;
  }
  100% {
    text-shadow: rgba(255, 226, 10, 0.5) 1px 0 3px;
    background-position: 1300px 0;
  }
}
</style>
