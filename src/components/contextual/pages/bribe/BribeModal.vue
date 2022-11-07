<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch
} from 'vue';

import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import useTokenApproval from '@/composables/trade/useTokenApproval';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';
import useTransactions from '@/composables/useTransactions';
import { Bribe } from '@/constants/bribe';
import { bnum } from '@/lib/utils';
import { isPositive } from '@/lib/utils/validations';
import { bribeService } from '@/services/bribe/bribe.service';
import { configService } from '@/services/config/config.service';

//SOLACE_TODO: flesh out the bribe modal's logic

export default defineComponent({
  components: { TokenInput },
  emits: ['close', 'success', 'selectRewardToken'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    selectedBribe: {
      type: Object as PropType<Bribe>,
      default: undefined
    },
    bribeTokens: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const { addTransaction } = useTransactions();
    const { txListener, getTxConfirmedAt } = useEthers();
    const {
      tokens,
      balances,
      getToken,
      approvalRequired,
      balanceFor
    } = useTokens();

    const rewardAmount = ref<string>('');
    const selectedRewardToken = ref<string>('');
    const excludedTokens = ref<string[]>([]);
    // const isValidAmount = ref<boolean>(true);
    const tokenApproval = useTokenApproval(
      selectedRewardToken,
      rewardAmount,
      tokens
    );
    const isTokenApproved = computed(() => {
      if (configService.network.addresses.bribe == '') return false;
      return !approvalRequired(
        selectedRewardToken.value,
        rewardAmount.value,
        configService.network.addresses.bribe
      );
    });

    const isValidAmount = computed(() => {
      const _isValidAmount =
        bnum(rewardAmount.value).gt(bnum(0)) &&
        bnum(rewardAmount.value).isLessThanOrEqualTo(
          balanceFor(selectedRewardToken.value)
        );
      return rewardAmount.value !== '' && isTokenApproved && _isValidAmount;
    });
    const inputRules = [v => !v || isPositive()];

    async function approveToken(): Promise<void> {
      await tokenApproval.approveSpender(configService.network.addresses.bribe);
    }

    async function init() {
      const blackListedTokens = Object.keys(tokens.value).filter(
        token => !props.bribeTokens.includes(token)
      );
      excludedTokens.value = blackListedTokens;
    }

    onBeforeMount(() => {
      init();
    });

    return {
      rewardAmount,
      selectedRewardToken,
      excludedTokens,
      isValidAmount,
      tokenApproval,
      isTokenApproved,
      approveToken,
      inputRules
    };
  }
});
</script>

<template>
  <BalModal @close="$emit('close')" show>
    <BalStack vertical class="stack-min-height">
      <h3>Adding Bribe</h3>
      <BalStack vertical>
        <TokenInput
          v-model:amount="rewardAmount"
          v-model:address="selectedRewardToken"
          :excludedTokens="excludedTokens"
          name="rewardAmount"
          :rules="inputRules"
          :disabled="selectedRewardToken == ''"
        />
        <BalBtn
          v-if="!isTokenApproved"
          :label="'Approve'"
          block
          @click.prevent="approveToken"
        />
        <BalBtn
          v-else
          :disabled="!isValidAmount || selectedRewardToken == ''"
          :label="'Add Bribe'"
          color="gradient"
          block
        />
      </BalStack>
    </BalStack>
  </BalModal>
</template>

<style scoped>
.token-select-input {
  @apply shadow rounded-lg flex items-center h-10 px-2 whitespace-nowrap;
  @apply text-sm;
  font-variation-settings: 'wght' 700;
}

.selectable {
  @apply cursor-pointer hover:shadow-none transition-shadow;
}

.selected {
  @apply bg-gray-50 dark:bg-gray-700 text-black dark:text-white;
}

.stack-min-height {
  min-height: 500px;
}
</style>
