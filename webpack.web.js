const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const DotenvPlugin = require('dotenv-webpack');
const TerserJSPlugin = require('terser-webpack-plugin');

const common = require('./webpack.common');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(common, {
  name: 'web',
  target: 'web',
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
            caller: { target: 'web' },
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: isProd
          ? [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: !isProd,
                },
              },
              {
                loader: 'css-loader',
                options: {
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
            ]
          : [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
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
  entry: isProd
    ? ['./src/client/main-web.jsx']
    : [
        'webpack-hot-middleware/client?name=web&reload=true&quiet=true',
        './src/client/main-web.jsx',
      ],
  output: {
    path: path.resolve(__dirname, './dist/web'),
    filename: isProd ? '[id].[contenthash].js' : '[name].js',
    publicPath: '/dist/web/',
    libraryTarget: undefined,
  },
  optimization: {
    minimize: isProd,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
  plugins: isProd
    ? [
        new DotenvPlugin(),
        new CleanWebpackPlugin(),
        new LoadablePlugin(),
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: '[id].[contenthash].css',
          chunkFilename: '[id].[hash].css',
        }),
      ]
    : [
        new DotenvPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new LoadablePlugin(),
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ],
});
