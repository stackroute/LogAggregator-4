var sift = require('sift');
var _ = require('highland');
var rollingCount = require('./rollingCount');
// var rollingTime = require('rollingTime');
var query = require('./samplequery.js');

var RC=[],RT=[];

if(query.eval.val1.rolling.over.time){
RT.push(new rollingTime(query.eval.val1.rolling.over.time)); //rollingTime not available
}
else {
  RC.push(new rollingCount(query.eval.val1.rolling.over.count));//assume every computation is either rollingTime or rollingCount
}
if(query.eval.val2.rolling.over.count){
RC.push(new rollingCount(query.eval.val1.rolling.over.count));
}
else {
RT.push(new rollingTime(query.eval.val1.rolling.over.time));  //assume every computation is either rollingTime or rollingCount
}
var siftobj=new Object();

expkeys=query.select;
// console.log(query.eval);


siftobj.filter=function(value) {
var temp=new Object();
for (var i = 0; i < expkeys.length; i++) {
  temp[expkeys[i]]=value[expkeys[i]];
}
var RTCount=0,
    RCCount=0;
if(query.eval.val1.rolling.over.time){
temp.val1=RT[RTCount++][query.eval.val1.rolling.evaluate](value[query.eval.val1.rolling.on]); //rollingTime not available
}
else {
  temp.val1=RC[RCCount++][query.eval.val1.rolling.evaluate](value[query.eval.val1.rolling.on]);//assume every computation is either rollingTime or rollingCount
}
if(query.eval.val1.rolling.over.count){
temp.val2=RC[RCCount++][query.eval.val1.rolling.evaluate](value[query.eval.val1.rolling.on]); //rollingTime not available
}
else {
  temp.val2=RT[RTCount++][query.eval.val1.rolling.evaluate](value[query.eval.val1.rolling.on]);//assume every computation is either rollingTime or rollingCount
}

return temp;
}


var data={filter:{
  authorName:'emil',
  authorEmail:'some@noone.com',
  insertions:'100',
  deletions:'9'
}
};

var testQuery=sift(siftobj);
for (var i = 0; i < 10; i++) {
  console.log(testQuery(data));
}
// var output=testQuery(data);

// console.log(output);
