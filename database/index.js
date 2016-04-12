/**
 * Created by COMP on 12-04-2016.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

mongoose.connection.on('open', function() {
    console.log('Connected to database');
});
mongoose.connection.on('error', function(err) {
    console.err('Problem connecting to database');
    return process.exit(-1);
});