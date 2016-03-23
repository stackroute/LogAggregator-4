module.exports = function rollingTimeWindow(windowDuration) {
  this.windowDuration = windowDuration;
  this.count = function(data) {
    var datacount = 0;
    //console.log(data);
    var arr = accumulateByTime(windowDuration, data);
    //console.log(arr);
    // the array is defined and has at least one element
    if (typeof arr !== 'undefined' && arr!==null) {
      if (arr.length > 0) {
        //Calculate past date
        pastDate = new Date();
        pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
        //Compute COUNT
        for (var counter = arr.length - 1; counter >= 0; counter--) {
          var itemdate = arr[counter].date;
          if (Date.parse(itemdate) >= Date.parse(pastDate)) {
            if (arr[counter].data !== "") {
              datacount += 1;
            }
          } else {
            //console.log("loop3  " + counter);
            arr.splice(0, counter + 1);
            //console.log(lineArr.length);
          }
        }
      }
    }
    return datacount;
  }
  this.sum=function(data){
    //console.log(data);
    var sum = 0;
    var arr = accumulateByTime(windowDuration, data);
    //console.log(arr);
    // the array is defined and has at least one element
    if (typeof arr !== 'undefined' && arr!==null) {
      if (arr.length > 0) {
        //Calculate past date
        pastDate = new Date();
        pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
        //Compute SUM
        for (var counter = arr.length - 1; counter >= 0; counter--) {
          var itemdate = arr[counter].date;
          if (Date.parse(itemdate) >= Date.parse(pastDate)) {
            if (arr[counter].data !== "") {
              sum += parseFloat(arr[counter].data);
            }
          } else {
            //console.log("loop3  " + counter);
            arr.splice(0, counter + 1);
            //console.log(lineArr.length);
          }
        }
      }
    }
    return sum;
  }
  this.avg=function(data){
    //console.log(data);
    var sum = 0,
      avg = 0,
      datacount = 0;
    var arr = accumulateByTime(windowDuration, data);
    //console.log(arr);
    // the array is defined and has at least one element
    if (typeof arr !== 'undefined' && arr!==null) {
      if (arr.length > 0) {
        //Calculate past date
        pastDate = new Date();
        pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
        //Compute AVG
        for (var counter = arr.length - 1; counter >= 0; counter--) {
          var itemdate = arr[counter].date;
          if (Date.parse(itemdate) >= Date.parse(pastDate)) {
            if (arr[counter].data !== "") {
              sum += parseFloat(arr[counter].data);
              datacount += 1;
              avg = sum / datacount;
            }
          } else {
            //console.log("loop3  " + counter);
            arr.splice(0, counter + 1);
            //console.log(lineArr.length);
          }
        }
      }
    }
    return avg;
  }
  this.min=function(data){
    //console.log(data);
    var min = 0,minArr=[];

    var arr = accumulateByTime(windowDuration, data);
    //console.log(arr);
    // the array is defined and has at least one element
    if (typeof arr !== 'undefined' && arr!==null) {
      if (arr.length > 0) {
        //Calculate past date
        pastDate = new Date();
        pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
        //Compute AVG
        for (var counter = arr.length - 1; counter >= 0; counter--) {
          var itemdate = arr[counter].date;
          if (Date.parse(itemdate) >= Date.parse(pastDate)) {
            if (arr[counter].data !== "") {
                minArr.push(arr[counter].data);
                min = Math.min.apply(null, minArr);
            }
          } else {
            //console.log("loop3  " + counter);
            arr.splice(0, counter + 1);
            //console.log(lineArr.length);
          }
        }
      }
    }
    return min;
  }
  this.max=function(data){
    //console.log(data);
    var max = 0,maxArr=[];

    var arr = accumulateByTime(windowDuration, data);
    //console.log(arr);
    // the array is defined and has at least one element
    if (typeof arr !== 'undefined' && arr!==null) {
      if (arr.length > 0) {
        //Calculate past date
        pastDate = new Date();
        pastDate.setSeconds(pastDate.getSeconds() - this.windowDuration);
        //Compute AVG
        for (var counter = arr.length - 1; counter >= 0; counter--) {
          var itemdate = arr[counter].date;
          if (Date.parse(itemdate) >= Date.parse(pastDate)) {
            if (arr[counter].data !== "") {
                maxArr.push(arr[counter].data);
                max = Math.max.apply(null, maxArr);
            }
          } else {
            //console.log("loop3  " + counter);
            arr.splice(0, counter + 1);
            //console.log(lineArr.length);
          }
        }
      }
    }
    return max;
  }
}

function accumulateByTime(windowDuration, data) {
  //creating array if it doesn't exist

  if (typeof lineArr == "undefined" || !(lineArr instanceof Array)) {
    lineArr = [];
  }
  //accumulating data for 10secs
  if (typeof data !== 'undefined') {
    var obj = {};
    obj.data = data.trim();
    obj.date = new Date();

    lineArr.push(obj);
  }

  if (lineArr.length == 1) {
    t0 = new Date();
  }
  //Get current time
  currentTime = new Date();
  //Check if window active
  var diffMs = currentTime.getTime() - t0.getTime();
  if (diffMs < 10) {
    //window not yet active
    return null;
  } else {
    //window active now
    //return true;
    //console.log(lineArr);
    return lineArr;
  }
}
