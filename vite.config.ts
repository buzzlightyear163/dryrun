import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fixtures ligger i public/api/*.json och serveras statiskt både i dev och efter build.
// TODO(backend): peka om fetch-anropen i src/lib/api.ts mot riktigt API.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
