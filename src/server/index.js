import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import Config from '../Config';
import webpackConfig from '../../webpack.config';
import schema from './graphql';
import { render } from './middlewares';

const isDev = process.env.NODE_ENV !== 'production';
const app = express();

const server = new ApolloServer({
  schema,
  context: async () => {
    return null;
  },
  debug: isDev,
  introspection: isDev,
  playground: isDev,
});

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

  // CORS
  .use(cors(Config.cors));

// На локальном сервер отдачей файлов занимается NodeJS
if (Config.isLocal) {
  app.use('/dist', express.static('./public/dist'));
  app.use('/static', express.static('./public'));
  app.use('/robots.txt', express.static('./public/robots.txt'));
}

// Парсинг данных запроса
app
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json());

// Подключение сервера Apollo
server.applyMiddleware({ app, path: '/graphql' });

app
  // Рендеринг
  .get('*', render)

  // eslint-disable-next-line no-console
  .listen(Config.port, () => console.log(`Listen on port ${Config.port}!`));
