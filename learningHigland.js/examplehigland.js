var highland = require('highland');
var _=highland;

// _([1,2,3,4]).toArray(function (xs) {
//     // xs is [1,2,3,4]
//     console.log(xs);
// });


// var doubled = _([1,2,3,4]).map(function (x) {
//     //console.log('hi');
//     return x * 2;
// });
// console.log(doubled);
// var shouty = _(['foo', 'bar', 'baz']).map(toUpperCase);
// console.log(shouty);
var stream =_([1,2]);
// stream.destroy();
//stream.write(10);
//stream.write('shefali');
// stream.end();
// stream.destroy();
//  stream.pause();
//stream.write(20);
//stream.resume();
//stream.end();
stream.append(4);
stream.toArray(function(x){
  console.log((x));
});
