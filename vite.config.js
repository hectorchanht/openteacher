import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Static single-page build → dist/ (uploaded as-is to the Cloudflare Pages
// project "openteacher"). No router, no SSR: content ships in the bundle.
export default defineConfig({
  plugins: [svelte()],
  build: { outDir: 'dist' }
});
