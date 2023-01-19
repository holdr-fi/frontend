<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTradeState } from '@/composables/trade/useTradeState';
import useBreakpoints from '@/composables/useBreakpoints';
import { isMainnet } from '@/composables/useNetwork';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import { AnyPool } from '@/services/pool/types';
import { usePool } from '@/composables/usePool';
import useMyWalletTokens from '@/composables/useMyWalletTokens';
import useNativeBalance from '@/composables/useNativeBalance';

type Props = {
  excludedTokens?: string[];
  // If pool prop is provided, Tokens are grouped into:
  // 'Pool tokens in wallet' and 'Other tokens in wallet'
  pool?: AnyPool;
  includeNativeAsset?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  excludedTokens: () => [],
  pool: undefined,
  includeNativeAsset: false,
});

const { isWalletReady, toggleWalletSelectModal } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();
const { setTokenInAddress } = useTradeState();
const networkName = configService.network.name;
const { t } = useI18n();
const { isDeepPool, isPreMintedBptPool } = usePool(toRef(props, 'pool'));

const {
  tokensWithBalance,
  poolTokensWithBalance,
  poolTokensWithoutBalance,
  notPoolTokensWithBalance,
  isLoadingBalances
} = useMyWalletTokens(props);

const noNativeCurrencyMessage = computed(() => {
  return t('noNativeCurrency', [nativeCurrency, networkName]);
});

const noNativeCurrencyMessageEthereum = computed(() => {
  return t('noNativeCurrencyEthereum', [nativeCurrency, networkName]);
});

const noTokensMessage = computed(() => {
  return t('noTokensInWallet', [networkName]);
});

const { hasNativeBalance, nativeBalance, nativeCurrency } = useNativeBalance();

function handleAssetClick(tokenAddress) {
  setTokenInAddress(tokenAddress);
}
</script>

<template>
  <BalCard
    :square="upToLargeBreakpoint"
    noPad
    :noBorder="upToLargeBreakpoint"
    growContent
    :hFull="upToLargeBreakpoint"
    shadow="none"
  >
    <div class="flex flex-col w-full h-full bg-transparent">
      <div
        class="flex lg:justify-between p-3 pb-0 lg:pb-3 lg:border-b dark:border-gray-700"
      >
        <h6 v-if="!upToLargeBreakpoint">{{ $t('myWallet2') }}</h6>
        <div
          class="font-semibold lg:font-normal ml-1 lg:ml-0"
          v-if="!isLoadingBalances"
        >
          <div
            class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors mr-0.5"
            v-if="!hasNativeBalance"
          >
            {{ nativeBalance }} {{ nativeCurrency }}
            <BalTooltip
              v-if="isWalletReady"
              :text="
                isMainnet
                  ? noNativeCurrencyMessageEthereum
                  : noNativeCurrencyMessage
              "
              icon-size="sm"
              :icon-name="'alert-triangle'"
              :icon-class="
                'text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors'
              "
              width="72"
              class="relative top-0.5"
            />
          </div>
          <div v-else>{{ nativeBalance }} {{ nativeCurrency }}</div>
        </div>
        <BalLoadingBlock v-else class="h-8 w-12" />
      </div>
      <div class="my-wallet h-full p-3 z-0">
        <BalLoadingBlock v-if="isLoadingBalances" class="h-8" />
        <div v-else-if="isWalletReady">
          <template v-if="pool">
            <MyWalletSubheader
              v-if="isDeepPool"
              class="text-sm border-b text-secondary"
            >
              {{ t('myWalletCard.title.poolTokens') }}
            </MyWalletSubheader>
            <div class="mt-5">
              <BalAssetSet
                :balAssetProps="{ button: true }"
                :width="275"
                wrap
                :size="30"
                :addresses="[
                  ...poolTokensWithBalance,
                  ...poolTokensWithoutBalance
                ]"
                :disabledAddresses="poolTokensWithoutBalance"
                :maxAssetsPerLine="7"
                @click="handleAssetClick"
              />
            </div>
            <template
              v-if="
                isDeepPool &&
                  isPreMintedBptPool &&
                  notPoolTokensWithBalance.length
              "
            >
              <MyWalletSubheader
                class="my-5 text-sm border-t border-b text-secondary"
              >
                {{ t('myWalletCard.title.otherTokens') }}
              </MyWalletSubheader>
              <BalAssetSet
                :balAssetProps="{ button: true }"
                :width="275"
                wrap
                :size="30"
                :addresses="notPoolTokensWithBalance"
                :maxAssetsPerLine="7"
                @click="handleAssetClick"
              />
            </template>
          </template>
          <div v-else class="mt-3">
            <BalAssetSet
              @click="setTokenInAddress"
              :width="275"
              wrap
              :size="30"
              :addresses="tokensWithBalance"
              :maxAssetsPerLine="28"
            >
            </BalAssetSet>
          </div>
          <p
            class="text-sm text-gray-500 dark:text-gray-400 opacity-0 fade-in"
            v-if="tokensWithBalance.length === 0"
          >
            {{ noTokensMessage }}.
          </p>
        </div>
        <div v-else class="w-full mt-4 lg:mt-0 flex font-medium">
          <BalLink @click="toggleWalletSelectModal"
            >Connect your wallet</BalLink
          >
        </div>
      </div>
    </div>
  </BalCard>
</template>
