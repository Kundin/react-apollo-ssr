const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
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
        use: 'null-loader',
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
    path: path.resolve(__dirname, './dist/node'),
    filename: isProd ? '[name].[hash].js' : '[name].js',
    publicPath: path.resolve(__dirname, './dist/node/'),
    libraryTarget: 'commonjs2',
  },
  externals: ['@loadable/component', nodeExternals()],
  plugins: [new CleanWebpackPlugin(), new LoadablePlugin()],
});
