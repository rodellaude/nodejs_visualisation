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
        const threadName = fields[5];

        // Add the parsed data to the array
        // Check if timeStamp and elapsed are valid numbers
        if (!isNaN(timeStamp) && !isNaN(elapsed)) {
            // Convert timeStamp to readable format (yyyy/mm/dd hh:mm:ss)
            const date = new Date(timeStamp);
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            const scriptName = threadName.replace(/\s\d+-\d+$/, '');
            // Add the parsed data to the array
            data.push({ 
                timeStamp: formattedDate, 
                elapsed: elapsed,
                scriptName: scriptName
            });
        }
    }

    // Sort the data array by timeStamp
    data.sort((a, b) => {
        return new Date(a.timeStamp) - new Date(b.timeStamp);
    });

    // Return the parsed data
    return data;
}

module.exports = { readJTLFile };
