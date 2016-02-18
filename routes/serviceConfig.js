
var express = require('express');
var router = express.Router();

var organizationModel = require('../models/dbConfig.js').organizationModel;
var gitServiceModel = require('../models/dbConfig.js').gitServiceModel;
var nginxServiceModel = require('../models/dbConfig.js').nginxServiceModel;
var appgitServiceModel = require('../models/dbConfig.js').appgitServiceModel;

router.post('/:service', function(req, res){
  req.body['organizationName']=req.session.user.organization;
  req.body['service']=req.params.service;
  console.log(req.body);
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
    model.findOneAndUpdate(
      { organizationName: req.body['organizationName'] },
      req.body,
      { upsert: true },function(error){
        res.send({state: 'success'});
        return;
      }
    );
  });
});

module.exports = router;
