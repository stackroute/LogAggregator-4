var fs = require('fs');
var _=require('highland');
var readableStream = fs.createReadStream('logs.json');
readableStream.setEncoding('utf8');
var keys=['insertions','deletions','authorName','authorEmail'];
//var exp="select record.insertions deletions authorName authorEmail from StreamA if(insertions>max(rollingCount(1min,insertions)))"
var exp="select record.insertions deletions authorName authorEmail from StreamA if(insertions>deletions)"

var condition =exp.match(/if\(.+[><=(!=)(contains)][(avesrage)(max)(min)]\)/g)
condition=condition.toString();
condition="if((record.insertions>record.deletions) || record.type=='commit' )";
var through = _.pipeline(
        _.map(function (chunk) {
        var data=JSON.parse(chunk);   // assuming the chunk/stream to be array of objects
        data.map(function(record) {
        var bool='false';
        bool=eval(condition+"true");
        if(bool)
        record.highlight=true;
        })
        return JSON.stringify(data);
    }),
    _.filter(function (chunk) {
//        console.log("index of all highlights"+);
      return chunk
    })
    );
_(readableStream).pipe(through).pipe(process.stdout);
