var mongoose = require('mongoose');

var namespaceSchema = new mongoose.Schema({
  name:String,
  description:String,
  createdOn:Date,
  filePath:String,
  dimensions:[{
              displayName :String,
              fieldName : String
            }],
  measures:[{
            displayName :String,
            aggrFunc:String,
            fieldEvent:String,
            filterField:String,
            filterValue:String
          }],
},{collection:"namespaces"});

namespaceSchema.statics.findNamespace=function(name,cb){
  this.findOne(
  {_id : name})
  .exec(function(err,namespace){
    if(!err)
    {
      cb(null,namespace);
    }
    else
      {
        cb(err,null);
      }
    });
  };




module.exports=namespaceSchema;
