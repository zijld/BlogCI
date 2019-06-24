const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

// Require all Models
require('./models/Blog');
require('./models/User');
// Require passport service for authentication
require('./services/passport');

// Connects to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

// Call express and create the app variable
const app = express();

// Parse all body's to json
app.use(bodyParser.json());
// Adds cookie days * hours * min * sec * milisec
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
// Adds authentication to app
app.use(passport.initialize());
app.use(passport.session());

// Require all routes
require('./routes/blogRoutes')(app);
require('./routes/authRoutes')(app);

// Checks if this app is running in production
if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

// Decides if the app is running local on Port 5000
// Or at takes the port from process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
