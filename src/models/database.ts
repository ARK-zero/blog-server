import mongoose = require('mongoose');
import {databaseConfig} from '../config';

let dbUrl: string;
if (databaseConfig.auth) {
  dbUrl = `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host || 'localhost'}:${databaseConfig.port || '27017'}/${databaseConfig.database || 'test'}`;
} else {
  dbUrl = `mongodb://${databaseConfig.host || 'localhost'}:${databaseConfig.port || '27017'}/${databaseConfig.database || 'test'}`;
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

export {database};

