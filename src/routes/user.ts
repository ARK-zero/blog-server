/**
 * Created by aman on 3/9/2018.
 */
import express = require('express');
import passport = require('passport');
import crypto = require('crypto');
import User = require('../models/user');
import encryptionConfig = require('../config/password.config');
const router = express.Router();

router.get('/login', (req, res, next) => {
  res.render('login.jade');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({login: true});
});

router.get('/isLogin', (req, res, next) => {
  res.send({isLogin: req.isAuthenticated()})
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.send({logout: true})
});

router.get('/register', (req, res, next) => {
  res.render('register.jade')
});

router.post('/register', (req, res, next) => {
  if (req.body.username && req.body.password) {
    User.findOne({username: req.body.username}, (err, user) => {
      if (!user) {
        const hash = crypto.createHash(encryptionConfig.hash);
        const encryption = hash.update(encryptionConfig.salt + req.body.password).digest('hex');
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
      res.send({hasUser: true})
    } else {
      res.send({hasUser: false})
    }
  })
});

export = router;
