var sift = require('sift');
var _=require('highland')

// eval= {
//   val1: '140',
//   val2: <%= val1%>
// }

// console.log(eval.val2);
// // i=eval.val2;
// var fs = require('fs');
// var output=fs.createWriteStream('output')
// var calls=0;
// var num=_(['1','2','3','4','5','6']).map(function(x) {
//   ++calls;
//   return x+1;
// });
// var nums=num.batch(2);
// nums.pipe(output)
// var output=_(['some','texe']).intersperse('n');
// // _(output).pipe(process.stdout);

// var output=_(['somme','texmme']).splitBy('mm');
// _(output).pipe(process.stdout);
// var output=_(['foo', 'bar']).invoke('toUpperCase', [])
// _(output).pipe(process.stdout);
// var output=_(['foo', 'bar']).map(toUpperCase);
// _(output).pipe(process.stdout)

// var output=_([1]).reduce1(function(a,b) {
//   return a+b;
// });
// _(output).each(function(x) {
//   console.log(x);
// });
var ar=[]

for (var i = 1; i <= 100; i++) {
  ar.push(i);

}

var output=_(ar).batch(10).reduce1(function (a,b) {
  // console.log(x);
  a=parseInt(a);
  b=parseInt(b)
  return a+b;
});

_(output).each(function(x) {
  console.log(x);
})
// console.log(calls);
// var sift = require('sift');
//
//
// eval= {
//   val1: 5,
//   val2: 5
// }
//
// var sifter = sift({$where: function() {
//   return this.val1 >= this.val2;
// }});
//
// eval.highlight=sifter(eval)
// console.log(eval);
