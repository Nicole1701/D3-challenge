/////////////////////////Set Up Chart////////////////////////////
// observablehq.com/@abebrath/scatterplot-of-text-labels

// Define SVG area dimensions
let svgWidth = 960;
let svgHeight = 560;

// Define the chart's margins as an object
let margin= {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// Define dimensions of the chart area
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Select scatter, append SVG area to it, and set the dimensions
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

/////////////////////////Fucntions////////////////////////////

// Function to update x-scale var upon axis label click
function xScale(censusData, chosenXAxis) {
  // Create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// Function to update y-scale var upon axis label click
function yScale(censusData, chosenYAxis) {
    // Create scales
    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

// Function to update xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// Function to update yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// Function to update circles with a transition 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

   // Function to update labels with transitions!!!!
   function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circleLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return circleLabels;
  }

  // Function to update circles group with new tooltip on xAxis
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
  
    if (chosenXAxis === "poverty") {
      var xlabel = "In Poverty (%): ";
    }

    else if (chosenXAxis === "age") {
        var xlabel = "Age (Median): ";
      }
    else {
        var xlabel = "Household Income (Median): $";
    };

    if (chosenYAxis === "obesity") {
        var ylabel = "Obesity (%): ";
      }
  
      else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes (%): ";
        }
      else {
        var ylabel = "Lacks Healthcare (%): ";
      }
    
       var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => `${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
  
    circlesGroup.call(toolTip);


    circlesGroup
    // Mouseover Event - Show tooltip
        .on("mouseover", function(data) {
      toolTip.show(data);
        })
      // Mouseout Event - Hide tooltip
        .on("mouseout", function(data) {
        toolTip.hide(data);
        });
  
    return circlesGroup;
  };

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
    let yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // Append initial circles
    var circlesGroup = chartGroup.selectAll("g")
        .data(censusData)
        .enter()
        .append("g")
        .classed("circles", true);
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .join("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .attr("fill", " blue")
      .attr("opacity", 0.5)
      .attr("stroke", "black");

      
  
    // Create group for three x-axis labels
    let xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 25)
      .attr("value", "poverty")
      .classed("active", true)
      .text("Poverty (%)");

      let ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 50)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

      let incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 75)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Income (Median)");

    // Create group for three y-axis labels
    let ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");
  
        let obesityLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - (margin.left/3))
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity (%)");

        let smokesLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (height / 2))
        .attr("y", -25 - (margin.left/3))
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");
          
        let healthcareLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (height / 2))
        .attr("y", -50 - (margin.left/3))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");
  
    // Update the ToolTip function
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  
    // Add x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // Replace chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  
          // Update x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);
  
          // Update x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
  
          // Update circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // Uppdate tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,);

          // Update the Labels function
          circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
        // Change classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            }
        else if (chosenXAxis === "age") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            }
        else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            }
        }
      });

         // Add x axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // Get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // Replace chosenYAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // Update y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // Update y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // Update circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // Update tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenYAxis);

        // Update the Labels function
        circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        
        // Change classes to change bold text
        if (chosenYAxis === "obesity") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        else if (chosenYAxis === "smokes") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          }
      }
      });
  }).catch(error => console.log(error));

