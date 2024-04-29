const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const { readJTLFile } = require('./utilities/utils.js');
const { createScatterPlot } = require('./charts/scatter_plot.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: './uploads', // Specify the directory to upload files
            keepExtensions: true,    // Keep file extensions
            multiples: false         // Allow multiple files to be uploaded
        });

        // Set the default temporary directory for file uploads
        form.uploadDir = path.join(__dirname, 'uploads');
        console.log(form.uploadDir);

        form.parse(req, (err, fields, files) => {
            try {
                if (err) {
                    console.error('Error parsing form:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if file is uploaded successfully
                const fileKeys = Object.keys(files);
                // console.log('files:', files);
                if (fileKeys.length === 0) {
                    console.error('No file uploaded');
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('No file uploaded');
                    return;
                }
                const file = files['file'][0];
                const originalFilename = file.originalFilename;
                var newFilename = file.newFilename;
                const oldPath = file.filepath;
                const newPath = path.join(path.dirname(oldPath), originalFilename);

                fs.rename(oldPath, newPath, function(err) {
                    if (err) {
                        console.error('Error renaming file:', err);
                        // Handle error
                    } else {
                        // Update the newFilename property
                        newFilename = originalFilename;
                        // Now newFilename matches originalFilename
                        console.log('File uploaded successfully');
                        // res.writeHead(200, { 'Content-Type': 'text/plain' });
                        // res.write('File uploaded successfully');
                        // res.end();
                        // Read the contents of the uploads directory
                        fs.readdir(form.uploadDir, (err, files) => {
                            if (err) {
                                console.error('Error reading directory:', err);
                                return res.status(500).send({ error: 'Internal Server Error' });
                            }
                            // Send the list of uploaded files to the client as JSON
                            console.log(files);
                            res.status(200).json({ files: files });
                        });
                    }
                });
            } catch (err) {
                console.error('Error processing file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    } catch (err) {
        console.error('Error creating form:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to serve the list of files
app.get('/files', (req, res) => {
    const uploadDirectory = path.join(__dirname, 'uploads');
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        res.json({ files: files });
    });
});

// Endpoint to process and serve scatter plot data
app.get('/file/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    try {
        // Read and parse JTL file
        const data = await readJTLFile(filepath);

        // Process data and create scatter plot
        const plot = await createScatterPlot(data);

        // Send scatter plot data to the client
        res.json({ plot: plot });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
