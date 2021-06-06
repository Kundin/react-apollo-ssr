/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import compilerPromise from './helpers/compilerPromise';
import nodeConfig from '../builder/configNode';
import webConfig from '../builder/configBrowser';
import render from './middlewares/render';

const app = express();
const multiCompiler = webpack([nodeConfig, webConfig]);
const webCompiler = multiCompiler.compilers.find((compiler) => compiler.name === webConfig.name);
const nodeCompiler = multiCompiler.compilers.find((compiler) => compiler.name === nodeConfig.name);
const watchOptions = {
  ignored: /node_modules/,
  stats: nodeConfig.stats,
};
const isDev = process.env.NODE_ENV === 'development';

const start = async () => {
  app.use('/dist', express.static('./dist'));
  app.use('/static', express.static('./static'));
  app.use('/robots.txt', express.static('./static/robots.txt'));

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('*', (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    next();
  });

  if (isDev) {
    app.use(
      webpackDevMiddleware(webCompiler, {
        publicPath: '/dist/web/',
        serverSideRender: true,
        writeToDisk(filePath) {
          return filePath.includes('dist/node/') || filePath.includes('loadable-stats');
        },
      }),
    );
    app.use(webpackHotMiddleware(webCompiler));
  }

  app.get('*', render);

  app.listen(3000, () => {
    console.log('App listening on port 3333!');
  });

  nodeCompiler.watch(watchOptions, (err) => {
    if (err) throw err;
    console.log('Watch node...');
  });

  try {
    await compilerPromise('web', webCompiler);
    await compilerPromise('node', nodeCompiler);
  } catch (error) {
    console.log('Error', error.message);
  }
};

start();
