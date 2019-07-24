// module.exports = {
//   googleClientID:
//     '244616794542-eb74she2775j30lggeujohra4u4pdnsf.apps.googleusercontent.com',
//   googleClientSecret: 'zahfBpInbspRiWwRJw9dfmCz',
//   mongoURI: 'mongodb://127.0.0.1:27017/blog_ci',
//   cookieKey: 'greo4n3g83hu432toug',
//   redisUrl: 'redis://127.0.0.1:6379'
// };

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  redisUrl: process.env.REDIS_URL
};
