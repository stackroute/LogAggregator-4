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
  //ws.setMaxListeners(ws.getMaxListeners() + 1);
});

var isClientConnected = false;
var stream;
var con;
var pipeline;


function bootstrapStream() {
    console.log("connected in mainQuery");
    stream=_('message',con);
    stream.pipe(_.pipeline(_.map(function(msg) {
    streamData=msg;
    console.log('data received ');
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
}

module.exports=function (queryy) {
  var executor = new QueryExecutor(queryy);
  pipeline = executor.getPipeline();

  if (isClientConnected) {
    // isClientConnected=false;
    console.log('before stream destroyed ');
    // for (var variable in stream) {
    // console.log('>>> '+variable);
    // }
    stream.end(function() {
      console.log('after stream destroyed');
      bootstrapStream();
    });
    console.log('after stream destroyed');
  }
else{
      WebSocket1.on('connect', function(connection) {
      isClientConnected = true;
      console.log(" Connected..Waiting for some message inQuery");
      var streamData = {};
      connection.on('close', function() {
      console.log('connection closed ***');
      });
       con=connection;
       bootstrapStream();
//      connection.setMaxListeners(connection.getMaxListeners() + 1);
    });
    WebSocket1.connect('ws://localhost:5050');
  }
}
