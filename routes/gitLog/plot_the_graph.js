var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var obj={};
var json = [];
var Logs = require('../../models/dbConfig').getModel;

router.post('/',function(req,res,next){                                   //router for the code

var json_param = req.body.data;
console.log("json_param",json_param);
var filter_data=[];

for(var i=0;i<json_param["filters"].length;i++){
  var filter_by= json_param["filters"][i]["name"];
  var filter_value = json_param["filters"][i]["values"];
  filter_data[i]={};
  filter_data[i][filter_by]= {"$in":filter_value};
}



if(json_param["row"]["values"]!== undefined){
 var temp_obj =  {};
 temp_obj[json_param["row"]["name"]] = {'$in': json_param["row"]["values"]};
 //console.log(temp_obj);
 filter_data.push(temp_obj);
}


//variable to group tha data that can be passed to the query
var grouping_object=  {};
grouping_object[json_param["row"]["name"]] = "$"+json_param["row"]["name"];


//if column is given will add the details in groupby function
if(json_param["columns"]!==undefined && json_param["columns"].length!==0){
  for(var i=0;i<json_param["columns"].length;i++){
    var temp_obj = {};
    temp_obj[json_param["columns"][i]["name"]] = {'$in' : json_param["columns"][i]["values"]};
    grouping_object[json_param["columns"][i]["name"]]='$' + json_param["columns"][i]["name"];
    //console.log(temp_obj);
    filter_data.push(temp_obj);
  }
}



console.log("grouping_object",grouping_object);

console.log("filter_data",filter_data);       //filter object of the data that is to be filtered

var complete_group_object = {};

complete_group_object["_id"]=grouping_object;
complete_group_object[json_param["measure"]["primary"]["function"]["argument"]]=(json_param["measure"]["primary"]["function"]["name"]!=="sum")?{"$sum":1}:{"$sum":('$'+json_param["measure"]["primary"]["function"]["argument"])}

if(json_param["measure"]["secondary"]!== undefined){
  for(var i=0;i<json_param["measure"]["secondary"].length;i++){
    complete_group_object[json_param["measure"]["secondary"][i]["function"]["argument"]]=(json_param["measure"]["secondary"][i]["function"]["name"]!=="sum")?{"$sum":1}:{"$sum":('$'+json_param["measure"]["secondary"][i]["function"]["argument"])}
  }
}

var aggregate_arr=[];
if(json_param["row"]["aggregators"]!==undefined && json_param["row"]["aggregators"]["name"]==="all" || filter_data.length==0){
  aggregate_arr = [
                        {
                          "$group":complete_group_object
                        }
                  ];
}
else{
  aggregate_arr = [{
                          "$match":
                          {
                            "$and": filter_data
                          }
                        },
                        {
                          "$group":complete_group_object
                        }
                      ];
}


if(json_param["row"]["aggregators"]!==undefined && json_param["row"]["aggregators"]["name"]!=="all"){
  var sort_obj={"$sort":{}};
  var limit_obj={"$limit":json_param["row"]["aggregators"]["argument"]};
  if(json_param["row"]["aggregators"]["displayName"]=="top"){
    sort_obj["$sort"][json_param["measure"]["primary"]["function"]["argument"]]=-1;
  }
  else if(json_param["row"]["aggregators"]["displayName"]=="bottom"){
    sort_obj["$sort"][json_param["measure"]["primary"]["function"]["argument"]]=1;
  }
  aggregate_arr.push(sort_obj);
  aggregate_arr.push(limit_obj);
}

console.log("aggregate_arr",aggregate_arr);
//console.log(grouping_object);

Logs(req.session.user.organization,"commitDataModel").then(function(model) {
  model.aggregate(aggregate_arr,function(error,result){
                        if(error){
                          console.log("we are not fetch the data from database");
                          console.log(error);
                        }
                        else{
                          console.log("we are able to fetch the data from the database");
                          console.log(result);
                          console.log(json_param["columns"]);
                          console.log("param",json_param["columns"].length!==0);
                           //convert_to_d3(result);
                           if(json_param["columns"]!== undefined && json_param["columns"].length!==0)
                          {
                            convert_to_d3(result,res,json_param);
                          }
                          else
                          {
                            no_change_data(result,res,json_param);
                          }
                        }
                      });
                });

});
function no_change_data(data,res,json_param){
              res.send(data);
             }

//function to convert the data from aggregate function to the format that can be accepted by d3 graphs
                    function convert_to_d3(data,res,json_param)
                    {
                      console.log("json_param",json_param);
                      console.log("data is retrived successfully");
                        var json = data;
                        console.log("json",json);
                        var obj={};
                        var grouped_data = json_param["columns"][0]["values"];
                        console.log("grouped_data",grouped_data);
                        //return;
                        for(var i=0;i<json.length;i++){
                          if(obj[json[i]["_id"][json_param["row"]["name"]]]===undefined)
                          {obj[json[i]["_id"][json_param["row"]["name"]]]={};}
                          //if(obj[json[i]["_id"][json_param["row"]["name"]]]===undefined)
                          obj[json[i]["_id"][json_param["row"]["name"]]][json[i]["_id"][json_param["columns"][0]["name"]]]=json[i][json_param["measure"]["primary"]["function"]["argument"]];
                        }
                        console.log(obj);
                        var converted_json =[];
                        for(keys in obj)
                        {
                          console.log(keys);
                          var temp_obj = {}
                          temp_obj["x_dim"]=keys;
                            for(var j=0;j<grouped_data.length;j++)
                            {
                              console.log(grouped_data[j]);
                              //console.log(obj[keys]);
                              if(obj[keys][grouped_data[j]]===undefined){
                                temp_obj[grouped_data[j]]=0;
                              }
                              else{
                                temp_obj[grouped_data[j]]=obj[keys][grouped_data[j]];
                              }
                              //console.log(temp_obj);
                            }
                            converted_json.push(temp_obj);
                        }
                        console.log(converted_json);
                         res.send(converted_json);

                      }


  module.exports = router;


//
// var filter_data=[];
//
// for(var i=0;i<json_param["filters"].length;i++){
//   var filter_by= json_param["filters"][i]["name"];
//   var filter_value = json_param["filters"][i]["values"];
//   filter_data[i]={};
//   filter_data[i][filter_by]= {"$in":filter_value};
// }
//
// var sec_filter_by = json_param["secondaryGroupByField"]["name"];
// var sec_filter_data = json_param["secondaryGroupByField"]["values"];
// var grouping_object=  {};
// grouping_object["primaryGroupByField"] = "$"+json_param["primaryGroupByField"];
//
// if(json_param["secondaryGroupByField"]!== ""){
//   filter_data[json_param["filters"].length]={};
//   filter_data[json_param["filters"].length][sec_filter_by]={"$in":sec_filter_data};
//   grouping_object["secondaryGroupByField"] = "$" + json_param["secondaryGroupByField"]["name"];
// }
// console.log("Filtering data");
// console.log(filter_data);       //filter object of the data that is to be filtered
// console.log("grouping data");
// console.log(grouping_object);
// console.log(Logs(req.session.user.organization,"commitDataModel"),"model");
// Logs(req.session.user.organization,"commitDataModel").aggregate([
//                       {
//                         "$match":
//                         {
//                           "$and": filter_data
//                         }
//                       },
//                       {
//                         "$group":
//                         {
//                           "_id":grouping_object,
//                           "recommendCount": {"$sum": 1}
//                         }
//                       },
//                       {
//                         "$sort":{"recommendCount":-1}
//                       },
//                       {
//                         "$limit":5
//                       }
//                     ],function(error,result){
//                       if(error){
//                         console.log("we are not fetch the data from database");
//                       }
//                       else{
//                         console.log("we are able to fetch the data from the database");
//                         console.log("result",result);
//                         mongoose.connection.close();
//                         if(json_param["secondaryGroupByField"]!== "")
//                         {
//                           convert_to_d3(result,res,sec_filter_data);
//                         }
//                         else {
//                           no_change_data(result,res);
//                         }
//                         //res.send("something");
//                       }
//                     });
// });
//
//
// module.exports = router
//
// function no_change_data(data,res){
//   res.send(data);
// }
//
// function convert_to_d3(data,res,sec_filter_data)
// {
//   console.log("data is retrived successfully");
//     var json = data;
//     var grouped_data=sec_filter_data;
//     console.log(grouped_data);
//     //json = JSON.parse(data);
//     console.log(json);
//     var obj={};
//     for(var i=0;i<json.length;i++){
//       if(obj[json[i]["_id"]["primaryGroupByField"]]===undefined)
//       {obj[json[i]["_id"]["primaryGroupByField"]]={};}
//       obj[json[i]["_id"]["primaryGroupByField"]][json[i]["_id"]["secondaryGroupByField"]]=json[i]["recommendCount"];
//     }
//     console.log(obj);
//     var converted_json =[];
//     for(keys in obj)
//     {
//       console.log(keys);
//       var temp_obj = {}
//       temp_obj["x_dim"]=keys;
//         for(var j=0;j<grouped_data.length;j++)
//         {
//           //console.log(grouped_data[j]);
//           //console.log(obj[keys]);
//           if(obj[keys][grouped_data[j]]===undefined){
//             temp_obj[grouped_data[j]]=0;
//           }
//           else{
//             temp_obj[grouped_data[j]]=obj[keys][grouped_data[j]];
//           }
//           //console.log(temp_obj);
//         }
//         converted_json.push(temp_obj);
//     }
//     console.log(converted_json);
//     res.send(converted_json);
//
//   }
//
