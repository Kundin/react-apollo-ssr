const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../webpack/webpack.config');
const render = require('./middlewares/render/index');

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = express();

//
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

  // eslint-disable-next-line no-console
  .listen(port, () => console.log(`Listen on port ${port}!`));
