/**
 * Created by aman on 3/10/2018.
 */
import session = require('express-session');
import connectMongo = require('connect-mongo');
import {database} from '../models';
const MongoStore = connectMongo(session);

export const sessionConfig = {
  secret: 'Secret@!_Baby',
  name: 'cookie',
  store: new MongoStore({mongooseConnection: database}),
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};
