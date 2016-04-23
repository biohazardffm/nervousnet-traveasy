'use strict';

const db = {
    "B9407F30-F5F8-466E-AFF9-25556B57FE6D": {
        name: "Wagon 1",
        used: ""
    },
    "2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6": {
      name: "Wagon 2",
      used: ""
    },
    "093E82AF-1AF1-5D23-A161-7631AC741CD9": {
      name: "Wagon 3",
      used: ""
    }
}

var express = require('express');
var logger = require('express-logger');
const https = require('https');
const fs = require('fs');
var app = express();

function logResponseBody(req, res, next) {
  var oldWrite = res.write,
      oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    console.log(req.path, body);

    oldEnd.apply(res, arguments);
  };

  next();
}
app.use(logResponseBody);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/inside/:wagonId/:userid', function(req, res) {
    const wid = req.params.wagonId;
    const uid = req.params.userid;
    if (db[wid]["used"] === "") {
        db[wid]["used"] = uid;
    }
    res.setHeader('Content-Type', 'application/json');
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
    res.setHeader('Content-Type', 'application/json');
    res.send(db);
});

app.get('/status', function(req, res) {
    res.send("<pre>"+ JSON.stringify(db, undefined, 4) +"</pre>");
});

app.listen(3000, function() {
    console.log('TravEasy app listening on port 3000!');
});

// var privateKey = fs.readFileSync( 'server.pem.key' );
// var certificate = fs.readFileSync( 'certificate.pem.cert' );
//
// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(3000);
