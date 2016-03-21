var express = require('express');
var _ = require('highland');
var fs = require('fs');
var app = express();

// var express = require('express');
// var app=express();
app.get('/process-file', function(req, res) {
  var inputFile = 'input.txt';
  var outputFile = 'output.txt';

  // create a highland stream
  var data = _([inputFile]);

  data
    .flatMap(_.wrapCallback(fs.readFile))
    // .flatMap(_.wrapCallback(process1))
    // .flatMap(_.wrapCallback(process2))
    // .flatMap(_.wrapCallback(process3))
    .flatMap(_.wrapCallback(fs.writeFile.bind(fs, outputFile)))
    .stopOnError(function(err) {
      res.status(500).send (err);
    })
    .apply(function(data) {
      res.status(200).send('processed successfully using highland streams')
    });
});

app.listen(9090);


























//http://blog.vullum.io/javascript-flow-callback-hell-vs-async-vs-highland/
