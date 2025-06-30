import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteSvgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/assets': resolve(__dirname, './src/assets'),
      '~/ui': resolve(__dirname, './src/ui'),
      '~/game': resolve(__dirname, './src/game'),
      '~/store': resolve(__dirname, './src/game/store'),
      '~/pages': resolve(__dirname, './src/pages'),
      '~/services': resolve(__dirname, './src/services'),
      '~/constants': resolve(__dirname, './src/constants'),
      '~/utils': resolve(__dirname, './src/utils'),
      '~/hooks': resolve(__dirname, './src/hooks'),
      "~/data/map": resolve(__dirname, './src/game/components/map/data'),
    }
  },
  plugins: [viteSvgr(), react()],
})
