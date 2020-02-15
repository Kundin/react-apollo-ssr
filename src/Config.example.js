const isLocal = true;
const port = 3000;

const Config = {
  isLocal,
  port,

  // Mongoose
  mongoose: {
    uri: 'mongodb://localhost:27017/test',
    opts: {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  },

  // Apollo
  apollo: {
    uri: `http://localhost:${port}/graphql`,
  },

  // CORS
  cors: {
    credentials: true,
    origin: [`http://localhost:${port}`],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Cookie', 'Content-Type', 'Authorization'],
  },

  // JSON Web Token
  jwt: {
    secret: 'REPLACE_RANDOM_STRING',
  },
};

export default Config;
