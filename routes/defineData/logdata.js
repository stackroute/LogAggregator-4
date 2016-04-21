var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var mongoose = require('mongoose');
var Namespace = require('../../models/dbConfig').namespaceModel;
var fs = require('fs');



/* GET log data */
router.get('/', function(req, res) {
  if (req.session.oid !== null) {
    Namespace.findNamespace(req.session.oid, function(err, namespace) {
      if (namespace != null) {
        fs.readFile(namespace.filePath, 'utf8', function(err, data) {
          if (err) {
            return console.log(err);
          }
          var nameObj ={
            namespaceName:namespace.name,
            filedata:JSON.parse(data)
          };
          res.send(nameObj);
        });
      }
    });
  }
});

/* POST Namespace*/
router.post('/', function(req, res) {
  //creates a new incoming form.
  var form = new formidable.IncomingForm();

  // parse a file upload
  form.parse(req, function(err, fields, files) {
    var newPath;
    fs.readFile(files.file.path, function(err, data) {
      var filedata = data.toString();
      fs.writeFile("public/upload/" + files.file.name, filedata, function(err) {
        if (err) return console.log(err);
        console.log("file written");
      });
    });

    Namespace.create({
      name: fields.namespace,
      description: fields.desc,
      createdOn: Date.now(),
      filePath: "public/upload/" + files.file.name,
      source: fields.fileSource

    }, function(err, namespace) {
      if (err) {
        console.log(err);
      } else {
        console.log("namespace created and saved", namespace);
        req.session.oid = namespace._id;
        res.redirect('/#/defineData');
      }
    });
  });
});

//get the list of namespace
router.get('/namespaceList', function(req, res) {

  Namespace.find(function(err,namespace){
    res.send(namespace);
  });
});


module.exports = router;
