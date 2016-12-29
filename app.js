var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swig = require('swig');


//新加user模型
var User = require("./models/User");


//新加cookie
var Cookies = require('cookies');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html',swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



//设置cookies
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);

    //解析用户登录的用户信息
    req.userInfo = {};

    if( req.cookies.get('userInfo') ){
        try{
            req.userInfo = JSON.parse( req.cookies.get('userInfo') );
            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean( userInfo.isAdmin );
                next();
            });
        }catch(e){ next(); }


    }else{
        next();
    }

});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);

app.use('/admin',require('./routes/admin'));
app.use('/api',require('./routes/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//加载数据库模块
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
      console.log('数据库连接失败');
    }else{
      console.log('数据库连接成功');
    }
});
module.exports = app;
