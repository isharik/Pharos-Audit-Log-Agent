import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const pharosMcpProxy = {
  target: 'https://mcp.pharos.xyz',
  changeOrigin: true,
  secure: true,
  rewrite: () => '/mcp'
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/__pharos_mcp': pharosMcpProxy
    }
  },
  preview: {
    proxy: {
      '/__pharos_mcp': pharosMcpProxy
    }
  },
});
