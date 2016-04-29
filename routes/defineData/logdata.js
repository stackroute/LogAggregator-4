var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var mongoose = require('mongoose');
var Namespace = require('../../models/dbConfig').namespaceModel;
var fs = require('fs');


/* POST Namespace*/
router.post('/', function(req, res) {
  console.log(req.body.data);
    Namespace.create({
      name: req.body.data.name,
      description: req.body.data.description,
      createdOn: Date.now(),
      source: req.body.data.source
    }, function(err, namespace) {
      if (err) {
        console.log(err);
      } else {
        console.log("namespace created and saved", namespace);
        // req.session.oid = namespace._id;
        // console.log('session',req.session.oid);
        res.status(201).send(namespace);
      }
    });
  });

router.get('/namespaceList', function(req, res) {
  // 
  // Namespace.remove({},function(){
  //   console.log("deleted");
  // });
  Namespace.find(function(err,namespace){
    res.send(namespace);
  });
});

module.exports = router;
