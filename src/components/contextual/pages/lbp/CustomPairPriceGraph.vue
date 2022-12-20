<script setup lang="ts">
import { maxBy, minBy } from 'lodash';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { useTradeState } from '@/composables/trade/useTradeState';
import useBreakpoints from '@/composables/useBreakpoints';
import useTailwind from '@/composables/useTailwind';
import useTokens from '@/composables/useTokens';
import useWeb3 from '@/services/web3/useWeb3';

import CustomLineChart from './CustomLineChart.vue';

const chartTimespans = [
  {
    option: '1d',
    value: 1
  },
  {
    option: '1w',
    value: 7
  },
  {
    option: '1m',
    value: 30
  },
  {
    option: '1y',
    value: 365
  },
  {
    option: 'All',
    value: 4000
  }
];

type Props = {
  projection?: boolean;
  tokenInAddress: string;
  tokenOutAddress: string;
  priceData?: [string, number, number][];
  isLoadingPriceData?: boolean;
  failedToLoadPriceData?: boolean;
  isModal?: boolean;
  onCloseModal?: () => void;
  toggleModal: () => void;
};

const props = defineProps<Props>();
const { upToLargeBreakpoint } = useBreakpoints();
const store = useStore();
const { getToken } = useTokens();
// const { tokenInAddress, tokenOutAddress } = useTradeState();
const tailwind = useTailwind();

const chartHeight = ref(
  upToLargeBreakpoint ? (props.isModal ? 250 : 75) : props.isModal ? 250 : 100
);
const activeTimespan = ref(chartTimespans[1]);
const appLoading = computed(() => store.state.app.loading);

const inputSym = computed(() => {
  if (props.tokenInAddress === '') return 'Unknown';
  return getToken(props.tokenInAddress)?.symbol;
});
const outputSym = computed(() => {
  if (props.tokenOutAddress === '') return 'Unknown';
  return getToken(props.tokenOutAddress)?.symbol;
});

const dataMin = computed(() => {
  return (minBy(props.priceData || [], v => v[1]) || [])[1] || 0;
});

const dataMax = computed(() => {
  return (maxBy(props.priceData || [], v => v[1]) || [])[1] || 0;
});

const toggle = () => {
  props.toggleModal();
};

const chartData = computed(() => {
  return [
    {
      name: `${outputSym.value}/${inputSym.value}`,
      values: props.priceData || []
    }
  ];
});

const isNegativeTrend = computed(() => {
  const _priceData = props.priceData || [];
  if (_priceData.length > 2) {
    if (
      _priceData[_priceData.length - 1][1] <
      _priceData[_priceData.length - 2][1]
    ) {
      return true;
    }
  }
  return false;
});

const chartColors = computed(() => {
  if (props.projection) return [tailwind.theme.colors.blue['100']];
  let color = tailwind.theme.colors.green['400'];
  if (isNegativeTrend.value) color = tailwind.theme.colors.red['400'];
  return [color];
});

const chartGrid = computed(() => {
  return {
    left: '2.5%',
    right: '0',
    top: '10%',
    bottom: '15%',
    containLabel: false
  };
});
</script>

<template>
  <div
    :class="[
      '',
      {
        'h-40 lg:h-56': !isModal,
        'h-full lg:h-full': isModal
      }
    ]"
  >
    <BalLoadingBlock
      v-if="isLoadingPriceData"
      :class="{
        'h-64': !isModal,
        'h-112': isModal
      }"
    />
    <BalCard
      :square="upToLargeBreakpoint"
      shadow="none"
      hFull
      growContent
      noPad
      :noBorder="upToLargeBreakpoint || isModal"
      v-else
    >
      <div class="relative h-full bg-transparent p-4">
        <button
          v-if="!failedToLoadPriceData && !(isLoadingPriceData || appLoading)"
          @click="toggle"
          class="maximise m-4 p-2 flex justify-center items-center shadow-lg rounded-full"
        >
          <BalIcon v-if="!isModal" name="maximize-2" class="text-gray-500" />
          <BalIcon v-if="isModal" name="x" class="text-gray-500" />
        </button>
        <div
          v-if="!failedToLoadPriceData && !(isLoadingPriceData || appLoading)"
          class="flex"
        >
          <h6 class="font-medium">
            {{ outputSym }}/{{ inputSym }} ({{
              projection ? 'Projected' : 'Historical'
            }}
            Price)
          </h6>
        </div>
        <div
          v-if="failedToLoadPriceData && tokenOutAddress"
          class="h-full w-full flex justify-center items-center"
        >
          <span class="text-sm text-gray-400">{{
            $t('insufficientData')
          }}</span>
        </div>
        <div
          v-if="failedToLoadPriceData && !tokenOutAddress"
          class="h-full w-full flex justify-center items-center"
        >
          <span class="text-sm text-gray-400 text-center">{{
            $t('chooseAPair')
          }}</span>
        </div>
        <div
          v-if="!failedToLoadPriceData && !isLoadingPriceData"
          class="flex-col"
        >
          <CustomLineChart
            :projection="projection"
            :data="chartData"
            :height="chartHeight"
            :show-legend="false"
            :color="chartColors"
            :custom-grid="chartGrid"
            :axis-label-formatter="({ yAxis: '0.000000' } as any)"
            :wrapper-class="
              `flex flex-row lg:flex-col ${isModal ? 'flex-col' : 'flex-row'}`
            "
            :show-tooltip="!upToLargeBreakpoint || isModal"
            hide-y-axis
            hide-x-axis
            show-header
            use-min-max
          />
          <div
            :class="[
              'w-full flex justify-between mt-6',
              {
                'flex-col': isModal
              }
            ]"
            v-if="isModal"
          >
            <!-- <div>
              <button
                v-for="timespan in chartTimespans"
                @click="activeTimespan = timespan"
                :key="timespan.value"
                :class="[
                  'py-1 px-2 text-sm rounded-lg mr-2',
                  {
                    'text-white': activeTimespan.value === timespan.value,
                    'text-gray-500': activeTimespan.value !== timespan.value,
                    'bg-green-400':
                      !isNegativeTrend &&
                      activeTimespan.value === timespan.value,
                    'bg-red-400':
                      isNegativeTrend &&
                      activeTimespan.value === timespan.value,
                    'hover:bg-red-200': isNegativeTrend,
                    'hover:bg-green-200': !isNegativeTrend
                  }
                ]"
              >
                {{ timespan.option }}
              </button>
            </div> -->
            <div :class="{ 'mt-4': isModal }">
              <span class="text-sm text-gray-500 mr-4"
                >Low: {{ dataMin.toPrecision(6) }}</span
              >
              <span class="text-sm text-gray-500"
                >High: {{ dataMax.toPrecision(6) }}</span
              >
            </div>
          </div>
          <!-- <div class="-mt-2 lg:mt-2" v-else>
            <span class="text-sm text-gray-500 w-full flex justify-end">{{
              activeTimespan.option
            }}</span>
          </div> -->
        </div>
      </div>
    </BalCard>
  </div>
</template>

<style scoped>
.maximise {
  @apply absolute;
  right: 0;
  top: 0;
}
</style>
