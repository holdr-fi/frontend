<script setup lang="ts">
import { ComponentState } from 'react';
import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';

type Props = {
  open: boolean;
  rewardTokens: string[];
};

const props = withDefaults(defineProps<Props>(), {
  open: false,
  rewardTokens: () => []
});

const emit = defineEmits<{
  (e: 'select', value: string): void;
  (e: 'close'): void;
}>();

const openRewardTokens = ref(false);
const selectedRewardToken = ref('');
const query = ref('');

function handleSelectRewardToken(token: string) {
  selectedRewardToken.value = token;
  emit('select', token);
}
</script>

<template>
  <BalModal @close="$emit('close')" show>
    <BalStack vertical class="stack-min-height">
      <h3>Adding Bribe</h3>
      <h4>Select a reward token</h4>
      <BalDropdown
        :options="rewardTokens"
        minWidth="44"
        @selected="handleSelectRewardToken"
      >
        <template #activator>
          <div class="token-select-input selected group selectable">
            <span class="text-base font-medium">
              <span>{{ selectedRewardToken }}</span>
            </span>
            <BalIcon
              name="chevron-down"
              size="sm"
              class="text-blue-500 group-hover:text-pink-500 ml-2"
            />
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex items-center justify-between">
            {{ option }}
          </div>
        </template>
      </BalDropdown>
      <BalStack v-if="selectedRewardToken != ''">
        <h4>Select a reward amount</h4>
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
