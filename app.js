'use strict';

const express = require('express');
const https = require('https');

var app = express();
app.set('port', process.env.PORT || 5000);

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

if (!VALIDATION_TOKEN) {
  console.error("VALIDATION_TOKEN missing");
  process.exit(1);
}

app.get("/", function(req, res){
  res.send("hello");
})

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
    res.sendStatus(200);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
