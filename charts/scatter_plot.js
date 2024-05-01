// Create scatter plot using Plotly.js
async function createScatterPlot(data) {
    try {
        // Extract unique x (timestamp) values for tick labeling
        const uniqueX = data.map(entry => entry.timeStamp);

        const colors = [
            '#000080', // Navy
            '#800000', // Maroon
            '#808000', // Olive
            '#008B8B', // Dark Cyan
            '#8B008B', // Dark Magenta
            '#FF8C00', // Dark Orange
            '#800080', // Dark Purple
            '#008080', // Dark Teal
            '#E9967A', // Dark Salmon
            '#A9A9A9', // Dark Grey
            '#00008B', // Dark Blue
            '#8B0000', // Dark Red
            '#006400', // Dark Green
            '#00CED1', // Dark Turquoise
            '#2F4F4F', // Dark Slate Gray
            '#4B0082', // Dark Indigo
            '#8B4513', // Dark Sienna
            '#2F4F4F', // Dark Slate Gray (Duplicate, but included for variety)
            '#D2691E', // Dark Chocolate
            '#556B2F', // Dark Olive Green
        ];
                
        // Define marker properties
        const marker = {
            color: 'white',
            size: 5,         // Marker size
            symbol: 'circle',  // Marker symbol
            line: {
                width: 1 // Marker border width
            }
        };
        // Group data by scriptName
        let groupedData = {};
        data.forEach((entry, index) => {
            const colorIndex = index % colors.length; // Define colorIndex here
            if (!groupedData[entry.scriptName]) {
                groupedData[entry.scriptName] = { 
                    x: [], 
                    y: [], 
                    mode: 'markers', 
                    type: 'scatter',
                    marker: { ...marker, line: { ...marker.line, color: colors[colorIndex] } }, // Assign color to marker line
                    name: entry.scriptName 
                };
            }
            groupedData[entry.scriptName].x.push(entry.timeStamp);
            groupedData[entry.scriptName].y.push(entry.elapsed);
        });

        // Convert timestamp strings to Date objects and sort x arrays within each group
        Object.values(groupedData).forEach(group => {
            group.x = group.x.map(timestamp => new Date(timestamp));
            group.x.sort((a, b) => a - b);
        });

        // Sort groups based on the earliest timestamp in each group
        const sortedGroups = Object.values(groupedData).sort((a, b) => {
            const earliestA = a.x[0];
            const earliestB = b.x[0];
            return earliestA - earliestB;
        });

        // Rebuild groupedData with sorted groups
        const sortedGroupedData = {};
        sortedGroups.forEach(group => {
            sortedGroupedData[group.name] = group;
        });

        // Update groupedData with sorted data
        groupedData = sortedGroupedData;

        // Convert groupedData to array
        const plotData = Object.values(groupedData);

        // Define layout properties
        const layout = {
            title: 'Scatter Plot by Script Name',  // Title of the plot
            xaxis: {
                title: {
                    text: 'Timestamp',   // X-axis title
                    font: {
                        size: 12  // Font size for x-axis title
                    }
                },
                automargin: true,
                showticklabels: true, // Show x-axis tick labels
                showgrid: false,
                ticks: 'outside',
                tickfont: {           // Define tick font
                    // family: 'Arial',  // Font family
                    size: 10,         // Font size
                    color: '#000'     // Font color
                },
                // tickformat: '%d %B (%a)\n %Y'
                tickformat: '%H:%M:%S %p \n %x'
                // tickmode: 'auto',
            },
            yaxis: {
                title: {
                    text: 'Response Times (ms)',   // Y-axis title
                    font: {
                        size: 12  // Font size for y-axis title
                    }
                },
                showgrid: false,
                ticks: 'outside', 
                tickfont: {           // Define tick font
                    // family: 'Arial',  // Font family
                    size: 10,         // Font size
                    color: '#000'     // Font color
                },
                zeroline: true, // Show the zero line
                zerolinecolor: 'gray', // Color of the zero line
                zerolinewidth: 1, // Width of the zero line
                zerolinestyle: 'dot' // Style of the zero line (dash, dot, solid, etc.)
            },
            width: 1000, // Set the width of the chart to 800 pixels
            height: 500, // Set the height of the chart to 600 pixels
            // plot_bgcolor: '#f7f7f7' // Set plot background color
            legend: {
                font: {
                    size: 10  // Adjust the font size of the legend
                }
            },
        };
        // const dates = uniqueX.map(formattedDate => new Date(formattedDate));
        // // Find the start and end times
        // const startTime = Math.min(...dates);
        // const endTime = Math.max(...dates);
        // console.log(startTime);
        // console.log(endTime);

        // // Convert start and end time to minutes
        // const startTimeMinutes = new Date(startTime).getTime() / (1000 * 60);
        // const endTimeMinutes = new Date(endTime).getTime() / (1000 * 60);

        // const numInterval = 6;
        // // Calculate the interval in minutes
        // const intervalMins = (endTimeMinutes - startTimeMinutes) / numInterval;

        // // Generate 5 timestamp values with equal intervals
        // const tickValues = [];
        // const tickLabels = [];
        // for (let i = 0; i <= numInterval; i++) {
        //     const timestamp = startTimeMinutes + i * intervalMins;
        //     tickValues.push(formatTimestamp_to_full(timestamp * 60 * 1000)); // Convert back to "YYYY/MM/DD HH:MM:SS" 
        //     tickLabels.push(formatTimestamp(timestamp * 60 * 1000)); // Convert back to milliseconds before formatting
        // }

        // console.log(tickValues);
        // console.log(tickLabels);

        // Set the tickvals and ticktext properties in the layout object
        // layout.xaxis.tickvals = tickValues;
        // layout.xaxis.ticktext = tickLabels;

        return { plot: plotData, layout: layout }; // Return plot data and layout
    } catch (error) {
        console.error('Error creating scatter plot:', error);
        throw error;
    }
}

// Function to format timestamp
// function formatTimestamp(timestamp) {
//     const date = new Date(timestamp);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
//     const ampm = hours >= 12 ? 'pm' : 'am';
//     const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
//     return `${formattedHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
// }

// function formatTimestamp_to_full(timestamp) {
//     const date = new Date(timestamp);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const seconds = date.getSeconds().toString().padStart(2, '0');
//     return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// }

module.exports = { createScatterPlot };
