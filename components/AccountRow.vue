<template>
  <tr :class="{ 'bg-gray-100': isEven, 'hover:bg-blue-100': true }">
    <td class="p-3">{{ account.friendlyName }}</td>
    <td class="p-3 custom-td">
      <a :href="`https://0l.fyi/accounts/${account.accountAddress}/resources`" target="_blank">{{ account.accountAddress
      }}
        <i class="fas fa-external-link-alt"></i>
      </a>
    </td>
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
<style scoped>
.icon-checkmark {
  /* Style for green checkmark */
}

.icon-cross {
  /* Style for red cross */
}

.warning-icon {
  color: rgb(149, 147, 35);
  margin-left: 8px;
}

.custom-td {
  cursor: pointer;
  color: #004499;
  /* Font color */
  transition: background-color 0.3s;
  /* Smooth background color transition on hover */
}

.custom-td:hover {
  /* background-color: #e8e8e8; */
  /* Slightly darker grey on hover */
}

text.custom-td a {
  /* ... existing link styles ... */
  display: inline-flex;
  /* Aligns text and icon */
  align-items: center;
  /* Centers icon with text */
}

.custom-td i {
  margin-left: 10px;
  /* Space between text and icon */
  font-size: 0.8em;
  /* Adjust icon size */
}

.custom-td a:hover {
  text-decoration: underline;
  /* Underline link on hover */
  color: #004499;
  /* Darker link color on hover */
}
</style>