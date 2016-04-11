var _ = require('highland');
var QueryExecutor = require('../query-executor');
var should = require('should');

describe('Query Parser', function() {
  var inputStream = [];
  var i;
  for(i=0; i<100; i++) {
    inputStream.push({index: i,
                      insertions:'2',
                      deletions:'4',
                      authorName:'rick',
                      authorEmail:'morph'});
  }

  it('Simple Filter Query', function(done) {
    var query = {
      from: {
        where: {
          $and: [
            {index: {$gt: 20}},
            {index: {$lte: 50}}
          ],
        }
      },
     select:['insertions','deletions','authorName','authorEmail'],
     eval: {
       val1: {
         rolling: {
           evaluate: 'average',
           over: {
             count: 10
           },
           on: 'deletions' // measure
         }
       },
       val2: {
         rolling: {
           evaluate: 'average',
           over: {
             count: 10
           },
           on: 'insertions'
         }
       },
     },
     project: {
        // $highlight: {$condition: {val1: {$eq: eval['val2']}}}
        $highlight: {$condition: 'val1 ==val2'}
     },
     to: 'streamB'
    };
console.log("****************************changed****************************************");
    var executor = new QueryExecutor(query);

    var pipeline = executor.getPipeline();

    _(inputStream).pipe(pipeline).toArray(function(arr) {
      // console.log(arr);
      arr.should.be.instanceOf(Array).and.have.lengthOf(30);
      var truthy = arr.every(function(x) {
        return x>20 || x<=50
      });
      truthy.should.be.true;
      done();
    });
  });
});
