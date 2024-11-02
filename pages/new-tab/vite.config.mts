import { resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const outDir = resolve(rootDir, '..', '..', 'dist', 'new-tab');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    // @ts-ignore
    libAssetsPlugin({
      outputPath: outDir,
    }),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: outDir,
  },
});
