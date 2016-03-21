var WebSocketClient = require('websocket').client;
var WebSocket = new WebSocketClient();
var _ =  require('highland');
var fs = require('fs');

// websocket on
WebSocket.on('connect',function(connection) {
  console.log("Connected..Waiting for some message");
// connection on
  connection.on('message',function(message) {
    // var _ = highland;
    // var data = _([message]);
    //
    // console.log(data);
    // console.log(message);
    fs.appendFileSync('str.json',JSON.stringify(message));
    var readable=fs.createReadStream('str.json');
    _(readable).pipe(process.stdout);
});

});

// source address
WebSocket.connect('ws://172.23.238.253:7070');
