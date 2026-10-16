// @ts-check
import { defineConfig } from 'astro/config';
import { site as content } from './src/content.ts';

// Keep previews canonical to the production domain.
const site = process.env.SITE_URL || content.domain;

export default defineConfig({
  ...(site ? { site } : {}),
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
});
