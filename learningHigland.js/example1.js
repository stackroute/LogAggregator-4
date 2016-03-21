var express = require('express');
var _ = require('highland');
var fs = require('fs');
var app = express();

// var express = require('express');
// var app=express();
app.get('/process-file', function(req, res) {
var outputFile = 'dg1.jpg';
  var readFile = fs.createReadStream('dg.jpg');
  // create a highland stream
  var data = _(readFile);
  data.pipe(fs.createWriteStream("dg1.jpg"));

});

app.listen(9090);
