<script setup lang="ts">
import accounts from '~/accounts.json';
import AccountRow from '~/components/AccountRow.vue';
import { onMounted, ref, computed } from 'vue';

const isDataLoaded = ref(false);
const accountsData = ref([]);
const sortColumn = ref(null);
const sortOrder = ref(null); // 'asc' for ascending, 'desc' for descending

const checkWalletType = (data, type) => data.some(d => d.type === type);
let validatorAddresses = new Set();
let validatorList = new Set();

const totalSums = computed(() => {
  let libraBalanceSum = 0;
  let unlockedBalanceSum = 0;

  accountsData.value.forEach(account => {
    if (!isNaN(parseFloat(account.coinValue))) {
      libraBalanceSum += parseFloat(account.coinValue);
    }
    if (!isNaN(parseFloat(account.unlockedValue))) {
      unlockedBalanceSum += parseFloat(account.unlockedValue);
    }
  });

  return {
    libraBalanceSum: (libraBalanceSum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    unlockedBalanceSum: (unlockedBalanceSum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  };
});

const sortData = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }

  accountsData.value.sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];

    // Check if sorting numeric values
    if (column === 'coinValue' || column === 'unlockedValue') {
      valueA = (valueA === 'N/A') ? 0 : parseFloat(valueA);
      valueB = (valueB === 'N/A') ? 0 : parseFloat(valueB);
    }

    if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
};

const exportToCSV = () => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  let headerRow = ['Friendly Name', 'Account Address', 'Slow Wallet', 'Is a Validator', 'Validating Current Set', 'Community Wallet', 'Libra Balance', 'Unlocked Balance'];
  csvContent += headerRow.join(',') + '\r\n';

  accountsData.value.forEach(account => {
    let row = [
      account.friendlyName,
      account.accountAddress,
      account.isSlowWallet ? 'Yes' : 'No',
      account.isValidator ? 'Yes' : 'No',
      account.isInValidatorSet ? 'Yes' : 'No',
      account.isCW ? 'Yes' : 'No',
      account.coinValue,
      account.unlockedValue
    ];
    csvContent += row.join(',') + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'accounts_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(async () => {
  // Fetch Validator Set Data
  const validatorSetUrl = `https://rpc.0l.fyi/v1/accounts/0x1/resource/0x1::stake::ValidatorSet`;
  const validatorSetResponse = await useFetch(validatorSetUrl);
  if (validatorSetResponse.error.value) {
    console.error('Error fetching validator set:', validatorSetResponse.error.value);
  } else if (validatorSetResponse.data.value) {
    validatorAddresses = new Set(validatorSetResponse.data.value.data.active_validators.map(v => v.addr));
  }

  const accountResourcesUrl = `https://rpc.0l.fyi/v1/accounts/0x1/resources?limit=9999`;
  const accountResourcesResponse = await useFetch(accountResourcesUrl);
  if (accountResourcesResponse.error.value) {
    console.error('Error fetching account resources:', accountResourcesResponse.error.value);
  } else if (accountResourcesResponse.data.value) {
    const validatorUniverse = accountResourcesResponse.data.value.find(d => d.type === "0x1::validator_universe::ValidatorUniverse");
    if (validatorUniverse) {
      validatorList = new Set(validatorUniverse.data.validators);
    }
  }

  const fetchPromises = accounts.map(async (account) => {
    const url = `https://rpc.0l.fyi/v1/accounts/${account.accountAddress}/resources?limit=9999`;
    const { data, error } = await useFetch(url);

    console.log('Fetching data from url:', url)

    if (error.value) {
      console.error('Error fetching data for account:', account.accountAddress, error.value);
      return null; // Handle the error as needed
    }

    if (data.value) {
      const coinData = data.value.find(d => d.type === "0x1::coin::CoinStore<0x1::libra_coin::LibraCoin>");
      const walletData = data.value.find(d => d.type === "0x1::slow_wallet::SlowWallet");

      // Fetching additional data for each account
      const additionalData = await useFetch(`https://rpc.0l.fyi/v1/accounts/${account.accountAddress}/resources?limit=9999`);
      const additionalDataValue = additionalData.data.value || [];

      return {
        accountAddress: account.accountAddress,
        friendlyName: account.friendlyName,
        coinValue: coinData ? coinData.data.coin.value : 'N/A',
        unlockedValue: walletData ? walletData.data.unlocked : 'N/A',
        isSlowWallet: checkWalletType(additionalDataValue, "0x1::slow_wallet::SlowWallet"),
        isCW: checkWalletType(additionalDataValue, "0x1::community_wallet::CommunityWallet"),
        isInValidatorSet: validatorAddresses.has(account.accountAddress),
        isValidator: validatorList.has(account.accountAddress)
      };
    } else {
      console.error('No data returned for account:', account.accountAddress);
      return null; // Handle the case when no data is returned
    }
  });

  accountsData.value = (await Promise.all(fetchPromises)).filter(account => account !== null);
  isDataLoaded.value = true;
});
</script>



<template>
  <div class="p-6">
    <div class="table-container">
      <table class="min-w-full lg:table-fixed" v-if="isDataLoaded">
        <thead class="text-gray-600">
          <tr>
          <th class="p-3 text-left bg-gray-200 th-friendlyName" @click="sortData('friendlyName')">Friendly Name</th>
          <th class="p-3 text-left bg-gray-200 th-accountAddress" @click="sortData('accountAddress')">Account Address</th>
          <th class="p-3 text-left bg-gray-200 th-isSlowWallet" @click="sortData('isSlowWallet')">Slow Wallet</th>
          <th class="p-3 text-left bg-gray-200 th-isValidator" @click="sortData('isValidator')">Is a Validator</th>
          <th class="p-3 text-left bg-gray-200 th-isInValidatorSet" @click="sortData('isInValidatorSet')">Validating current set</th>
          <th class="p-3 text-left bg-gray-200 th-isCW" @click="sortData('isCW')">Community Wallet</th>
          <th class="p-3 text-left bg-gray-200 th-coinValue" @click="sortData('coinValue')">Libra Balance</th>
          <th class="p-3 text-left bg-gray-200 th-unlockedValue" @click="sortData('unlockedValue')">Unlocked Balance</th>
          </tr>
        </thead>
        <tbody>
          <AccountRow v-for="(account, index) in accountsData" :key="account.accountAddress" :account="account" :index="index" />
          <!-- Dummy Row -->
          <tr>
            <td colspan="6"></td>
            <td class="sum-cell">{{ totalSums.libraBalanceSum }}</td>
            <td class="sum-cell">{{ totalSums.unlockedBalanceSum }}</td>
          </tr>
        </tbody>
      </table>
      <div class="csv-export-button">
        <button @click="exportToCSV" class="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded" v-if="isDataLoaded">
          CSV ⇩
        </button>
      </div>
    </div>    
  </div>
</template>

<style scoped>

.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Aligns the button to the right */
}

.csv-export-button {
  margin-top: 1rem; /* Add some space above the button */
}

/* Desktop styles */
table {
  width: 100%;
  border-collapse: collapse;  
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* Prevent text wrapping */
}

th {
  position: sticky;
  top: 0; /* Stick to the top of the table */
  z-index: 10; /* Ensure the header is above other content */
}

@media (min-width: 1024px) {
  .th-friendlyName, .td-friendlyName { width: 20%; }
  .th-accountAddress, .td-accountAddress { width: 20%; }
  .th-isSlowWallet, .td-isSlowWallet { width: 7%; }
  .th-isValidator, .td-isValidator { width: 7%; }
  .th-isInValidatorSet, .td-isInValidatorSet { width: 10%; }
  .th-isCw, .td-isCw { width: 10%; }
}

/* Mobile styles */
@media (max-width: 600px) {
  thead {
    display: none; /* Hide table headers */
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
