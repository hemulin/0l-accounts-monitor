<template>
  <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <form @submit.prevent="login" class="flex flex-col w-full">
      <input v-model="password" type="password" placeholder="Enter password" class="p-2 border border-gray-300 rounded mb-4" />
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const password = ref('');
const router = useRouter();

const login = () => {
const correctPassword = config.authPassword || 'password';
  if (password.value === correctPassword) {
    localStorage.setItem('auth', 'true');
    router.push('/');
  } else {
    alert('Incorrect password');
  }
};
</script>
<style scoped>
</style>

