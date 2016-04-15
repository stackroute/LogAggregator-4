module.exports=function myfunction(n)
{

    var arr1= new Array();
    var  count=0;
    this.sum= function(value)
    {
        value=parseInt(value);
        var length;
        length=arr1.length;
        if(count<n)
        {
            arr1.push(value);
            //  console.log("array[count]---"+arr1[count]);
            count++;
        }

        if(count>=n)
        {
            var k=count%n;
            arr1[k]=value;
            var sum=0;
            for(var h=0;h<n;h++)
            {
                sum=sum+arr1[h];
                //     console.log("sum2222--"+sum);
            }
            count++;
            return sum;
        }
    }



    this.min= function(value)
    {
        value=parseInt(value);
        var length;
        length=arr1.length;
        if(count<n)
        {
            arr1.push(value);
            count++;
        }

    if(count>=n)
        {
            var k=count%n;
            arr1[k]=value;
            var min=99999999999;
            for(var h=0;h<n;h++)
            {
                if(min>arr1[h])
                {
                    min=arr1[h];
                }

            }
            count++;
            return min;
        }

    }

    this.max= function(value)
    {
        value=parseInt(value);
        var length;
        length=arr1.length;
        if(count<n)
        {
            arr1.push(value);
            count++;
        }

        if(count>=n)
        {
            var k=count%n;
            arr1[k]=value;
            var max=-99999999999;
            for(var h=0;h<n;h++)
            {
                if(max<arr1[h])
                {
                    max=arr1[h];
                }

            }
            count++;
            return max;
        }

    }

    this.average= function(value)
    {
        value=parseInt(value);
        var length;
        length=arr1.length;
        if(count<n)
        {
            arr1.push(value);
            count++;
        }

        if(count>=n)
        {
            var k=count%n;
            arr1[k]=value;
            var sum=0;
            for(var h=0;h<n;h++)
            {
                sum=sum+arr1[h];
            }
            var average=sum/n;
            count++;
            return average;
        }

    }


    this.standardDeviation= function(value)
    {
        value=parseInt(value);
        var length;
        length=arr1.length;
        if(count<n)
        {
            arr1.push(value);
            count++;
        }

        if(count>=n)
        {
            var k=count%n;
            arr1[k]=value;
            var sum=0;
            for(var h=0;h<n;h++)
            {
                sum=sum+arr1[h];
            }
            var mean=sum/n;



            var sd;
            sum=0;
            for(var h=0;h<n;h++)
            {
                sd=arr1[h]-mean;
                sd=Math.pow(sd,2);
                sum=sum+sd;
            }

            var resul=sum/n;
            resul=Math.sqrt(resul);
            count++;
            return resul;
        }

    }
}
