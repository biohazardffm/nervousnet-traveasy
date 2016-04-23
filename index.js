'use strict';

const db = {
    "B9407F30-F5F8-466E-AFF9-25556B57FE6D": {
        name: "Wagon 1",
        used: ""
    }
}

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/inside/:wagonId/:userid', function(req, res) {
    const wid = req.params.wagonId;
    const uid = req.params.userid;
    if (db[wid]["used"] === "") {
        db[wid]["used"] = uid;
    }
    res.send(db);
});

app.get('/outside/:wagonId/:userid', function(req, res) {
    const wid = req.params.wagonId;
    const uid = req.params.userid;

    Object.keys(db).forEach(key => {
      if(key === wid && db[key]["used"] === uid) {
        db[key]["used"] = "";
        // res.send('checked out: ');
      }
    });
    res.send(db);
});

app.listen(3000, function() {
    console.log('TravEasy app listening on port 3000!');
});
