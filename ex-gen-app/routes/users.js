const express = require('express');
const router = express.Router();
const db =  require('../models/index')
const { Op } = require('sequelize')

/* GET users listing. */
router.get('/', (req, res, next) => {
  db.User.findAll().then(users => {
    var data = {
      title: 'User/Index',
      content: users
    }
    res.render('users/index', data)
  })
});
// router.get('/', (req, res, next) => {
//   const id = req.query.id
//   db.User.findAll(
//     { where: {
//       id: { [Op.lte]:id }
//     } }
//   ).then(users => {
//     var data = {
//       title: 'User/Index',
//       content: users
//     }
//     res.render('users/index', data)
//   })
// });
// router.get('/', (req, res, next) => {
//   const id = req.query.id
//   const name = req.query.name
//   db.User.findAll(
//     { where: {
//       name: { [Op.like]: '%' + name + '%' }
//     } }
//   ).then(users => {
//     var data = {
//       title: 'User/Index',
//       content: users
//     }
//     res.render('users/index', data)
//   })
// });
// router.get('/', (req, res, next) => {
//   const id = req.query.id
//   const name = req.query.name
//   const mail = req.query.mail
//   const min = req.query.min * 1
//   const max = req.query.max * 1
//   db.User.findAll(
//     { where: {
//       // age: { [Op.gte]: min, [Op.lte]: max }
//       [Op.or]: [
//         { name: { [Op.like]: '%' + name + '%' } },
//         { mail: { [Op.like]: '%' + mail + '%' } }
//       ]
//     } }
//   ).then(users => {
//     var data = {
//       title: 'User/Index',
//       content: users
//     }
//     res.render('users/index', data)
//   })
// });

router.get('/add', (req, res, next) => {
  const data = {
    title: 'User/add',
    form: new db.User(),
    err: null
  }
  res.render('users/add', data)
});

router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  }
  db.sequelize.sync()
    .then(() => db.User.create(form))
    .then(usr => {
      res.redirect('/users')
    })
    .catch(err => {
      const data = {
        title: 'User/Add',
        form: form,
        err: err
      }
      res.render('users/add', data)
    })
});

router.get('/edit', (req, res, next) => {
  db.User.findByPk(req.query.id)
    .then(usr => {
      const data = {
        title: 'Users/Edit',
        form: usr
      }
      res.render('users/edit', data)
    })
});

router.post('/edit', (req, res, next) => {
  db.User.findByPk(req.query.id)
    .then(usr => {
      usr.name = req.body.name,
      usr.pass = req.body.pass,
      usr.mail = req.body.mail,
      usr.age = req.body.age
      usr.save().then(() => res.redirect('/users'))
    })
});

router.get('/delete', (req, res, next) => {
  db.User.findByPk(req.query.id)
    .then(usr => {
      var data = {
        title: 'Users/Delete',
        form: usr
      }
      res.render('users/delete', data)
    })
})

router.post('/delete', (req, res, next) => {
  db.sequelize.sync()
  .then(() => db.User.destroy({
    where: {id: req.body.id }
  }))
  .then(usr => {
    res.redirect('/users')
  })
})

router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力してください'
  }
  res.render('users/login', data)
})

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass
    }
  }).then(user => {
    if (user != null) {
      req.session.login = user;
      let back = req.session.back || '/';
      res.redirect(back)
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力してください'
      }
      res.render('users/login', data)
    }
  })
})
module.exports = router;
