function plot(data, options, x_axis, y_axis){
  console.log(data.length)
  var width = options['width'] - options['left'] - options['right'],
      height = options['height'] - options['top'] - options['bottom'];

  var avail_keys = Object.keys(data[0]);

  function pars_float(met_data){
    var num_con = 0.0
    try{
      num_con = parseFloat(met_data)
    }
    catch(err){
      num_con = 0.0
    }
    return num_con
  }

  d3.select("#scatter-load").html("")

  var x = d3.scale.linear().range([0, width]);

  var y = d3.scale.linear().range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(10);

  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

  var svg = d3.select("#scatter-load").append("svg")
              .attr("width", width + options.left + options.right)
              .attr("height", height + options.top + options.bottom)
              .append("g")
              .attr("transform", "translate(" + options.left + "," + options.top + ")");

  var plot_data = []

  data.forEach(function(d){
    $.each(avail_keys,  function(index, key_data){
      var data_to_plot = {};
      data_to_plot['name'] = key_data;
      data_to_plot['cx'] = pars_float(d[x_axis]);
      data_to_plot['cy'] = pars_float(d[y_axis]);
      data_to_plot['region'] = d['Region']
      plot_data.push(data_to_plot)
    })
  })

  x.domain(d3.extent(plot_data, function(d) { return d['cx']; })).nice();
  y.domain(d3.extent(plot_data, function(d) { return d['cy']; })).nice();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(90)")
      .attr("x", width)
      .attr("y", -6)
      .attr("dy", '0.71em')
      .style("text-anchor", "end");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  // add circles
  svg.selectAll(".dot")
    .data(plot_data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return d['cx']})
      .attr("cy", function(d) { return y(d['cy']); })
      .style("fill", '#2b8cbe')
      .attr("industry", function(d) { return d['name']; })
      .attr("data-q", function(d) { return d['region'].replace(/ /g, '').toLowerCase(); })
      .attr('data-original-title', function(d) {
        var title = d['region'] + ': ' + '(' + d['cx'] +  ', ' +  d['cy'] + ')';
        return title;
      })
      .attr('data-toggle','tooltip');

  // on mouse over y axis line
  svg.selectAll(".axis-hover-liney")
    .data(plot_data)
    .enter().append("line")
      .attr("class", "axisline")
      .attr("x1", function(d) { return d['cx']})
      .attr("x2", function(d) { return d['cx']})
      .attr("y1", function(d) { return y(d['cy']); })
      .attr("y2", function(d) { return height; })
      .style("opacity", 0)
      .style("stroke", '#2b8cbe')
      .attr("data-q", function(d) { return d['region'].replace(/ /g,'').toLowerCase(); })

  // on mouse over x axis line
  svg.selectAll(".axis-hover-linex")
    .data(plot_data)
    .enter().append("line")
      .attr("class", "axisline")
      .attr("x1", function(d) { return d['cx']})
      .attr("x2", 0)
      .attr("y1", function(d) { return y(d['cy']); })
      .attr("y2", function(d) { return y(d['cy']); })
      .style("opacity", 0)
      .style("stroke", '#2b8cbe')
      .attr("data-q", function(d) { return d['region'].replace(/ /g,'').toLowerCase(); })

  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width - options.left - options.right) + " ," +
                           (height - options.top) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text(x_axis.replace(/_/g,' '));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - options.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text(y_axis.replace(/_/g,' '));

  // add legend
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}
