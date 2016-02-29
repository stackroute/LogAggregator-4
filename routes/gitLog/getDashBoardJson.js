var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
//var DashBoards = require('../../models/dbConfig').gitDashBoardModel;
var DashBoards = require('../../models/dbConfig').getModel;
router.post('/',function(req,res,next){
  console.log("we got the request to fetch the dashboard json data");
  //res.send("git the request from the client");
  //console.log(DashBoards);
  DashBoards(req.session.user.organization,"gitDashBoardModel").then(function(model){
    model.find({},function(error,data){
    if(error || data.length==0){
      console.log("Not able to fetch the dashboard data from database");
      res.end("No dashboard saved")
    }
    else{
      console.log(data);
      res.send(data);
    }
  });
});
});

router.post('/saveDash',function(req,res,next){
  console.log("we are into save dashboard section");
  var newDashBoard=req.body.data;
  console.log(newDashBoard);

  // var newDashBoard = {"name": "my_intension",
	// "row": {
	// 	"name": "commiiter.email",
	// 	"displayName": "Committer",
	// 	"aggregators": {
	// 		"name": "top",
	// 		"argument": 10
	// 	}
	// },
	// "measure": {
	// 	"primary": {
	// 		"function": {
	// 			"name": "count",
	// 			"argument": "commitID"
	// 		},
	// 		"displayName": "Commits"
	// 	}
	// },
	// "columns": [{
	// 	"name": "commitYear",
	// 	"displayName": "CommitYear",
	// 	"values": ["2014", "2015", "2016"]
	// }, {
	// 	"name": "commitMonth",
	// 	"displayName": "CommitMonth",
	// 	"values": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	// }],
	// "filters": [{
	// 	"_id": "3",
	// 	"name": "repo",
	// 	"displayName": "Repositories",
	// 	"values": ["node", "express", "angular"]
	// }]};

  DashBoards(req.session.user.organization,"gitDashBoardModel").then(function(model) {
    model(newDashBoard).save(function(error){
      if(error){
        console.log("Data not added to database");
        res.send("data not saved");
      }
      else{
        console.log("we added the data successfully");
        res.send("data is saved correctly");
        //console.log(data);
      }
    });
  });
});
module.exports = router;
