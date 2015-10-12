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
var dbService = appEnv.getService('cloudant-chat');
var db;
var cloudant;
var dbCredentials = {
  dbName: 'photos_db'
};
function initDBConnection() {
  if (dbService) {
    dbCredentials.host = dbService.credentials.host;
    dbCredentials.port = dbService.credentials.port;
    dbCredentials.user = dbService.credentials.username;
    dbCredentials.password = dbService.credentials.password;
    dbCredentials.url = dbService.credentials.url;

    cloudant = require('cloudant')(dbCredentials.url);
			
    // check if DB exists if not create
    cloudant.db.get(dbCredentials.dbName, function (err, body) {
      if (err) {
        cloudant.db.create(dbCredentials.dbName, function (err, res) {
          if (err) { console.log('could not create db ', err); }
          db = cloudant.use(dbCredentials.dbName);
        });
      } else {
        db = cloudant.use(dbCredentials.dbName);
      }

    });

  } else {
    console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
    // For running this app locally you can get your Cloudant credentials 
    // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment 
    // Variables section for an app in the Bluemix console dashboard).
    // Alternately you could point to a local database here instead of a 
    // Bluemix service.
    //dbCredentials.host = "REPLACE ME";
    //dbCredentials.port = REPLACE ME;
    //dbCredentials.user = "REPLACE ME";
    //dbCredentials.password = "REPLACE ME";
    //dbCredentials.url = "REPLACE ME";
  }
}
function destroyDB() {
  cloudant.db.destroy(dbCredentials.dbName, function (err) {
    if (!err) { console.log(dbCredentials.dbName + ' db detroyed'); }
  });
}

initDBConnection();


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/destroydb',function(req,res){
  destroyDB();
});


// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use(function (req, res, next) {
  if (isSecure(req)) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.hostname + req.originalUrl);
  }
});

//Compress
app.use(require('compression')());

//Minify
//app.use(require('express-minify')());

// Routing
app.use(express.static(__dirname + '/www'));


function isSecure(req) {
  // Check the trivial case first.
  if (req.secure || /mybluemix.net/i.test(req.hostname) === false) {
    return true;
  }
  // Check if we are behind Application Request Routing (ARR).
  // This is typical for Azure.
  if (req.headers['x-arr-log-id']) {
    return typeof req.headers['x-arr-ssl'] === 'string';
  }
  // Check for forwarded protocol header.
  // This is typical for AWS.
  return req.headers['x-forwarded-proto'] === 'https';
}

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      //username: socket.username,
      message: data
    });

    console.log(data.user + (data.img ? ' sent an img' : ' say: ' + data.message));
    //save image to the cloud
    if (db && data.img) {
      db.insert(data, function (err, body) {
        if (err) { console.log(err,body); }
      });
    }

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
