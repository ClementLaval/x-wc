import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  minify: !options.watch,
}));
