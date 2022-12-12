<script lang="ts">
import BigNumber from 'bignumber.js';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { VueQueryDevTools } from 'vue-query/devtools';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Notifications from '@/components/notifications/Notifications.vue';
import WalletSelectModal from '@/components/web3/WalletSelectModal.vue';
import useWeb3Watchers from '@/composables/watchers/useWeb3Watchers';
import { DEFAULT_TOKEN_DECIMALS } from '@/constants/tokens';
import * as Layouts from '@/pages/_layouts';
import useWeb3 from '@/services/web3/useWeb3';

import GlobalModalContainer from './components/modals/GlobalModalContainer.vue';
import AppSidebar from './components/navs/AppNav/AppSidebar/AppSidebar.vue';
import useBackgroundColor from './composables/useBackgroundColor';
import useGnosisSafeApp from './composables/useGnosisSafeApp';
import useNavigationGuards from './composables/useNavigationGuards';
import { useSidebar } from './composables/useSidebar';
import useExploitWatcher from './composables/watchers/useExploitWatcher';
import useGlobalQueryWatchers from './composables/watchers/useGlobalQueryWatchers';
import usePoolCreationWatcher from './composables/watchers/usePoolCreationWatcher';

BigNumber.config({ DECIMAL_PLACES: DEFAULT_TOKEN_DECIMALS });

export default defineComponent({
  components: {
    ...Layouts,
    VueQueryDevTools,
    WalletSelectModal,
    Notifications,
    AppSidebar,
    GlobalModalContainer
  },

  setup() {
    /**
     * STATE
     */
    const layout = ref('DefaultLayout'); // an instance property used to indicate a reference to HTML elements in the template

    /**
     * COMPOSABLES
     */
    useWeb3Watchers();
    usePoolCreationWatcher();
    useGlobalQueryWatchers();
    useGnosisSafeApp();
    useExploitWatcher();
    useNavigationGuards();
    const {
      isWalletSelectVisible,
      toggleWalletSelectModal
      // isMainnet
    } = useWeb3();
    const route = useRoute();
    const store = useStore();
    const { newRouteHandler: updateBgColorFor } = useBackgroundColor();
    const { sidebarOpen } = useSidebar();

    const showTopBanner = ref(true);

    // ADD FEATURE ALERT HERE
    // const featureAlert: Alert = {
    //   id: 'vebal-gap',
    //   priority: AlertPriority.LOW,
    //   label: t('alerts.vebalL2'),
    //   type: AlertType.FEATURE,
    //   rememberClose: false,
    //   actionOnClick: false
    // };
    // addAlert(featureAlert);

    /**
     * CALLBACKS
     */
    onBeforeMount(async () => {
      store.dispatch('app/init');
    });

    /**
     * WATCHERS
     */
    watch(route, newRoute => {
      updateBgColorFor(newRoute);
      if (newRoute.meta.layout) {
        layout.value = newRoute.meta.layout as string;
      } else {
        layout.value = 'DefaultLayout';
      }
    });

    return {
      // state
      layout,
      // computed
      isWalletSelectVisible,
      sidebarOpen,
      showTopBanner,
      // methods
      toggleWalletSelectModal
    };
  }
});
</script>

<template>
  <!--
    teleport target for modals throughout the app
    -->
  <div id="modal" />
  <div id="app">
    <div class="top-banner" v-if="showTopBanner">
      <div>
        Developed for the Balancer Friendly Fork Proposal
        <BalLink
          class="link-blue"
          external
          href="https://forum.balancer.fi/t/holdr-friendly-fork-proposal/3983"
          >(Learn more)</BalLink
        >
      </div>
      <BalBtn size="xs" @click="showTopBanner = false">X</BalBtn>
    </div>
    <component :is="layout" />
    <VueQueryDevTools />
    <WalletSelectModal
      :isVisible="isWalletSelectVisible"
      @close="toggleWalletSelectModal"
    />
    <Notifications />
    <!--
    Sidebar only available on mobile
    -->
    <AppSidebar v-if="sidebarOpen" />
  </div>
  <!--
    a container for the redirect modal, reason for design is unknown
    -->
  <GlobalModalContainer />
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

#intercom-activator {
  z-index: 2147483004;
}

.top-banner {
  @apply bg-gray-100 text-gray-600 text-sm text-center py-2 gap-2 flex justify-center;
}
</style>
