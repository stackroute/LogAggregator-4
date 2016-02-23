var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var DashBoards = require('../../models/dbConfig').gitDashBoardModel;
router.post('/',function(req,res,next){
  console.log("we got the request to fetch the dashboard json data");
  //res.send("git the request from the client");
  //console.log(DashBoards);
  DashBoards.find({},function(error,data){
    if(error){
      console.log("Not able to fetch the dashboard data from database");
    }
    else{
      console.log(data);
      res.send(data);
    }
  });
});

module.exports = router;
