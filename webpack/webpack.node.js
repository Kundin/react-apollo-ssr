const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const dotenv = require('dotenv');

const config = require('./webpack.common');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(config, {
  name: 'node',
  target: 'node',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProd,
            cacheCompression: false,
            caller: { target: 'node' },
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProd,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isProd
                  ? '[hash:base64:5]'
                  : '[path][name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssNested(),
                postcssPresetEnv({
                  stage: 1,
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2)$/,
        exclude: /node_modules/,
        use: 'null-loader',
      },
    ],
  },
  entry: ['./src/client/main-node.js'],
  output: {
    path: path.resolve(__dirname, '../dist/node'),
    filename: isProd ? '[name].[hash].js' : '[name].js',
    publicPath: path.resolve(__dirname, '../dist/node/'),
    libraryTarget: 'commonjs2',
  },
  externals: ['@loadable/component', nodeExternals({ whitelist: /\.css$/ })],
  plugins: [
    new CleanWebpackPlugin(),
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: '[id].[contenthash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
});
