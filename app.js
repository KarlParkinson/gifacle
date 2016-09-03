'use strict';

const express = require('express');


var app = express();

app.get("/", function(req, res){
  res.send("Hello");
})

//app.set('port', process.env.PORT || 5000);

app.listen(5000, function() {
  console.log("listening on port 5000");
})
