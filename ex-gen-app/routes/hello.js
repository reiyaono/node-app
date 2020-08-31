const express = require('express');
const router = express.Router();
const http = require('https')
const sqlite3 = require('sqlite3')
const parseString = require('xml2js').parseString
const { check, validationResult } = require('express-validator')

const db = new sqlite3.Database('mydb.sqlite3')

router.get('/show', (req, res, next) => {
  const id = req.query.id
  db.serialize(() => {
    const query = "select * from  mydata where id = ?"
    db.get(query, [id], (err, row) => {
      if (!err) {
        var data = {
          title: 'Hello/show',
          content: 'id =' + id + 'のレコード:',
          mydata: row
        }
        res.render('hello/show', data)
      }
    })
  })
});

/* GET home page. */
router.get('/', (req, res, next) => {
  db.serialize(() => {
    db.all("select * from mydata", (err, rows) => {
      if (!err) {
        var data = {
          title: 'Hello!',
          content: rows
        }
        res.render('hello/index', data)
      }
    })
  })
  // const name = req.query.name
  // const mail = req.query.mail
  // const opt = {
  //   host: 'news.google.com',
  //   port: 443,
  //   path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja'
  // }
  // http.get(opt, (res2) => {
  //   var body = ''
  //   res2.on('data', (data) => {
  //     body += data
  //   })
  //   res2.on('end', () => {
  //     parseString(body.trim(), (err, result) => {
  //       var data = {
  //         title: 'Google News',
  //         content: result.rss.channel[0].item
  //       }
  //       res.render('hello', data)
  //     })
  //   })
  // })
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

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Hello!',
    content: '新しいレコードを入力',
    form: { name: '', mail: '', age: 0 }
  }
  res.render('hello/add', data);
});

router.post('/add', [
  check('name', 'NAMEは必ず入力してください。').notEmpty(),
  check('mail', 'MAILはメールアドレスを記入してください').isEmail(),
  check('age', 'AGEは年齢(整数)を入力してください。').isInt(),
  check('age', 'AGE はゼロ以上120以下で入力してください。').custom(value => {
    return value >= 0 & value <= 120
  })
 ], (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    var result = '<ul class="text-danger">'
    var result_arr = errors.array()
    for(var n in result_arr) {
      result += '<li>' + result_arr[n].msg + '</li>'
    }
    result += '</ul>'
    var data = {
      title: 'Hello/Add',
      content: result,
      form: req.body
    }
    res.render('hello/add', data)
  } else {
    const nm = req.body.name
    const ml = req.body.mail
    const ag = req.body.age
    db.serialize(() => {
      db.run("INSERT INTO mydata (name, mail, age) values (?, ?, ?)", nm, ml, ag)
    })
    res.redirect('/hello')
  }
});

router.get('/add', (req, res, next) => {
  const data = {
    title: 'Hello!',
    content: '新しいレコードを入力'
  }
  res.render('hello/add', data);
});

router.get('/edit', (req, res, next) => {
  const id = req.query.id
  db.serialize(() => {
    const query = "select * from  mydata where id = ?"
    db.get(query, [id], (err, row) => {
      if (!err) {
        var data = {
          title: 'Hello/edit',
          content: 'id =' + id + 'のレコードを編集',
          mydata: row
        }
        res.render('hello/edit', data)
      }
    })
  })
});

router.post('/edit', (req, res, next) => {
  const id = req.body.id
  const nm = req.body.name
  const ml = req.body.mail
  const ag = req.body.age
  db.serialize(() => {
    const query = "UPDATE mydata set name = >, mail = ?, age = ? WHERE id = ?"
    db.run(query, nm, ml, ag, id)
  })
  res.redirect('/hello')
});

router.get('/delete', (req, res, next) => {
  const id = req.query.id
  db.serialize(() => {
    const query = "select * from  mydata where id = ?"
  })
  db.get(query, [id], (err, row) => {
    if (!err) {
      var data = {
        title: 'Hello/Delete',
        content: 'id =' + id + 'のレコードを編集',
        mydata: row
      }
      res.render('hello/delete', data)
    }
  })
});

router.post('/delete', (req, res, next) => {
  const id = req.query.id
  db.serialize(() => {
    const query = "DELETE from mydata WHERE id = ?"
    db.run(query, id)
  })
  res.redirect('/hello')
});

router.get('/find', (req, res, next) => {
  db.serialize(() => {
    db.all("select * from mydata", (err, rows) => {
      if (!err) {
        var data = {
          title: 'Hello/find',
          find: '',
          content: '検索条件を入力してください',
          mydata: rows
        }
      }
      res.render('hello/find', data)
    })
  })
});

router.post('/find', (req, res, next) => {
  var find = req.body.find
  db.serialize(() => {
    const query = "select * from  mydata where "
    db.all(query + find, (err, rows) => {
      console.log('-----------')
      console.log(query + find)
      console.log(err)
      if (!err) {
        var data = {
          title: 'Hello/find',
          find: find,
          content: '検索条件' + find,
          mydata: rows
        }
      }
      res.render('hello/find', data)
    })
  })
});

module.exports = router;
