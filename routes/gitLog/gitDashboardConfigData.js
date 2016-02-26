var express = require('express');
var router = express.Router();
var fs = require('fs');
router.post('/', function(req, res, next) {
  // console.log("getDataForClientgetDataForClientgetDataForClient");
  //dashBoardObject=req.body.data
  var dashBoardObject = {
  	"dimensions": [{
      "_id":"1",
  		"name": "repo",
  		"displayName": "Repositories",
  		"values": ["nodejs/node", "nodejs/pode"]
  	}, {
      "_id":"2",
  		"name": "commitYear",
  		"displayName": "Commit Year",
  		"values": [2012, 2011, 2010]
  	}, {
      "_id":"3",
  		"name": "commitMonth",
  		"displayName": "Commit Month",
  		"values": ["January", "Month"]
  	}, {
      "_id":"4",
  		"name": "commitDay",
  		"displayName": "Commit Day",
  		"values": ["Monday", "Tuesday"]
  	}, {
      "_id":"5",
  		"name": "commitDate",
  		"displayName": "Commit Date",
  		"values": ["Some Date", "Some Other Date"]
  	}, {
      "_id":"6",
  		"name": "committer.email",
  		"displayName": "Commiter",
  		"values": ["Sridharan@iAmFuckinAsshole.com", "Pranay@beardGuy.com"]
  	}],
    "measures": [{
  "function": {"name":"count","argument":"commitID"},
  "displayName": "Commits"
}, {
  "function": {"name":"sum","argument":"insertion"},
  "displayName": "Insertions"
}, {
  "function": {"name":"sum","argument":"deletion"},
  "displayName": "Deletions"
}, {
  "function": {"name":"sum","argument":"noOfFiles"},
  "displayName": "Number of Files Changed"
}],
  	"operators": {
  		"logical": ["and", "or"],
  		"condtional": [">", "<", ">=", "<=", "=="]
  	},
  	"aggregators": [{
  		"displayName": "top",
  		"noOfArguments": 1,

  	}, {
  		"displayName": "bottom",
  		"noOfArguments": 1
  	}, {
  		"displayName": "average",
  		"noOfArguments": 0
  	}]
  };
  //  dashBoardObject = JSON.parse(dashBoardObject);
  console.log(Object.keys(dashBoardObject));
  res.send(dashBoardObject);
});


module.exports = router;
