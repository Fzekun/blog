/**
 * Created by fengzekun on 16/11/24.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);


