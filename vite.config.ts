import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteSvgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/assets': resolve(__dirname, './src/assets'),
      '~/components': resolve(__dirname, './src/components'),
      '~/game': resolve(__dirname, './src/game'),
      '~/store': resolve(__dirname, './src/game/store'),
      '~/pages': resolve(__dirname, './src/pages'),
      '~/services': resolve(__dirname, './src/services'),
    }
  },
  plugins: [viteSvgr(), react(), nodePolyfills({ protocolImports: true })],
})
