var fs = require('fs');
var _=require('highland');

//
// var exp=[];
// exp.push("authorEmail");
// exp.push("authorName");
// exp.push("insertions");
// exp.push("deletions");
// console.log(exp);


// var jsondata;
// fs.readFile("./myApp/gitLogsMaster.json","utf8",function(error,data){
//   //console.log(data);
//   var modifiedjson=data.filter(function(record) {
//     return true;
//   }).map(function(record) {
//     var temp={};
//     for (var i = 0; i < exp.length; i++) {
//       temp[exp[i]]=record[exp[i]]
//     }
//     return temp;
//   })
// })
// var fs = require('fs');
// var readableStream = fs.createReadStream('./myApp/gitLogsMaster.json');
// var data = '';
// var obj=[];
// j=0;
// readableStream.setEncoding('utf8');
// readableStream.on('data', function(chunk) {
//     if(chunk !== null)
//     var local=JSON.parse(chunk);
//     console.log(local[0]);
// });
//
// readableStream.on('end', function() {
// });
var fs = require('fs');
var readableStream = fs.createReadStream('./myApp/gitLogsMaster.json');
var data = '';
var chunk;
readableStream.setEncoding('utf8');
readableStream.on('readable', function() {
    while ((chunk=readableStream.read()) != null) {
        _(chunk).pipe();
    }
});

readableStream.on('end', function() {
    console.log(data)
});
