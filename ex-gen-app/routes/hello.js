const express = require('express');
const router = express.Router();
const http = require('https')
const parseString = require('xml2js').parseString


/* GET home page. */
router.get('/', (req, res, next) => {
  const name = req.query.name
  const mail = req.query.mail
  const opt = {
    host: 'news.google.com',
    port: 443,
    path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja'
  }
  http.get(opt, (res2) => {
    var body = ''
    res2.on('data', (data) => {
      body += data
    })
    res2.on('end', () => {
      parseString(body.trim(), (err, result) => {
        var data = {
          title: 'Google News',
          content: result.rss.channel[0].item
        }
        res.render('hello', data)
      })
    })
  })
  // var msg = '*何か書いてください'
  // if (req.session.message != undefined) {
  //   msg = "Last Message:" + req.session.message
  // }
  // const data = {
  //   title: 'Hello!',
  //   content: msg
  // }
  // res.render('hello', data);
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
