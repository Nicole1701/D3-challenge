// Define SVG area dimensions
let svgWidth = 960;
let svgHeight = 560;

// Define the chart's margins as an object
let margin= {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Define dimensions of the chart area
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
let svg = d3
  .select("scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

// Function used for updating x-scale var upon click on axis label
function xScale(poverty, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(poverty, d => d[chosenXAxis]) * 0.8,
      d3.max(poverty, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Function used for updating x-scale var upon click on axis label
function yScale(obesity, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(obesity, d => d[chosenXAxis]) * 0.8,
        d3.max(obesity, d => d[chosenXAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// Function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// Function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// Function to update circles with a transition 

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  // Function used for updating circles group with new tooltip on xAxis
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    let label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty (%): ";
    }

    if (chosenXAxis === "age") {
        label = "Age (Median): ";
      }
    else {
      label = "Household Income (Median): ";
    }

    if (chosenYAxis === "obesity") {
        label = "Obesity (%): ";
      }
  
      if (chosenYAxis === "smokes") {
          label = "Smokes (%): ";
        }
      else {
        label = "Lacks Healthcare (%): ";
      }
    
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(d => `${d.state}<br>${label} ${d[chosenYAxis]}`);

        var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => `${d.state}<br>${label} ${d[chosenXAxis]}`);
    
      circlesGroup.call(toolTip);
    
      // Create mouseover event
      circlesGroup.on("mouseover", function(data) {
          toolTip.show(data);
        })

        // Create mouseout event
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });
  
    
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

      
  
    return circlesGroup;
  }

 // Function used for updating circles group with new tooltip on yAxis
 function updateToolTip(chosenYAxis, circlesGroup) {

    let label;
  
    if (chosenYAxis === "obesity") {
      label = "Obesity (%): ";
    }

    if (chosenYAxis === "smokes") {
        label = "Smokes (%): ";
      }
    else {
      label = "Lacks Healthcare (%): ";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => `${d.state}<br>${label} ${d[chosenYAxis]}`);
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


  // Retrieve data from the CS file
  d3.csv("./assets/data/data.csv").then(censusData => {

    // Parse data
    censusData.forEach(data => {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
  
    // xLinearScale function above csv import
    let xLinearScale = xScale(censusData, chosenXAxis);
  
    // Create y scale function
    // xLinearScale function above csv import
    let yLinearScale = yScale(censusData, chosenYAxis);
  
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .join("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "pink")
      .attr("opacity", 0.5)
      .attr("stroke", "black");
  
    // Create group for two x-axis labels
    let labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let hairLengthLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "hair_length") // value to grab for event listener
      .classed("active", true)
      .text("Hair Metal Ban Hair Length (inches)");
  
    var albumsLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "num_albums") // value to grab for event listener
      .classed("inactive", true)
      .text("# of Albums Released");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Number of Billboard 500 Hits");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
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
          xLinearScale = xScale(censusData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "num_albums") {
            albumsLabel
              .classed("active", true)
              .classed("inactive", false);
            hairLengthLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            albumsLabel
              .classed("active", false)
              .classed("inactive", true);
            hairLengthLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(error => console.log(error));