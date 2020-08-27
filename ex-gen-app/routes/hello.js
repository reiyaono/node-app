var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const name = req.query.name
  const mail = req.query.mail
  var msg = '*何か書いてください'
  if (req.session.message != undefined) {
    msg = "Last Message:" + req.session.message
  }
  const data = {
    title: 'Hello!',
    content: msg
  }
  res.render('hello', data);
});

router.get('/en', (req, res, next) => {
  const data = {
    title: 'Hello!',
    content: 'This is sample contents'
  }
  res.render('hello', data);
});

router.post('/post', (req, res, next) => {
  const msg = req.body['message']
  req.session.message = msg;
  const data = {
    title: 'Hello!',
    content: 'Last Message: ' + req.session.message
  }
  res.render('hello', data);
});

module.exports = router;
