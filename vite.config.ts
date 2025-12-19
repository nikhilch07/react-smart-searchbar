import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
      include: ['src/lib'],
      exclude: [
        'vite.config.*',
        'src/demo/**',
        'src/main.tsx',
        'src/App.tsx',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      entryRoot: 'src/lib',
      outDir: 'dist',
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'ReactSmartSearchbar',
      fileName: (format) => `react-smart-searchbar.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
});
