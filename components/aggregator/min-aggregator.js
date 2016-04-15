module.exports=function (arr){


    for(var i=0;i<arr.length;i++)
    {
        arr[i]=parseInt(arr[i]);
    }
    var min=0;
    min = Math.min.apply(null, arr);
    return min;
}
