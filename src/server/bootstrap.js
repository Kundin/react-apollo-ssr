require('ignore-styles');
require('url-loader');
require('file-loader');
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['dynamic-import-node', '@loadable/babel-plugin', '@babel/transform-runtime'],
});
require('./index');
