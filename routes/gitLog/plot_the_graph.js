var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var obj={};
var json = [];
var Logs = require('../../models/dbConfig').getModel;

router.post('/',function(req,res,next){                                   //router for the code
    obj={};
    json = [];
    var filter = [];        //filter data available in this variable will be added to the Ui for selection
    var data = req.body.data;
    console.log(data);
    console.log(data["y_axis_dim"]);
    var limit_data = data["type"].split(" ");
    var sorting_side = (limit_data[0]=="top")?-1:1;
    var limit = limit_data[1];
    console.log(limit);
    var group_data = "$" + data["x_axis_dim"];
    var sum_data = "$" + data["y_axis_dim"];
    console.log("Group Data" + group_data);
    var obj = (data["y_axis_dim"]=="noOfCommits")?{ "$sum": 1}:{ "$sum": sum_data};
    console.log(obj);
    if(data["x_axis_dim"]=="time")
    {
        var to_year = data["to_year"];
        var to_month =data["to_month"];
        var to_date = data["to_date"];
        var from_date =data["from_date"];
        var from_year = data['from_year'];
        var from_month = data["from_month"];
        var group_data_time = {'month' : "$commitMonth",'year':"$commitYear"};
        console.log("we got the time request");

        if(data["filterdata"] !== undefined){
          console.log("we are inside the if statement");
          var filter_data = data["filterdata"];
          var filterby = data["filterby"];
          console.log(filter_data+" "+filterby);
          console.log(filter_data.length);
          var temp_obj = {};
          temp_obj[filterby]={'$in':filter_data};
          console.log(temp_obj);
          var grouping_data =[
                            {
                              "$match":
                              {
                          "$and": [
                                  {"commitDate" : {'$gte': from_date}},
                                  {"commitDate":{'$lte': to_date}},
                                  temp_obj
                               ]
                              }
                            },
                            { "$group": {
                                "_id": {month : "$commitMonth",year:"$commitYear"},
                                "recommendCount": obj
                            }}
                    ]
                    //grouping_data[0]["$match"]["$and"][2][filterby]={'$in': filter_data};
                    //console.log(grouping_data[0]["$match"]["$and"][2]);
        }
        else{
          console.log("we are in the else statement")
          var grouping_data =[
                            {
                              "$match":
                              {
                          "$and": [
                                  {"commitDate" : {'$gte': from_date}},
                                  {"commitDate":{'$lte': to_date}},
                                //  {""}
                               ]
                              }
                            },
                            { "$group": {
                                "_id": {month : "$commitMonth",year:"$commitYear"},
                                "recommendCount": obj
                            }}
                    ]
                  //  console.log(grouping_data);
        }
    }
    else if(data["x_axis_dim"]!="time" && data["filterdata"] !== undefined)
    {
      console.log("we are in the not time filtered section");
      var filter_data = data["filterdata"];
      var filterby = data["filterby"];
      console.log(filter_data+" "+filterby);
      console.log(filter_data.length);
      var temp_obj = {};
      temp_obj[filterby]={'$in':filter_data};
      console.log(temp_obj);
      var grouping_data =[
                        {
                          "$match":
                          {
                              "$and": [
                              // {"commitDate" : {'$gte': from_date}},
                              // {"commitDate":{'$lte': to_date}},
                              temp_obj
                           ]
                          }
                        },
                        { "$group": {
                            "_id": group_data,
                            "recommendCount": obj
                        }},
                        { "$sort": { "recommendCount": sorting_side } },
                        // Optionally limit results
                        { "$limit": parseInt(limit) }
                ]
    }
    else
    {
      var grouping_data = [
                        { "$group": {
                            "_id": group_data,
                            //"repo": group_data,
                            "recommendCount": obj
                        }},
                        // Sorting pipeline
                        { "$sort": { "recommendCount": sorting_side } },
                        // Optionally limit results
                        { "$limit": parseInt(limit) }
                ]
    }
    // data for plotting depending upon the json selected
    console.log(req.session.user.organization+"11111111111111111111111111111",Logs(req.session.user.organization,"commitDataModel"));
    Logs(req.session.user.organization,"commitDataModel").aggregate(grouping_data, function (err, result) {
                          if (err) {
                              console.log(err);
                              return;
                          }
                          mongoose.connection.close();
                          //console.log(JSON.stringify(result));
                          console.log(result.length);
                          if(result.length==0)
                          {
                            res.send(result);
                            return;
                          }

                          if(data["x_axis_dim"]=="time")
                          covertobjtodate(result,0);
                          else {
                            json = result;
                          }
                          console.log(json);
                          res.send(json);
        });


    // res.send("Got the Data");
    });

    function covertobjtodate(result,i){
        obj={};
        var date = new Date();
        date.setMonth(result[i]["_id"]["month"]);
        date.setYear(result[i]["_id"]["year"]);
        console.log(date);
        obj["_id"]=date;
        obj["recommendCount"] = result[i]["recommendCount"];
        if(i<result.length-1){
          i++;
          json.push(obj);
          covertobjtodate(result,i);
        }
        else{
              json.push(obj);
              console.log(json);
              return;
            }
    }
module.exports = router
