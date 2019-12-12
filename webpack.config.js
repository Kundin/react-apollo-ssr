const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const DIST_PATH = path.resolve(__dirname, 'public/dist')
const isProd = process.env.NODE_ENV === 'production'
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

function getConfig(target) {
  const isNode = target === 'node'
  const isWeb = target === 'web'

  return {
    mode: isProd ? 'production' : 'development',
    target: target,
    name: target,
    devtool: isDev && isWeb ? 'source-map' : false,
    entry: isDev
      ? [`./src/client/main-${target}.js`, 'webpack-hot-middleware/client']
      : [`./src/client/main-${target}.js`],
    output: {
      path: path.join(DIST_PATH, target),
      filename: isProd ? '[name].[hash].js' : '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: isNode ? 'commonjs2' : undefined,
    },
    module: {
      rules: [
        // JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              caller: { target },
            },
          },
        },

        // CSS
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
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: [
                      require('postcss-simple-vars'),
                      require('postcss-nested'),
                      require('postcss-preset-env')({
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
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
  }
}

module.exports = [getConfig('web'), getConfig('node')]
