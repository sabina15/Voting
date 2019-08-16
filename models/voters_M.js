var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voterSchema = new Schema({
        formNo: Number,
        fullName: String,
        DOB: Date,
        sex: String,
        rollNo: String,
        batch:String,
        voted: Boolean,
        ethAddress: String,
        pkHash: String,
        tokenTransferred: Boolean
});

var model = mongoose.model('voters_M', voterSchema);

module.exports = model;

