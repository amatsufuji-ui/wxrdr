import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // 追加

// https://vitejs.dev/config/
export default defineConfig({
  //base: '/wxrdr/',
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
      },
      
      workbox: {
        // アプリを構成する基本ファイルを事前にキャッシュ
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], 
        runtimeCaching: [
          {
            // 背景となるベースマップ（ArcGIS）のタイル画像をキャッシュ
            urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'base-map-cache',
              expiration: {
                maxEntries: 300,                  // 最大300枚の地図画像を保持
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30日間保持
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          }
        ],
      }

    })
  ],
})