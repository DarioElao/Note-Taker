const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/notes", (req, res) => 
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
       if (err) throw err
       return res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => {
   const notes= JSON.parse(fs.readFileSync('db/db.json'))
   let note = req.body;
   let id = notes.length.toString();
   note.id = id;
   notes.push(note);
 
   fs.writeFileSync("./db/db.json", JSON.stringify(notes));
   console.log("Note saved!");
   res.json(notes);
   });


app.delete('/api/notes/:id', (req, res) => {
   const noteData = JSON.parse(fs.readFileSync('db/db.json'))
   const delData = noteData.filter((note) => note.id !== req.params.id)
   fs.writeFileSync('db/db.json', JSON.stringify(delData))
       res.json(delData)
   
})

app.listen(PORT, function () {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
