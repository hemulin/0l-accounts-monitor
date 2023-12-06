<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <a class="font-bold text-2xl lg:text-4xl" href="#">Libra Monitor</a>
      <div class="block lg:hidden">
        <button @click="drawerOpen = !drawerOpen" class="text-xl">
          <!-- Hamburger Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5z" />
          </svg>
          <!-- <i class="bi bi-list"></i> -->
        </button>
      </div>
      <div class="hidden lg:flex items-center">
        <!-- Regular Menu for larger screens -->
        <ul class="flex items-center space-x-4">
          <li>
            <NuxtLink to="/my-accounts">My accounts</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/accounts-of-interest">Accounts of interest</NuxtLink>
          </li>
        </ul>
        <button v-if="isAuthenticated" @click="logout" class="btn btn-error btn-sm ml-4">Logout</button>
      </div>
    </div>
    <!-- Drawer for mobile screens -->
    <div :class="drawerOpen ? 'block' : 'hidden'" class="lg:hidden">
      <ul class="p-4 space-y-2">
        <li>
          <NuxtLink to="/my-accounts">My accounts</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/accounts-of-interest">Accounts of interest</NuxtLink>
        </li>
        <li v-if="isAuthenticated"><button @click="logout" class="btn btn-error btn-sm">Logout</button></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const router = useRouter();
const isAuthenticated = ref(false);
const drawerOpen = ref(false);

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

<style scoped>/* Add custom styles for Navbar if needed */</style>
