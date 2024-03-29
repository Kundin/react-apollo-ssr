import path from 'path';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import dotenv from 'dotenv';

import configCommon from './configCommon';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default merge(configCommon, {
  name: 'node',
  target: 'node',
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
          {
            loader: MiniCssExtractPlugin.loader,
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
        test: /\.(png|svg|jpg|gif|woff|woff2)$/,
        exclude: /node_modules/,
        use: 'null-loader',
      },
    ],
  },
  entry: [path.resolve(__dirname, '../client/node.ts')],
  output: {
    path: path.resolve(__dirname, '../../dist/node'),
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
    publicPath: path.resolve(__dirname, '../../dist/node/'),
    libraryTarget: 'commonjs2',
  },
  externals: ['@loadable/component', nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new LoadablePlugin() as any,
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: '[id].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
});
