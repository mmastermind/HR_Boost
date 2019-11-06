var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter") //CHECK if when grabbing a class a "." goes before calling it
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(dataset, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d[chosenXAxis]) * 0.8,
        d3.max(dataset, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  }
// function used for updating y-scale var upon click on axis label
function yScale(dataset, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d[chosenYAxis]) * 0.6,
        d3.max(dataset, d=> d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }
  
  function renderAxes2(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles - CHECK IF THE "CY" ATTR IS OK
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis, circletext) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]))
      .text(circletext);

    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    if (chosenXAxis === "poverty") {
      var label = "In Poverty:";
    }
    else if (chosenXAxis === "age") {
      var label = "Age (Median):";
    } 
    else {
      var label = "income";
    }
    if (chosenYAxis === "obesity") {
        var label2 = "Obese (%):";
      }
    else {
        var label2 = "Lacks Healthcare:";
      }
  
//   check what "label" stands for after line break
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr} ${d.state}<br>${label} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

  function updatecircletext(chosenXAxis, chosenYAxis, circletext) {
  
    // if (chosenXAxis === "poverty") {
    //   var label = "In Poverty:";
    // }
    // else if (chosenXAxis === "age") {
    //   var label = "Age (Median):";
    // } 
    // else {
    //   var label = "income";
    // }
    // if (chosenYAxis === "obesity") {
    //     var label2 = "Obese (%):";
    //   }
    // else {
    //     var label2 = "Lacks Healthcare:";
    //   }
    var circletext = chartGroup.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(function(d) { 
        return (`${d.abbr}`); 
        })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .attr("anchor", "middle")
      .attr("stroke-width","2px");

// //   check what "label" stands for after line break
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.abbr} ${d.state}<br>${label} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
//       });
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
    return circletext;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("data/data3.csv", function(err, dataset) {
    // if (err) throw err;
    if (err) {return console.warn(err)};
    // debugger
    //parse data
    console.log(dataset);
    dataset.forEach(function(data) {
      data.id=data.id;
      data.state=data.state;
      data.abbr=data.abbr;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
    //   data.healthcareLow = +data.healthcareLow;
    //   data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
    //   data.obesityLow = +data.obesityLow;
    //   data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
    //   data.smokesLow = +data.smokesLow;
    //   data.smokesHigh = +data.smokesHigh;
    });
    // xLinearScale function above csv import
    var xLinearScale = xScale(dataset, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(dataset, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis CHECK IF JUST SWITCHING THE HEIGHT AND 0 IS OK
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(${width},0)`) NO NEED TO TRANSFORM / TRANSLATE SINCHE THE CANVAS START FROM THE LEFT
        .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "red")
        .attr("opacity", ".5");

    // append initial circle text
    var circletext = chartGroup.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(function(d) { 
          return (`${d.abbr}`); 
          })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("anchor", "middle")
        .attr("stroke-width","2px");

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household income (Median)");

    // Create group for  2 Y- axis labels
    var labelsGroup2 = chartGroup.append("g") 
      .attr("transform",`translate(-90,${height / 2})`)
        // .attr("y", 0 - margin.left)
        // .attr("x", 0 - (height / 2))
    
    var obesityLabel = labelsGroup2.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em") //specify that goes on first "y" axis; i.e: could be the second one 
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obese (%)");
  
    var hcLabel = labelsGroup2.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em") 
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      // .classed("axis-text", true)
      .text("Lacks Healthcare (%)");
    
    var smokesLabel = labelsGroup2.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")  
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      // .classed("axis-text", true)
      .text("Smokes (%)");

  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circletext);
    var circletext = updatecircletext(chosenXAxis, chosenYAxis, circletext)

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(dataset, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circletext);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    // y axis labels event listener
    labelsGroup2.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(dataset, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxes2(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circletext);
  
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          hcLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          hcLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        } else {
          hcLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
  });
  