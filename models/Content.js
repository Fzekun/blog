/**
 * Created by fengzekun on 16/11/24.
 */
var mongoose = require('mongoose');
var contentSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentSchema);


