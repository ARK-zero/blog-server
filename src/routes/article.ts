/**
 * Created by aman on 3/11/2018.
 */
import express = require('express');
import {Article} from '../models';
const router = express.Router();

import * as _ from 'lodash'

const jsdom = require('jsdom');
const window = new jsdom.JSDOM().window;
const $ = require('jquery')(window);

router.post('/save', (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.body._id) {
      updateArticle(req.body, res);
    } else {
      saveArticle(req.body, res)
    }
  } else {
    res.send();
  }

  function updateArticle(article, res) {
    Article.update({_id: article._id}, article, (err, raw) => {
      if (err) {
        throw err.message;
      } else {
        res.send({_id: article._id})
      }
    })
  }

  function saveArticle(article, res) {
    const newArticle = new Article(article);
    newArticle.save().then((doc) => {
      res.send({_id: doc._id});
    }).catch((err) => {
      throw err.message;
    })
  }
});

router.post('/articleList', (req, res, next) => {
  if (req.body.author) {
    Article.aggregate([
      {$match: {author: req.body.author}},
      {
        $group: {
          _id: '$classification',
          children: {
            $push: {
              createdAt: '$createdAt',
              _id: '$title',
              routerLink: '$_id'
            }
          }
        }
      }
    ]).exec((err, result) => {
      if (err) {
        throw err.message
      } else {
        res.send(result)
      }
    })
  } else {
    res.send({articleList: false})
  }
});

router.post('/getArticle', (req, res, next) => {
  if (req.body.articleId) {
    Article.findOne({_id: req.body.articleId}, (err, doc) => {
      if (err) throw err.message;
      res.send(doc);
    })
  } else {
    res.send();
  }
});

router.post('/delete', (req, res, next) => {
  if (req.isAuthenticated() && req.body.articleId) {
    Article.findOne({_id: req.body.articleId}, (err, doc) => {
      if (err) throw err.message;
      if (req.user.username === doc['author']) {
        Article.remove({_id: req.body.articleId}, (err) => {
          if (err) {
            res.send({'delete': err.message})
          }
          res.send({'delete': true})
        })
      }
    })
  } else {
    res.send({})
  }
});

router.post('/getClassification', (req, res, next) => {
  if (req.isAuthenticated()) {
    Article.aggregate([
      {$match: {author: req.body.author}},
      {$group: {_id: '$classification'}}
    ]).exec((err, result) => {
      if (err) {
        throw err.message
      } else {
        res.send(result)
      }
    })
  } else {
    res.send();
  }
});

router.post('/getBreviary', (req, res, next) => {
  getBreviaries(req.body);

  function getBreviaries(queryParams) {
    let index = queryParams['index'] || 1;
    let number = queryParams['number'] || 20;
    let author = queryParams['author'] || null;
    if (!author) {
      queryBrev(index, number);
    } else {
      queryBrevByAuthor(index, number, author);
    }
  }

  function queryBrev(index, number) {
    Article.aggregate([
      {$sort: {'createdAt': -1}},
      {$skip: (index - 1) * number},
      {$limit: number}
    ]).exec((err, result) => {
      if (err) throw err.message;
      let queries = result;
      for (let item of queries) {
        if ($(item.content).find('img')[0]) {
          const src = $(item.content).find('img')[0].src;
          Object.assign(item, {src: src})
        }
        item.content = $(item.content).text().substring(0, 120) + '...';
      }
      res.send(queries);
    })
  }

  function queryBrevByAuthor(index, number, author) {
    Article.aggregate([
      {$match: {author: author}},
      {$sort: {'createdAt': -1}},
      {$skip: (index - 1) * number},
      {$limit: number}
    ]).exec((err, result) => {
      if (err) throw err.message;
      let queries = result;
      for (let item of queries) {
        if ($(item.content).find('img')[0]) {
          const src = $(item.content).find('img')[0].src;
          Object.assign(item, {src: src})
        }
        item.content = $(item.content).text().substring(0, 120).trim() + '...';
      }
      res.send(queries);
    })
  }

});


router.post('/insert', (req, res, next) => {
  for (let i = 0; i < 15; i++) {
    let article = new Article({
      title: Math.random().toString(),
      author: 'aman',
      classification: 'angular',
      content: Math.random().toString()
    });
    article.save();
  }

  res.send('hello')
});


export {router as article};
