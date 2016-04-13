var _ = require('highland');
var QueryExecutor = require('./query-executor');
var query = {
  select:['remote','host','method','code'],
  eval: {
    val1: {
      rolling: {
        evaluate: 'average',
        over: {
          count: 10
        },
        on: 'code' // measure
      }
    },
    val2: {
      rolling: {
        evaluate: 'average',
        over: {
          count: 10
        },
        on: 'insertions'
      }
    },
  },
  project: {
    // $highlight: {$condition: {val1: {$eq: eval['val2']}}}
    $highlight: {$condition: 'val1 ==val2'}
  },
  to: 'streamB'
};

var WebSocketClient = require('websocket').client;
var WebSocket1 = new WebSocketClient();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var serverWs;

wss.on('connection', function(ws) {
  console.log('CONNECTED');
  ws.send('Connected');
  serverWs = ws;
  ws.setMaxListeners(ws.getMaxListeners() + 1);
});

module.exports=function (queryy) {

  var executor = new QueryExecutor(query);
  var pipeline = executor.getPipeline();
  WebSocket1.on('connect', function(connection) {
    console.log("Connected..Waiting for some message");
    var streamData = {};
    _('message', connection).pipe(_.pipeline(_.map(function(msg) {
      console.log('data received');
      return JSON.parse(msg.utf8Data)[2];
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
}
