
function plot_pie_chart(data,graph_details){
  console.log("we are inside the plotting the pie chart");
  console.log(data);
  var element = document.getElementById("graph-container");
  console.log(element.clientWidth);

  var width = (0.85*parseInt(element.clientWidth)) ,
      height = 470,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#72B01D", "#ADE25D", "#317B22", "#FCEC52", "#a05d56", "#d0743c", "#ff8c00"]);
      // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - radius);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[graph_details["measure"]["primary"]["function"]["argument"]]; });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>"+"No of Commits in"+" "+ d.data["_id"][graph_details["row"]["name"]] +" :"+"</strong> <span style='color:red'> " + d.data[graph_details["measure"]["primary"]["function"]["argument"]] + "</span>";
      })

  var svg = d3.select("#graph1").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.call(tip);

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    g.append("path").transition()
    .delay(500)
        .attr("d", arc)
        .style("fill", function(d) { return color( d.data["_id"][graph_details["row"]["name"]]); });

  //   g.append("text")
  //       // .attr("transform", function(d) { return "translate(" + arc.centriod(d) + ")"; })
  //       .attr("transform", function(d) {
  //                               var c = arc.centroid(d),
  //                                   x = c[0],
  //                                   y = c[1],
  //                                   // pythagorean theorem for hypotenuse
  //                                   h = Math.sqrt(x*x + y*y);
  //                               return "translate(" + (x/h * radius) +  ',' +
  //                                  (y/h * radius) +  ")";
  //                           })
  //       .attr("dy", ".35em")
  //       .text(function(d) { return d["data"]["_id"][graph_details["row"]["name"]]}).attr("font-size",12);
  // //});

  // legend = svg.selectAll(".legend")
  //     .data(d[graph_details["measure"]["primary"]["function"]["argument"]].slice().reverse())
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


  function type(d) {
    d.recommendCount = +d.recommendCount;
    return d;
  }
}

function plot_multibar_graph(data,graph_details){
  console.log("plot_multibar",data);
  var element = document.getElementById("graph-container");
  console.log(element.clientWidth);
  var margin = {top: 20, right: 60, bottom: 80, left: 60},
      width = (0.89*parseInt(element.clientWidth))  - margin.left - margin.right,
      height =  470 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#72B01D", "#ADE25D", "#317B22", "#FCEC52", "#a05d56", "#d0743c", "#ff8c00"]);
      // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width);

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "<strong> " +graph_details["measure"]["primary"]["displayName"]+" "+ d.name + " : </strong> <span style='color:red'>" + (d.value) +"</span>";
          })

 var grouped_data=graph_details["columns"][0]["name"];

  var svg = d3.select("#graph1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

    //if (error) throw error;

    var ageNames = d3.keys(data[0]).filter(function(key) { return (key !== "x_dim")&&(key !== "ages")&&(key !== "total"); });
    console.log("agenames"+ageNames);

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d["x_dim"]; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr("font-size",15);

      svg.append("text")
          .attr("font-size",15)
          .attr("x",width-70)
          .attr("y",height+75)
          .attr("fill", "#aaa")
          .style("text-anchor", "end")
          .text(graph_details["row"]["displayName"]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("font-size",15)
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(graph_details["measure"]["primary"]["displayName"]);

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d["x_dim"]) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .attr("class","bar")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .delay(500)
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    // var legend = svg.selectAll(".legend")
    //     .data(ageNames.slice().reverse())
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

}
