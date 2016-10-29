'use strict';

function hitGiphyAPI() {
}

function shouldTakeAction(text) {
  return /^gifacle.*/.test(text);
}

function parseMessage(text) {
  if (!shouldTakeAction(text)) return;
}

function gifParty() {
}

function gifTranslate() {
}

function isTextMessage(msg) {
  return msg.message;
}

function callSendAPI(message) {
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: message

  } , function (error, response, body) {
    if (!error && response.statusCode== 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Succesfully sent message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

function handleTextMessage(msg) {
  var senderID = msg.sender.id;
  var recipientID = msg.recipient.id;
  var timeOfMessage= msg.timestamp;
  var message = msg.message;

  console.log("Received message for user %d and page %d at %d with message: ", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageText = message.text;

  if (messageText) {
    if (shouldTakeAction(messageText)) {
      respondToTextMessage(senderID, "need to send gif");
    } else {
      respondToTextMessage(senderID, messageText);
    }
  }
}

function respondToTextMessage(sendTo, msg) {
  var messageData = {
    recipient: {
      id: sendTo
    },
    message: {
      text: msg
    }
  };

  callSendAPI(messageData);
}

function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  
  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];
    
    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
        .update(buf)
        .digest('hex');
    
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}


const bodyParser = require('body-parser')
const express = require('express');
const https = require('https');
const request = require('request');
const crypto = require('crypto');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.APP_SECRET;

if (!VALIDATION_TOKEN) {
  console.error("VALIDATION_TOKEN missing");
  process.exit(1);
}

app.get("/", function(req, res){
  res.send("hello");
})

// Routes
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
//  console.log(req)
  var data = req.body;
  console.log(data);

  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      pageEntry.messaging.forEach(function (msg) {
        if (isTextMessage(msg)) {
          handleTextMessage(msg)
          // ignore others for now
          // TODO: do not ignore
        }
      });
    });
  }
  res.sendStatus(200);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
