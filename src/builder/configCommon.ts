import path from 'path';
import dotenv from 'dotenv';
import { Configuration } from 'webpack';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const config: Configuration = {
  mode: isProd ? 'production' : 'development',
  resolve: {
    // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.mjs'],
    alias: {
      '@App': path.resolve(__dirname, '../client/App'),
      '@Components': path.resolve(__dirname, '../client/Components'),
      '@Themes': path.resolve(__dirname, '../client/Themes'),
      '@Pages': path.resolve(__dirname, '../client/Pages'),
      '@GraphQL': path.resolve(__dirname, '../client/GraphQL'),
      '@Icons': path.resolve(__dirname, '../client/Icons'),
      '@Utils': path.resolve(__dirname, '../client/Utils'),
      '@Hooks': path.resolve(__dirname, '../client/Hooks'),
      '@Templates': path.resolve(__dirname, '../client/Templates'),
    },
  },
  module: {
    rules: [
      // fixes https://github.com/graphql/graphql-js/issues/1272
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
};

export default config;
