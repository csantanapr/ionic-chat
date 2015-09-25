/*eslint-env node*/

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
//var port = process.env.PORT || 3000;
var port = appEnv.port;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//Compress
app.use(require('compression')());

// Routing
app.use(express.static(__dirname + '/www'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    data.avatar = socket.avatar;
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (userInfo) {
    // we store the username in the socket session for this client
    var username = userInfo.username
    socket.username = username;
    socket.avatar = userInfo.avatar;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

/* Using WebSockets 
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
    //ws.send(message);
    //broadcast
    wss.clients.forEach(function each(client) {
          client.send(message);
    });
  });

  //ws.send('Connection established');
});


server.on('request', app);
server.listen(appEnv.port, function () { 
  console.log('Listening on ' + appEnv.url); 
});

*/
