import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../builder';
import { render } from './middlewares';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = express();

if (isDev) {
  const compiler = webpack(webpackConfig);

  app
    .use(
      webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: '/dist/web',
        serverSideRender: true,
        writeToDisk(filePath) {
          return filePath.includes('dist/node/') || filePath.includes('loadable-stats');
        },
      }),
    )

    .use(
      webpackHotMiddleware(compiler, {
        log: false,
      }),
    );
}

app
  .disable('x-powered-by')
  .enable('trust proxy')
  .use(compression())

  .use('/dist', express.static('./dist'))
  .use('/static', express.static('./static'))
  .use('/robots.txt', express.static('./static/robots.txt'))

  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  .get('*', render)

  .listen(port, () => console.log(`Listen on port ${port}!`));
