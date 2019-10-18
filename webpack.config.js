const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const DIST_PATH = path.resolve(__dirname, 'public/dist')
const isProd = process.env.NODE_ENV === 'production'
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

function getConfig(target) {
  let isNode = target === 'node'

  return {
    mode: isProd ? 'production' : 'development',
    target: target,
    name: target,
    devtool: 'source-map',
    entry: `./src/client/main-${target}.js`,
    output: {
      path: path.join(DIST_PATH, target),
      filename: isProd ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
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
          use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
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
    },
    plugins: [
      new CleanWebpackPlugin(),
      new LoadablePlugin(),
      new MiniCssExtractPlugin(),
    ],
  }
}

module.exports = [getConfig('web'), getConfig('node')]
