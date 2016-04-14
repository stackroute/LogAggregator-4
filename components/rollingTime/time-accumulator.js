module.exports = function(time, evalFunc) {
  this.windowDuration = time;
  this.evalFunc = evalFunc;


  this.evaluate = function(line) {
    //creating array if it doesn't exist
    //console.log(line);
    if (typeof lineArr == "undefined" || !(lineArr instanceof Array)) {
      lineArr = [];
    }
    //accumulating data for 10secs
    if (typeof line !== 'undefined') {
      var obj = {};
      obj.line = line.trim();
      obj.date = new Date();
      lineArr.push(obj);
    }

    if (lineArr.length == 1) {
      t0 = new Date();
    }
    //Get current time
    currentTime = new Date();
    //Check if window active
    var diffMs = (currentTime.getTime() - t0.getTime());
    console.log("Time diff: " + diffMs);

    if (diffMs < 100) {
      //window not yet active
      console.log('not yet active');
      return null;
    } else if (diffMs >= 100) {
      //window active now
      console.log('active now');
      pastDate = new Date();
      pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
      dataArr = [];
      for (var counter = lineArr.length - 1; counter >= 0; counter--) {
        var itemdate;
          itemdate = lineArr[counter].date;
        if (Date.parse(itemdate) >= Date.parse(pastDate)) {
          // console.log(itemdate);
          // console.log(pastDate);
          if (lineArr[counter].line !== "") {
            dataArr.push(parseFloat(lineArr[counter].line));
          }
        } else {
            console.log('loop3--------------' + counter);
          lineArr.splice(0, counter + 1);
          break;
        }
      }
      //console.log(dataArr);
      return this.evalFunc(dataArr);
    }
  }
};
