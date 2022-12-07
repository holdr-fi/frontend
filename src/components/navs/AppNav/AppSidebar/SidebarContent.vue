<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import IconDiscord from '@/components/icons/IconDiscord.vue';
import IconGithub from '@/components/icons/IconGithub.vue';
import IconMirror from '@/components/icons/IconMirror.vue';
import IconTwitter from '@/components/icons/IconTwitter.vue';
import AppLogo from '@/components/images/AppLogo.vue';
import useApp from '@/composables/useApp';
import useConfig from '@/composables/useConfig';
import useDarkMode from '@/composables/useDarkMode';
import { EXTERNAL_LINKS } from '@/constants/links';
import { sleep } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * PROPS & EMITS
 */
const emit = defineEmits(['close']);

/**
 * COMPOSABLES
 */
const { darkMode, toggleDarkMode } = useDarkMode();
const { blockNumber } = useWeb3();
const { networkConfig } = useConfig();
const { version } = useApp();
const { t } = useI18n();
const router = useRouter();

/**
 * STATE
 */
const blockIcon = ref<HTMLDivElement>();

const navLinks = [
  { label: t('invest'), path: '/' },
  { label: t('trade'), path: '/trade' },
  { label: 'veHLDR', path: '/vehldr' },
  { label: 'Bribe', path: '/bribe' },
  { label: t('claim'), path: '/claim' },
  { label: 'HLDR Token Launch', path: '/lbp', special: true }
  // { label: 'Analytics', path: '/analytics' }
];

const ecosystemLinks = [
  { label: t('build'), url: 'https://balancer.fi/build' },
  { label: t('blog'), url: 'https://medium.com/balancer-protocol' },
  { label: t('docs'), url: 'https://docs.balancer.fi/' },
  { label: t('governance'), url: 'https://vote.balancer.fi/#/' },
  { label: t('analytics'), url: 'https://dune.xyz/balancerlabs' },
  { label: t('forum'), url: 'https://forum.balancer.fi/' },
  {
    label: t('grants'),
    url: 'https://balancer.community/balancer-community-grants'
  }
];

/**
 * METHODS
 */
async function navTo(path: string) {
  router.push(path);
  emit('close');
}

/**
 * WATCHERS
 */
watch(blockNumber, async () => {
  blockIcon.value?.classList.add('block-change');
  await sleep(300);
  blockIcon.value?.classList.remove('block-change');
});
</script>

<template>
  <div class="opacity-0 fade-in-delay">
    <div
      class="h-20 px-4 border-b border-gray-800 flex flex-col justify-center"
    >
      <AppLogo forceDark />
    </div>

    <div class="grid grid-col-1 text-lg mt-2">
      <div
        v-for="link in navLinks"
        :key="link.label"
        class="side-bar-link flex items-center gap-2"
        :class="[link.special ? 'special rocket-ship' : '']"
        @click="navTo(link.path)"
      >
        {{ link.label }}
        <img
          v-if="link.special"
          src="@/assets/images/icons/rocket.svg"
          class="rocket-ship"
          width="24"
        />
      </div>
    </div>

    <!-- <div class="grid grid-col-1 text-sm mt-5">
      <span class="text-gray-500 px-4 pb-1 font-medium">Ecosystem</span>
      <BalLink
        v-for="link in ecosystemLinks"
        :key="link.url"
        :href="link.url"
        class="side-bar-link flex items-center"
        external
        noStyle
      >
        {{ link.label }}
        <BalIcon name="arrow-up-right" size="sm" class="ml-1 text-gray-500" />
      </BalLink>
    </div> -->

    <div class="mt-6 px-4">
      <!-- <div id="intercom-activator" class="side-bar-btn">
        <IntercomIcon />
        <span class="ml-2">Chat for help</span>
      </div> -->
      <div class="side-bar-btn mt-2" @click="toggleDarkMode">
        <MoonIcon v-if="!darkMode" class="mr-2" />
        <SunIcon v-else class="mr-2" />
        <span>{{ darkMode ? 'Light' : 'Dark' }} mode</span>
      </div>
    </div>

    <div class="mt-6 flex gap-3 justify-center">
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Twitter" external noStyle>
        <IconTwitter />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Discord" external noStyle>
        <IconDiscord />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Mirror" external noStyle>
        <IconMirror />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Github" external noStyle>
        <IconGithub />
      </BalLink>
    </div>

    <div class="mt-6 px-4 text-xs">
      <div class="flex items-center">
        <div
          ref="blockIcon"
          class="block-icon w-2 h-2 rounded-full bg-green-500"
        />
        <span class="ml-2 text-gray-300">
          {{ networkConfig.name }}: Block {{ blockNumber }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-bar-link {
  @apply transition duration-300 p-4 py-1.5 hover:bg-gray-850 cursor-pointer;
}

.side-bar-btn {
  @apply flex items-center bg-gray-850 hover:bg-gray-800 rounded-lg p-2 cursor-pointer transition;
}

.social-link {
  @apply w-11 h-11 xs:w-12 xs:h-12  rounded-full bg-gray-850 hover:bg-gray-800 flex items-center justify-center text-white cursor-pointer;
}

.rocket-ship {
  animation: bounce 1s infinite;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

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

.special {
  background-image: url('/images/backgrounds/hldr.png');
  background-size: 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: yellow 1px 0 15px;
  background-repeat: repeat;
  background-size: cover;
  animation: shine 15s linear infinite;
}

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

.social-link > svg {
  @apply w-6 h-6;
  fill: white;
}

#intercom-activator {
  z-index: 2147483004;
}

.block-icon {
  box-shadow: 0px 0px 3px 2px theme('colors.green.500');
  transition: box-shadow 0.3s ease-in-out;
}

.block-change {
  box-shadow: 0px 0px 6px 4px theme('colors.green.500');
}
</style>
