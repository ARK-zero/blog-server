/**
 * Created by aman on 3/9/2018.
 */
import express = require('express');
import passport = require('passport');
import crypto = require('crypto');
import {Validator} from './service/validator';

import {User} from '../models';
import {passwordConfig} from '../config';

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.send({login: false});
    }
    req.login(user, (err) => {
      if (err) {
        return res.send({login: false});
      }
      return res.send({login: true});
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.send({logout: true})
});

router.post('/register', (req, res, next) => {
  if (Validator.validateUsername(req.body.username) &&
    Validator.validatePassword(req.body.password) && (req.body.inviteCode === passwordConfig.inviteCode)) {
    User.findOne({username: req.body.username}, (err, user) => {
      if (err) throw err.message;
      if (!user) {
        const hash = crypto.createHash(passwordConfig.hash);
        const encryption = hash.update(passwordConfig.salt + req.body.password).digest('hex');
        const registerUser = new User({username: req.body.username, password: encryption});
        registerUser.save().then(() => {
          res.send({register: true})
        }).catch(() => {
          res.send({register: false})
        });
      } else {
        res.send({register: false})
      }
    })
  } else {
    res.send({register: false})
  }
});

router.post('/hasUser', (req, res, next) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (user) {
      res.send({hasUser: req.body.username})
    } else {
      res.send({hasUser: false})
    }
  })
});

router.post('/getUserList', (req, res, next) => {
  User.aggregate([
    {$sort: {'createdAt': -1}},
    {$group: {_id: '$username'}}
  ]).exec((err, result) => {
    if (err) {throw err.message}
    res.send(result);
  })
});

router.post('/checkStatus', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send({
      isLogin: true,
      username: req.user.username
    })
  } else {
    res.send({login: false})
  }
});

export {router as user};
