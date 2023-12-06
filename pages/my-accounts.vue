<script setup>
import { useAccounts } from '~/composables/useAccounts';
import accounts from '~/myAccounts.json';
import AccountsTable from '~/components/AccountsTable.vue';
import LiquidCoinsKPI from '~/components/LiquidCoinsKPI.vue';
import FiatConverter from '~/components/FiatConverter.vue';


const { progress, isDataLoaded, accountsData, totalSums, sortData, exportToCSV } = useAccounts(accounts);

// ... other page-specific logic ...
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <LiquidCoinsKPI v-if="isDataLoaded" :accounts-data="accountsData" class="flex-1" />
      <FiatConverter v-if="isDataLoaded" :accounts-data="accountsData" class="flex-1" />
    </div>
    <AccountsTable 
      :accounts-data="accountsData" 
      :total-sums="totalSums" 
      :is-data-loaded="isDataLoaded" 
      :progress="progress" 
      :sort-data="sortData" 
      :exportToCSV="exportToCSV" />
  </div>
</template>
