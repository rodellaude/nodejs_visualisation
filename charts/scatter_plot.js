// Create scatter plot using Plotly.js
async function createScatterPlot(data) {
    try {
        // Extract x and y data
        const x = data.map(entry => entry.timeStamp);
        const y = data.map(entry => entry.elapsed);

        // Plot data
        const plot = {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'blue'
            }
        };

        return plot;
    } catch (error) {
        console.error('Error creating scatter plot:', error);
        throw error;
    }
}

module.exports = { createScatterPlot };
