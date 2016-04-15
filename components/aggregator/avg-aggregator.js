module.exports=function (arr){
    var len=arr.length;
    var i=0;
    var sum=0;
    var avg=0;

    for(i=0;i<len;i++)
    {
        var k=parseInt(arr[i]);
        sum=sum+k;
    }
    avg=sum/len;
    return avg;
}
