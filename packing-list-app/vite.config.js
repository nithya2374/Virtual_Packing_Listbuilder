import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Virtual_Packing_Listbuilder/',  
  plugins: [react()],
  server: {
  proxy: {
    '/api': 'http://localhost:5000',
  },
}
});


