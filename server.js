/*eslint-env node*/

var express = require('express');
var cfenv = require('cfenv');
var app = express();
var appEnv = cfenv.getAppEnv();
var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server:server });

app.use(express.static(__dirname + '/www'));

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
