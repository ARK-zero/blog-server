import mongoose = require('mongoose');
import dbConfig = require('../config/mongodb.config');

let dbUrl: string;
if (dbConfig.auth) {
  dbUrl = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host || 'localhost'}:${dbConfig.port || '27017'}/${dbConfig.database || 'test'}`;
} else {
  dbUrl = `mongodb://${dbConfig.host || 'localhost'}:${dbConfig.port || '27017'}/${dbConfig.database || 'test'}`;
}

const options = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000
};

mongoose.connect(dbUrl, options).then(
  () => console.info('Mongodb Connected'),
  (err) => console.error(err.message)
);

const database = mongoose.connection;

export = database;

