/**
 * Created by aman on 3/11/2018.
 */
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: String,
  author: String,
  classification: String,
  content: String
}, {
  versionKey: false,
  collection: 'articles',
  timestamps: true
});

const Article = mongoose.model('article', ArticleSchema);

export {Article};
