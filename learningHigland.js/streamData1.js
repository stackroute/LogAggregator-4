// 17/3/16 mongo client

// #2
var _ = require('highland');
var fs = require('fs')
//  var uri  = 'mongodb://localhost:27017/slog4'
var WebSocketClient = require('websocket').client;
var WebSocket = new WebSocketClient();

WebSocket.on('connect',function(connection) {
  console.log("Connected..Waiting for some message");

   _('message',connection).map(function(msg){
     //console.log('msg1:' + JSON.stringify(msg));
     fs.appendFileSync('str.json',JSON.stringify(msg));
    //  fs.createWriteStream('str.json',{defaultEncoding:'utf8'},JSON.stringify(msg));
     var readable=fs.createReadStream('str.json');
     _(readable).pipe(process.stdout);
   }).done(function(){
     console.log('Done');
   });


});
WebSocket.connect('ws://172.23.238.253:7070');

// function msg
/* ending of program*/
