var express = require('express');
var router = express.Router();
var model = require('../model')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/regist', function (req, res, next) {
  var data = {
    useremail: req.body.useremail,
    password: req.body.password,
    identify: req.body.gridRadios
  }
  model.connect(function (db) {
    db.collection('users').insertOne(data, function (err, ret) {
      if (err) {
        console.log('注册失败')
        res.redirect('/regist')
      } else {
        res.redirect('/login')
      }
    })
  })
})

//登录接口
router.post('/login', function (req, res, next) {
  var data = {
    useremail: req.body.useremail,
    password: req.body.password,
    identify: req.body.gridRadios
  }
  model.connect(function (db) {
    db.collection('users').find(data).toArray(function (err, docs) {
      if (err) {
        res.redirect('/login')
      } else {
        if (docs.length > 0) {
          //登录成功，进行session会话储存
          req.session.useremail = data.useremail
          res.redirect('/')
        } else {
          res.redirect('/login')
        }
      }
    })
  })
})

//退出登录
router.get('/logout',function(req,res,next){
  req.session.useremail=null
  res.redirect('/login')
})
module.exports = router;
