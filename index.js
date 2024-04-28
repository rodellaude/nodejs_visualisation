import express from 'express';
import path from 'path';
import morgan from 'morgan';
import fs from 'fs';
import { createLogger, transports, format } from 'winston';
import { handleFileUpload } from './utilities/utils.js';
import { createScatterPlot } from './charts/scatter_plot.js';

const app = express();
const port = 3000;

// Logging configuration
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: 'log/combined.log', level: 'info' }),
        new transports.File({ filename: 'log/error.log', level: 'error' })
    ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

// Serve static files (HTML, CSS, JavaScript, etc.)
app.use(express.static('public'));

const __dirname = path.dirname(new URL(import.meta.url).pathname); // Get the directory name from the module's URL
const logDirectory = path.join(__dirname.substring(1), 'log'); // Define the log directory

fs.mkdirSync(logDirectory, { recursive: true }); // Ensure the log directory exists

const logFilePath = path.join(logDirectory, 'access.log'); // Use __dirname and log directory to construct the log file path
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // Create a write stream for logging

app.use(morgan('combined', { stream: accessLogStream })); // Use morgan middleware with the accessLogStream

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling file upload
app.post('/upload', async (req, res, next) => {
    try {
        // Call the handleFileUpload middleware
        await handleFileUpload(req, res, next);
        
        // If handleFileUpload is successful, continue processing
        // Get uploaded file information
        // const file = req.file;
        // if (!file) {
        //     const noFileMessage = 'No file uploaded.';
        //     return res.status(400).send({ message: noFileMessage });
        // }

        // File uploaded successfully, continue processing...
    } catch (error) {
        logger.error(error); // Log error
        // res.status(400).send(error.message);
    }
});


// Route for processing scatter plot
app.get('/process-scatter-plot', async (req, res) => {
    try {
        const plotData = await createScatterPlot();
        // Send scatter plot data as JSON response
        res.json(plotData);
    } catch (error) {
        logger.error(error); // Log error
        res.status(500).send('Error processing scatter plot.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err); // Log error

    // Check if a response has already been sent
    if (res.headersSent) {
        return next(err); // Pass the error to the next error handler
    }
    
    res.status(500).send('Internal Server Error: ' + err.message);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default logger;
