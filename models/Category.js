/**
 * Created by fengzekun on 16/11/24.
 */
var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Cotegory',categoriesSchema);


