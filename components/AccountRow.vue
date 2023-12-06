<template>
  <tr :class="{'bg-gray-100': isEven, 'hover:bg-blue-100': true}">
    <td class="p-3">{{ account.friendlyName }}</td>
    <td class="p-3">{{ account.accountAddress }}</td>
    <td class="p-3">
      <span v-if="account.isSlowWallet" class="text-green-500">✓</span>
      <span v-else class="text-red-500">×</span>
    </td>
    <td class="p-3">
      <span v-if="account.isValidator" class="text-green-500">✓</span>
      <span v-else class="text-red-500">×</span>
    </td>
    <td class="p-3">
      <span v-if="account.isInValidatorSet" class="text-green-500">✓</span>
      <span v-else class="text-red-500">×</span>
    </td>
    <td class="p-3">
      <span v-if="account.isCW" class="text-green-500">✓</span>
      <span v-else class="text-red-500">×</span>
    </td>
    <td class="p-3">{{ formatNumber(account.coinValue) }}</td>
    <td class="p-3">
      {{ formatNumber(account.unlockedValue) }}
      <span v-if="account.isCW" class="warning-icon">⚠️</span>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  account: Object,
  index: Number
});

const isEven = computed(() => props.index % 2 === 0);

const formatNumber = (value) => {
  if (value === 'N/A') {
    return value;
  }
  return (Number(value) / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 });
};
</script>
<style>
.icon-checkmark { /* Style for green checkmark */ }
.icon-cross { /* Style for red cross */ }
.warning-icon {
  color: rgb(149, 147, 35);
  margin-left: 8px;
}
</style>