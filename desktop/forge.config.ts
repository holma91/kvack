import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/view/html/index.html',
            js: './src/electron/renderer/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/electron/preload.ts',
            },
          },
          {
            html: './src/view/html/search.html',
            js: './src/electron/renderer/search.ts',
            name: 'search_window',
            preload: {
              js: './src/electron/preload.ts',
            },
          },
          {
            html: './src/view/html/vSeparator.html',
            js: './src/electron/renderer/vSeparator.ts',
            name: 'vseparator_window',
            preload: {
              js: './src/electron/preload.ts',
            },
          },
          {
            html: './src/view/html/hSeparator.html',
            js: './src/electron/renderer/hSeparator.ts',
            name: 'hseparator_window',
            preload: {
              js: './src/electron/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
