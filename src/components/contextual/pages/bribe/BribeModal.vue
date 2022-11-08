<script lang="ts">
import { parseUnits } from '@ethersproject/units';
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch
} from 'vue';

import TxActionBtn from '@/components/btns/TxActionBtn/TxActionBtn.vue';
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import useTokenApproval from '@/composables/trade/useTokenApproval';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';
import useTransactions from '@/composables/useTransactions';
import { Bribe } from '@/constants/bribe';
import { TOKENS } from '@/constants/tokens';
import { bnum } from '@/lib/utils';
import { isPositive } from '@/lib/utils/validations';
import { bribeService } from '@/services/bribe/bribe.service';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';

export default defineComponent({
  components: { TokenInput, TxActionBtn },
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
    const { getProvider } = useWeb3();
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
    const passedDeadline = ref<boolean>(false);

    const bribeRef = computed(() => {
      return props.selectedBribe;
    });

    const tokenApproval = useTokenApproval(
      selectedRewardToken,
      rewardAmount,
      tokens
    );
    const isTokenApproved = computed(() => {
      if (configService.network.addresses.bribeVault == '') return false;
      return !approvalRequired(
        selectedRewardToken.value,
        rewardAmount.value,
        configService.network.addresses.bribeVault
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
      await tokenApproval.approveSpender(
        configService.network.addresses.bribeVault
      );
    }

    function callDepositBribe() {
      const isDepositingNativeAsset =
        selectedRewardToken.value === TOKENS.Addresses.nativeAsset;
      if (isDepositingNativeAsset) {
        return bribeService.depositBribe(
          getProvider(),
          parseUnits(
            rewardAmount.value,
            getToken(selectedRewardToken.value).decimals
          ),
          props.selectedBribe?.proposalId ?? ''
        );
      } else {
        return bribeService.depositBribeERC20(
          getProvider(),
          props.selectedBribe?.proposalId ?? '',
          selectedRewardToken.value,
          parseUnits(
            rewardAmount.value,
            getToken(selectedRewardToken.value).decimals
          )
        );
      }
    }

    async function init() {
      const blackListedTokens = Object.keys(tokens.value).filter(
        token => !props.bribeTokens.includes(token)
      );
      excludedTokens.value = blackListedTokens;
    }

    watch(bribeRef, () => {
      if (bribeRef.value)
        passedDeadline.value =
          Number(bribeRef.value?.deadline) * 1000 < Date.now();
    });

    onBeforeMount(() => {
      init();
    });

    return {
      rewardAmount,
      chosenBribe: props.selectedBribe,
      selectedRewardToken,
      excludedTokens,
      isValidAmount,
      tokenApproval,
      isTokenApproved,
      passedDeadline,
      inputRules,
      TOKENS,
      approveToken,
      callDepositBribe,
      getToken
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
        <TxActionBtn
          v-else
          :disabled="
            !isValidAmount ||
              selectedRewardToken == '' ||
              !chosenBribe ||
              passedDeadline
          "
          :label="'Add Bribe'"
          color="gradient"
          :summary="
            `Deposit ${rewardAmount} ${
              getToken(selectedRewardToken)?.symbol
            } as bribe`
          "
          :action="
            selectedRewardToken === TOKENS.Addresses.nativeAsset
              ? 'depositBribe'
              : 'depositBribeERC20'
          "
          :actionFn="callDepositBribe"
          :confirmingLabel="'Adding to Bribe'"
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
