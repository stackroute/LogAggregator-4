var _ = require('highland');
var WebSocketClient = require('websocket').client;
// var WebSocket1 = new WebSocketClient();
var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port: 8484});
var WebSocket1 = new WebSocketClient();
var sift = require('sift');
var wss = new WebSocketServer({
  port: 5050
});
var serverWs;
wss.on('connection', function(ws) {
  console.log('CONNECTED');
  // ws.send('Connected');
  serverWs = ws;
});
var measures = [];
var source;
// var forwardPort;
module.exports = function(namespaceId,Namespace) {
  Namespace.findNamespace(namespaceId, function(err, namespace) {
    if (namespace != null) {
      // console.log("routes",namespace.dimensions);
      // res.send(namespace.dimensions);
      measures = [];
      measures = namespace.measures;
      source = namespace.source;
      //console.log(measures);
    }
  });
};
console.log("inside component", measures);
WebSocket1.on('connect', function(connection) {
  console.log("Connected..Waiting for some message");
  streamData = {};
  _('message', connection).map(function(msg) {
    var sourceData = JSON.parse(msg.utf8Data)[0];
    if (source === sourceData) {
      streamData = JSON.parse(msg.utf8Data)[2];
      // var keys = Object.keys(streamData); //array of keys in the streaming data
      var condition;
      var sifter;
      for (var k = 0; k < measures.length; k++)
      {
      var displayValue=measures[k].eventField;
        // streamdata, keys
        if(measures[k].measureType === "fieldMeasure") {
          condition = {};

          condition[measures[k].eventField] = {$exists: true};
          sifter = sift(condition);
          streamData[displayValue] = sifter(streamData) ? 1 : 0
        } else {
          condition = {};
          condition[measures[k].eventField] = measures[k].eventValue;
          sifter = sift(condition);
          streamData[displayValue] = sifter(streamData) ? 1 : 0;
        }
      }
      if (serverWs) {
        serverWs.send(JSON.stringify(streamData));
      }
    }
    // console.log(streamData);
  }).done(function() {
    console.log('Done');
  });
});
WebSocket1.connect('ws://172.23.238.253:7070');
