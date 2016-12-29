/**
 * Created by fengzekun on 16/11/23.
 */
var mongoose = require('mongoose');

//用户结构表
module.exports = new mongoose.Schema({
    //用户名
    username : String,
    //密码
    password : String,
    isAdmin : {
        type : Boolean,
        default : false
    }
});