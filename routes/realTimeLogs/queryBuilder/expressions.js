var express = require('express');
var router = express.Router();
var Expression = require('../../../models/dbConfig').expressionModel;
var mainquery=require('../../../components/queryexecutor/mainquery.js');
var datamapper=require('../../../components/RTdatamapper/RTdatamapper.js');
var Namespace = require('../../../models/dbConfig').namespaceModel;

  router.post('/save', function(req, res, next) {
  // console.log('****************************in express routes********************* '+ JSON.stringify(req.body.data));
  var temp=new Expression(req.body)
  Expression.addExp(temp,function(err,doc) {
  if (err) {
  console.error(err);
  res.send(err);
  }
  else{
  mainquery(req.body.data);
  res.send(doc);
  }
  })

});


router.get('/modify', function(req, res, next) {
var search='select * from somethin';
if(true)
{
Expression.searchQuery(search,function(err,doc) {
  if (!err) {
  res.send(doc);
  }
})
}




});
router.post('/stream', function(req, res, next) {
   console.log("rcvd namespace " +JSON.stringify(req.body.data));
  //  console.log(Namespace);
   datamapper(req.body.data,Namespace);
  res.send("cha");
});

module.exports = router;
