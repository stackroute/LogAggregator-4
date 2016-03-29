module.exports=function (arr){
    var len=arr.length;
    var i=0;
    var sum=0;
    for(i=0;i<len;i++)
    {
        sum=sum+arr[i];
    }
    return sum;
}
