<script lang="ts" setup>
import { formatUnits } from '@ethersproject/units';
import axios from 'axios';
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import CustomPairPriceGraph from '@/components/contextual/pages/lbp/CustomPairPriceGraph.vue';
import SoloTradePair from '@/components/contextual/pages/lbp/SoloTradePair.vue';
import Col3Layout from '@/components/layouts/Col3Layout.vue';
import TradeSettingsPopover, {
  TradeSettingsContext
} from '@/components/popovers/TradeSettingsPopover.vue';
import { useTradeState } from '@/composables/trade/useTradeState';
import useTrading from '@/composables/trade/useTrading';
import useValidation, {
  TradeValidation
} from '@/composables/trade/useValidation';
import { isMumbai } from '@/composables/useNetwork';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import useUserSettings from '@/composables/useUserSettings';
import { ApiErrorCodes } from '@/services/gnosis/errors/OperatorError';

const store = useStore();
const { tokens } = useTokens();
const { fNum, fNum2 } = useNumbers();
const { slippage, setSlippage } = useUserSettings();
const { t } = useI18n();

const exactIn = ref(true);
const modalTradePreviewIsOpen = ref(false);
const dismissedErrors = ref({
  highPriceImpact: false
});

const {
  tokenInAddress,
  tokenOutAddress,
  tokenInAmount,
  tokenOutAmount,
  setTokenInAddress,
  setTokenOutAddress
} = useTradeState();

const trading = useTrading(
  exactIn,
  tokenInAddress,
  tokenInAmount,
  tokenOutAddress,
  tokenOutAmount
);

const { errorMessage } = useValidation(
  tokenInAddress,
  tokenInAmount,
  tokenOutAddress,
  tokenOutAmount
);

const saleEnd = ref<string>('-');

const previousInputAddress = ref<string>('');
const previousOutputAddress = ref<string>('');
const previousSlippage = ref<string>('');

const usdcAddress = ref<string>('');
const hldrAddress = ref<string>('');
const loading = ref<boolean>(true);
const showPriceGraphModal = ref(false);
const numTokens = ref(0);

const showLbp = ref(false);

const message = ref('');

const error = computed(() => {
  if (trading.isBalancerTrade.value) {
    if (errorMessage.value === TradeValidation.NO_LIQUIDITY) {
      return {
        header: t('insufficientLiquidity'),
        body: t('insufficientLiquidityDetailed')
      };
    }
  }

  if (trading.isGnosisTrade.value) {
    if (trading.gnosis.validationError.value != null) {
      const validationError = trading.gnosis.validationError.value;

      if (validationError === ApiErrorCodes.SellAmountDoesNotCoverFee) {
        return {
          header: t('gnosisErrors.lowAmount.header'),
          body: t('gnosisErrors.lowAmount.body')
        };
      } else if (validationError === ApiErrorCodes.PriceExceedsBalance) {
        return {
          header: t('gnosisErrors.lowBalance.header', [
            trading.tokenIn.value.symbol
          ]),
          body: t('gnosisErrors.lowBalance.body', [
            trading.tokenIn.value.symbol,
            fNum2(
              formatUnits(
                trading.getQuote().maximumInAmount,
                trading.tokenIn.value.decimals
              ),
              FNumFormats.token
            ),
            fNum2(trading.slippageBufferRate.value, FNumFormats.percent)
          ])
        };
      } else if (validationError === ApiErrorCodes.NoLiquidity) {
        return {
          header: t('gnosisErrors.noLiquidity.header', [
            trading.tokenIn.value.symbol
          ]),
          body: t('gnosisErrors.noLiquidity.body')
        };
      } else {
        return {
          header: t('gnosisErrors.genericError.header'),
          body: trading.gnosis.validationError.value
        };
      }
    }
  } else if (trading.isBalancerTrade.value) {
    if (isHighPriceImpact.value) {
      return {
        header: t('highPriceImpact'),
        body: t('highPriceImpactDetailed'),
        label: t('accept')
      };
    }
  }

  return undefined;
});

const warning = computed(() => {
  if (trading.isGnosisTrade.value) {
    if (trading.gnosis.warnings.value.highFees) {
      return {
        header: t('gnosisWarnings.highFees.header'),
        body: t('gnosisWarnings.highFees.body')
      };
    }
  }

  return undefined;
});

const isHighPriceImpact = computed(
  () =>
    trading.sor.validationErrors.value.highPriceImpact &&
    !dismissedErrors.value.highPriceImpact
);

const tradeDisabled = computed(() => {
  const hasValidationError = errorMessage.value !== TradeValidation.VALID;
  const hasGnosisErrors =
    trading.isGnosisTrade.value && trading.gnosis.hasValidationError.value;
  const hasBalancerErrors =
    trading.isBalancerTrade.value && isHighPriceImpact.value;

  return hasValidationError || hasGnosisErrors || hasBalancerErrors;
});

const historicalPriceData = ref<[string, number, number][]>([]);
const projectedPriceData = ref<[string, number, number][]>([]);

const isProjection = ref(false);

function calculateEnd(timestamp: number) {
  const diff = Math.max(timestamp * 1000 - Date.now(), 0);
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
  const url = `https://api.holdr.fi/lbp`;
  const [
    _timestampData,
    _priceData,
    _projectedPrices,
    _tokens
  ] = await Promise.all([
    axios.get(`${url}/time`),
    axios.get(`${url}/priceHistory`),
    axios.get(`${url}/priceProjection`),
    axios.get(`${url}/tokensRemaining`)
  ]);
  historicalPriceData.value = _priceData.data;
  projectedPriceData.value = _projectedPrices.data;
  numTokens.value = _tokens.data;
  const timestamp = _timestampData.data;
  const usdc = Object.values(tokens.value).find(p => p.symbol === 'USDC');
  const HLDR = Object.values(tokens.value).find(p => p.symbol === 'HLDR');
  if (HLDR) hldrAddress.value = HLDR.address;
  if (usdc) usdcAddress.value = usdc.address;
  previousSlippage.value = slippage.value;
  previousInputAddress.value = tokenInAddress.value;
  previousOutputAddress.value = tokenOutAddress.value;
  setSlippage('0.05');
  setTokenInAddress(usdcAddress.value);
  setTokenOutAddress(hldrAddress.value);
  loading.value = false;
  setInterval(() => {
    calculateEnd(timestamp);
  }, 1000);
}

onBeforeMount(() => {
  const startlbp = 1671024600000;
  const endlbp = 1671199200000;
  init();
  setInterval(() => {
    const newNow = Date.now();
    if (startlbp > newNow) {
      showLbp.value = false;
      message.value = 'Coming Soon';
    } else if (endlbp < newNow) {
      showLbp.value = false;
      message.value = 'LBP has Ended';
    } else {
      showLbp.value = true;
    }
  }, 1000);
});

function trade() {
  trading.trade(() => {
    trading.resetAmounts();
    modalTradePreviewIsOpen.value = false;
  });
}

function handlePreviewButton() {
  trading.resetSubmissionError();

  modalTradePreviewIsOpen.value = true;
}

function handlePreviewModalClose() {
  trading.resetSubmissionError();

  modalTradePreviewIsOpen.value = false;
}

function handleErrorButtonClick() {
  if (trading.sor.validationErrors.value.highPriceImpact) {
    dismissedErrors.value.highPriceImpact = true;
  }
}

function onPriceGraphModalClose() {
  showPriceGraphModal.value = false;
}

function togglePairPriceGraphModal(showProjectionVerion: boolean) {
  if (showProjectionVerion) isProjection.value = true;
  else isProjection.value = false;
  showPriceGraphModal.value = !showPriceGraphModal.value;
}

watch(tokenInAddress, () => {
  store.commit('trade/setInputAsset', tokenInAddress.value);
});

watch(tokenOutAddress, () => {
  store.commit('trade/setOutputAsset', tokenOutAddress.value);
});

onBeforeUnmount(() => {
  setSlippage(
    previousSlippage.value == '0.05' ? '0.01' : previousSlippage.value
  );
  if (!previousInputAddress.value || !previousOutputAddress.value) return;
  store.commit('trade/setInputAsset', previousInputAddress.value);
  store.commit('trade/setOutputAsset', previousOutputAddress.value);
  setTokenInAddress(previousInputAddress.value);
  setTokenOutAddress(previousOutputAddress.value);
});
</script>

<template>
  <div class="w-full app-hero h-56 flex-col gap-3">
    <h1 class="headline">
      HLDR Liquidity Bootstrapping Pool
    </h1>
  </div>
  <div v-if="showLbp" class="hero-content justify-center">
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
        <BalCard class="mt-4">
          <p class="text-sm text-gray-500 inline mr-1 text-center">
            Current Price:
          </p>
          <BalLoadingBlock v-if="historicalPriceData.length == 0" />
          <p v-else class="text-lg font-semibold tabular-nums text-center">
            <span>
              {{
                fNum(
                  historicalPriceData[historicalPriceData.length - 1][1],
                  'usd'
                )
              }}
            </span>
          </p>
        </BalCard>
        <BalCard class="mt-4">
          <p class="text-sm text-gray-500 inline mr-1 text-center">
            Tokens Remaining:
          </p>
          <p class="text-lg font-semibold tabular-nums text-center">
            <span> {{ fNum(numTokens, 'token') }} </span>
          </p>
          <BalProgressBar
            :width="(numTokens / 1200000) * 100"
            :buffer-width="0"
            :color="'green'"
            class="mt-2"
          />
        </BalCard>
      </template>

      <BalCard class="relative" no-border>
        <template v-slot:header>
          <div class="w-full flex items-center justify-between">
            <h4 class="font-bold">Buy HLDR</h4>
            <TradeSettingsPopover
              :context="TradeSettingsContext.trade"
              :isGasless="trading.tradeGasless.value"
            />
          </div>
        </template>
        <div class="mb-2">
          <SoloTradePair
            v-if="hldrAddress && usdcAddress"
            v-model:tokenInAmount="tokenInAmount"
            v-model:tokenInAddress="tokenInAddress"
            v-model:tokenOutAmount="tokenOutAmount"
            v-model:tokenOutAddress="tokenOutAddress"
            v-model:exactIn="exactIn"
            :tradeLoading="
              trading.isBalancerTrade.value ? trading.isLoading.value : false
            "
            :effectivePriceMessage="trading.effectivePriceMessage"
            @amountChange="trading.handleAmountChange"
            class="mb-4"
          />
          <BalLoadingBlock v-else />
          <BalAlert
            v-if="error"
            class="p-3 mb-4"
            type="error"
            size="sm"
            :title="error.header"
            :description="error.body"
            :action-label="error.label"
            block
            @actionClick="handleErrorButtonClick"
          />
          <BalAlert
            v-else-if="warning"
            class="p-3 mb-4"
            type="warning"
            size="sm"
            :title="warning.header"
            :description="warning.body"
            block
          />
          <BalBtn
            v-if="trading.isLoading.value"
            loading
            disabled
            :loading-label="
              trading.isGnosisTrade.value
                ? $t('loadingBestPrice')
                : $t('loading')
            "
            block
          />
          <BalBtn
            v-else
            :label="$t('preview')"
            :disabled="tradeDisabled || !(hldrAddress && usdcAddress)"
            color="gradient"
            block
            @click.prevent="handlePreviewButton"
          />
        </div>
        <BalStack class="flex flex-col justify-center gap-4">
          <BalLink
            external
            noStyle
            class="mx-auto"
            href="https://mirror.xyz/0xEF013a60f765f34b0FD7C5aAf83b9C65BB10A9af/8T4t5eAnNWrSaQFsVXNfp8h1_TgO88OHkX9d8ve_2zU"
          >
            More Information
            <BalIcon
              name="arrow-up-right"
              size="sm"
              class="ml-px group-hover:text-pink-500 transition-colors"
            />
          </BalLink>
        </BalStack>
      </BalCard>

      <template #gutterRight>
        <BalLoadingBlock v-if="!usdcAddress || !hldrAddress" :class="'h-64'" />
        <BalStack vertical v-else>
          <CustomPairPriceGraph
            :priceData="historicalPriceData"
            :tokenInAddress="usdcAddress"
            :tokenOutAddress="hldrAddress"
            :toggleModal="() => togglePairPriceGraphModal(false)"
          />
          <CustomPairPriceGraph
            :projection="true"
            :priceData="projectedPriceData"
            :tokenInAddress="usdcAddress"
            :tokenOutAddress="hldrAddress"
            :toggleModal="() => togglePairPriceGraphModal(true)"
          />
        </BalStack>
      </template>
    </Col3Layout>
  </div>
  <div v-else class="lg:container lg:mx-auto pt-10 md:pt-12">
    <BalCard square class="p-8">
      <div v-if="message.length > 0" class="text-center">
        <span class="text-3xl">{{ message }}</span>
      </div>
      <BalLoadingBlock v-else />
    </BalCard>
  </div>

  <!-- <teleport to="#modal">
    <CustomTradePreviewModalGP
      v-if="modalTradePreviewIsOpen"
      :trading="trading"
      @trade="trade"
      @close="handlePreviewModalClose"
    />
  </teleport> -->

  <teleport to="#modal">
    <BalModal :show="showPriceGraphModal" @close="onPriceGraphModalClose">
      <div class="graph-modal">
        <CustomPairPriceGraph
          :projection="isProjection"
          :priceData="isProjection ? projectedPriceData : historicalPriceData"
          :tokenInAddress="usdcAddress"
          :tokenOutAddress="hldrAddress"
          :toggleModal="() => togglePairPriceGraphModal(true)"
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
