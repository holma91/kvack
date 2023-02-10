const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const assets = ['assets'];
const copyPlugins = new CopyWebpackPlugin({
  patterns: assets.map((asset) => ({
    from: path.resolve(__dirname, 'src', asset),
    to: path.resolve(__dirname, '.webpack/renderer', asset),
  })),
});

plugins.push(copyPlugins);

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
