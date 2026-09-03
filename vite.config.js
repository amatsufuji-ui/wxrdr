import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // 追加

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 以下、VitePWAの設定を追加
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'GLOBAL WX RADAR',
        short_name: 'WX RADAR',
        description: 'Aviation Weather Radar App for Pilots',
        theme_color: '#0f172a', // ヘッダーの色 (bg-slate-900)
        background_color: '#020617', // 全体の背景色 (bg-slate-950)
        display: 'standalone', // フルスクリーン表示
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})