var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');
const e = require('express');
const { use } = require('./users');
/* GET home page. */
router.get('/', function (req, res, next) {
  var useremail = req.session.useremail
  var page = req.query.page || 1
  var data = {
    total: 0,//总共有多少页
    curPage: 1,
    list: []//当前页的文章列表
  }
  var pageSize = 5//每次请求的数据量
  model.connect(function (db) {
    //1-查询所有文章
    db.collection('articles').find().toArray(function (err, docs) {
      console.log('文章列表', docs)
      data.total = Math.ceil(docs.length / pageSize);
      // docs.map(function (ele, index) {
      //   ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
      // })

      //2-查询当前页的文章列表
      model.connect(function (db) {
        //sort({ _id: -1 })为倒序查询   limit（）为限制数量  skip（）为跳过多少数量
        db.collection('articles').find().sort({ _id: -1 }).limit(pageSize).skip((page - 1) * pageSize).toArray(function (err, docs2) {
          docs2.map(function (ele, index) {
            ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')//时间处理
          })
          data.list = docs2
          res.render('index', { useremail: useremail, data: data });
        })
      })
      // data.list = docs
      // res.render('index', { useremail: useremail, data: data });
    })
  })

});

//渲染注册页
router.get('/regist', function (req, res, next) {
  res.render('regist', {})
})

//渲染登录页
router.get('/login', function (req, res, next) {
  res.render('login', {})
})

//渲染写文章页面  /编辑文章页面
router.get('/write', function (req, res, next) {
  var useremail = req.session.useremail
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title: '',
    content:''
  }
  if (id) {
    //编辑
    model.connect(function (db) {
      db.collection('articles').findOne({ id: id }, function (err, docs) {
        if (err) {
          console.log('查询失败')
        } else {
          item = docs
          item['page'] = page
          res.render("write", { useremail: useremail ,item:item})
        }
      })
    })
  } else {
    //新增
    res.render("write", { useremail: useremail ,item:item})
  }
  // res.render('write', { useremail: useremail })
})

//渲染详情页面
router.get('/detail', function (req, res, next) {
  var id=parseInt(req.query.id)
  var useremail=req.session.useremail||""
  model.connect(function(db){
    db.collection('articles').findOne({id:id},function(err,docs){
      if(err){
        console.log('查询失败',err)
      }else{
        var item=docs
        item['time']=moment(item.id).format('YYYY-MM-DD HH:mm:ss')
        res.render('detail',{item:item,useremail:useremail})
      }
    })
  })
  // res.render('detail', {})
})

module.exports = router;
