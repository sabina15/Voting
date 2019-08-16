const Web3=require('web3');
const setNotification = require('../notification');

var candidate_model=require('../models/candidate_M');
var candidate_api=require('../api/candidate_api');
var web3=new Web3();
const config = require('../config');

var fs=require('fs'),
path=require('path');

module.exports={
    index: function(req, res) {
        var viewModel={
            candidates: []
        };
        console.log("Acessed candidate index function");
        fptp_candidate_model.find(function(err, candidates){
            viewModel.candidates=candidates;
            res.render('candidate_home', viewModel);
        });
        
    },

    Registration_render: function(req, res){
        
        res.render('candidate_register');       
    },

    fptpManagement: function(req, res)
    {
        var url="http://www.google.com";
        res.render('fptp_candidate_management');
    },

    
    // POst controller for FPTP registration
    register: function(req, res)
    {

        candidate_model.find({ "rollNo": req.body.rollNo }, function(err, result){
            if(err) {
                res.status[500].send(error).end();
            } else if(result.length) {
                //setNotification(req, true, "error", "Candidate Already Exists");
                console.log('Candidates already registered.')
            } else {
                            var candidateAddress=web3.eth.accounts.create();
                            // console.log(candidateAddress);
                            
                            candidate_model.create({
                                candidateName: req.body.candidateName, 
                                rollNo: req.body.rollNo,
                                batch: req.body.batch,
                                
                                ethAddress: candidateAddress.address,
                                registered: false,
                                votes: 0
                            }, function(err, doc){
                                if(err)
                                    res.status(500).send(error).end();
                                else{
                                    console.log(doc);
                                    setNotification(req, true, "success", "Candidate "+req.body.candidateName+" has beem registered.");
                                    config.db_candidate.insert({ address: candidateAddress.address, txHash: null, timestamp: Date.now() });
                                    
                                    res.redirect('/candidate/info/?id='+doc.id);
                                }
                            }); 
                    
                            
                    


                    }
                });

    },

    fptp_candidate_registration_success: function(req, res)
    {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        // res.json(req.query.id);
        var viewModel={
            candidate : {}
        };
        fptp_candidate_model.findById( req.query.id, function(err, doc){
            viewModel.candidate=doc;
            res.render('fptp_candidate_info', viewModel);

        });


        // console.log('Printingggggggggggggggggggggggggggggggggggggggggggggggggg');
        // console.log(candidate);
        // res.render('fptp_candidate_info', viewModel);
    },

    update_form_for_fptp_candidate: function(req, res)
    {
        var viewModel={
            districts: []
           
        };

       
        fptp_candidate_model.findById(req.query.id, function(err, result){
            if(!err) {
                model_district.find(function(err, dists)
                {
                    if(err)
                        throw err;
            
                    viewModel.districts=dists;
                    res.render('fptp_candidate_update', viewModel);
                });
              
            }
        });
    },
    update_fptp_candidate_info: function(req, res){
        var updatedInfo=req.body;
        delete updatedInfo.submit;
        console.log(req.body);
        console.log(req.params.id);
        fptp_candidate_model.findByIdAndUpdate(req.params.id, updatedInfo, function(err, result){
            if (!err) {
                setNotification(req, true, "success", "Voter updated Successfully");
                res.redirect('/candidate/fptp/manage');
            } else {
                setNotification(req, true, "error", "Upadting Voter Failed");
                res.redirect('/candidate/fptp/update?id=' + req.params.id);
            }
        });
    },
    delete: function(req, res){
        fptp_candidate_model.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    },

    test: function(req, res)
    {
        console.log(req.body.fatherName);
        res.redirect('/');
    }

};