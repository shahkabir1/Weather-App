import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(),
    createHtmlPlugin({
        minify: true,
        pages: {
          '/hourly.html': {
            template: 'public/hourly.html'
          }
        }
      })
  ],
  base: '/',
  build: {
    outDir: 'dist',
  },
});
