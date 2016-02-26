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
      { upsert: true },function(error){
        if(error){
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
  model2.findOne(
    { organizationName: req.session.user.organization },function(error,doc){
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
  organizationModel.findOne({organizationName:req.session.user.organization}, function (err, organization) {
    if (err) {
      res.send({state: 'failure'});
      return;
    }
    var flag=true;
    if(organization && organization.services){
      for (var i = 0; i < organization.services.length; i++) {
        if(organization.services[i]=="git"){
          flag=false;
          break;
        }
      }
      if(flag){
        organization.services.push("git");
        organization.save(function (err) {
          if (err) {
            console.log("error");
          }
        });
      }
    }
    gitServiceModel.update({organizationName:req.session.user.organization},
      {organizationName:req.session.user.organization,dbDetails:req.body},
      { upsert: true },
      function (err, gitDoc) {
        if (err) {
          return;
        }
        console.log(createJsonFile(req.session.user.organization));
        console.log(createJson(req.session.user.organization));
        res.send({state:"success"});
        return;
      });
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
        console.log(createJsonFile(req.session.user.organization));
        res.send({state: 'success'});
        return;
      });
    });

    router.post('/git/deleteRepo', function(req, res){
      gitServiceModel.update({organizationName:req.session.user.organization},
        { $pull: { 'repositoryData': {gitAccountname:req.body.gitAccountname} } },
        function (err) {
          if (err) {
            res.send({state: 'failure'});
            return;
          }
          console.log(createJsonFile(req.session.user.organization));
          res.send({state: 'success'});
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
              console.log(createJsonFile(req.session.user.organization));
              res.send({state: 'success'});
            return;
            });
          //  console.log(createJsonFile(req.session.user.organization));

          });
        });


function createJsonFile(orgName){
var json = [];
  gitServiceModel.find({organizationName: orgName},
    function (err, gitDoc) {
      if (err) {
        return;
      }
      var requiredJson = manipulateJsonForGitAgent(gitDoc);
      console.log(requiredJson);
      var fileName = "../organizationJsons/" +orgName + "File" + ".json";
      var outPath = path.join(__dirname, fileName);
// Convert object to string, write json to file
      fs.writeFileSync(outPath, JSON.stringify(requiredJson), 'utf8',
       function(err){console.log(err);});
           return;
    });
}

function createJson(orgName){
    var filePath = path.join(__dirname, '../organizationJsons/metadata.json');
    var metaDataFile = fs.readFileSync(filePath, {encoding: 'utf-8'},
    function(err){console.log(err);});

var response = JSON.parse(metaDataFile);
var len = response.length;
var flag = 0;
var organizationJson = [];
for(var i = 0; i < len; i++){
     if (response[i].organizationName === orgName) {
      console.log("We found the Organization");
      console.log(response[i].organizationName);
      flag = 1;
    }
  }

var json = [];
if (flag == 0){
  for(var j = 0; j < len; j++){
    var obj = {};
    obj["organizationName"] = response[j].organizationName;
    obj["organizationFileName"] = response[j].organizationFileName;
    obj["organizationJobFileName"] = response[j].organizationJobFileName;
    json.push(obj);
  }
  var obj = {};
    obj["organizationName"] = orgName;
    obj["organizationFileName"] = orgName + "File.json";
    obj["organizationJobFileName"] = orgName + "JobFile.json";
    json.push(obj);
    }
    // var fileName = "../" +orgName + "File" + ".json";
    // var outPath = path.join(__dirname, fileName);
    // Convert object to string, write json to file
    fs.writeFileSync(filePath, JSON.stringify(json), 'utf8',
     function(err){console.log(err);});
         return;
}


function manipulateJsonForGitAgent(inpJson){
var data = inpJson; var obj = {};

obj["_id"] = data[0]["_id"];
obj["organizationName"] = data[0]["organizationName"];
obj["gitHost"] = data[0]["gitHost"];
obj["dbName"] = data[0]["dbDetails"]["dbName"];

var arr1 = [];var arr2 = [];  var objTemp = {};
if((data[0]["gitauthSets"]) !== undefined){
for(var i = 0 ; i < data[0]["gitauthSets"].length ; i++) {
arr1.push(data[0]["gitauthSets"][i]["gitOauth"]);
}
}
obj["gitOauthSets"] = arr1;
if((data[0]["repositoryData"]) !== undefined && data[0]["repositoryData"][0]!==undefined){
  for(var k = 0 ; k < data[0]["repositoryData"].length ; k++) {
for(var j = 0 ; j < data[0]["repositoryData"][k]["repos"].length ; j++) {
// console.log(data[0]["repositoryData"]["gitAccountname"]);
objTemp["gitUserName"] =  data[0]["repositoryData"][k]["gitAccountname"];
// console.log(data[0]["repositoryData"][0]["repos"][j]["repo"]);
objTemp["repo"] =  (data[0]["repositoryData"][k]["repos"][j]["repo"].split("/"))[1];
// console.log(data[0]["repositoryData"][0]["repos"][j]["_id"]);
objTemp["_id"] =  data[0]["repositoryData"][k]["repos"][j]["_id"];
arr2.push(objTemp);
objTemp = {};
}
}
}
obj["repositoryData"] = arr2;

return obj;
}
        module.exports = router;
