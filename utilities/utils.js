// utilities/utils.js

const fs = require('fs');

// Read and parse the JTL file
async function readJTLFile(filepath) {
    try {
        const fileContents = fs.readFileSync(filepath, 'utf8');
        return parseJTLFile(fileContents);
    } catch (error) {
        console.error('Error reading JTL file:', error);
        throw error;
    }
}

// Parse JTL file contents
function parseJTLFile(fileContents) {
    // Split the file contents into lines
    const lines = fileContents.trim().split('\n');
    
    // Initialize an array to store parsed data
    const data = [];

    // Loop through each line and parse the data
    for (const line of lines) {
        // Split the line into fields (assuming comma-separated values)
        const fields = line.split(',');

        // Extract timeStamp and elapsed values
        const timeStamp = parseInt(fields[0]);
        const elapsed = parseFloat(fields[1]);

        // Add the parsed data to the array
        data.push({ timeStamp: timeStamp, elapsed: elapsed });
    }

    // Return the parsed data
    return data;
}

module.exports = { readJTLFile };
