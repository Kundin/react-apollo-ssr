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
        test: /\.(png|svg|jpg|gif|woff|woff2)$/,
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
    filename: isProd ? '[name].[hash].js' : '[name].js',
    publicPath: '/dist/web/',
    libraryTarget: undefined,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: isProd
    ? [
        new DotenvPlugin(),
        new CleanWebpackPlugin(),
        new LoadablePlugin(),
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: isProd ? '[name].[contenthash].css' : '[name].css',
          chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
        }),
      ]
    : [
        new DotenvPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new LoadablePlugin(),
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: isProd ? '[name].[contenthash].css' : '[name].css',
          chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
        }),
      ],
});
