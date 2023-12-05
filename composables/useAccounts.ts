import { ref, onMounted, computed } from 'vue';
import type { Account, TotalSums, FetchResponse, ValidatorSetResponse, AccountResourcesResponse, ValidatorSetResponseType, FetchResourcesResponse, ResourceItem, AccountResourcesResponseType } from '~/types';

export function useAccounts(accountsJson: Partial<Account>[]) {
  const progress = ref(0);
  const isDataLoaded = ref(false);
  const accountsData = ref<Account[]>([]);
  const sortColumn = ref<keyof Account | null>(null);
  const sortOrder = ref<'asc' | 'desc' | null>(null); // 'asc' for ascending, 'desc' for descending


  const checkWalletType = (data: ResourceItem[], type: string): boolean => {
    return data.some(d => d.type === type);
  };

  let validatorAddresses = new Set<string>();
  let validatorList = new Set<string>();

  const totalSums = computed<TotalSums>(() => {
    let libraBalanceSum = 0;
    let unlockedBalanceSum = 0;

    accountsData.value.forEach(account => {
      const coinValue = typeof account.coinValue === 'number' ? account.coinValue.toString() : account.coinValue;
      const unlockedValue = typeof account.unlockedValue === 'number' ? account.unlockedValue.toString() : account.unlockedValue;

      if (!isNaN(parseFloat(coinValue))) {
        libraBalanceSum += parseFloat(coinValue);
      }
      if (!isNaN(parseFloat(unlockedValue))) {
        unlockedBalanceSum += parseFloat(unlockedValue);
      }
    });

    return {
      libraBalanceSum: (libraBalanceSum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }),
      unlockedBalanceSum: (unlockedBalanceSum / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    };
  });


  const sortData = (column: keyof Account) => {
    if (sortColumn.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortOrder.value = 'asc';
    }

    accountsData.value.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        // Both values are numbers
        return (valueA - valueB) * (sortOrder.value === 'asc' ? 1 : -1);
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Both values are strings
        if (column === 'coinValue' || column === 'unlockedValue') {
          // Convert 'N/A' to zero for numeric comparison
          const numA = valueA === 'N/A' ? 0 : parseFloat(valueA);
          const numB = valueB === 'N/A' ? 0 : parseFloat(valueB);
          return (numA - numB) * (sortOrder.value === 'asc' ? 1 : -1);
        } else {
          // Regular string comparison
          return sortOrder.value === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        // Both values are booleans
        return (valueA === valueB) ? 0 : (valueA ? -1 : 1) * (sortOrder.value === 'asc' ? 1 : -1);
      }

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
    const totalAccounts = accountsJson.length;
    let loadedAccounts = 0;

    const updateProgress = () => {
      loadedAccounts += 1;
      progress.value = Math.ceil((loadedAccounts / totalAccounts) * 100);
    };

    // Fetch Validator Set Data
    const validatorSetUrl = `https://rpc.0l.fyi/v1/accounts/0x1/resource/0x1::stake::ValidatorSet`;
    const validatorSetResponse = await useFetch<ValidatorSetResponseType>(validatorSetUrl);

    if (validatorSetResponse.error.value) {
      console.error('Error fetching validator set:', validatorSetResponse.error.value);
    } else if (validatorSetResponse.data.value) {
      validatorAddresses = new Set(validatorSetResponse.data.value.data.active_validators.map(v => v.addr));
    }

    const accountResourcesUrl = `https://rpc.0l.fyi/v1/accounts/0x1/resources?limit=9999`;
    const accountResourcesResponse = await useFetch<AccountResourcesResponseType>(accountResourcesUrl);

    if (accountResourcesResponse.error.value) {
      console.error('Error fetching account resources:', accountResourcesResponse.error.value);
    } else if (accountResourcesResponse.data && Array.isArray(accountResourcesResponse.data.value)) {
      const validatorUniverse = accountResourcesResponse.data.value.find(d => d.type === "0x1::validator_universe::ValidatorUniverse");
      if (validatorUniverse) {
        validatorList = new Set(validatorUniverse.data.validators); // Ensure this matches the structure of your data
      }
    }

    const fetchPromises = accountsJson.map(async (account: Account) => {
      const url = `https://rpc.0l.fyi/v1/accounts/${account.accountAddress}/resources?limit=9999`;
      const response = await useFetch<AccountResourcesResponseType>(url);

      if (response.error.value) {
        console.error('Error fetching data for account:', account.accountAddress, response.error.value);
        return null;
      }

      if (response.data && Array.isArray(response.data.value)) {
        const resources: ResourceItem[] = response.data.value; // Now TypeScript knows resources is an array of ResourceItem
        const coinData = resources.find(d => d.type === "0x1::coin::CoinStore<0x1::libra_coin::LibraCoin>");
        const walletData = resources.find(d => d.type === "0x1::slow_wallet::SlowWallet");

        // Fetching additional data for each account
        const additionalData = await useFetch<AccountResourcesResponseType>(`https://rpc.0l.fyi/v1/accounts/${account.accountAddress}/resources?limit=9999`);
        const additionalDataValue = additionalData.data && Array.isArray(additionalData.data.value) ? additionalData.data.value : [];

        updateProgress();

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

    accountsData.value = (await Promise.all(fetchPromises)).filter((account): account is Account => account !== null);
    isDataLoaded.value = true;
  });

  // Add all the logic from index.vue related to fetching and processing data here
  // Modify functions to use accountsJson parameter where necessary

  return { progress, isDataLoaded, accountsData, totalSums, sortColumn, sortOrder, sortData, exportToCSV };
}