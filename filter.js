var fs = require('fs');
var _=require('highland');
var readableStream = fs.createReadStream('logs.json');
readableStream.setEncoding('utf8');
var keys=['insertions','deletions','authorName','authorEmail'];
var exp="select insertions deletions authorName authorEmail from StreamA if(insertions>max(rollingCount(1min,insertions)))"
var expkeys;
var aggregates=['average','min','max'];
var accumulators=['rollingCount','rollingTime'];
var aggregateVariables=[];
var patterns=[];
for (var j = 0; j < aggregates.length; j++) {
  for (var i = 0; i < accumulators.length; i++) {
    patterns.push('/'+aggregates[j]+'\('+accumulators[i]+'/')
  }
}







var conditions =exp.match(/if\(.+[><=(!=)(contains)][(avesrage)(max)(min)]\)/g)
conditions=conditions.toString().split(" ");
for (var i = 0; i < conditions.length; i++) {
  for (var i = 0; i < keys.length; i++) {
    if(conditions.indexOf(keys[i])>=0)
    aggregateVariables.push(keys[i]);
  }
}
var logicaloperators=[];
var operators=['>','<','=','!==','contains'];
for (var i = 0; i < conditions.length; i++) {
  if(conditions[i].indexOf('>')>=0){
  logicaloperators.push('>')
  }
  else if (conditions[i].indexOf('<')>=0) {
    logicaloperators.push('<')
  }
  else if (conditions[i].indexOf('=')>=0) {
    logicaloperators.push('=')
  }
  else if (conditions[i].indexOf('!=')>=0) {
    logicaloperators.push('!=')
  }
  else if (conditions[i].indexOf('contains')>=0) {
    logicaloperators.push('!=')
  }
}
for (var j = 0; j < conditions.length; j++) {
  var code='';
  for (var i = 0; i < logicaloperators.length; i++) {
    conditions[j].split(logicaloperators[i]).each(function(singlecondition) {
      for (var k = 0; k < patterns.length; k++) {
        singlecondition.match(patterns[k]);
        code+=k;
      }
    })
  }
}






// console.log(logicaloperators);







// var through = _.pipeline(
//     _.map(function (chunk) {
//         var data=JSON.parse(chunk);   // assuming the chunk/stream to be array of objects
//         if(!keys)
//         keys=Object.keys(data[0]);    // All the keys of a single record
//         if(!expkeys)
//         {
//             var temp=exp.split(" ");
//             if(temp[1]=='*');
//             {
//                 expkeys=keys;        //keys in expression
//             }
//             else{
//                 var i=1;
//                 while(temp[i]!=='from')
//                 expkeys.push(temp[i])
//             }
//         }
//         }
//
//
//         // if(data[0].insertions > 100)
//         // {
//         //     data[0].highlight=true;
//         // }
//         // else{
//         //     data[0].highlight=false;
//         // }
//         return JSON.stringify(data);
//     }),
//     _.filter(function (chunk) {
//       console.log("hello");
//     })
//     );
// _(readableStream).pipe(through).pipe(process.stdout);
