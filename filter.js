var fs = require('fs');
var _=require('highland');
var rollingCount=require('./rollingCount');
var readableStream = fs.createReadStream('logs.json');
readableStream.setEncoding('utf8');
var keys;
var exp="select record.insertions record.deletions record.authorName record.authorEmail from StreamA if(rollingCount(22).avg(record.insertions)> rollingCount(11).max(record.insertions))"
//var exp="select record.insertions deletions authorName authorEmail from StreamA if(insertions>deletions)"
var RT=[];//function constructors generated  from expression for rollingTime
var RC=[];//function constructors generated  from expression for rollingCounts
var condition =exp.match(/if\(.+[><=(!=)(contains)]\)/g)
condition=condition.toString();
var rollingCountemp=condition.match(/rollingCount\D\d+\D/g);
if (rollingCountemp) {
var rollingCountVars=[];
for (var i = 0; i < rollingCountemp.length; i++) {
  rollingCountVars.push(rollingCountemp[i].match(/\d+/g))
}
for (var i = 0; i < rollingCountemp.length; i++) {
  RC.push(new rollingCount(parseInt(rollingCountVars[i])));
}
for (var i = 0; i < 2; i++) {
  condition=condition.replace(rollingCountemp[i],'RC['+i+']')
}

}//if ends RollingCount
var rollingTimetemp=condition.match(/rollingTime\D\d+\D/g);
if(rollingTimetemp){
var rollingTimeVars=[];
// for (var i = 0; i < rollingTimetemp.length; i++) {
//   rollingTimeVars.push(rollingTimetemp[i].match(/\d+/g))
// }
// for (var i = 0; i < rollingTimetemp.length; i++) {
//   RT.push(new rollingTime(parseInt(rollingTimeVars[i])));
// }

for (var i = 0; i < 2; i++) {
  condition=condition.replace(rollingTimetemp[i],'RT['+i+']')
}
}//if ends rollingTimetemp





// //condition="if(record.insertions>disp())";
// var through = _.pipeline(
//         _.map(function (chunk) {
//         var data=JSON.parse(chunk);   // assuming the chunk/stream to be array of objects
//         if(!keys)
//         keys=Object.keys(data[0])
//         if(!expkeys)
//         {
//         var temp=exp.split(" ");
//         if(temp[1]=='*');
//         {
//         expkeys=keys;        //keys in expression
//         }
//         else{
//         var i=1;
//         while(temp[i]!=='from')
//         expkeys.push(temp[i].substr(7))
//         }
//         }
//         data.map(function(record) {
//         var bool='false';
//         bool=eval(condition+"true");
//         if(bool)
//         record.highlight=true;
//         })
//         return JSON.stringify(data);
//     }),
//     _.filter(function (chunk) {
//       return chunk
//     })
//     );
// _(readableStream).pipe(through).pipe(process.stdout);
/************************************rollingCount***********************************************/
function rollingCount(value,n,aggregate) {




}












/*********************************rollingTime***************************************************/
