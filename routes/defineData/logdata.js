var express = require('express');
var router = express.Router();
// var json = [{
//     "host": "216.67.1.92",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/Aug/2006:07:01:53 -0700]",
//     "request": "GET /index1.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Mozilla/5.0",
//     "cookies": "-"
//   }, {
//     "host": "216.67.1.93",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[14/Sep/2006:07:01:53 -0700]",
//     "request": "GET /index.html HTTP/1.0",
//     "statuscode": "404",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Mozilla/5.0",
//     "cookies": "-"
//   }, {
//     "host": "216.67.1.95",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/Sep/2006:07:01:53 -0700]",
//     "request": "GET /index2.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "432",
//     "referrer": "http://www.google.com",
//     "user_agent": "Mozilla/5.0",
//     "cookies": "-"
//   }, {
//     "host": "218.67.1.97",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/May/2006:07:01:53 -0700]",
//     "request": "GET /index3.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Mozilla/5.0",
//     "cookies": "-"
//   }, {
//     "host": "217.67.1.91",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/Sep/2006:07:01:53 -0700]",
//     "request": "GET /index.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Mozilla/5.0",
//     "cookies": "-"
//   }, {
//     "host": "216.67.2.91",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/Sep/2006:07:01:53 -0700]",
//     "request": "GET /index.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Google Chrome",
//     "cookies": "-"
//   },{
//     "host": "216.67.2.95",
//     "rfc931": "-",
//     "username": "-",
//     "datetime": "[13/Sep/2006:07:01:53 -0700]",
//     "request": "GET /index.html HTTP/1.0",
//     "statuscode": "200",
//     "bytes": "431",
//     "referrer": "http://www.google.com",
//     "user_agent": "Google Chrome",
//     "cookies": "-"
//   }
//
// ];
//
// router.get('/', function(req, res){
//
//  res.send(json);
//  });

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
module.exports = router;
