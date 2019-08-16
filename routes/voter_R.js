const router = require('express').Router();
const voter = require('../models/voters_M');
const config = require('../config');

router.get('/', function (req, res) {
    if (req.query.id) {
        voter.findById(req.query.id, function (err, doc) {
            console.log(doc);
            console.log('doc_id:',doc.id);
            res.render('voterInfo', { voter: doc, pk: config.pk });
            config.pk = null;
        });

    } else {
        res.render('voterRegister');
    }

});

router.get('/register', function (req, res) {

    res.render('voterRegister');
});

router.get('/manage', function (req, res) {
    res.render('voterManage');
});


router.get('/update', function (req, res) {
    voterModel.findById(req.query.id, function (err, doc) {
        if (!err) {
            res.render('voterUpdate');
        }
    })
});

module.exports = router;
