// 17/3/16 mongo client

// #2
var _ = require('highland');
var fs = require('fs')
//  var uri  = 'mongodb://localhost:27017/slog4'
var WebSocketClient = require('websocket').client;
var WebSocket = new WebSocketClient();


var dest =fs.createWriteStream('eout.json',{defaultEncoding:'utf8'});

WebSocket.on('connect',function(connection) {
  console.log("Connected..Waiting for some message");

   _('message',connection).map(function(msg){
     console.log('msg1:' + JSON.stringify(msg));
   }).done(function(){
     console.log('Done');
   });

  /*connection.on('message',function(message) {

// var docs =_([message]);
// var docs=message;
// var output=fs.createWriteStream('output.txt');
// _(docs).pipe(output);

// es.through([
//   fs.createReadStream('message'),
// ]).pipe(fs.createWriteStream('output.json'));
//

// console.log(message);
    // var outputFile='output.json'
    var data =_([message]);
    console.log("******");
    console.log(data);
    var dest =fs.createWriteStream('eout.json');
    data.pipe(dest);
    data.pipe(through).pipe(dest);
    // es.through(function write(data){
    //   this.emit('data', data);
    // })
    console.log(data);

    // data.pipe();
//console.log(message);

// data.toArray(function(s){
//   console.log("bhaskar",s);
// fs.writeFile(outputFile,JSON.stringify(s),function(err){
//   console.log(err);
// });
//
// });

  //  data
  //       .flatMap(_.wrapCallback(fs.writeFile.bind(fs,outputFile)))
  //       .stopOnError(function(err){
  //         console.log(err);
  //       });

    console.log(message);
});*/
});
WebSocket.connect('ws://172.23.238.253:7070');

// function msg
/* ending of program*/
