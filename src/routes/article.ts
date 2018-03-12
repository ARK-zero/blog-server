/**
 * Created by aman on 3/11/2018.
 */
import express = require('express');
import {Article} from '../models';
const router = express.Router();

function updateArticle(article) {
  Article.update({_id: article._id}, article, (err, raw) => {
    if (err) {
      res.send({update: false})
    } else {
      res.send({update: true})
    }
  })
}

function saveArticle(article) {
  const article = new Article(article);
  article.save().then(() => {
    res.send({save: true});
  }).catch(() => {
    res.send({save: false});
  })
}

router.post('/save', (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.body._id) {
      updateArticle(req.body);
    } else {
      saveArticle(req.body)
    }
  } else {
    res.send({save: false});
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
    throw 'nothing';
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
