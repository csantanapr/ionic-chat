/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/www'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var server = require('http').createServer();

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server:server });

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send("you "+message);
  });

  ws.send('Connection established');
});

server.on('request', app);
server.listen(appEnv.port, function () { 
  console.log('Listening on ' + appEnv.url); 
});
