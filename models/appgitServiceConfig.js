var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var appgitServiceConfigSchema = new Schema(
{
  organizationName: String,
  service:String,
  dbDetails:{
    host:String,
    port:String,
    dbName:String,
    collection: String
  }
},{collection: "appgitServiceConfig"});
module.exports = appgitServiceConfigSchema;
