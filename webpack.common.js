const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@App': path.resolve(__dirname, 'src/client/App/App.jsx'),
      '@Components': path.resolve(__dirname, 'src/client/Components'),
      '@Themes': path.resolve(__dirname, 'src/client/Themes'),
      '@Pages': path.resolve(__dirname, 'src/client/Pages'),
      '@GraphQL': path.resolve(__dirname, 'src/client/GraphQL'),
      '@Icons': path.resolve(__dirname, 'src/client/Icons'),
      '@Utils': path.resolve(__dirname, 'src/client/Utils'),
      '@Hooks': path.resolve(__dirname, 'src/client/Hooks'),
      '@Templates': path.resolve(__dirname, 'src/client/Templates'),
    },
  },
};
