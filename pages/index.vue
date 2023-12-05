<script setup lang="ts">
import accountsJson from '~/accountsOfInterest.json';
import { onMounted} from 'vue';
import type { Account } from '~/types';
import AccountRow from '~/components/AccountRow.vue';
import { useAccounts } from '~/composables/useAccounts';
import { useRouter } from 'vue-router';

const router = useRouter();

const typedAccountsJson: Account[] = accountsJson as Account[];

const { progress, isDataLoaded, accountsData, totalSums, sortData, exportToCSV } = useAccounts(typedAccountsJson);

const logout = () => {
  localStorage.removeItem('auth');
  router.push('/login');
};

onMounted(async () => {
  const isAuthenticated = localStorage.getItem('auth');
  if (!isAuthenticated) {
    router.push('/login'); // Redirect to login page if not authenticated
  } else {
    router.push('/my-accounts'); // Redirect to my-accounts page if authenticated
  }
});

</script>

<template>  
</template>



<style scoped>

</style>
