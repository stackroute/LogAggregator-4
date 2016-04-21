var mongoose = require('mongoose');
var getMeasure = require('../components/RTdatamapper/RTdatamapper');
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
            measureType:String,
            eventField:String,
            eventValue:String
          }],
  source:String,
  port:Number
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

  namespaceSchema.post('save',function (namespace) {
    //  console.log('nid' +namespace._id + '||' +namespace.measures);
      getMeasure(namespace.measures);
    });


module.exports=namespaceSchema;
