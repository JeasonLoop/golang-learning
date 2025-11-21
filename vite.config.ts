import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // 如果是生产环境，使用仓库名称作为 base 路径（GitHub Pages）
    // 如果仓库在根目录，base 应该是 '/'
    // 如果仓库名称是 golang-learning，base 应该是 '/golang-learning/'
    // 注意：如果您的仓库名称不同，请修改这里的路径
    const base = mode === 'production' ? '/golang-learning/' : '/';

    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Plugin to copy .nojekyll to dist for GitHub Pages
        {
          name: 'copy-nojekyll',
          closeBundle() {
            try {
              copyFileSync(path.resolve(__dirname, '.nojekyll'), path.resolve(__dirname, 'dist', '.nojekyll'));
            } catch (err) {
              // Ignore if .nojekyll doesn't exist or dist doesn't exist yet
            }
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            // Ensure proper MIME types for JavaScript modules
            format: 'es',
          }
        }
      }
    };
});
