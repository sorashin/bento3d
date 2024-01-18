import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  optimizeDeps:{
    esbuildOptions:{
      plugins:[
        esbuildCommonjs(['link:../core'])
      ]
    }
  }
})
