var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Logs = require('../../models/dbConfig').getModel;
router.post('/',function(req,res,next){
    var data = req.body.data;
    console.log(data);
    var str = '$' + data["filterby"];
    console.log(data["filterby"]);
    Logs(req.session.user.organization,"commitDataModel").then(function(model) {
      model.aggregate([
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
});

module.exports = router;
