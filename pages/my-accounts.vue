<script setup>
import { useAccounts } from '~/composables/useAccounts';
import accounts from '~/myAccounts.json';

const { progress, isDataLoaded, accountsData } = useAccounts(accounts);

// Other page-specific logic
</script>