var sum = require('./aggregator/avg-aggregator');
require('should');
require('expect');
var expect = require('chai').expect;
var AccumulateOverCount = require('./rollingCount/accumulateOverCount');

describe('Aggregate Sum Over Count', function(done) {
    it('sum', function(done) {
       // console.log('sum1: ' + sum);
        var res = sum([10,20,30]);
        console.log(res);
        res.should.be.instanceOf(Number);
        res.should.be.exactly(60);
        done();
    });

    it('sum over count', function(done) {
       // console.log('sum: ' + sum);
        var countAccumulator = new AccumulateOverCount(10, sum);

        for(var k=0;k<50;k++) {
            line = k;
            var sum2 = countAccumulator.eval(line);

            if(k>=0 && k<9) {
                //console.log(sum2)
                expect(sum2).to.be.an('undefined');
            }

            else {
                //console.log("k"+k)
              //  console.log(sum2);
                var result = ((10 * k) - 45);

                expect(sum2).to.equal(result)
            }
        }
        done();
    });
});