const isLocal = true;
const port = 3000;

export default {
  isLocal,
  port,

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
};
