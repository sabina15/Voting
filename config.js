const Datastore = require('nedb');
const path = require('path');
const configure = {
    "files.associations": {
        "*.ejs" : "html"
    },
    PORT: 8001,
    PROVIDER: 'ws://localhost:8545', 
    OWNER_ADDRESS: "",
    CONTRACT_ADDRESS: "",
    web3Connection: 'http://127.0.0.1:8546',
    pk: null,
    BASE_DIR: __dirname,
    db : new Datastore({
        filename: (path.join(__dirname) + '/logs/votersLog'),
        autoload: true
    }),
    db_candidate: new Datastore({
        filename: (path.join(__dirname) + '/logs/candidateLog'),
        autoload: true
    })
}

module.exports = configure;