import { resolve } from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [dts(), react(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'Notify',
      // the proper extensions will be added
      fileName: 'index'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        format: 'umd',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  }
})
