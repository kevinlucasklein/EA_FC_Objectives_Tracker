import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: "/src/lib",
      $components: "/src/components",
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})