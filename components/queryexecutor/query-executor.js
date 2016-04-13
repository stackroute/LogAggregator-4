var sift = require('sift');
var _ = require('highland');
var rollingCount=require('../rollingCount/index');
var QueryExecutor = function(query) {
  var self = this;
  self.query = query;
   var RC=new Array();
   var RT=new Array();
  self.getPipeline = function() {
    return self.createPipeline(self.query);
  }

  self.createPipeline = function(query) {
    var pipeline = [];

    if(query.hasOwnProperty('from') && query.from.hasOwnProperty('where')) {
      var sifter = sift(query.from.where);
      pipeline.push(_.filter(sifter));
    }
    pipeline.push(_.map(function(obj) {
      // console.log('in query exec ');
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
      var data={
        filter:obj
      };
      var testQuery=sift(siftobj);
      var tempdata=testQuery(data);  //testQuery returns object with val1 and val2 set
      var condition=query.project.$highlight.$condition;
      condition=condition.replace('val1','tempdata.val1');
      condition=condition.replace('val2','tempdata.val2')
                                                 //filter that returns true/false depending on query condition
                                                 //{val1: {$gte: '$val2'}}//query.project.$highlight.$condition
      tempdata.highlight=eval(condition)                  //highlight set to true/false depending on val1 and val2
      console.log(tempdata);
      return tempdata; //object with select parameters and highlight
    }));
    return _.pipeline.apply(this, pipeline);
  };
};

exports = module.exports = QueryExecutor;
