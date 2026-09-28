import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths work both locally and when deployed under a GitHub Pages repo path.
  base: './',
});
