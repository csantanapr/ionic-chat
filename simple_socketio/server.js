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
    socket.broadcast.emit('new message', {message: message});
  });
  socket.on('disconnect', function () {
    console.log('connection closed');
  });
  socket.emit('new message',{ message: 'connected'});
});
