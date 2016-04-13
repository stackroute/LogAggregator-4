var mongoose = require('mongoose');
// var masterDB = mongoose.createConnection("mongodb://localhost:27017/masterDB");

var masterDB = mongoose.createConnection("mongodb://172.23.238.253:27018/masterDB");
//var db = mongoose.createConnection('mongodb://localhost/log4DB');

// var masterDB = mongoose.createConnection("mongodb://localhost:27017/masterDB");
//var masterDB = mongoose.createConnection("mongodb://172.23.238.253:27018/masterDB");
//var db1 = mongoose.createConnection("mongodb://localhost/nginx");
//var db2 = mongoose.createConnection("mongodb://localhost/LogAggregate");
// var db1 = mongoose.createConnection("mongodb://172.23.238.253:27018/nginx");
//var db2 = mongoose.createConnection("mongodb://172.23.238.253:27018/LogAggregate");

var userSchema = require('./log.user.model');
var organizationSchema=require('./log.organization.model');
var gitServiceConfigSchema=require('./gitServiceInfo');
var nginxServiceConfigSchema=require('./nginxServiceConfig');
var appgitServiceConfigSchema=require('./appgitServiceConfig');


var querySchema = require('./querySchema');

var serverSchema = require('./log.server.model');
var configSchema = require('./log.config.model');
var aptLogSchema = require('./logSchema');
var aptConfigSchema = require('./configSchema');
var commitDataSchema = require('./org_data_schema');
var gitDashBoardSchema = require('./gitlog.dashBoard.model');
var onPageLoadDashBoardSchema = require('./onLoaddashboard.model');
var queryBoxSchema = require('./query.box.model');
var saveDashBoardSchema = require('./query.box.model');
var expschema=require('./expression.js')

//wave4
var namespaceSchema = require('./namespaceSchema');

var organizationModel = masterDB.model('Organization',organizationSchema);
var gitServiceModel= masterDB.model('GitServiceConfig',gitServiceConfigSchema);
var nginxServiceModel= masterDB.model('nginxServiceConfig',nginxServiceConfigSchema);
var appgitServiceModel= masterDB.model('AppgitServiceConfig',appgitServiceConfigSchema);
// var gitDashBoardModel = masterDB.model('gitDashBoardConfig',gitDashBoardSchema);
// var onPageLoadDashBoardModel =masterDB.model('onPageLoadDashBoardConfig',onPageLoadDashBoardSchema);
var queryBoxModel = masterDB.model('queryBox',queryBoxSchema);
var queryModel = masterDB.model('Query', querySchema);
var expressionModel=masterDB.model('expression',expschema);

org(organizationModel);
var models={};

function setDbConnection(services,orgName) {
  console.log("Inside Set Db Connection");
  var promise = new Promise(function(resolve,reject) {
    models[orgName]={};
    for (var i = 0; i < services.length; i++) {
      var db1,db2,db3,serverModel,aptLogModel,aptConfigModel,commitDataModel;
      if(services[i]=="nginx"){
        nginxServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
          for (var i = 0; i < docs.length; i++) {
            db1 = mongoose.createConnection("mongodb://"+docs[0].dbDetails.host+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName,function(err){
              if(err){
                console.log("error connecting to gitDB of:",orgName);
              }
            });
            models[orgName]['serverModel'] = db1.model('Logs',serverSchema);
            console.log("resolving stuffs in set Db Connection");
            resolve();
          }
        });
      }
      else if(services[i]=="appgit"){
        appgitServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
          for (var i = 0; i < docs.length; i++) {
            db2 = mongoose.createConnection("mongodb://"+docs[0].dbDetails.host+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName,function(err){
              if(err){
                console.log("error connecting to gitDB of:",orgName);
              }
            });
            models[orgName]['aptLogModel'] = db2.model('aptLog',aptLogSchema);
            models[orgName]['aptConfigModel'] = db2.model('aptConfig', aptConfigSchema);
            console.log("resolving model in setDbConnection");
            resolve();
          }
        });
      }
      else if (services[i]=="git") {
        gitServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
          for (var i = 0; i < docs.length; i++) {
            db3 = mongoose.createConnection("mongodb://"+docs[0].dbDetails.host+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName,function(err){
              if(err){
                console.log(err);
                console.log("error connecting to gitDB of:",orgName);
              }
            });
            models[orgName]['commitDataModel']=db3.model('gitLogs',commitDataSchema);
            models[orgName]['gitDashBoardModel']=db3.model('gitDashBoardConfig',gitDashBoardSchema);
            models[orgName]['onPageLoadDashBoardModel']=db3.model('onPageLoadDashBoardConfig',onPageLoadDashBoardSchema);
            console.log("resolving model in setDbConnection");
            resolve();
        }
      });
    }
  }
  });
  return promise;
}

module.exports = {
  userModel : masterDB.model('User',userSchema),
  configModel : masterDB.model('Config',configSchema),
  organizationModel : organizationModel,
  gitServiceModel: gitServiceModel,
  nginxServiceModel: nginxServiceModel,
  appgitServiceModel:appgitServiceModel,
  getModel:getModel,
  queryBoxModel:queryBoxModel,
  namespaceModel : masterDB.model('Namespace',namespaceSchema),
  queryModel: queryModel,
  expressionModel:expressionModel
};

function org(organizationModel){
  organizationModel.find({}, 'organizationName services', function (err, docs) {
    for(var i=0;i<docs.length;i++){
      setDbConnection(docs[i].services,docs[i].organizationName);
    }
  });
}


function getModel(organization,model){
  console.log("Inside get Model");
  return new Promise(function(resolve,reject) {
    if(models[organization]==undefined||models[organization][model]==undefined){
      console.log("inside if");
      organizationModel.findOne({'organizationName':organization}, 'organizationName services', function (err, doc){
        if(err){
          reject();
        }
        setDbConnection(doc.services,doc.organizationName).then(function() {
          console.log("resolving in get models");
          resolve(models[organization][model]);
        })
      });
    }
    else{
      console.log("resolving in get models");
      resolve(models[organization][model]);
    }
  });
}
