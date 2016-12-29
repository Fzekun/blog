/**
 * Created by fengzekun on 16/11/23.
 */
var mongoose = require('mongoose');

//内容结构表
module.exports = new mongoose.Schema({
    //关联字段 - 分类ID
    category : {
        type : mongoose.Schema.Types.ObjectId,
        //引用
        ref : 'Cotegory'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    addTime : {
        type : Date,
        default : new Date()
    },
    views : {
        type : Number,
        default : 0
    },
    //标题
    title : String,
    //标题
    dec : {
        type : String,
        default : ''
    },
    content : {
        type : String,
        default : ''
    }
});