var _ = require('highland');
var sift = require('sift');


var sifter=sift({index:{$gt:'0'}});

console.log(sifter({index:'-9'}));
