/////////////////////////Set Up Chart////////////////////////////

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
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  // Function used for updating circles group with new tooltip on xAxis
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    if (chosenXAxis === "poverty") {
      let xLabel = "Poverty (%): ";
    }

    if (chosenXAxis === "age") {
        let xLabel = "Age (Median): ";
      }
    else {
        let xLabel = "Household Income (Median): ";
    }

    if (chosenYAxis === "obesity") {
        let yLabel = "Obesity (%): ";
      }
  
      if (chosenYAxis === "smokes") {
        let yLabel = "Smokes (%): ";
        }
      else {
        let yLabel = "Lacks Healthcare (%): ";
      }
    
      let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(d => `${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);

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
  
    // Create mouseover event
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
      // Create mouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    return circlesGroup;
  }

/////////////////////////Create Chart////////////////////////////

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
  
    // xLinearScale function above csv import
    let yLinearScale = yScale(censusData, chosenYAxis);
  
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
  
    // Append x axis
    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // Append y axis
    chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // Append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .join("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", " blue")
      .attr("opacity", 0.5)
      .attr("stroke", "black");
  
    // Create group for three x-axis labels
    let xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty (%)");

      let ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

      let incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Income (Median)");

    let ylabelsGroup = chartGroup.append("g")
      .attr("transform", rotate(-90));
  
        let obesityLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity (%)");

        let healthcareLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Healthcare (%)");

        let smokesLabel = ylabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");
  
    // // append y axis
    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .classed("axis-text", true)
    //   .text("Number of Billboard 500 Hits");
  
    // Update the ToolTip function
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // Add x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        let value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // Replace chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  
          // Update x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);
  
          // Udate x axis with transition
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