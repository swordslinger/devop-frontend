import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));


export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        deps: {
            inline: ['vee-validate', 'vuex', 'yup']        
        },

        include: [
            'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
            'tests/**/*.test.js',
            'tests/**/*.test.ts',
            'tests/**/*.test.tsx',
            'tests/**/*.test.jsx'
        ],

        css: true,

        coverage: {
            provider: 'c8',
            reporter: ['text', 'json', 'html'],
            exclude: ['**/node_modules/**', '**/tests/**', '**/src/main.js', '**/src/router/index.js', '**/src/store/index.js'],
        },

        testTimeout: 10000,

        mockReset: true,
    }

})