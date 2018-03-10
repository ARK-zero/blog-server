import express = require('express');
import path = require('path');
import crypto = require('crypto');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import passport = require('passport');
import LocalStrategy = require('passport-local');
import session = require('express-session');

import sessionConfig = require('./config/session.config');
import encryptionConfig = require('./config/password.config');
import User = require('./models/user');
import user = require('./routes/user');

const app = express();

// views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  User['findByName'](username, (err, user) => {
    const hash = crypto.createHash(encryptionConfig.hash);
    const verification = hash.update(encryptionConfig.salt + password).digest('hex');
    if (user) {
      if (verification === user.password) {
        return done(null, user);
      } else {
        return done(null, false)
      }
    } else {
      return done(null, false)
    }

  })
}));
passport.serializeUser(User['serializeUser']());
passport.deserializeUser(User['deserializeUser']());

// routes config
app.use('/user', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

export = app;
