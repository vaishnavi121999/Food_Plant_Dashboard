const express = require('express');
const cors = require('cors');
const readFile = require('read-excel-file/node');

const app = express();
app.use(cors());

const path = require('path');

const filePath = path.join(__dirname, 'data.xlsx');

// Endpoint to read Excel data
app.get('/data', (req, res) => {
    console.log(`Filepath is: ${filePath}`)
    readFile(filePath).then((rows) => {
        res.json(rows);
    }).catch(error => {
        console.error("Error reading data file:", error);
        res.status(500).send('Error reading data file.');
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
