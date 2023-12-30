// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      authPassword: process.env.ACCOUNTS_MONITOR_PASSWORD || 'password',
    }
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.15.4/css/all.css' } // Replace with your Font Awesome CDN link
      ]
    },
  },
})
