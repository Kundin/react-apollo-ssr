const path = require('path')
const nodeExternals = require('webpack-node-externals')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const PostCSSSimpleVars = require('postcss-simple-vars')
const PostCSSNested = require('postcss-nested')
const PostCSSPresetEnv = require('postcss-preset-env')

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
    entry: [`./src/client/main-${target}.js`],
    resolve: {
      alias: {
        Pages: path.resolve(__dirname, './src/client/pages'),
        Components: path.resolve(__dirname, './src/client/components'),
      },
    },
    output: {
      path: path.join(DIST_PATH, target),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: isNode ? 'commonjs2' : undefined,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              caller: { target: target },
            },
          },
        },
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
                      PostCSSSimpleVars(),
                      PostCSSNested(),
                      PostCSSPresetEnv({
                        stage: 0,
                        features: {
                          // customProperties: {
                          //   warnings: false,
                          // },
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
            test: /[\/]node_modules[\/]/,
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
      new CleanWebpackPlugin(),
      new LoadablePlugin(),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),
    ],
  }
}

module.exports = [getConfig('web'), getConfig('node')]
