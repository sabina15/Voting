var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var candidateSchema=new Schema({
    
    
    candidateName: String, //
    rollNo: String, //
    batch: String,
    candidateImg: String,
    ethAddress: String,
    registered: Boolean,
    votes: Number
    // pkHash: String        // HOR (House of Representative) or PA (public Assembly)  


});

var model=mongoose.model('candidates', candidateSchema);
module.exports=model;