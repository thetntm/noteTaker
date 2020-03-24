//Modules

const path = require("path");
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

const publicDirectory = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));
app.use(express.static("/"));


app.get("/notes", (req, res) => {
    res.sendFile(path.join(publicDirectory, "./notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.json(JSON.parse(fs.readFileSync("./db/db.json")));
});

app.get("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if(note.id == req.params.id) {
            res.json(note);
        }
    }
});


app.post("/api/notes", (req, res) => {
    const data = req.body;
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    //if notes has a length, return the id of the last item + 1, otherwise, return 1;
    data.id = notes.length ? notes[notes.length - 1].id + 1 : 1;
    notes.push(data);
    fs.writeFileSync("./db/db.json",JSON.stringify(notes));
    res.end();
})

app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if(note.id == req.params.id) {
            notes.splice(i,1);
        }
    }
    fs.writeFileSync("./db/db.json",JSON.stringify(notes));
    res.end();
});

app.get("*", (req, res) => {
    res.sendFile(path.join(publicDirectory, "./index.html"));
});

app.listen(PORT, () =>
    console.log(`listening on port ${PORT}`));