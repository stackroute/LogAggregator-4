var mongoose = require('mongoose');
var RTdatamapper = require('../components/RTdatamapper/RTdatamapper');

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
      // if (!err){
      console.log('nid' +namespace._id + '||' +namespace.measures);
        RTdatamapper(namespace._id,namespace.measures);

      //  log.info('post saving...', this);
      // }
      // else{
      //     console.log('error occured in hook' + err);
      // }
    });


module.exports=namespaceSchema;
