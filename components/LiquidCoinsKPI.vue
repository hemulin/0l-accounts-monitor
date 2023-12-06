<template>
  <div class="card card-bordered bg-base-100 shadow">
    <div class="card-body flex flex-col items-center justify-center p-2">
      <h2 class="card-title text-lg">Liquid Balance</h2>
      <p class="text-xl font-bold text-success">Ƚ{{ liquidCoinsSum }}</p>
    </div>
    <div class="divider m-0 p-0"></div>
    <div class="card-body flex flex-col items-center justify-center p-2">
      <h2 class="card-title text-lg">Daily Unlock</h2>
      <p class="text-xl font-bold text-success">Ƚ{{ dailyUnlock }}</p>
    </div>
    <div class="divider m-0 p-0"></div>
    <div class="card-body flex flex-col items-center justify-center p-2">
      <h2 class="card-title text-lg">Total Balance</h2>
      <p class="text-xl font-bold text-success">Ƚ{{ totalCoinsSum }}</p>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed } from 'vue';
import type { Account } from '~/types';

const props = defineProps({
  accountsData: Array as PropType<Account[]>
});

const liquidCoinsSum = computed(() => {
  let sum = 0;
  props.accountsData?.forEach(account => {
    if (!account.isCW) {
      const balance = account.isSlowWallet ? account.unlockedValue : account.coinValue;
      const numericBalance = typeof balance === 'number' ? balance : parseFloat(balance);
      if (!isNaN(numericBalance)) {
        sum += numericBalance;
      }
    }
  });
  return (sum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 });
});

const totalCoinsSum = computed(() => {
  let libraBalanceSum = 0;

  props.accountsData?.forEach(account => {
    const coinValue = typeof account.coinValue === 'number' ? account.coinValue.toString() : account.coinValue;

    if (!isNaN(parseFloat(coinValue))) {
      libraBalanceSum += parseFloat(coinValue);
    }
  });

  return (libraBalanceSum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 })
});

const dailyUnlock = computed(() => {
  const dailyDrip = 35000;
  const countSlow = props.accountsData?.filter(account => !account.isCW && account.isSlowWallet && (account.coinValue > account.unlockedValue)).length || 0;
  return (countSlow * dailyDrip).toLocaleString('en-US', { maximumFractionDigits: 2 });
});
</script>

<style scoped></style>
