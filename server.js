const express = require("express");
const path = require("path");
const fs = require('fs');

// Helper function for generating unique ids
const uuid = require("./helpers/uuid");

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const dbData = require("./db/db.json");

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static("public"));

// This view route is a GET route for the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/assets/notes.html"));
});

// This view route is a GET route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/assets/index.html"));
});

// This API route is a GET Route for retrieving all of the notes
app.get('/api/notes', (req, res) => {
    
    res.json(dbData);

    console.info(`${req.method} request to get notes recieved`);    
});

// This API route is a POST Route for a new note to be added
app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
    if (title && text) {

    const newNote =
        {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, `./db/db.json`);
        res.json(`Note added successfully`);
    }   else {
        res.error(`Error adding note`);
    }
});

// This API route is a DELETE Route for any notes to be deleted
app.delete('/api/notes/:id', (req, res) => {
    const noteData = note.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((deletedNote) => {
            res.json(deletedNote);
        })
        .catch((err) => res.json(err));
});

app.listen(PORT, () =>
console.log(`Note taker listening at http://localhost:${PORT}`)
);
