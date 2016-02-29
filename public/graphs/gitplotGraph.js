function plotting_stacked_graph(data,graph_details){
    //console.log(data);
    console.log("graph_details",graph_details);

    var element = document.getElementById("graph-container");
    var margin = {top: 60, right: 60, bottom: 180, left: 80},
        width = (0.89*parseInt(element.clientWidth)) - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, .3);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.ordinal()
      .range(["#72B01D", "#ADE25D", "#317B22", "#FCEC52", "#a05d56", "#d0743c", "#ff8c00"]);
        // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .innerTickSize(-width);;
        console.log(data);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong> "+graph_details["measure"]["primary"]["displayName"]+" "+ d.name + " : </strong> <span style='color:red'>" + (d.y1-d.y0) +"</span>";
        })

    var grouped_data=graph_details["columns"][0]["values"];
    //console.log(sec_grouped_data);

    d3.selectAll("svg").remove();
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

  //  d3.json("./data.json", function(error, data) {
      //if (error) throw error;

      color.domain(grouped_data);

      data.forEach(function(d) {
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.ages[d.ages.length - 1].y1;
      });

      data.sort(function(a, b) { return b.total - a.total; });

      x.domain(data.map(function(d) { return d["x_dim"]; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll('text')
          .attr("transform","rotate(-35)")
          .attr("x",-50)
          .attr("font-size",15)
          // .call(wrap, x.rangeBand());

      svg.append("text")
         .attr("font-size",15)
         .attr("x",width-70)
         .attr("y",height+75)
         .attr("fill", "#aaa")
         .text(graph_details["row"]["displayName"]);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("font-size",15)
          .attr("transform", "rotate(-90)")
          .attr("y",-60)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(graph_details["measure"]["primary"]["displayName"]);

      var country = svg.selectAll(".country")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d["x_dim"]) + ",0)"; });

      country.selectAll("rect")
          .data(function(d) { return d.ages; })
        .enter().append("rect")
          .attr("class","bar")
          .attr("width", x.rangeBand())
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .transition()
          .delay(500)
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .style("fill", function(d) { return color(d.name); });


          console.log(" chumma");

      // var legend = svg.selectAll(".legend")
      //     .data(color.domain().slice().reverse())
      //   .enter().append("g")
      //     .attr("class", "legend")
      //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      //
      // legend.append("rect")
      //     .attr("x", width - 18)
      //     .attr("width", 18)
      //     .attr("height", 18)
      //     .style("fill", color);
      //
      // legend.append("text")
      //     .attr("x", width - 24)
      //     .attr("y", 9)
      //     .attr("dy", ".35em")
      //     .style("text-anchor", "end")
      //     .text(function(d) { return d; });

  //  });
  }

function plotting_graph(data,graph_details){

  console.log(graph_details);
  var element = document.getElementById("graph");
  console.log(element.clientWidth);
    var margin = {top: 40, right: 60, bottom: 120, left: 60},
      width = (0.89*parseInt(element.clientWidth)) - margin.left - margin.right,
      height =470 - margin.top - margin.bottom;

  //var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width);;

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+graph_details["measure"]["primary"]["function"]["argument"].substring(0,6).concat("s")+" :"+"</strong> <span style='color:red'>" + d[graph_details["measure"]["primary"]["function"]["argument"]] + "</span>";
    })

 d3.selectAll('svg').remove();
  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  //d3.json("./test.json", function(error, data) {
    console.log(data);
    x.domain(data.map(function(d) { return d["_id"][graph_details["row"]["name"]]; }));
    y.domain([0, d3.max(data, function(d) { return d[graph_details["measure"]["primary"]["function"]["argument"]]; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr("transform","rotate(-35)")
        .attr("x",-60)
        .attr("font-size",14);

    svg.append("text")
      .attr("font-size",15)
      .attr("x",width-70)
      .attr("y",height+75)
      .attr("fill", "#aaa")
       .text(graph_details["row"]["displayName"]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",-40)
        .attr("x",-50)
        .attr("dx", -50)
        .attr("dy", ".35em")
        //.style("text-anchor", "end")
        .text(graph_details["measure"]["primary"]["function"]["argument"].substring(0,6).concat("s"))
        .attr("font-size",15);


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect").on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("class", "bar")
        .transition()
        .delay(500)
        .attr("x", function(d) { return x(d["_id"][graph_details["row"]["name"]]); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d[graph_details["measure"]["primary"]["function"]["argument"]]); })
        .attr("height", function(d) { return height - y(d[graph_details["measure"]["primary"]["function"]["argument"]]); });


  //});
}


  ///////////////////////////////////////////////////////////////////////////older plotting method
//   var margin = {top: 40, right: 20, bottom: 30, left: 40},
//       width = 760 - margin.left - margin.right,
//       height = 500 - margin.top - margin.bottom;
//
//   var formatPercent = d3.format(".0%");
//
//   var x = d3.scale.ordinal()
//       .rangeRoundBands([0, width], .1);
//
//   var y = d3.scale.linear()
//       .range([height, 0]);
//
//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient("bottom");
//
//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient("left");
//       //.tickFormat(formatPercent);
//
//   var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([-10, 0])
//     .html(function(d) {
//       return "<strong>Frequency:</strong> <span style='color:red'>" + d.recommendCount + "</span>";
//     })
//   d3.selectAll("svg").remove();
//   var svg = d3.select("#graph").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//   svg.call(tip);
//
//     x.domain(data.map(function(d) { return d["_id"]; }));
//     y.domain([0, d3.max(data, function(d) { return d["recommendCount"]; })]);
//
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);
//
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//       .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//         .text("Frequency");
//
//     svg.selectAll(".bar")
//         .data(data)
//       .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d["_id"]); })
//         .attr("width", x.rangeBand())
//         .attr("y", function(d) { return y(d.recommendCount); })
//         .attr("height", function(d) { return height - y(d.recommendCount); })
//         .on('mouseover', tip.show)
//         .on('mouseout', tip.hide)
//
//
//   function type(d) {
//     d.recommendCount = +d.recommendCount;
//     return d;
//   }
//
//   plot_pie_chart(data)
// }
//
// function plot_pie_chart(data){
//   console.log("we are inside the plotting the pie chart");
//   console.log(data);
//   var width = 760,
//       height = 500,
//       radius = Math.min(width, height) / 2;
//
//   var color = d3.scale.ordinal()
//       .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
//   var arc = d3.svg.arc()
//       .outerRadius(radius - 10)
//       .innerRadius(radius - 70);
//
//   var pie = d3.layout.pie()
//       .sort(null)
//       .value(function(d) { return d.recommendCount; });
//
//   var svg = d3.select("#graph1").append("svg")
//       .attr("width", width)
//       .attr("height", height)
//     .append("g")
//       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//   // d3.csv("data.csv", type, function(error, data) {
//   //   if (error) throw error;
//
//     var g = svg.selectAll(".arc")
//         .data(pie(data))
//       .enter().append("g")
//         .attr("class", "arc");
//
//     g.append("path")
//         .attr("d", arc)
//         .style("fill", function(d) { return color(d.data["_id"]); });
//
//     g.append("text")
//         .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//         .attr("dy", ".35em")
//         .text(function(d) { return d.data["_id"]; });
//   //});
//
//   function type(d) {
//     d.recommendCount = +d.recommendCount;
//     return d;
//   }
