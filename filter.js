var fs = require('fs');
var _=require('highland');
var rollingCount=require('./rollingCount');
var readableStream = fs.createReadStream('logs.json');
readableStream.setEncoding('utf8');
var keys;
var expkeys;
var exp="select record.insertions record.deletions record.authorName record.authorEmail from StreamA if(record.insertions> rollingCount(10).average(record.insertions))"
//var exp="select record.insertions deletions authorName authorEmail from StreamA if(insertions>deletions)"
// var exp="select record.insertions record.deletions record.authorName record.authorEmail from StreamA if(record.insertions> 10)"
var RT=[];//function constructors generated  from expression for rollingTime
var RC=[];//function constructors generated  from expression for rollingCounts
var condition =exp.match(/if\(.+\)/g)
condition=condition.toString();


var rollingCountemp=condition.match(/rollingCount\D\d+\D/g);//checks and replaces rollingCount with instantiated function objects
if (rollingCountemp) {                                      // like RC[0] for first rollingCount and so on..
var rollingCountVars=[];
for (var i = 0; i < rollingCountemp.length; i++) {
  rollingCountVars.push(rollingCountemp[i].match(/\d+/g))
  RC.push(new rollingCount(parseInt(rollingCountVars[i])));
   console.log('RC['+i+']'+'initialized with count'+(parseInt(rollingCountVars[i])));
  condition=condition.replace(rollingCountemp[i],'RC['+i+']')
}
}//if ends RollingCount
var rollingTimetemp=condition.match(/rollingTime\D\d+\D/g);//checks and replaces rollingTime with instantiated function objects
if(rollingTimetemp){                                       // like RT[0] for first rollingTime and so on..
var rollingTimeVars=[];
for (var i = 0; i < rollingTimetemp.length; i++) {
  rollingTimeVars.push(rollingTimetemp[i].match(/\d+/g))
  RT.push(new rollingTime(parseInt(rollingTimeVars[i])));
  condition=condition.replace(rollingTimetemp[i],'RT['+i+']')
}
}//if ends rollingTimetemp

var through = _.pipeline(
        _.map(function (chunk) {
        var data=JSON.parse(chunk);   // assuming the chunk/stream to be array of objects
        if(!keys)
        keys=Object.keys(data[0]);
        if(!expkeys){
        var temp=exp.split(" ");
        if(temp[1]=='*')
        expkeys=keys;        //keys in expression
        else{
        var i=1;
        var tempkeys=new Array();
        while(temp[i]!=='from'){
        tempkeys.push(temp[i].substr(7));
        i++;
        }
        expkeys=tempkeys;
        }
        }
        data.map(function(record) {
        var bool=false;
        bool=eval(condition+"{true}");

        if(bool){
        record.highlight="true";
        // console.log("*****insertions******** "+record.insertions);
        }
        })
        return JSON.stringify(data);
    }),
    _.filter(function (chunk) {
        return chunk;
    })
    );
_(readableStream).pipe(through).pipe(process.stdout);
