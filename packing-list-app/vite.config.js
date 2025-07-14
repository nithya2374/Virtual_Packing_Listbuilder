import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Virtual_Packing_Listbuilder/',  
  plugins: [react()],
  server: {
    port: 5173, // ✅ Lock Vite to port 5173
    proxy: {
      '/api': 'http://localhost:5000', // ✅ Redirect API to backend
    },
  },
});

