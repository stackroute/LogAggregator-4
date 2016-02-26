var fs = require('fs');
var gitServiceModel = require('../models/dbConfig.js').gitServiceModel;

module.exports=function(orgName){
  var db=orgName+"DB";
  if(appendMatch(db))
  {
    content='\n<match '+db+'.*>\n'+
    '@type mongo\n'+
    'host 172.23.238.253\n'+
    'port 27018\n'+
    'database '+db+'\n'+
    'tag_mapped\n'+
    'remove_tag_prefix '+db+'\n'+
    '</match>';
try{
    fs.appendFileSync('/etc/td-agent/td-agent.conf',content);
  }
  catch(e){
    console.log("error while changing fluentd file",e);
  }
  }
  gitServiceModel.update({organizationName:orgName},
    {organizationName:orgName,dbDetails:{'dbName':db}},
    { upsert: true },
    function (err, gitDoc) {
      if (err) {
        console.log("error inserting DB name");
        return;
      }
      return;
    });
  };

  function appendMatch(db){
    try{
    var isAppend=true;
    fs.readFileSync('/etc/td-agent/td-agent.conf').toString().split('\n').forEach(function(line){
      if(line.indexOf(db)>-1){
        isAppend=false;
      }
    });
  }
  catch(e){
    console.log("error while changing fluentd file",e);
  }
    return isAppend
  }
