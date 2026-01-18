import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'sharp',
    routes: {
      extend: {
        // Make sure static assets are handled correctly
        include: ['/_astro/*']
      }
    }
  }),
});
