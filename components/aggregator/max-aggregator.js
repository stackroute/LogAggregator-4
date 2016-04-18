module.exports=function (arr){
    var max=0;
    for(var i=0;i<arr.length;i++)
    {
        arr[i]=parseInt(arr[i]);
    }
    max = Math.max.apply(null, arr);
    return max;
}
