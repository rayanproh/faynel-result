import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // ==========================================================
  // 🚀 التعديل المطلوب لإضافة النطاق العام من Cloudflare Tunnel
  // ==========================================================
  server: {
    // المنفذ الافتراضي لتطبيقك هو 5173
    port: 5173, 
    // أضف النطاق الذي أنشأه cloudflared إلى قائمة النطاقات المسموح بها
    allowedHosts: [
      'thumbs-new-images-handbags.trycloudflare.com',
    ],
  },
  // ==========================================================
  
})