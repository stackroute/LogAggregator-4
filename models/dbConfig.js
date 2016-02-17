var mongoose = require('mongoose');
var masterDB = mongoose.createConnection("mongodb://172.23.238.253:27018/masterDB");
//var db1 = mongoose.createConnection("mongodb://localhost/nginx");
//var db2 = mongoose.createConnection("mongodb://localhost/LogAggregate");
// var db1 = mongoose.createConnection("mongodb://172.23.238.253:27018/nginx");
//var db2 = mongoose.createConnection("mongodb://172.23.238.253:27018/LogAggregate");

var userSchema = require('./log.user.model');
var organizationSchema=require('./log.organization.model');
var gitServiceConfigSchema=require('./gitServiceInfo');
var nginxServiceConfigSchema=require('./nginxServiceConfig');
var appgitServiceConfigSchema=require('./appgitServiceConfig');

var serverSchema = require('./log.server.model');
var configSchema = require('./log.config.model');
var aptLogSchema = require('./logSchema');
var aptConfigSchema = require('./configSchema');
var commitDataSchema = require('./org_data_schema');


var organizationModel = masterDB.model('Organization',organizationSchema);
var gitServiceModel= masterDB.model('GitServiceConfig',gitServiceConfigSchema);
var nginxServiceModel= masterDB.model('nginxServiceConfig',nginxServiceConfigSchema);
var appgitServiceModel= masterDB.model('AppgitServiceConfig',appgitServiceConfigSchema);

org(organizationModel);
var models={};

function setDbConnection(services,orgName){
models[orgName]={};
  for (var i = 0; i < services.length; i++) {

    var db1,db2,db3,serverModel,aptLogModel,aptConfigModel,commitDataModel;
    if(services[i]=="nginx"){
      nginxServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
        db1 = mongoose.createConnection("mongodb://"+docs[0].dbDetails.host+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName);
        models[orgName]['serverModel'] = db1.model('Logs',serverSchema);
        break;
      }
      });

    }
    else if(services[i]=="appgit"){

    appgitServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
     for (var i = 0; i < docs.length; i++) {
        db2 = mongoose.createConnection("mongodb://"+docs[0].dbDetails.host+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName);
        models[orgName]['aptLogModel'] = db2.model('aptLog',aptLogSchema);
        models[orgName]['aptConfigModel'] = db2.model('aptConfig', aptConfigSchema);
        break;
  }
     });

    }
    else if (services[i]=="git") {
      gitServiceModel.find({organizationName:orgName},{dbDetails:1,_id:0},function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
      db3 = mongoose.createConnection("mongodb://"+docs[0]["dbDetails"]["host"]+":"+docs[0].dbDetails.port+"/"+docs[0].dbDetails.dbName);
      models[orgName]['commitDataModel']=db3.model('someOtherCollectionName',commitDataSchema);

break;
}
    });
    }
  }
  var dbModels=
  {
    serverModel : serverModel,
    aptLogModel : aptLogModel,
    aptConfigModel : aptConfigModel,
    commitDataModel:commitDataModel

  };
  return dbModels;
}
module.exports = {
  userModel : masterDB.model('User',userSchema),
  configModel : masterDB.model('Config',configSchema),
  organizationModel : organizationModel,
  getModel:getModel
};

function org(organizationModel){
  organizationModel.find({}, 'organizationName services', function (err, docs) {
    for(var i=0;i<docs.length;i++){
  setDbConnection(docs[i].services,docs[i].organizationName);
}

});
}

function getModel(organization,model){
// console.log("org:"+organization+"Model:"+model);
// console.log(models);
// console.log(models[organization][model]+"-------------getModel");
//console.log(JSON.stringify(models)+"moood");
  // if(models[organization][model]==undefined){
  //   organizationModel.find({}, 'organizationName services', function (err, docs){
  //     for(var i=0;i<docs.length;i++){
  //       console.log(docs[i].organizationName+"---------------------"+docs[i].services+"-------------");
  //   models[docs[i].organizationName]=setDbConnection(docs[i].services);
  // }
  //   return models[organization][model];
  // });
  //
  // }
  // else{
    return models[organization][model];
//  }
}
