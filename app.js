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
  res.send(VALIDATION_TOKEN)
})



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
