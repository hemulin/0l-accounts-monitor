<template>
  <div class="card card-bordered bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Fiat Converter</h2>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Enter Price per Coin ($):</span>
        </label>
        <input type="number" v-model="fiatPrice" class="input input-bordered" />
      </div>
      <div class="pt-4">
        <div class="font-semibold">Liquid Balance: <span class="text-success">$ {{ liquidBalanceConverted }}</span></div>
        <div class="font-semibold">Daily Unlock: <span class="text-success">$ {{ dailyUnlockConverted }}</span></div>
        <div class="font-semibold">Total Balance: <span class="text-success">$ {{ totalBalanceConverted }}</span></div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Account } from '~/types';

const props = defineProps({
  accountsData: Array as PropType<Account[]>
});

const fiatPrice = ref(0);

const liquidBalance = computed(() => {
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
  return (sum / 1e6)
});

const totalBalance = computed(() => {
  let libraBalanceSum = 0;
  let unlockedBalanceSum = 0;

  props.accountsData?.forEach(account => {
    const coinValue = typeof account.coinValue === 'number' ? account.coinValue.toString() : account.coinValue;

    if (!isNaN(parseFloat(coinValue))) {
      libraBalanceSum += parseFloat(coinValue);
    }
    // Add to unlockedBalanceSum only if not a community wallet
    if (!account.isCW) {
      const unlockedValue = typeof account.unlockedValue === 'number' ? account.unlockedValue.toString() : account.unlockedValue;
      if (!isNaN(parseFloat(unlockedValue))) {
        unlockedBalanceSum += parseFloat(unlockedValue);
      }
    }
  });
  return libraBalanceSum / 1e6
});

const dailyUnlock = computed(() => {
  const dailyDrip = 35000;
  const countSlow = props.accountsData?.filter(account => !account.isCW && account.isSlowWallet && (Number(account.coinValue) > Number(account.unlockedValue))).length || 0;
  return countSlow * dailyDrip;
});

// Computed property for the dailyUnlock converted to fiat
const dailyUnlockConverted = computed(() => {
  return (dailyUnlock.value * fiatPrice.value).toLocaleString('en-US', { maximumFractionDigits: 2 });
});

const liquidBalanceConverted = computed(() => {
  return (liquidBalance.value * fiatPrice.value).toLocaleString('en-US', { maximumFractionDigits: 2 });
});

const totalBalanceConverted = computed(() => {
  return (totalBalance.value * fiatPrice.value).toLocaleString('en-US', { maximumFractionDigits: 2 });
});
</script>

<style scoped>
/* Additional styling as needed */
</style>
