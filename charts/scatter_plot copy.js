// Create scatter plot using Plotly.js
async function createScatterPlot(data) {
    try {
        // Extract x and y data
        const x = data.map(entry => entry.timeStamp);
        const y = data.map(entry => entry.elapsed);

        // Extract unique x (timestamp) values for tick labeling
        const uniqueX = Array.from(new Set(x));

        // Define marker properties
        const marker = {
            color: 'white',     // Marker color
            size: 5,         // Marker size
            symbol: 'circle',  // Marker symbol
            line: {
                color: 'red', // Marker border color
                width: 1 // Marker border width
            }
        }; 

        // Plot data
        const plot = {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter',
            marker: marker
        };

        // Define layout properties
        const layout = {
            title: 'Scatter Plot',  // Title of the plot
            xaxis: {
                title: {
                    text: 'Timestamp',   // X-axis title
                    font: {
                        size: 12  // Font size for x-axis title
                    }
                },
                automargin: true,
                // tickangle: -45, // Rotate x-axis labels for better readability
                showticklabels: true, // Show x-axis tick labels
                showgrid: false,
                ticks: 'outside',
                tickfont: {           // Define tick font
                    family: 'Arial',  // Font family
                    size: 10,         // Font size
                    color: '#000'     // Font color
                }
            },
            yaxis: {
                title: {
                    text: 'Response Times (ms)',   // X-axis title
                    font: {
                        size: 12  // Font size for x-axis title
                    }
                },
                showgrid: false,
                ticks: 'outside', 
                tickfont: {           // Define tick font
                    family: 'Arial',  // Font family
                    size: 10,         // Font size
                    color: '#000'     // Font color
                },
                zeroline: true, // Show the zero line
                zerolinecolor: 'gray', // Color of the zero line
                zerolinewidth: 1, // Width of the zero line
                zerolinestyle: 'dot' // Style of the zero line (dash, dot, solid, etc.)
            },
            width: 800, // Set the width of the chart to 800 pixels
            height: 400, // Set the height of the chart to 600 pixels
            plot_bgcolor: '#f7f7f7', // Set plot background color to black
            // paper_bgcolor: 'lightgrey' // Set paper background color to white (this fills the entire chart area)
            // margin: {
            //     t: 40  // Adjust the top margin to move the graph slightly above the x-axis
            // },
        };

        // Create an array of timestamp values and labels (displaying only a subset)
        const tickInterval = Math.ceil(uniqueX.length / 5); // Adjust the interval between ticks
        const tickValues = [];
        const tickLabels = [];
        for (let i = 0; i < uniqueX.length; i += tickInterval) {
            tickValues.push(uniqueX[i]);
            tickLabels.push(formatTimestamp(uniqueX[i])); // Format timestamp (you need to define formatTimestamp function)
        }

        // Set the tickvals and ticktext properties in the layout object
        layout.xaxis.tickvals = tickValues;
        layout.xaxis.ticktext = tickLabels;

        return { plot: plot, layout: layout }; // Return plot data and layout
    } catch (error) {
        console.error('SERVER :: Error creating scatter plot:', error);
        throw error;
    }
}

// Function to format timestamp to hh:mm:ss am/pm format
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

module.exports = { createScatterPlot };
