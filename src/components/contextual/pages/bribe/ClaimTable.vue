<script setup lang="ts">
import { formatUnits } from '@ethersproject/units';
import { computed, ref, watch } from 'vue';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useTokens from '@/composables/useTokens';
import { Bribe, Claim } from '@/constants/bribe';
import { bribeService } from '@/services/bribe/bribe.service';
import useWeb3 from '@/services/web3/useWeb3';

const emit = defineEmits<{
  (e: 'clickedClaim'): void;
}>();

const data = ref<Bribe[]>([]);

const { upToLargeBreakpoint } = useBreakpoints();
const { account, isWalletReady, getProvider } = useWeb3();

const columns = computed<ColumnDefinition<{ name: string; amount: string }>[]>(
  () => [
    {
      name: 'Token',
      id: 'tokenName',
      accessor: 'tokenName',
      Cell: 'tokenNameCell',
      align: 'center',
      width: 250
    },
    {
      name: 'Amount',
      Cell: 'humanAmountCell',
      id: 'humanAmount',
      accessor: 'humanAmount',
      align: 'center',
      width: 150
    },
    {
      name: '',
      Cell: 'claimCell',
      accessor: 'claim',
      align: 'center',
      id: 'claim',
      width: 150,
      hidden: !isWalletReady.value
    }
  ]
);

const { getToken } = useTokens();
const claims = ref<Claim[]>([]);
const readableClaims = ref<{ name: string; amount: string }[]>([]);

function callClaim() {
  emit('clickedClaim');
  return bribeService.claim(getProvider(), []);
}

async function getClaims() {
  if (account.value) {
    const data = await bribeService.claims(account.value);
    console.log(data.data);
    claims.value = data.data;
  }
}

watch(account, () => {
  getClaims();
});

watch(claims, () => {
  console.log(claims.value);
  let res: { name: string; amount: string }[] = [];
  for (let i = 0; i < claims.value.length; i++) {
    const claim = claims.value[i];
    const token = getToken(claim.token);
    res.push({
      name: token.name,
      amount: formatUnits(claim.amount, token.decimals)
    });
  }
  readableClaims.value = res;
});
</script>

<template>
  <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :key="data"
      :columns="columns"
      :data="data"
      skeleton-class="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :initial-state="{
        sortColumn: 'totalRewards',
        sortDirection: 'desc'
      }"
    >
      <template v-slot:tokenNameCell="claim">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="claim.name"
        >
          <span>{{ claim.name }}</span>
        </div>
      </template>
      <template v-slot:humanAmountCell="claim">
        <div
          class="px-6 py-4 -mt-1 flex items-center font-numeric"
          :key="claim.name"
        >
          <span>{{ claim.humanAmount }}</span>
        </div>
      </template>
      <template>
        <div v-if="isWalletReady" class="px-2 py-4 flex justify-center">
          <BalBtn
            color="blue"
            :outline="true"
            size="sm"
            class="hover:text-white hover:bg-blue-500 focus:text-white"
            flat
            block
            @click.prevent="callClaim"
          >
            Claim
          </BalBtn>
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
