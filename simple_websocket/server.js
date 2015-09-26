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
    console.log('connection closed');
    clearInterval(interv);
  });
  ws.send('connected');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

