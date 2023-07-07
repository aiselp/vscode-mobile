import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from "vite-plugin-top-level-await";
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy(),
  topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: "__tla",
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // base: "",
  assetsInclude: ['node_modules/vscode-oniguruma/**/*.wasm']
})
