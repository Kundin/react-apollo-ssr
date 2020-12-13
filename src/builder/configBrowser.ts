import path from 'path';
import dotenv from 'dotenv';
import webpack from 'webpack';
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
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProd,
            cacheCompression: false,
            presets: ['airbnb', '@babel/preset-env', '@babel/preset-typescript'],
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
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 8192, // 8 Kb
          },
        },
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/,
        use: ['file-loader'],
      },
    ],
  },
  entry: [
    isDev && 'webpack-hot-middleware/client?name=web&reload=true&quiet=true',
    path.resolve(__dirname, '../client/browser.tsx'),
  ].filter((p) => !!p),
  output: {
    path: path.resolve(__dirname, '../../dist/web'),
    filename: isProd ? '[id].[contenthash].js' : '[name].js',
    publicPath: '/dist/web/',
    libraryTarget: undefined,
  },
  optimization: {
    minimize: isProd,
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      name: !isProd,
      cacheGroups: {
        'react-vendors': {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom\/esm)[\\/]/,
          chunks: 'all',
        },

        'graphql-vendors': {
          test: /[\\/]node_modules[\\/](apollo-client|@apollo|apollo-utilities\/lib|apollo-link\/lib|graphql|graphql-tag\/src|zen-observable)[\\/]/,
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new DotenvPlugin(),
    isDev && new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new LoadablePlugin(),
    isProd &&
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
  ].filter((p) => !!p),
});
