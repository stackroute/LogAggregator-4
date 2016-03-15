$(document).ready(function() {

  var json;
  $.get('/logdata', function(data) {
    json = data;
    var keys = Object.keys(json[0]);
    $('#tabLog').append("<tr></tr>");
    $.each(keys, function(key, value) {
      $('#tabLog tr').append("<th>" + value + "</th>");
    });

    for (var i = 0; i < json.length; i++) {
      tr = $('<tr/>');
      for (var key in json[i]) {
        if (json[i].hasOwnProperty(key)) {
          var keyvalue = json[i][key];
          tr.append("<td>" + keyvalue + "</td>");
        }
      }
      $('#tabLog').append(tr);
    }

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
    }

    //binding selected entity to event field under measures
    addMeas = function(item1, item2) {
      var textbox1 = document.getElementById("eventname");
      textbox1.value = item1 + " : " + item2;
    }
  });
});

//display selected fieldname or event in measures pane
function ShowHideDiv() {
  var chkField = document.getElementById("radioField");
  var dvField = document.getElementById("radioFieldDiv");
  var chkRadio = document.getElementById("radioEvent");
  var dvRadio = document.getElementById("radioEventDiv");
  var dvField = document.getElementById("radioFieldDiv");
  if (chkField.checked) {
    dvField.style.display = "block";
    dvRadio.style.display = "none";
  } else if (chkRadio.checked) {
    dvField.style.display = "none";
    dvRadio.style.display = "block";
  }
}

//binding dummy dimensions and measures list

var dimList;
$.get('/dimensions', function(data) {
  dimList = data;
  var items = [];
  $.each(dimList, function(i, item) {
    items.push('<li class="list-group-item list-group-item-success">' + item.displayName + '<form action="/dimensions/' + item.dispName + '" method="post"><button class="btn btn-info" ><span class="glyphicon glyphicon-trash"></span></button></form></li>');
  });
  $('#dimList').append(items.join(''));
  //  console.log(dimList);
});

var measureList;
$.get('/measures', function(data) {
  measureList = data;
  var items = [];
  $.each(measureList, function(i, item) {
    items.push('<li class="list-group-item list-group-item-success">' + item.displayName + '<form action="/measures/' + item.dispName + '" method="post"><button class="btn btn-info" ><span class="glyphicon glyphicon-trash"></span></button></form></li>');
  });
  $('#measureList').append(items.join(''));
});



//Display selected row in 'Select Dimensions' pane
$("#tabLog").on('click', 'tr', function(e) {
  e.preventDefault();
  var i = 0;
  $(this).find('td').each(function() {
    $("#tabDim").find('td').eq(i).html($(this).text());
    i += 2;
  });
});
