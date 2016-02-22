var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var User = require('../../models/dbConfig').userModel;
router.post('/',function(req,res,next){
    //console.log(req.body.data);
    var obj ={"username":req.body.data.username}
    User.find(obj,{"_id":0,"organization":1,"lastName":1,"firstName":1,"email":1,"homeAddress":1,"phoneno":1},function(error,data){
      if(error){
        console.log("we are not able to fecth the data")
      }
      else{
        console.log("we got the user details");
        //console.log(data);
        res.send(data);
      }
    })
});

router.post('/edit',function(req,res,next){
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");
    //console.log(req.body.data.username);
    fetched_data = req.body.data;
    var obj ={"username":req.body.data.username.username};
    //console.log(fetched_data["data_set"]);
    var save_data = fetched_data["data_set"];
    //console.log("daved data");
    //console.log(obj);
    //console.log(save_data);
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
    //res.send("got the data");
    User.update(obj,{$set:save_data},function(error,data){
      if(error){
        console.log("data not updated");
        res.send("User Not found");
      }
      else{
        console.log("data updated successfully");
        res.send("data updated successfully");
      }
    });
});


module.exports = router;
