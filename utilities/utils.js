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
        const fields = splitCSVLine(line);

        // Extract timeStamp and elapsed values
        const timeStamp = parseInt(fields[0]);
        const elapsed = parseFloat(fields[1]);
        const scriptNameField = fields[5]; // Assuming scriptName is in the 6th column (index 5)

        // Extract scriptName from the scriptNameField
        const scriptNameMatch = scriptNameField.match(/(.+?)\s\d+-\d+$/);
        const scriptName = scriptNameMatch ? scriptNameMatch[1] : scriptNameField;

        // Add the parsed data to the array
        // Check if timeStamp and elapsed are valid numbers
        if (!isNaN(timeStamp) && !isNaN(elapsed)) {
            // Convert timeStamp to readable format (yyyy/mm/dd hh:mm:ss)
            const date = new Date(timeStamp);
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            // Add the parsed data to the array
            data.push({ 
                timeStamp: formattedDate, 
                elapsed: elapsed,
                scriptName: scriptName
            });
        }
    }

    // Sort the data array by timeStamp
    // data.sort((a, b) => {
    //     return new Date(a.timeStamp) - new Date(b.timeStamp);
    // });
    data.sort((a, b) => {
        // Compare scriptName property of each data trace
        if (a.scriptName < b.scriptName) {
            return -1; // a should appear before b
        }
        if (a.scriptName > b.scriptName) {
            return 1; // a should appear after b
        }
        return 0; // scriptName is equal
    });

    // Display a few rows of data
    const numRowsToShow = 5;
    for (let i = 0; i < Math.min(numRowsToShow, data.length); i++) {
        console.log(`${data[i].timeStamp}, ${data[i].elapsed}, ${data[i].scriptName}`);
    }

    // Return the parsed data
    return data;
}

// Split CSV line while handling commas inside double quotes
function splitCSVLine(line) {
    const parts = [];
    let currentPart = '';
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            // Toggle insideQuote
            insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
            // Split the part and start a new part
            parts.push(currentPart);
            currentPart = '';
        } else {
            // Append character to the current part
            currentPart += char;
        }
    }

    // Add the last part
    parts.push(currentPart);

    return parts;
}

module.exports = { readJTLFile };
