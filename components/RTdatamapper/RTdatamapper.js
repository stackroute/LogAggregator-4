var _ = require('highland');
var WebSocketClient = require('websocket').client;
// var WebSocket1 = new WebSocketClient();
var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port: 8484});
var WebSocket1 = new WebSocketClient();
var wss = new WebSocketServer({
  port: 5050
});
var serverWs;
wss.on('connection', function(ws) {
  console.log('CONNECTED');
  ws.send('Connected');
  serverWs = ws;
});
var measures = [];
module.exports = function(mList) {
  measures = [];
  measures = mList;
  console.log(measures);
};
console.log("inside component", measures);
WebSocket1.on('connect', function(connection) {
  console.log("Connected..Waiting for some message");
  streamData = {};
  _('message', connection).map(function(msg) {
    streamData = JSON.parse(msg.utf8Data)[2];
    var keys = Object.keys(streamData); //array of keys in the streaming data
    for (var k = 0; k < measures.length; k++) {
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === measures[k].eventField) {
          var keyValue = keys[i];
          if (measures[k].measureType === "fieldMeasure") {
            var displayValue = measures[k].displayName;
            streamData[displayValue] = "1";
          } else {
            if (streamData[keyValue] === measures[k].eventValue) {
              var displayValue = measures[k].displayName;
              streamData[displayValue] = "1";
            } else {
              var displayValue = measures[k].displayName;
              streamData[displayValue] = "0";
            }
          }
        }
      }
    }
    if (serverWs) {
      serverWs.send(JSON.stringify(streamData));
    }
    // console.log(streamData);
  }).done(function() {
    console.log('Done');
  });
});
WebSocket1.connect('ws://172.23.238.253:7070');
