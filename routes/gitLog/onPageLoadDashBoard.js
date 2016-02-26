var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var onLoadDashBoard = require('../../models/dbConfig').getModel;
router.post('/',function(req,res,next){
  console.log("we got the request to fetch the dashboard json data");
  console.log(onLoadDashBoard);
  // res.send("got the request");
  onLoadDashBoard(req.session.user.organization,"gitDashBoardModel").then(function(model) {
    model.findOne({},function(error,data){
    if(error || data=={}){
         console.log("cannot retrive data from onpage load dashboard");
       res.end("No dashboard saved");
      }
      else{
        console.log("data",data);
        res.send(data);
      }
    });
  })
});

module.exports = router;
