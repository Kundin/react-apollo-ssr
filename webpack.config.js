const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');

const DIST_PATH = path.resolve(__dirname, 'public/dist');
const isProd = process.env.NODE_ENV === 'production';
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

function getConfig(target) {
  const isNode = target === 'node';
  const isWeb = target === 'web';

  return {
    mode: isProd ? 'production' : 'development',
    target,
    name: target,
    devtool: isDev && isWeb ? 'source-map' : false,
    entry:
      isWeb && isDev
        ? [
            'webpack-hot-middleware/client?name=web&reload=true&quiet=true',
            './src/client/main-web.jsx',
          ]
        : ['./src/client/main-node.js'],
    output: {
      path: path.join(DIST_PATH, target),
      filename: isProd ? '[name].[hash].js' : '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: isNode ? 'commonjs2' : undefined,
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '@Config': path.resolve(__dirname, 'src/Config.js'),
        '@App': path.resolve(__dirname, 'src/client/App/App.jsx'),
        '@Themes': path.resolve(__dirname, 'src/client/Themes'),
        '@Components': path.resolve(__dirname, 'src/client/Components'),
        '@Pages': path.resolve(__dirname, 'src/client/Pages'),
      },
    },
    module: {
      rules: [
        // JS
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              caller: { target },
            },
          },
        },

        // PostCSS
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: isWeb
            ? [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: isDev,
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
            : ['css-loader'],
        },
      ],
    },
    externals: isNode ? ['@loadable/component', nodeExternals()] : undefined,
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'manifest',
            enforce: true,
          },
        },
      },
      minimize: isProd,
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      removeAvailableModules: isProd,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
      new LoadablePlugin(),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
      }),
    ],
  };
}

module.exports = [getConfig('web'), getConfig('node')];
