const router = require('express').Router();
const voterModel = require('../models/voters_M');
const Web3 = require('web3');
const config = require('../config');
const crypto = require('crypto'),
algorithm='aes-128-cbc';
const setNotification = require('../notification');
var Datastore = require('nedb');
var path = require('path');

var web3 = new Web3();
var myContract;

//calling smart contract
/*

router.use((req, res, next) => {
    if (web3.currentProvider == undefined) {
        const ethprovider = new Web3.providers.WebsocketProvider(config.web3Connection);
        const web3 = new Web3('http://');
        web3.setProvider(ethprovider);

        //web3.setProvider(new Web3.providers.WebsocketProvider(config.web3Connection))
        myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);
    }
    next();
});
*/


router.post('/:id', function (req, res) {
    console.log("update voter request");
    var updatedInfo = req.body;
    delete updatedInfo.submit;
    voterModel.findByIdAndUpdate(req.params.id, updatedInfo, function (err, result) {
        if (!err) {
            setNotification(req, true, "success", "Voter updated Successfully");
            res.redirect('/voter/manage');
        } else {
            setNotification(req, true, "error", "Upadting Voter Failed");
            res.redirect('/voter/update?id=' + req.params.id);
        }
    });
});

router.route('/')
    .post(function (req, res) {
        console.log("register voter request")
        voterModel.find({ $or: [{ "formNo": req.body.formNo }, { "rollNo": req.body.rollNo }] }, function (err, result) {
            if (err) {
                res.status(500).send(error).end();
                console.log(error);
            } else if (result.length) {
                //setNotification(req, true, "error", "Voter Already Exists");
                console.log("Voter already registered")
                res.redirect('/voter?id=' + result[0].id);
            } else {
                var voterAddress = web3.eth.accounts.create();
                console.log(voterAddress);

                const hash = crypto.createHash('sha256');
                hash.update((voterAddress.privateKey).toString());
                var pkHash = hash.digest('hex');
                console.log('Hashed Pk: ', pkHash);

                voterModel.create({
                    formNo: req.body.formNo,
                    fullName: req.body.fullName,
                    DOB: req.body.dob,
                    sex: req.body.sex,
                    rollNo: req.body.rollNo,
                    voted: false,
                    batch: req.body.batch,
                    ethAddress: voterAddress.address,
                    pkHash: pkHash,
                    tokenTransferred: false
                }, function (error, doc) {
                    if (error) {
                        res.status(500).send(error).end();
                        console.log(error);
                    } else {
                        config.db.insert({ address: doc.ethAddress, txHash: null, timestamp: Date.now() });
                        //setNotification(req, true, "success", "Voter Added Successfully");
                        console.log("Voter Added Successfully");
                        
                        
                        const password="cipherWild";
                        
                        var cipher=crypto.createCipher('aes-256-cbc', password)
                        var crypted=cipher.update((voterAddress.privateKey), 'utf8','hex')
                        crypted+=cipher.final('hex')
                        config.pk = crypted;

    
                        //console.log('Private Key Type: ', (voterAddress.privateKey).length)
                        console.log("Real Private Key",voterAddress.privateKey);
                        console.log('Encrypted Value: ', config.pk);
                        //console.log('Encrypted Value Length: ', (config.pk).length);
                        
                        

                        // config.pk=voterAddress.privateKey;
                        res.redirect('/voter?id=' + doc.id);
                        //res.redirect('/voter/info?id=' + doc.id);
                    }
                });
            }
        });

    })
    .get(function (req, res) {
        if (req.query.id) {
            console.log("read voter request");
            voterModel.findById(req.query.id, function (err, doc) {
                if (!err) {
                    res.json(doc);
                } else {
                    res.status(500).send(err).end();
                }
            });
        } else {
            voterModel.find(function (err, docs) {
                if (!err) {
                    // var votersDetails = {};
                    // votersDetails.total = docs.length;
                    // votersDetails.rows = docs;
                    // res.json(votersDetails);
                    res.json(docs);
                } else {
                    res.status(500).send(err).end();
                }
            });
        }

    })
    .delete(function (req, res) {
        console.log("delete voter requetst");
        voterModel.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    });

module.exports = router;