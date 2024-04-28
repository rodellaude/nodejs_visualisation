// utilities/utils.js

import fs from 'fs';
import multer from 'multer';

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Custom file filter function
function fileFilter(req, file, cb) {
    const filePath = 'uploads/' + file.originalname;
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist, accept the file
            cb(null, true);
        } else {
            // File already exists, reject the file
            cb(new Error('File with the same name already exists'), false);
        }
    });
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Read and parse the JTL file
export async function readJTLFile(filepath) {
    try {
        const fileContents = fs.readFileSync(filepath, 'utf8');
        // Parse file contents and return data
        // Example: const data = parseJTLFile(fileContents);
        // Replace the above line with your actual logic to parse JTL file contents
        return data;
    } catch (error) {
        console.error('Error reading JTL file:', error);
        throw error;
    }
}

// Middleware for handling file upload
export async function handleFileUpload(req, res, next) {
    try {         // Check if a file was uploaded
             
        const uploadMiddleware = upload.single('file');
        uploadMiddleware(req, res, async (err) => {
            console.log('Inside uploadMiddleware callback');
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).send(err.message);
            }
            // File uploaded successfully
            console.log('File uploaded successfully');
            const successMessage = 'File uploaded successfully.';
            res.status(200).send({ message: successMessage }); // Send success response with message
            next();
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).send('Internal Server Error');
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
        const [timeStamp, elapsed] = line.split(',');
        
        // Convert timestamp and elapsed to numbers
        const timestampMs = parseInt(timeStamp);
        const elapsedMs = parseInt(elapsed);

        // Add the parsed data to the array
        data.push({ timeStamp: timestampMs, elapsed: elapsedMs });
    }

    // Return the parsed data
    return data;
}

