$(document).ready(function() {
//Dummy log data
var json = [{
    "host": "216.67.1.92",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/Aug/2006:07:01:53 -0700]",
    "request": "GET /index1.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Mozilla/5.0",
    "cookies": "-"
  }, {
    "host": "216.67.1.93",
    "rfc931": "-",
    "username": "-",
    "datetime": "[14/Sep/2006:07:01:53 -0700]",
    "request": "GET /index.html HTTP/1.0",
    "statuscode": "404",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Mozilla/5.0",
    "cookies": "-"
  }, {
    "host": "216.67.1.95",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/Sep/2006:07:01:53 -0700]",
    "request": "GET /index2.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "432",
    "referrer": "http://www.google.com",
    "user_agent": "Mozilla/5.0",
    "cookies": "-"
  }, {
    "host": "218.67.1.97",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/May/2006:07:01:53 -0700]",
    "request": "GET /index3.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Mozilla/5.0",
    "cookies": "-"
  }, {
    "host": "217.67.1.91",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/Sep/2006:07:01:53 -0700]",
    "request": "GET /index.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Mozilla/5.0",
    "cookies": "-"
  }, {
    "host": "216.67.2.91",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/Sep/2006:07:01:53 -0700]",
    "request": "GET /index.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Google Chrome",
    "cookies": "-"
  },{
    "host": "216.67.2.95",
    "rfc931": "-",
    "username": "-",
    "datetime": "[13/Sep/2006:07:01:53 -0700]",
    "request": "GET /index.html HTTP/1.0",
    "statuscode": "200",
    "bytes": "431",
    "referrer": "http://www.google.com",
    "user_agent": "Google Chrome",
    "cookies": "-"
  }

];
//binding json to html
for (var i = 0; i < json.length; i++) {
  tr = $('<tr/>');
  tr.append("<td>" + json[i].host + "</td>");
  tr.append("<td>" + json[i].rfc931 + "</td>");
  tr.append("<td>" + json[i].username + "</td>");
  tr.append("<td>" + json[i].datetime + "</td>");
  tr.append("<td>" + json[i].request + "</td>");
  tr.append("<td>" + json[i].statuscode + "</td>");
  tr.append("<td>" + json[i].bytes + "</td>");
  tr.append("<td>" + json[i].referrer + "</td>");
  tr.append("<td>" + json[i].user_agent + "</td>");
  tr.append("<td>" + json[i].cookies + "</td>");
  $('#tabLog').append(tr);
}
//get headers and bind to Select Dimensions pane
$('#tabLog').find('th').each(function() {
  $('#tabDim').append("<tr><th>" + $(this).text() + "</th></tr>");
});
//get selected row and bind to 'Select Dimensions' pane
var ind = 0;
$('#tabLog tr:eq(1)').find('td').each(function() {
  $('#tabDim').find('tr').eq(ind).append("<td>" + $(this).text() + "</td><td></td>");
  ind += 1;
});

//display dimension and measures button dynamically on selecting an entity
$("#tabDim tr").bind("mouseenter", function() {
  var value = $(this).find("th").text();
  val = value.toString();
  var valueEvent = $(this).find("td").text();
  valEvent = valueEvent.toString();
  $(this).find("td:last-child").html('<button type="submit" class="btn btn-warning btn-circle" onClick="addDim(val);">D</button></br><button type="submit" class="btn btn-danger btn-circle" onClick="addMeas(val,valEvent);">M</button>');
});

// remove button on tr mouseleave
$("#tabDim tr").bind("mouseleave", function() {
  $(this).find("td:last-child").html("&nbsp;");
});

//binding selected entity to dimensions field
addDim = function(item) {
  var textbox1 = document.getElementById("fieldname");
  textbox1.value = item;
};

//binding selected entity to event field under measures
addMeas = function(item1, item2) {
    var textbox1 = document.getElementById("eventname");
    textbox1.value = item1 + " : " + item2;
  };

});

//display selected fieldname or event in measures pane
$('input[type="radio"]').click(function(){
        if($(this).attr("value")=="field"){
            $(".box").not("#radioFieldDiv").hide();
            $("#radioFieldDiv").show();
        }
        if($(this).attr("value")=="event"){
          $(".box").not("#radioEventDiv").hide();
            $("#radioEventDiv").show();
        }
});
//binding dummy dimensions and measures list
var dimList = [{
  "dispName": "Path",
  "fieldName": "request"
}, {
  "dispName": "User",
  "fieldName": "username"
}, {
  "dispName": "Browser",
  "fieldName": "user_agent"
}, {
  "dispName": "Timestamp",
  "fieldName": "datetime"
}];

var items = [];
$.each(dimList, function(i, item) {
  items.push('<li class="list-group-item list-group-item-success">' + item.dispName + '</li>');
});
$('#dimList').append(items.join(''));

var measureList = [{
  "dispName": "No of Hits"
}, {
  "dispName": "Failed Requests"
}, {
  "dispName": "Average Visitor Stay Length"
}, {
  "dispName": "Average Bandwidth per Day"
}];

var mItems = [];
$.each(measureList, function(i, item) {
  mItems.push('<li class="list-group-item list-group-item-success">' + item.dispName + '</li>');
});
$('#measureList').append(mItems.join(''));

//Display selected row in 'Select Dimensions' pane
$("#tabLog").on('click', 'tr', function(e) {
      e.preventDefault();
      var i = 0;
      $(this).find('td').each(function() {
       $("#tabDim").find('td').eq(i).html($(this).text());
        i += 2;
      });
});
