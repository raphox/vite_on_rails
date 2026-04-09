import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        autoSubfolderIndex: true,
        crawlLinks: true,
      },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    outDir: '.tanstack',
    emptyOutDir: true,
  },
  environments: {
    client: {
      build: {
        outDir: '../public',
        emptyOutDir: true,
      },
    },
    server: {
      build: {
        outDir: '.tanstack/server',
        emptyOutDir: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
