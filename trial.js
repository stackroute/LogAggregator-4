var myfunction=require("./fun.js");

var ins1=new myfunction(10);

var ins2=new myfunction(10);

var ins3=new myfunction(10);

var ins4=new myfunction(10);

var ins5=new myfunction(10);



for(var j=0;j<50;j++)
{


    k= ins1.sum(j);
   l=ins2.min(j);
    m=ins3.average(j);
    n=ins4.standardDeviation(j);


    console.log("sum-----"+k);
   console.log("min---"+l);
    console.log("standard---"+n);
    console.log("average---"+m);


}





