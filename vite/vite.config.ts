import { defineConfig } from 'vite';
import aurelia from '@aurelia/vite-plugin';

export default defineConfig({
    plugins: [
        aurelia()
    ]
});