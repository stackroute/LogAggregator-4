var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/log4DB');
console.log("connection open");

//
// db.connection.on('connected',function(){
//   console.log('Connected to log4db...');
// });
// db.connection.error('error',function(err){
//   console.log('Error in connection' + err);
// });

var namespaceSchema = require('./namespaceSchema');

module.exports ={
  namespaceModel : db.model('Namespace',namespaceSchema)
};
