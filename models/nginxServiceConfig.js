var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var nginxServiceConfigSchema = new Schema(
{
  organizationName: String,
  service:String,
  dbDetails:{
    host:String,
    port:String,
    dbName:String,
    collection: String
  }
},{collection: "nginxServiceConfig"});
module.exports = nginxServiceConfigSchema;
