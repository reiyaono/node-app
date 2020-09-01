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
    title: 'User/add'
  }
  res.render('users/add', data)
});

router.post('/add', (req, res, next) => {
  db.sequelize.sync()
    .then(() => db.User.create({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    }))
    .then(usr => {
      res.redirect('/users')
    })
});

module.exports = router;
