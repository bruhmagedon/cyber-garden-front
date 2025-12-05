import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import pluginChecker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      tailwindcss(),
      react({
        tsDecorators: true,
      }),
      svgrPlugin(),
      tsconfigPaths(),
      pluginChecker({ typescript: true }),
    ],
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Включаем sourcemap только для dev/stage окружений
      chunkSizeWarningLimit: 1500, // Строгий лимит для снижения размера chunk
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // Предварительная загрузка критически важных библиотек
    },
    hmr: {
      overlay: true,
      log: 'debug',
    },
    server: {
      host: true,
      port: 7001,
      cors: true,
      open: env.VITE_APP_IS_OPEN === 'true',
      strictPort: false,
      hmr: {
        port: 24678,
      },
    },
    preview: {
      host: true,
      port: 7000,
      strictPort: false,
    },
    resolve: {
      alias: {
        '@/app': path.resolve(__dirname, './src/app'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/assets': path.resolve(__dirname, './src/shared/assets'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
        '@/ui': path.resolve(__dirname, './src/shared/ui'),
      },
      dedupe: ['zod'], // Дедупликация zod для избежания конфликтов версий и вторых экземпляров
    },
  };
});
