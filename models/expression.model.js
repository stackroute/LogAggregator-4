var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var expSchema = new Schema({


},{collection: "expressions"});


expSchema.statics.addExp=function addExp(obj,cb) {
obj.save(function(err,doc) {
    if (err) {
    console.error(err);
    cb(err,null);
    }
    else {
    console.log(doc);
    cb(null,doc);
    }
    })
}

expSchema.statics.searchQuery=function searchQuery(searchquery,cb) {
  this.find({sqlquery:searchquery},function(err,doc) {
    if (!err) {
      cb(null,doc);
    }
    else {
      cb(err,null);
    }
  })
}

mongoose.model('Expression', expSchema);
