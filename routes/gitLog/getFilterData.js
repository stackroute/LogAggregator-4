 var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var schema = require('./org_data_schema');

router.post('/',function(req,res,next){
    mongoose.connect('mongodb://localhost/someOtherDbName');
    var data = req.body.data;
     console.log(data);
    // console.log("We are here");
    //res.send("we are here");

    var commitData = mongoose.model('someOtherCollectionName',schema,'someOtherCollectionName');
    var str = '$' + data["filterby"];
    console.log(data["filterby"]);
    //console.log(filter_query);
    commitData.aggregate([
                  {
                    "$group":
                    {
                      "_id": str
                    }
                  }
    ],function(err,result){
      if(err){
        console.log("we are having issue in retriving data");
      }
      else{
        console.log("we successfully retrieved the data");
        console.log(result);
        mongoose.connection.close();
        res.send(result);
      }
    });
});

module.exports = router;
