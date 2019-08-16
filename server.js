const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const web3 = require('web3');
const url = require('url');
const config = require("./config");
const path = require('path');
const bodyParser = require('body-parser');
var multer = require('multer');
const session = require('express-session');



//Routes
const loginRoute = require('./routes/login_R');
const voterRoute = require('./routes/voter_R.js');
var candidateRoute = require('./routes/candidate_R');

const voterApi = require('./api/voter_api');
const votingRoute = require('./routes/voting');

//models scama for MongoDb
const userModel = require('./models/users_M');
const candidateModel = require('./models/candidate_M');
const votereModel = require('./models/voters_M');


var app = express();
app.set('view engine', 'ejs');

var notification = {
    toNotify: false,
    type: null,
    message: null
}

app.use(session({
    key: 'user_sid',
    resave: false,
    secret: 'sussh',
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));



   var setNotification = function (req, notify, Type = null, Message = null) {
    notification.toNotify = notify;
    notification.type = Type;
    notification.message = Message;
    req.session.notification = notification;
}


connectDb = function (username = 'sabin', password = 'nepal123') {
    mongoose.connect(`mongodb://${username}:${password}@ds339177.mlab.com:39177/voting`, (error) => {
        if (!error) {
            console.log("connected to Database: Voting");
        } else {
            console.log("Error: ", error);
        }
    });
}

app.use((req, res, next) => {
    if (mongoose.connection.readyState == 0) {
        connectDb();
    }
    next();
})
connectDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'public/uploads/electionSymbols/') }).single('symbolFileName'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, booth_address, token, username, fptp_hor_ethAddress, fptp_pa_ethAddress, pr_hor_ethAddress, pr_pa_ethAddress, test');
    res.header('Access-Control-Expose-Headers', ' booth_address, token, username, fptp_hor_ethAddress, fptp_pa_ethAddress, pr_hor_ethAddress, pr_pa_ethAddress, test');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});




app.get('/notification', function (req, res) {
    res.json(req.session.notification).end();
});

app.get('/clearNotification', function (req, res) {
    setNotification(req, false);
    res.json(req.session.notification).end();
});


app.use('/plugins', express.static(__dirname + '/plugins'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/test', express.static(__dirname + '/test'));



app.use('/login', loginRoute);
app.use('/voter', voterRoute);
app.use('/api/voter', voterApi);
app.use('/voting', votingRoute);


//app.use('/candidate', candidateRoute);






app.listen(config.PORT, function (err) {
    if (!err) {
        console.log("Listening at PORT: ", config.PORT);
    }
    else
        throw err;
});

candidateRoute.initialize(app);




