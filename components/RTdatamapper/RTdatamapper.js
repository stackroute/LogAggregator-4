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
  //ws.setMaxListeners(ws.getMaxListeners() + 1);
});

var measures = [];


module.exports = function(mList){
  measures = [];
   measures = mList;
   console.log(measures);
};



// module.exports = function(namespaceId, measuresList) {
  console.log("inside component", measures);
  //var measures =[];
  // measures=measuresList;
  // console.log("measure",measures);

  WebSocket1.on('connect', function(connection) {
    console.log("Connected..Waiting for some message");
    //console.log('connObj' + JSON.stringify(connection));

     streamData = {};
    _('message', connection).map(function(msg) {
      // var streamData1 = JSON.parse(msg.utf8Data)[2];
      // console.log("hiiting",streamData1);
      streamData = JSON.parse(msg.utf8Data)[2];
      var keys = Object.keys(streamData); //array of keys in the streaming data
      for (var k = 0; k < measures.length; k++) {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === measures[k].eventField) {
            var keyValue = keys[i];
            if (measures[k].measureType === "radioField") {
              var displayValue = measures[k].displayName;
              streamData[displayValue] = true;
            } else {
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

  // function msg
  /* ending of program*/
// }
// module.exports = getMeasure(mList);
