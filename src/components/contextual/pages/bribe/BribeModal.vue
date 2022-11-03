<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref
} from 'vue';

import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import useTokenApproval from '@/composables/trade/useTokenApproval';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';
import useTransactions from '@/composables/useTransactions';
import { Bribe } from '@/constants/bribe';
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
    }
  },
  setup(props, { emit }) {
    const { addTransaction } = useTransactions();
    const { txListener, getTxConfirmedAt } = useEthers();
    const { tokens, balances, getToken, approvalRequired } = useTokens();

    const rewardAmount = ref<string>('');
    const selectedRewardToken = ref<string>('');
    const excludedTokens = ref<string[]>([]);
    const isValidAmount = ref<boolean>(true);
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
    const inputRules = [v => !v || isPositive()];

    async function approveToken(): Promise<void> {
      await tokenApproval.approveSpender(configService.network.addresses.bribe);
    }
    function handleValidity(isValid: boolean) {
      isValidAmount.value = isValid;
    }
    async function getWhitelistedTokens() {
      const whiteListedTokens = await bribeService.getWhitelistedTokens();
      const blackListedTokens = Object.keys(tokens.value).filter(
        token => !whiteListedTokens.includes(token)
      );
      excludedTokens.value = blackListedTokens;
    }
    onBeforeMount(() => {
      getWhitelistedTokens();
    });

    return {
      rewardAmount,
      selectedRewardToken,
      excludedTokens,
      isValidAmount,
      tokenApproval,
      isTokenApproved,
      approveToken,
      handleValidity,
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
          @update:isValid="handleValidity($event)"
          :excludedTokens="excludedTokens"
          name="rewardAmount"
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
