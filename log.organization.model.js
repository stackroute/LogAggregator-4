var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var organizationSchema = new Schema(
  {
    organizationName: {
      type: String,
      unique: true,
      required: 'Username is required',
      trim: true
    },
    services: []
  }  
  ,{collection: "organizations"})
  module.exports = organizationSchema;
