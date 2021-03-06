import express = require('express');
import path = require('path');
import crypto = require('crypto');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import passport = require('passport');
import LocalStrategy = require('passport-local');
import session = require('express-session');

import {sessionConfig, passwordConfig} from './config';

import {User} from './models';
import {user, article} from './routes';

const app = express();

// views engine setup
// app.set('views', path.resolve(__dirname, 'views'));
// app.set('views engine', 'jade');

// uncomment after placing your favicon in /static
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());


const options = {
  root: __dirname + '/static/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.sendfile('index.html', options);
  } else {
    next();
  }
});

// passport config
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, verified) => {
  User['findByName'](username, (err, user) => {
    if (err) {return verified(err, false)}
    const hash = crypto.createHash(passwordConfig.hash);
    const verification = hash.update(passwordConfig.salt + password).digest('hex');
    if (user) {
      if (verification === user.password) {
        return verified(null, user);
      } else {
        return verified(null, false)
      }
    } else {
      return verified(null, false)
    }
  })
}));
passport.serializeUser(User['serializeUser']());
passport.deserializeUser(User['deserializeUser']());

// routes config
app.use('/user', user);
app.use('/article', article);

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
