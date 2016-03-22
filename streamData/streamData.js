// 17/3/16 mongo client

// #2
var _ = require('highland');
var fs = require('fs')
//  var uri  = 'mongodb://localhost:27017/slog4'
var WebSocketClient = require('websocket').client;
var WebSocket1 = new WebSocketClient();


  var WebSocketServer = require('ws').Server
  //  , http = require('http')
   , express = require('express')
   , app = express.createServer();

   app.use(express.static(__dirname + '/public'));
   app.listen(9090);

   var wss = new WebSocketServer({server: app});

WebSocket1.on('connect',function(connection) {
  console.log("Connected..Waiting for some message");

   _('message',connection).map(function(msg){
    wss.on('connection', function(ws) {
      //console.log("--------------------------------------------");
      //ws.send(JSON.stringify(msg));
      ws.send(JSON.stringify(JSON.parse(msg.utf8Data)[2]));
      //console.log('started client interval');
      ws.on('close', function() {
        //console.log('stopping client interval');
        //clearInterval(id);
      });
      //
      ws.setMaxListeners(ws.getMaxListeners() + 1);
    });

    console.log(JSON.parse(msg.utf8Data)[2]);


 // websocket.send(JSON.stringify(msg));
   }).done(function(){
     console.log('Done');
   });
//
 connection.setMaxListeners(connection.getMaxListeners() + 1);
});
// connection.setMaxListeners(0);

// WebSocket1.setMaxListeners(WebSocket1.getMaxListeners() + 1);
// websocket.send(JSON.stringify(msg));
WebSocket1.connect('ws://172.23.238.253:7070');

// function msg
/* ending of program*/
