var fs = require('fs');

//Read Data file
var input = fs.createReadStream('datastream.csv');

var rollingTimeWindow = require('./rollingTime.js');
//Creating a new instance
var timeWindow = new rollingTimeWindow(10);

readLines(input,timeWindow);
//Function for sending streaming data as input
function readLines(input, timeWindow) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;

       //console.dir(timeWindow);
       //console.log(timeWindow.count(line));
       //console.log(timeWindow.sum(line));
      // console.log(timeWindow.avg(line));
      //console.log(timeWindow.min(line));
       console.log(timeWindow.max(line));
      // console.log(timeWindow.StandardDeviation());

      index = remaining.indexOf('\n', last);
    }
    remaining = remaining.substring(last);
  });
  input.on('end', function() {

  });
}
