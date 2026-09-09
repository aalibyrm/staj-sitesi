import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const pagesBase = '/staj-sitesi/';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: pagesBase,
    plugins: [react()],
    resolve: {
      alias: {
        'next/image': '/src/github-pages/shims/Image.tsx',
        'next/link': '/src/github-pages/shims/Link.tsx',
      },
    },
    define: {
      __PAGES_BASE_PATH__: JSON.stringify(pagesBase.slice(0, -1)),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || env.SUPABASE_URL || '',
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '',
      ),
    },
    build: {
      outDir: 'out',
      emptyOutDir: true,
    },
  };
});
