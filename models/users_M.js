var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        username: String,
        password: String
});

var model = mongoose.model('users_M', userSchema);

module.exports = model;