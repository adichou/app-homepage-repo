import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // 默认根路径（Cloudflare Workers / 本地开发）；GitHub Pages 构建时用 VITE_BASE 覆盖为子路径
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: false
  }
})
