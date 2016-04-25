var _ = require('highland');
var QueryExecutor = require('./query-executor');
// var query = {
//   select:['remote','host','method','code'],
//   eval: {
//     val1: {
//       rolling: {
//         evaluate: 'average',
//         over: {
//           count: 10
//         },
//         on: 'code' // measure
//       }
//     },
//     val2: {
//       rolling: {
//         evaluate: 'average',
//         over: {
//           count: 10
//         },
//         on: 'insertions'
//       }
//     },
//   },
//   project: {
//     // $highlight: {$condition: {val1: {$eq: eval['val2']}}}
//     $highlight: {$condition: 'val1 ==val2'}
//   },
//   to: 'streamB'
// };

var WebSocketClient = require('websocket').client;
var WebSocket1 = new WebSocketClient();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 9000});
var serverWs;

wss.on('connection', function(ws) {
  //console.log('CONNECTED');
  // ws.send('Connected');
  serverWs = ws;
  ws.setMaxListeners(ws.getMaxListeners() + 1);
});

var isClientConnected = false;

module.exports=function (queryy) {

  var executor = new QueryExecutor(queryy);
  var pipeline = executor.getPipeline();
  if (isClientConnected) {
    isClientConnected=false;
    console.log("WebSocket1 keys ");
    for(var l in WebSocket1) {
      console.log('>>> ' + l);
    }
    WebSocket1.abort();
  }
  if(!isClientConnected) {

    WebSocket1.on('connect', function(connection) {
      isClientConnected = true;
      console.log(" Connected..Waiting for some message ");
      var streamData = {};
       connection.on('close', function() {
       console.log('connection closed');
       });
       _('message', connection).pipe(_.pipeline(_.map(function(msg) {
        streamData=msg;
        console.log('data received from local '+ JSON.stringify(streamData.utf8Data));
        return JSON.parse(streamData.utf8Data);
        })
        ))
      .pipe(pipeline)
      .pipe(_.pipeline(
        _.map(function(msg) {
          if(serverWs) {
            serverWs.send(JSON.stringify(msg));
          }
        })
      )).done();
      connection.setMaxListeners(connection.getMaxListeners() + 1);
    });
    WebSocket1.connect('ws://localhost:5050');
  }
}
