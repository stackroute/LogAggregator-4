var express = require('express');
var router = express.Router();
var Expression = require('../../../models/dbConfig').expressionModel;


  router.post('/save', function(req, res, next) {
  // console.log('****************************in express routes********************* '+ req.body.data);
  var temp=new Expression(req.body)
  Expression.addExp(temp,function(err,doc) {
  if (err) {
  console.error(err);
  res.send(err);
  }
  else{
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

module.exports = router;
