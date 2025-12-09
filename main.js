// main.js - Fixed: "Expected moveto path command" Error

// 1. CONFIGURATION
const margin = { top: 40, right: 200, bottom: 60, left: 60 };
const width = 850 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

const xAttr = 'Horsepower(HP)';
const yAttr = 'City Miles Per Gallon';

// --- Dimension 3: COLOR (Car Type) ---
const colorMap = {
    'Sedan': '#4e79a7', 'SUV': '#f28e2b', 'Sports Car': '#e15759',
    'Wagon': '#76b7b2', 'Minivan': '#59a14f', 'Truck': '#edc949', 'Other': '#bab0ac'
};

// --- Dimension 4: SHAPE (AWD) ---
const getShape = (d) => {
    return d.AWD === 1 ? d3.symbolSquare : d3.symbolCircle;
};

// 2. SETUP SVG
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 3. LOAD DATA
d3.csv("cars.csv").then(function (data) {
    console.log("Data Loaded.");

    // Parse Data
    data.forEach(d => {
        d[xAttr] = +d[xAttr];
        d[yAttr] = +d[yAttr];
        d['Retail Price'] = +d['Retail Price'];
        d['Cyl'] = +d['Cyl'];
        d['Engine Size (l)'] = +d['Engine Size (l)'];
        d['AWD'] = +d['AWD'];
    });

    const cleanedData = data.filter(d => d[xAttr] > 0 && d[yAttr] > 0 && d[yAttr] < 200);

    // 4. SCALES
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(cleanedData, d => d[xAttr]) * 1.05])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(cleanedData, d => d[yAttr]) * 1.05])
        .range([height, 0]);

    // 5. AXES & GRID
    svg.append("g").attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    svg.append("g").attr("class", "grid")
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    svg.append("text").attr("class", "axis-label")
        .attr("x", width / 2).attr("y", height + 40).attr("text-anchor", "middle")
        .text("Horsepower (HP)");

    svg.append("text").attr("class", "axis-label")
        .attr("transform", "rotate(-90)").attr("y", -40).attr("x", -height / 2).attr("text-anchor", "middle")
        .text("City Miles Per Gallon");

    // 6. DRAW POINTS
    const dots = svg.selectAll(".dot")
        .data(cleanedData)
        .enter()
        .append("path")
        .attr("class", "dot")
        .attr("transform", d => `translate(${xScale(d[xAttr])}, ${yScale(d[yAttr])})`)
        // 【核心修复】 注意最后的 ()，必须调用函数才能生成路径字符串
        .attr("d", d => d3.symbol().type(getShape(d)).size(80)())
        .attr("fill", d => colorMap[d.Type] || '#999')
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .style("opacity", 0.7);

    // 7. INTERACTION (HOVER ONLY)
    dots.on("mouseover", function (event, d) {
        // 鼠标移入：高亮
        d3.select(this)
            .classed("selected", true)
            // 【核心修复】 这里也要加 ()
            .attr("d", d3.symbol().type(d3.symbolSquare).size(300)())
            .raise();

        updatePanel(d);
    })
        .on("mouseout", function (event, d) {
            // 鼠标移出：恢复
            d3.select(this)
                .classed("selected", false)
                // 【核心修复】 这里也要加 ()
                .attr("d", d => d3.symbol().type(getShape(d)).size(80)())
                .style("opacity", 0.7);

            resetPanel();
        });

    // 8. LEGEND
    const legendContainer = svg.append("g").attr("transform", `translate(${width + 20}, 20)`);

    // Color Legend
    legendContainer.append("text").text("Car Type (Color)").style("font-weight", "bold");
    const types = Object.keys(colorMap);
    types.forEach((type, i) => {
        const row = legendContainer.append("g").attr("transform", `translate(0, ${i * 20 + 20})`);
        row.append("rect").attr("width", 12).attr("height", 12).attr("fill", colorMap[type]);
        row.append("text").attr("x", 20).attr("y", 10).style("font-size", "12px").text(type);
    });

    // Shape Legend
    const shapeLegendY = types.length * 20 + 50;
    const shapeGroup = legendContainer.append("g").attr("transform", `translate(0, ${shapeLegendY})`);

    shapeGroup.append("text").text("Drive Type (Shape)").style("font-weight", "bold");

    const rowNoAWD = shapeGroup.append("g").attr("transform", "translate(0, 25)");
    // 【核心修复】 Legend 里的符号也要加 ()
    rowNoAWD.append("path")
        .attr("d", d3.symbol().type(d3.symbolCircle).size(60)())
        .attr("fill", "#666").attr("transform", "translate(6,6)");
    rowNoAWD.append("text").attr("x", 20).attr("y", 10).style("font-size", "12px").text("2WD (Circle)");

    const rowAWD = shapeGroup.append("g").attr("transform", "translate(0, 50)");
    // 【核心修复】 Legend 里的符号也要加 ()
    rowAWD.append("path")
        .attr("d", d3.symbol().type(d3.symbolSquare).size(60)())
        .attr("fill", "#666").attr("transform", "translate(6,6)");
    rowAWD.append("text").attr("x", 20).attr("y", 10).style("font-size", "12px").text("AWD (Square)");

}).catch(function (error) {
    console.error("Error loading data:", error);
});

// HELPER: Update Side Panel
function updatePanel(d) {
    const panel = d3.select("#panel-content");
    const name = d.Name || d.name || "Unknown Name";
    const price = d['Retail Price'] ? d['Retail Price'].toLocaleString() : "N/A";
    const isAWD = d.AWD === 1 ? "Yes (AWD)" : "No (2WD)";

    const htmlContent = `
        <h4 style="margin-top:0; border-bottom: 2px solid ${colorMap[d.Type] || '#333'}">${name}</h4>
        <table>
            <tr><th>Type</th><td>${d.Type}</td></tr>
            <tr><th>Drive Mode</th><td>${isAWD}</td></tr>
            <tr><th>Horsepower</th><td>${d[xAttr]} HP</td></tr>
            <tr><th>MPG</th><td>${d[yAttr]} mpg</td></tr>
            <tr><th>Price</th><td>$${price}</td></tr>
            <tr><th>Cylinders</th><td>${d.Cyl || "N/A"}</td></tr>
            <tr><th>Engine</th><td>${d['Engine Size (l)'] || "N/A"} L</td></tr>
        </table>
    `;
    panel.html(htmlContent);
}

// HELPER: Reset Panel
function resetPanel() {
    d3.select("#panel-content")
        .html('<p class="placeholder-text">Hover over a point to view details.</p>');
}