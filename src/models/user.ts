/**
 * Created by aman on 3/10/2018.
 */
import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String
}, {
  versionKey: false,
  collection: 'users'
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.static('findByName', function(username, callback) {
  return this.findOne({username: username}, callback);
});

const User = mongoose.model('user', UserSchema);

export = User;
