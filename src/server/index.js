import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'

import { config } from '../Config'
import { schema } from './graphql'
import { render, login, logout, detectDevice } from './middlewares'
import getUserByJWT from './getUserByJWT'

const isDev = process.env.NODE_ENV !== 'production'

// Подключение к MongoDB
mongoose.Promise = global.Promise
mongoose.connect(config.mongoose.uri, config.mongoose.opts)

const app = express()

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const token = req.cookies.jwt || ''
    const user = token ? await getUserByJWT(token) : null

    return { user }
  },
  debug: isDev,
  introspection: isDev,
  playground: isDev,
})

//
if (isDev) {
  const webpackConfig = require('../../webpack.config.js')[0]
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')
  const compiler = webpack(webpackConfig)

  app
    .use(
      webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true,
        writeToDisk(filePath) {
          return /dist\/web\//.test(filePath) || /loadable-stats/.test(filePath)
        },
      }),
    )

    .use(
      webpackHotMiddleware(compiler, {
        log: false,
      }),
    )
}

app
  .disable('x-powered-by')
  .enable('trust proxy')

  // CORS
  .use(cors(config.cors))

// На локальном сервер отдачей файлов занимается NodeJS
if (config.isLocal) {
  app.use('/dist', express.static('./public/dist'))
  app.use('/static', express.static('./public'))
  app.use('/robots.txt', express.static('./public/robots.txt'))
}

// Парсинг данных запроса
app
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

// Подключение сервера Apollo
server.applyMiddleware({ app, path: '/graphql' })

app
  // Определение устройства
  .use(detectDevice)

  // Вход и выход из аккаунта
  .post('/login', login)
  .post('/logout', logout)

  // Рендеринг
  .get('*', render)

  .listen(config.port, () => console.log(`Listen on port ${config.port}!`))
