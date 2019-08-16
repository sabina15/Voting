var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voterSchema = new Schema({
        
        from: String,
        to: String,
        voted: Boolean
        
});

var model = mongoose.model('votes_M', voterSchema);

module.exports = model;

