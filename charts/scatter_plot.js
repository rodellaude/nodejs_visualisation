// Create scatter plot using Plotly.js
async function createScatterPlot(data) {
    try {
        // Extract x and y data
        const x = data.map(entry => entry.timeStamp);
        const y = data.map(entry => entry.elapsed);

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
                title: 'Timestamp',   // X-axis label
                automargin: true,
                tickangle: -45, // Rotate x-axis labels for better readability
                showticklabels: true // Show x-axis tick labels
            },
            yaxis: {
                title: 'Response Times (ms)'     // Y-axis label
            },
            width: 800, // Set the width of the chart to 800 pixels
            height: 600, // Set the height of the chart to 600 pixels
        };

        // Create an array of timestamp values and labels (displaying only a subset)
        const tickInterval = Math.ceil(x.length / 10); // Adjust the interval between ticks
        const tickValues = [];
        const tickLabels = [];
        for (let i = 0; i < x.length; i += tickInterval) {
            tickValues.push(x[i]);
            tickLabels.push(formatTimestamp(x[i])); // Format timestamp (you need to define formatTimestamp function)
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
