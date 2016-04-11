var express = require('express');
var router = express.Router();
var Expression=require('mongoose').model('Expression');

  router.post('/save', function(req, res, next) {
  req.body.expressions=JSON.parse(req.body.expressions);
  req.body.nestedexpressions=JSON.parse(req.body.nestedexpressions);

  var temp=new Expression(req.body)
  Expression.addExp(temp,function(err,doc) {
  if (err) {
  console.error(err);
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
