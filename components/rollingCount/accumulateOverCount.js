

module.exports=function AccumulateOverCount(count, evalFunc) {
   // var self = this;
    console.log('evalFunc1: ' + this.evalFunc);
    this.count = count;
    this.evalFunc = evalFunc;
    var fn=evalFunc;
    arr= new Array(count);
    var counter=0;

    this.eval = function(line) {
        if(counter<count-1)
        {
            arr[counter]=line;
        //   console.log(arr);

            counter++;
            return undefined;
        }
        else {
            var k = counter%count;
            arr[k]=line;
            counter++;
         //   console.log(arr);
          //  console.log('evalFunc: ' + this.evalFunc);

            return this.evalFunc(arr);
        }
    }
};