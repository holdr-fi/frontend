<script setup lang="ts">
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { computed, onBeforeMount, reactive, ref } from 'vue';

import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import useTokenApproval from '@/composables/trade/useTokenApproval';
import useEthers from '@/composables/useEthers';
import { dateTimeLabelFor } from '@/composables/useTime';
import useTokens from '@/composables/useTokens';
import useTransactions from '@/composables/useTransactions';
import { Bribe } from '@/constants/bribe';
import { isPositive } from '@/lib/utils/validations';
import { bribeService } from '@/services/bribe/bribe.service';
import useWeb3 from '@/services/web3/useWeb3';
import { TransactionActionState } from '@/types/transactions';
import { configService } from '@/services/config/config.service';

//SOLACE_TODO: flesh out the bribe modal's logic

type Props = {
  open: boolean;
  selectedBribe: Bribe | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  open: false,
  selectedBribe: undefined
});

const { addTransaction } = useTransactions();
const { txListener, getTxConfirmedAt } = useEthers();
const { tokens, balances, getToken, approvalRequired } = useTokens();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
  (e: 'selectRewardToken'): void;
}>();

const txState = reactive<TransactionActionState>({
  init: false,
  confirming: false,
  confirmed: false,
  confirmedAt: ''
});

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
  if (tokenApproval.approved.value) {
    return true;
  }

  return !approvalRequired(
    selectedRewardToken.value,
    rewardAmount.value,
    configService.network.addresses.bribe
  );
});

const { account, appNetworkConfig } = useWeb3();
const inputRules = [v => !v || isPositive()];

const transactionInProgress = computed(
  (): boolean => txState.init || txState.confirming
);

async function handleTransaction(tx) {
  addTransaction({
    id: tx.hash,
    type: 'tx',
    action: 'voteForGauge',
    summary: 'Adding to bribe',
    details: {
      rewardAmount: rewardAmount.value
    }
  });

  txListener(tx, {
    onTxConfirmed: async (receipt: TransactionReceipt) => {
      txState.receipt = receipt;

      const confirmedAt = await getTxConfirmedAt(receipt);
      txState.confirmedAt = dateTimeLabelFor(confirmedAt);
      txState.confirmed = true;
      txState.confirming = false;
      emit('success');
    },
    onTxFailed: () => {
      console.error('Vote failed');
      txState.error = {
        title: 'Vote Failed',
        description: 'Vote failed for an unknown reason'
      };
      txState.confirming = false;
    }
  });
}

function handleValidity(isValid: boolean) {
  isValidAmount.value = isValid;
}

async function getWhitelistedTokens() {
  const whiteListedTokens = await bribeService.getWhitelistedTokens();
  console.log('whiteListedTokens', whiteListedTokens);
  const blackListedTokens = Object.keys(tokens.value).filter(
    token => !whiteListedTokens.includes(token)
  );
  excludedTokens.value = blackListedTokens;
}

onBeforeMount(() => {
  getWhitelistedTokens();
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
        <BalBtn v-if="isTokenApproved" :label="'Approve'" block />
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
