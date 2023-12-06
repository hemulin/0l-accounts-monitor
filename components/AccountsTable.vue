<template>
  <div class="table-container bg-white shadow-md rounded-lg overflow-x-auto">
    <div v-if="!isDataLoaded" class="flex justify-center items-center">
      <div class="radial-progress" :style="`--value:${progress}; --size:6rem; --thickness:1rem;`" role="progressbar">{{
        progress }}%</div>
    </div>
    <table class="min-w-full" v-if="isDataLoaded">
      <thead class="bg-gray-200 text-gray-600">
        <tr>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('friendlyName')">
            Friendly Name</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('accountAddress')">
            Account Address</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('isSlowWallet')">Slow
            Wallet</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('isValidator')">Is a
            Validator</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('isInValidatorSet')">
            Validating current set</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('isCW')">Community
            Wallet</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('coinValue')">Libra
            Balance</th>
          <th class="sticky top-0 z-10 p-3 text-left cursor-pointer bg-gray-200" @click="sortData('unlockedValue')">
            Unlocked Balance</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <AccountRow v-for="(account, index) in accountsData" :key="account.accountAddress" :account="account"
          :index="index" />
        <!-- Dummy Row for Total Sums -->
        <tr>
          <td colspan="6"></td>
          <td class="sum-cell">{{ totalSums?.libraBalanceSum }}</td>
          <td class="sum-cell">{{ totalSums?.unlockedBalanceSum }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-end space-x-2">
      <button @click="exportToCSV" class="btn btn-warning shadow-md" v-if="isDataLoaded">
        Export CSV
      </button>      
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account, TotalSums } from '~/types';
import type { PropType } from 'vue';
import AccountRow from './AccountRow.vue';

defineProps({
  accountsData: Array as PropType<Account[]>,
  totalSums: Object as PropType<TotalSums>,
  isDataLoaded: Boolean,
  progress: Number,
  sortData: Function,
  exportToCSV: Function
});
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}

.csv-export-button {
  margin-top: 1rem;
  /* Add some space above the button */
}

/* Desktop styles */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  /* Prevent text wrapping */
}

th {
  position: sticky;
  top: 0;
  /* Stick to the top of the table */
  z-index: 10;
  /* Ensure the header is above other content */
}

@media (min-width: 1024px) {

  .th-friendlyName,
  .td-friendlyName {
    width: 20%;
  }

  .th-accountAddress,
  .td-accountAddress {
    width: 20%;
  }

  .th-isSlowWallet,
  .td-isSlowWallet {
    width: 7%;
  }

  .th-isValidator,
  .td-isValidator {
    width: 7%;
  }

  .th-isInValidatorSet,
  .td-isInValidatorSet {
    width: 10%;
  }

  .th-isCw,
  .td-isCw {
    width: 10%;
  }
}

/* Mobile styles */
@media (max-width: 600px) {
  thead {
    display: none;
    /* Hide table headers */
  }

  tr {
    margin-bottom: 10px;
    display: block;
    border-bottom: 2px solid #ddd;
  }

  td {
    display: block;
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    text-align: left;
    font-weight: bold;
  }
}

.sum-cell {
  background-color: #2d3748;
  color: white;
  text-align: left;
}
</style>