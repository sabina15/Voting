const router = require('express').Router();
const config = require('../config');
const bodyPraser = require('body-parser');
const voterModel = require('../models/voters_M');
const crypto = require('crypto');
const voteModel = require('../models/votes_M');
var candidate_model=require('../models/candidate_M');

router.get('/', function (req, res) {
    res.render('../views/voting.ejs');
});
router.get('/ballot', function (req, res) {
    res.render('../views/ballot.ejs');
});
router.get('/result', function (req, res) {

    res.render('../views/result.ejs');
});

router.post('/validateUser', function(req, res) {
    //const pkEncrypted = req.body.pkEncrypted;
    password = 'cipherWild';
    const pkEncrypted = req.body.pkEncrypted;
    console.log('Encrypted Value',pkEncrypted);
            
            var mykey=crypto.createDecipher('aes-256-cbc', password);
            console.log(mykey);
            // mykey.setAutoPadding(false)
            var pkDecrypted=mykey.update(pkEncrypted,'hex','utf8')
            pkDecrypted+=mykey.final('utf8')
            // pkDecrypted=pkDecrypted.substring(0, 66);
            console.log("routes-After Decryption: ",pkDecrypted);

            const hash = crypto.createHash('sha256');
            hash.update(pkDecrypted.toString());
            pkHash = hash.digest('hex');
            console.log("routes-pkHash  after decryption: ", pkHash);
    voterModel.findOne({pkHash: pkHash}, function(err, result) {
        if(!err) {
            if (result) {
                console.log(result);
                var sess = req.session;
                sess.ethAddress = result.ethAddress;
                res.end("true");
            //res.redirect('/voting/ballot');
            //res.render('../views/ballot.ejs');

            } else {
                res.end("false");
            }
        } 
    });

});

router.post('/processVote',function(req,res){
    var sess= req.session;
    console.log("request: ",req.body.candidateAddress);
    console.log("session",sess.ethAddress);
    var candidateAddress = req.body.candidateAddress;
    var voterAddress = sess.ethAddress;


    voteModel.create({
        from : voterAddress,
        to: candidateAddress,
        voted: true,
    }, function (error, doc) {
        if (error) {
            res.status(500).send(error).end();
            console.log(error);
        } else {
            //console.log("Voted Successfully");
            candidate_model.findOneAndUpdate({ethAddress :candidateAddress}, {$inc : {'votes' : 1}}).exec();
            voterModel.findOneAndUpdate({ethAddress :voterAddress}, {$set:{'voted': true}});
            res.end('true');
        }
    }

);
});



module.exports = router;
