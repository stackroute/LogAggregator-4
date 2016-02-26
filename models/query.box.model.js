var mongoose = require('mongoose');

var Schema= mongoose.Schema;
var queryBoxOut = new Schema({
"_id" : String,
"git" : {
  "dimensions" : [
    {
      name : String,
      displayName : String
    }
  ],
  "measures" : [
    {
      function : {
      name : String,
      argument : String
    },
    displayName : String
  }
  ],
  "operators" : {
    "logical" : [],
    "condtional" : []
  },
  "aggregators" : []
  }
},{collection: "queryBox"});

module.exports = queryBoxOut;
