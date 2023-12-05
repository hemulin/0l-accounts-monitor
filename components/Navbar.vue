<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <a class="font-bold text-2xl lg:text-4xl" href="#">My Libra Monitor</a>
      <!-- Navigation Links -->
      <div class="flex items-center">
        <ul class="flex items-center">
          <li>
            <NuxtLink class="p-3" to="/my-accounts">My accounts</NuxtLink>
          </li>
          <li>
            <NuxtLink class="p-3" to="/accounts-of-interest">Accounts of interest</NuxtLink>
          </li>
        </ul>
        <!-- Logout Button -->
        <button v-if="isAuthenticated" @click="logout" class="btn btn-error btn-sm">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const router = useRouter();
const isAuthenticated = ref(false);

// Function to check authentication status
const checkAuth = () => {
  if (process.client) {
    isAuthenticated.value = !!localStorage.getItem('auth');
  }
};

// Check authentication status on mounted and on route changes
onMounted(checkAuth);
watch(() => router.currentRoute.value, checkAuth);

const logout = () => {
  if (process.client) {
    localStorage.removeItem('auth');
    isAuthenticated.value = false;
    router.push('/login');
  }
};
</script>

<style scoped>
/* Add custom styles for Navbar if needed */
</style>
