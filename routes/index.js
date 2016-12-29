var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content'); 

var config;

router.use(function(req,res,next){
    config = {
        userInfo : req.userInfo,
        categorys : []
    };
    Category.find().then(function(categorys){
        config.categorys = categorys;
        next();
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    config.category = req.query.category || '';
    config.page = Number( req.query.page || 1 );
    config.count = 0;
    config.limit = 4;
    config.maxNumber = 0;

    var where  = {};
    if( config.category ){
        where.category = config.category;
    }

  // request('http://www.cheyipai.com/',function(error,response,body){
  //   if (!error && response.statusCode == 200) {
  //     var $ = cheerio.load(body);
  //
  //     var html = $('.carType').html();
  //     res.send(html);
  //   }
  // });

    //读取数据库所有分类信息
    Content.where(where).find().then(function(count){
        //console.log(count);
        config.count = count;
        config.maxNumber = Math.ceil( config.count.length / config.limit );

        //取值不能超过最后一页
        config.page = Math.min( config.page, config.maxNumber );

        //取值不能小于1
        config.page = Math.max( config.page, 1 );
        var skip = (config.page-1)*config.limit;

        return Content.where(where).find().sort({addTime:-1}).limit(config.limit).skip(skip).populate(['category','user']);
    }).then(function(contents){
        config.contents = contents;
        res.render('index', config);
    })
});

router.get('/view',function(req,res){
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id : contentId
    }).then(function(content){
        config.content = content;
        content.views++;
        content.save();
        res.render('view',config);
    });

});
module.exports = router;
