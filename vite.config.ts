import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteSvgr from 'vite-plugin-svgr';
import tailwindcss from "@tailwindcss/vite";


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/assets': resolve(__dirname, './src/assets'),
      "~/components": resolve(__dirname, "./src/components"),
      '~/constants': resolve(__dirname, './src/constants'),
      "~/data": resolve(__dirname, './src/data'),
      '~/game': resolve(__dirname, './src/game'),
      '~/hooks': resolve(__dirname, './src/hooks'),
      '~/pages': resolve(__dirname, './src/pages'),
      '~/services': resolve(__dirname, './src/services'),
      '~/store': resolve(__dirname, './src/store'),
      '~/ui': resolve(__dirname, './src/ui'),
      '~/utils': resolve(__dirname, './src/utils'),
    }
  },
  plugins: [react(), tailwindcss(), viteSvgr()],
})
