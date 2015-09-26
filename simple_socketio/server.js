/*
var   server = require('http').createServer(),
 express = require('express'),
 app = express(),
 WebSocketServer = require('ws').Server,
 wss = new WebSocketServer({ server:server }),
 port = '8080';

app.use(express.static(__dirname + '/www'));

wss.on('connection', function connection(ws) {
  var interv;
  ws.on('message', function incoming(message) {
    var counter = 0;
    console.log('received: %s', message);
    
    interv = setInterval(function(){
      ws.send('polo '+counter++);
    }, 3000);
  });
  ws.on('close',function(){
    console.log('connections closed');
    clearInterval(interv);
  });
  ws.send('connected');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
*/
/*eslint-env node*/

// Setup basic express server
var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io')(server),
port = '8080';

server.listen(port, function () { console.log('Listening on ' + server.address().port) });

app.use(express.static(__dirname + '/www'));

io.on('connection', function (socket) {
  var interv;
  socket.on('new message', function (message) {
    var counter = 0;
    console.log('received: %s', message);
    interv = setInterval(function(){
      socket.emit('new message',{ message: 'polo '+counter++});
    }, 3000);
    socket.broadcast.emit('new message', {message: message});
  });
  socket.on('disconnect', function () {
    console.log('connection closed');
  });
  socket.emit('new message',{ message: 'connected'});
});
