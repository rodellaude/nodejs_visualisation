import fs from 'fs';
import yaml from 'js-yaml'; // Make sure to install js-yaml as a dependency
import { readJTLFile } from '../utilities/utils.js'; // Import readJTLFile function from file_utils.js

// Read and parse the YAML configuration file
function readConfigFile(filepath) {
    try {
        const fileContents = fs.readFileSync(filepath, 'utf8');
        return yaml.safeLoad(fileContents);
    } catch (error) {
        console.error('Error reading configuration file:', error);
        throw error;
    }
}

// Create scatter plot using Plotly.js
export async function createScatterPlot(filepath, username, apiKey) {
    try {
        // Read and parse JTL file
        const data = await readJTLFile(filepath);

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

        // Optionally, initialize Plotly with credentials
        // const plotlyClient = plotly(username, apiKey);
        // await plotlyClient.plot(plot, { filename: 'scatter-plot', fileopt: 'overwrite' });

        return plot;
    } catch (error) {
        console.error('Error creating scatter plot:', error);
        throw error;
    }
}
