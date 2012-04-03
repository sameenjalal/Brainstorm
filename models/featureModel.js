var mongoose = require('mongoose');
var schemas = require('./schemas.js');

module.exports = mongoose.model('Feature', schemas.feature);
