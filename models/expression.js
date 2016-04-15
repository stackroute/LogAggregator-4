var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var mainquery = require('../components/queryexecutor/mainquery');
var expSchema = new Schema({
query:String

});


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
//
// expschema.post('save',function(query) {
// mainquery(query);
// })



module.exports=expSchema;
