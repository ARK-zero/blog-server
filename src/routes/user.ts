/**
 * Created by aman on 3/9/2018.
 */
import express = require('express');
import passport = require('passport');
import crypto = require('crypto');
import User = require('../models/user');
import passwordConfig = require('../config/password.config');
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
  console.log(req.body.inviteCode);
  if (req.body.username && req.body.password && (req.body.inviteCode === passwordConfig.inviteCode)) {
    User.findOne({username: req.body.username}, (err, user) => {
      if (!user) {
        const hash = crypto.createHash(passwordConfig.hash);
        const encryption = hash.update(passwordConfig.salt + req.body.password).digest('hex');
        const registerUser = new User({username: req.body.username, password: encryption});
        registerUser.save();
        res.send({register: true})
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

export = router;
