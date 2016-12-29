/**
 * Created by fengzekun on 16/11/23.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

//返回格式
var responseData;

router.use(function(req,res,next){ 
    responseData =   {
        code : 0,
        message : ''
    }
    next();
});

// router.get('/user',function (req,res,next) {
//     res.send('api --- user');
// });

/**
 * 用户注册：
 *          注册逻辑
 *          1.用户名不能为空
 *          2.密码不能为空
 *          3.2次输入密码必须一致
 *          4.用户名是否已经被注册（查询数据库）
 *
 *
 *
 */
router.post('/register',function (req,res,next) {
    var body = req.body;
    var username = body.username;
    var password = body.password;
    var repassword = body.repassword;

    //用户名不能为空
    if( username == '' ){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if( password == '' ){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入密码必须一致
    if( repassword !== password ){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username : username
    }).then(function(userInfo){
       if( userInfo ){
           responseData.code = 4;
           responseData.message = '用户名已经被注册了';
           res.json(responseData);
           return;
       }
       //保存用户到数据库
       var user = new User({
           username : username,
           password : password
       });
       return user.save();
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

//登录
router.post('/login',function(req,res,next){
    var body = req.body;
    var username = body.username;
    var password = body.password;

    if( username == '' || password == '' ){
        responseData.code = 1;
        responseData.message = '用户名密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同用户名和密码的记录是否存在，如果存在登录成功
    User.findOne({
        username : username,
        password : password
    }).then(function(userInfo){
        if( !userInfo ){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.userInfo = {
            username :  userInfo.username,
            _id : userInfo._id
        };
        req.cookies.set('userInfo',JSON.stringify({
            username :  userInfo.username,
            _id : userInfo._id
        }));
        responseData.message = '登录成功';
        res.json(responseData);
    });

});


//退出登录
router.get('/loginout',function(req,res,next){
    req.cookies.set('userInfo',null);
    responseData.code = 0;
    responseData.message = '退出成功';
    res.json(responseData);
});

module.exports = router;