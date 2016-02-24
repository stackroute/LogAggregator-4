var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();

var organizationModel = require('../models/dbConfig.js').organizationModel;
var gitServiceModel = require('../models/dbConfig.js').gitServiceModel;
var nginxServiceModel = require('../models/dbConfig.js').nginxServiceModel;
var appgitServiceModel = require('../models/dbConfig.js').appgitServiceModel;

router.post('/:service', function(req, res){
  req.body['organizationName']=req.session.user.organization;
  req.body['service']=req.params.service;
  organizationModel.findOne({organizationName:req.session.user.organization}, function (err, organization) {
    if (err) {
      res.send({state: 'failure'});
      return;
    }
    var flag=true;
    if(organization && organization.services){
      for (var i = 0; i < organization.services.length; i++) {
        if(organization.services[i]==req.params.service){
          flag=false;
          break;
        }
      }
      if(flag){
        organization.services.push(req.params.service);
        organization.save(function (err) {
          if (err) {
            console.log("error");
          }
        });
      }
    }
    var model;
    if(req.params.service=="git"){
      model=gitServiceModel;
    }
    else if(req.params.service=="nginx"){
      model=nginxServiceModel;
    }
    else if(req.params.service=="appgit"){
      model=appgitServiceModel;
    }
    model.update(
      { organizationName: req.body['organizationName'] },
      req.body,
      { upsert: true, raw: true }, function(error){
        if(error){
          console.log(error,"errrrrrrrrrrrrrrrrrrrr");
          res.send({state: 'failure'});
          return;
        }
        res.send({state: 'success'});
        return;
      }
    );
  });
});

router.get('/json/:service', function(req, res){
  var model2;
  if(req.params.service=="git"){
    model2=gitServiceModel;
  }
  else if(req.params.service=="nginx"){
    model2=nginxServiceModel;
  }
  else if(req.params.service=="appgit"){
   model2=appgitServiceModel;
  }
  console.log(req.session.user.organization);
  model2.findOne(
    { organizationName: req.session.user.organization },function(error,doc){
      console.log(doc,"doc----");
     if(!doc){
         res.send({state: 'failure'});
         return;
     }
      res.send({state: 'success',data:doc});
      return;
    }
  );

});

router.post('/git/DB', function(req, res){
  gitServiceModel.update({organizationName:req.session.user.organization},
{organizationName:req.session.user.organization,dbDetails:req.body},
{ upsert: true, raw: true },
    function (err, gitDoc) {
    if (err) {
      res.send({state: 'failure'});
      return;
    }
    res.send({state: 'success'});
    console.log("@@@@@@@@@@------------------------" + gitDoc);
    return;
  });
});

router.post('/git/authO', function(req, res){
  gitServiceModel.findOne({organizationName:req.session.user.organization},
    function (err, gitDoc) {
    if (err) {
      res.send({state: 'failure'});
      return;
    }
    gitDoc.gitHost = req.body.gitHost;
    gitDoc.gitauthSets=req.body.gitauthSets;
    gitDoc.save(function (err) {
      if (err) {
        res.send({state: 'failure'});
        return;
      }
    });
    res.send({state: 'success'});
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + gitDoc.organizationName);
    console.log(createJson(gitDoc.organizationName) +"ppppppppppppppppppppppppp000000000000000");
    return;
  });
});

router.post('/git/repos', function(req, res){
  gitServiceModel.findOne({organizationName:req.session.user.organization},
    function (err, gitDoc) {
    if (err || !gitDoc) {
      res.send({state: 'failure'});
      return;
    }
    var flag=true;
    for (var i = 0; i < gitDoc.repositoryData.length; i++) {
      if(gitDoc.repositoryData[i].gitAccountname==req.body.gitAccountname)
      {
        gitDoc.repositoryData[i].repos =  req.body.repos;
        flag=false;
        break;
      }
    }
    if(flag){
      gitDoc.repositoryData.push(req.body);
    }
    gitDoc.save(function (err) {
      if (err) {
        res.send({state: 'failure'});
        return;
      }
      res.send({state: 'success'});
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + gitDoc);
      return;
    });
  });
});

function createJson(orgName){
  var createJsonObj = {};json = [];
  // var stringifiedJson = [];var tempObj = {};
  // var oooo = orgName + "";
  // gitServiceModel.findOne({organizationName:oooo},
  //    function(err,obj) {
  //      console.log(obj + "yrdhrdgfrdvcdvzgfcxvf");
  //      tempObj = obj;
  //      json.push(obj);
  //
  //    });
// return(JSON.stringify(json));
  createJsonObj.organizationName = orgName ;
  createJsonObj.fileName = orgName + "file" ;

  json.push(createJsonObj) ;
  return(JSON.stringify(json));
}



module.exports = router;
