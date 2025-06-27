import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite' // This is no longer needed for v3

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()], // We removed the tailwindcss() plugin from here
}) 