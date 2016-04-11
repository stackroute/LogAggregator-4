module.exports = function(namespaceId,measures) {
  console.log("inside component",measures);
// var _ = require('highland');
// var WebSocketClient = require('websocket').client;
// var WebSocket1 = new WebSocketClient();
// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port: 8484});
// var serverWs;
// wss.on('connection', function(ws) {
//   console.log('CONNECTED');
//   ws.send('Connected');
//   serverWs = ws;
//   ws.setMaxListeners(ws.getMaxListeners() + 1);
// });
//
// // var measures = [{
// //   displayName: "success hits",
// //   eventField: "code",
// //   eventValue: "304"
// // },
// // {
// //   displayName: "remote by 172.23.238.186",
// //   eventField: "remote",
// //   eventValue: "172.23.238.186"
// // }
// // ];
//
//
// WebSocket1.on('connect', function(connection) {
//   console.log("Connected..Waiting for some message");
//   var streamData = {};
//   _('message', connection).map(function(msg) {
//       streamData = JSON.parse(msg.utf8Data)[2];
//       var keys = Object.keys(streamData); //array of keys in the streaming data
//       for (var k = 0; k < measures.length; k++) {
//         for (var i = 0; i < keys.length; i++) {
//           if (keys[i] === measures[k].eventField) {
//             var keyValue = keys[i];
//             if (streamData[keyValue] === measures[k].eventValue) {
//               var displayValue = measures[k].displayName;
//               streamData[displayValue] = true;
//             } else {
//               var displayValue = measures[k].displayName;
//               streamData[displayValue] = false;
//             }
//           }
//         }
//       }
//       if(serverWs) {
//         serverWs.send(JSON.stringify(streamData));
//       }
//     console.log(streamData);
//   }).done(function() {
//     console.log('Done');
//   });
//   connection.setMaxListeners(connection.getMaxListeners() + 1);
// });
// WebSocket1.connect('ws://172.23.238.253:7070');
//
// // function msg
// /* ending of program*/
}
