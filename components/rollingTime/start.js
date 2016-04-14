var fs = require('fs');

//Read Data file
var input = fs.createReadStream('datastream.csv');

var sum = require('./sum-aggregator');
var count = require('./count-aggregator');
var avg = require('./avg-aggregator');
var min = require('./min-aggregator');
var max = require('./max-aggregator');

var TimeAccumulator = require('./time-accumulator');
//Creating a new instance
var timeAccumulator = new TimeAccumulator(1, max);

readLines(input);
//Function for sending streaming data as input
function readLines(input) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;

      var result = timeAccumulator.evaluate(line);
      console.log(result);

      index = remaining.indexOf('\n', last);
    }
    remaining = remaining.substring(last);
  });
  input.on('end', function() {

  });
}
