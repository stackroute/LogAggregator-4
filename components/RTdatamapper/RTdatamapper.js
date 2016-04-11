// 17/3/16 mongo client

// #2
var _ = require('highland');
var fs = require('fs')
  //  var uri  = 'mongodb://localhost:27017/slog4'
var WebSocketClient = require('websocket').client;
var WebSocket1 = new WebSocketClient();


var WebSocketServer = require('ws').Server
  //  , http = require('http')
  ,
  express = require('express'),
  app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.listen(9090);

var wss = new WebSocketServer({
  server: app
});

var measures = [{
  displayName: "success hits",
  eventField: "code",
  eventValue: "304"
},
{
  displayName: "remote by 172.23.238.186",
  eventField: "remote",
  eventValue: "172.23.238.186"
}
];


WebSocket1.on('connect', function(connection) {
  console.log("Connected..Waiting for some message");
  var streamData = {};
  _('message', connection).map(function(msg) {
    wss.on('connection', function(ws) {
      streamData = JSON.parse(msg.utf8Data)[2];
      var keys = Object.keys(streamData); //array of keys in the streaming data
      for (var k = 0; k < measures.length; k++) {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === measures[k].eventField) {
            var keyValue = keys[i];
            if (streamData[keyValue] === measures[k].eventValue) {
              var displayValue = measures[k].displayName;
              streamData[displayValue] = true;
            } else {
              var displayValue = measures[k].displayName;
              streamData[displayValue] = false;
            }
          }
        }
      }
      ws.send(JSON.stringify(streamData));
      ws.on('close', function() {
        //console.log('stopping client interval');
        //clearInterval(id);
      });
      //
      ws.setMaxListeners(ws.getMaxListeners() + 1);
    });

    streamData = JSON.parse(msg.utf8Data)[2];
    console.log(streamData);
  }).done(function() {
    console.log('Done');
  });
  //
  connection.setMaxListeners(connection.getMaxListeners() + 1);
});
WebSocket1.connect('ws://172.23.238.253:7070');

// function msg
/* ending of program*/
