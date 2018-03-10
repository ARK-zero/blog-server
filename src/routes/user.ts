/**
 * Created by aman on 3/9/2018.
 */
import express = require('express');
import passport = require('passport');
import crypto = require('crypto');
import User = require('../models/user');
const router = express.Router();

router.get('/login', (req, res, next) => {
  res.render('login.jade');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.send({logout: true})
});

router.get('/isLogin', (req, res, next) => {
  res.send({isLogin: req.isAuthenticated()})
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({login: true});
});

router.get('/register', (req, res, next) => {
  res.render('register.jade')
});


router.post('/register', (req, res, next) => {
  if (req.body.username && req.body.password) {
    User.findOne({username: req.body.username}, (err, user) => {
      if (!user) {
        const salt = 'cyclelove';
        const ssl3_md5 = crypto.createHash('ssl3-md5');
        const encryption = ssl3_md5.update(salt + req.body.password).digest('hex');
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

export = router;
