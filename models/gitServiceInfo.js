var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var gitServiceConfigSchema = new Schema(
{
  organizationName: String,
  service:String,
  dbDetails:{
    host:String,
    port:String,
    dbName:String,
    collection: String
  },
  gitHost: String,
  gitauthSets: [{gitOauth:String}],
  repositoryData : [
    {
      gitAccountname : String,
      repos: [
      {repo : String,
      gitRepoId: String}
    ]
  }],
  dashBoards: [{
    name: String,
    measure:    {
      measureEntity: String,
      measureFunction: String
    },
    subject: String,
    filterDetails: [
      {
        filterName: String,
        filters: []
      }
    ],
    timePeriod:{
      startDate: Date,
      endDate: Date
    }
  }]
},{collection: "gitServiceConfig"});
module.exports = gitServiceConfigSchema;
