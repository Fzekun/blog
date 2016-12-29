/**
 * Created by fengzekun on 16/11/23.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req,res,next){
    if( !req.userInfo.isAdmin ){
        res.send('不是管理员用户');
        return;
    }
    next();
});

router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo : req.userInfo
    });
});
//用户管理
//从数据库当中读取所有的用户数据
/**
 * limit(Number) : 限制获取的数据条数
 *
 * skip(2) : 忽略数据的条数
 *
 * 每页2条
 *
 *
 */

router.get('/user',function (req,res,next) {

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var maxNumber = 0;
    User.count().then(function(count){

        maxNumber = Math.ceil( count / limit );
        //取值不能超过最后一页
        page = Math.min( page, maxNumber );

        //取值不能小于1
        page = Math.max( page, 1 );
        var skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user',{
                userInfo : req.userInfo,
                users : users,
                page : page,
                count : count,
                pages : maxNumber,
                limit : limit
            });
        });
    });
});


/**
 *分类首页
 *
 */
router.get('/category',function (req,res,next) {
    var page = Number( req.query.page || 1 );
    var limit = 10;
    var maxNumber = 0;
    Category.count().then(function(count){

        maxNumber = Math.ceil( count / limit );
        //取值不能超过最后一页
        page = Math.min( page, maxNumber );

        //取值不能小于1
        page = Math.max( page, 1 );
        var skip = (page-1)*limit;

        /**
         *  1升序 从小到大
         *  -1降序 从大到小
         *
         */

        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categorys){
            res.render('admin/category',{
                userInfo : req.userInfo,
                categorys : categorys,
                page : page,
                count : count,
                pages : maxNumber,
                limit : limit
            });
        });
    });
});

/**
 *添加分类
 *
 */
router.get('/category/add',function (req,res,next) {
    res.render('admin/category_add',{
        userInfo : req.userInfo
    });
});

/**
 *分类保存
 *
 */
router.post('/category/add',function (req,res) {
    var name = req.body.name || '';
    if( name  == '' ){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '分类名称不能为空'
        });
        return;
    }
    //数据库中是否存在分类名称
    Category.findOne({
        name : name
    }).then(function(rs){
        if( rs ){
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '分类已经存在'
            });
            return Promise.reject();
        }else{
            return new Category({
                name : name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '分类添加成功',
            url : '/admin/category'
        });
    })
});


/**
 *分类修改
 *
 */
router.get('/category/edit',function (req,res) {
    var id = req.query.id || '';
    //获取要修改的分类信息，表单形式展现
    Category.findOne({
        _id : id
    }).then(function(category){
        if( !category ){
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo : req.userInfo,
                category : category
            });
        }
    });
});

/**
 *分类修改保存
 *
 */
router.post('/category/edit',function (req,res) {
    var id = req.query.id || '';
    var name = req.body.name || '';

    //获取要修改的分类信息，表单形式展现
    Category.findOne({
        _id : id
    }).then(function(category){
        if( !category ){
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '分类信息不存在'
            });
            return Promise.reject();
        }else{
            //没有修改分类名称
            if( name == category.name ){
                res.render('admin/success',{
                    userInfo : req.userInfo,
                    message : '修改成功',
                    url : '/admin/category'
                });
                return Promise.reject();
            }else{
                return Category.findOne({
                    _id : { $ne : id },
                    name : name
                })
            }

        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
           return Category.update({
                _id : id 
            },{
                name : name
            })
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '修改成功',
            url : '/admin/category'
        });
    });
});

/**
 *分类删除
 *
 */
router.get('/category/delete',function (req,res) {
    var id = req.query.id || '';
    Category.remove({
        _id : id
    }).then(function(){
       res.render('admin/success',{
          userInfo : req.userInfo,
          message : '删除成功',
          url : '/admin/category'
       });
    });
});


/**
 *内容首页
 *
 */
router.get('/content',function (req,res) {
    var page = Number( req.query.page || 1 );
    var limit = 10;
    var maxNumber = 0;

    Content.count().then(function(count){

        maxNumber = Math.ceil( count / limit );
        //取值不能超过最后一页
        page = Math.min( page, maxNumber );

        //取值不能小于1
        page = Math.max( page, 1 );
        var skip = (page-1)*limit;

        /**
         *  1升序 从小到大
         *  -1降序 从大到小
         *
         */

        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            res.render('admin/content',{ 
                userInfo : req.userInfo,
                contents : contents,
                page : page,
                count : count,
                pages : maxNumber,
                limit : limit
            });
        });
    });
});
/**
 *内容添加页面
 *
 */
router.get('/content/add',function(req,res) {
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo : req.userInfo,
            categories : categories
        });
    })
});

/**
 *内容保存 
 *
 */
router.post('/content/add',function(req,res) {
    var category = req.body.category;
    var title = req.body.title;
    var dec = req.body.dec;
    var content = req.body.content;
    if( category ==  ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '内容分类不能为空'
        });
        return;
    }
    if( title ==  ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '内容标题不能为空'
        });
        return;
    }
    //保存到数据库
    new Content({
        category :  category,
        title : title,
        dec : dec,
        user : req.userInfo._id.toString(),
        content : content

    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '内容保存成功',
            url : '/admin/content'
        });
    });
});

/**
 *内容编辑
 *
 */
router.get('/content/edit',function(req,res) {
    var id = req.query.id || '';
    var categories = [];

    Category.find().sort({_id:1}).then(function(rs){
        categories = rs;
        return Content.findOne({
            _id : id
        }).populate('category');
    }).then(function(content){
        if( !content ){
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '指定内容不存在'
            })
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo : req.userInfo,
                content : content,
                categories : categories
            })
        }
    });

});


/**
 *保存内容编辑
 *
 */
router.post('/content/edit',function(req,res) {

    var body = req.body;
    var id = req.query.id || '';

    if( body.category ==  ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '内容分类不能为空'
        });
        return;
    }
    if( body.title ==  ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '内容标题不能为空'
        });
        return;
    }
    Content.update({
        _id : id
    },{
        category :  body.category,
        title : body.title,
        dec : body.dec,
        content : body.content
    }).then(function(content){
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '内容保存成功',
            url : '/admin/content'
        });
    });
});


/**
 *内容删除
 *
 */
router.get('/content/delete',function(req,res) {
    var id = req.query.id || '';
    Content.remove({
        _id : id
    }).then(function(){
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '内容删除成功',
            url : '/admin/content'
        });
    });
});

module.exports = router;
