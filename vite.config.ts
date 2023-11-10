import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from "vite-plugin-top-level-await";
import path from 'path'
import { defineConfig } from 'vite'
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  // legacy({
  //   targets: 'Android 101'//['ChromeAndroid 103']
  // }),
  topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: "__tla",
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  }), vsixPlugin({})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vscode': ['vscode'],
          'monaco-editor': ['monaco-editor']
        }
      }
    }
  },
  assetsInclude: ['node_modules/vscode-oniguruma/**/*.wasm']
})
