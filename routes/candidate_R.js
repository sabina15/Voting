var candidate=require('../controllers/candidate_manager');
var candidate_api=require('../api/candidate_api');
multer=require('multer');
var upload=multer({dest: 'electionSymbols/'});

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);                                                     // Candidate Homepage
    app.get('/candidate/register', candidate.Registration_render);                            // Candidate Registration
    app.get('/candidate/manage', candidate.fptpManagement);                                // Candidate Management (List)
    
    app.get('/candidate/fptp_candidate', candidate.fptp_candidate_registration_success);        // Fetch Candidate information and conformation Box
    app.get('/candidate/fptp/update', candidate.update_form_for_fptp_candidate);                // Html Form to update Candidate
    
    app.post('/candidate/fptp_candidate/:id', candidate.update_fptp_candidate_info);            // Updates the candidate Information
    app.post('/candidate/save', candidate.register);                                       // Registers a new Candidate
    app.delete('/candidate/fptp/delete', candidate.delete);     


    app.get('/get/district_const/:district_name', candidate_api.fetch_Constituency);            // API call to get District Information 
    app.get('/api/candidate_list', candidate_api.get_candidate_list);                 // API call to get the list of all candidates
    app.get('/api/candidate/fptp_candidate', candidate_api.get_fptp_candidate_info);        // API call to get Candidate Info

  
  
    };
  






















// const router = require('express').Router();
// const voterModel = require('../models/candidate_M');
// const config = require('../config');

// router.get('/', function (req, res) {
//     if (req.query.id) {
//         voterModel.findById(req.query.id, function (err, doc) {
//             res.render('voterInfo', { voter: doc, pk: config.pk });
//             config.pk = null;
//         });

//     } else {
//         res.render('voterRegister');
//     }

// });

// router.get('/register', function (req, res) {

//     res.render('candidate_register');
// });

// router.get('/manage', function (req, res) {
//     res.render('candidate_register');
// });


// router.get('/update', function (req, res) {
//     voterModel.findById(req.query.id, function (err, doc) {
//         if (!err) {
//             res.render('voterUpdate');
//         }
//     })
// });

// module.exports = router;
