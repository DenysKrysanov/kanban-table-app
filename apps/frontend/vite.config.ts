import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'kanban-table-app-production-5e4a.up.railway.app',
      'localhost'
    ],
    host: true,
    port: port
  },
  server: {
    host: true,
    port: process.env.NODE_ENV === 'development' ? 5173 : port
  }
})