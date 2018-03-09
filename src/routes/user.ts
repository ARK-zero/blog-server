/**
 * Created by aman on 3/9/2018.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('hello world');
});

export default router;
