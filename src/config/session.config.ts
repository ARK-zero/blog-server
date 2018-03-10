/**
 * Created by aman on 3/10/2018.
 */
import session = require('express-session');
import connect_mongo = require('connect-mongo');
import database = require('../models/database');
const MongoStore = connect_mongo(session);

export = {
  secret: 'Secret@!_Baby',
  name: 'cookie',
  store: new MongoStore({mongooseConnection: database}),
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60
  }
};
