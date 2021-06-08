import path from 'path';
import dotenv from 'dotenv';
import { HotModuleReplacementPlugin } from 'webpack';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import DotenvPlugin from 'dotenv-webpack';
import TerserJSPlugin from 'terser-webpack-plugin';

import configCommon from './configCommon';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

export default merge(configCommon, {
  name: 'web',
  target: 'web',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProd,
            cacheCompression: false,
            presets: [
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
            plugins: ['@loadable/babel-plugin'],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          isProd
            ? {
                loader: MiniCssExtractPlugin.loader,
              }
            : {
                loader: 'style-loader',
              },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[contenthash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
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
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
    ],
  },
  entry: [
    isDev && 'webpack-hot-middleware/client?name=web&reload=true&quiet=true',
    path.resolve(__dirname, '../client/browser.tsx'),
  ].filter(Boolean),
  output: {
    path: path.resolve(__dirname, '../../dist/web'),
    filename: isProd ? '[id].[contenthash].js' : '[name].js',
    publicPath: '/dist/web/',
    libraryTarget: undefined,
  },
  optimization: {
    minimize: isProd,
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin() as any],
  },
  plugins: [
    new DotenvPlugin(),
    isDev && new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new LoadablePlugin() as any,
    isProd &&
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
  ].filter(Boolean),
});
