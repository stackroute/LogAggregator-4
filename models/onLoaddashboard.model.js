var mongoose = require('mongoose');
// var crypto = require('crypto');
var Schema =  mongoose.Schema;

var DashBoardsJsonSchema = new Schema({
        "graph-type" : String,
        measure : {},
        "operation-type" : String,
        primaryGroupByField : String,
        secondaryGroupByField : {},
        aggregator : {
                function : String,
                argument : Number
        },
        filters : []
},{collection: "onPageLoadDashBoardConfig"});

module.exports = DashBoardsJsonSchema;
