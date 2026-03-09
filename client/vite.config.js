import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use './' so the app works regardless of the GitHub repository name
  base: './', 
})