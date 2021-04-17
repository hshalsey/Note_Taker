const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', (err, data)=> {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
})

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.post('/api/notes', (req,res) => {
    fs.readFile('db/db.json', (err, data) => {
        if (err) throw err;
        let dataArr = JSON.parse(data);
        const content = req.body;
        content.id = Date.now();
        dataArr.push(content);

        fs.writeFile('db/db.json', JSON.stringify(dataArr), (err) => {
            if (err) {
                res.status(400);
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        })
    })  
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', (err, data) => {
        const {id} = req.params;
        let dataArr = JSON.parse(data);
        const result = dataArr.filter(el => el.id !== parseInt(id));
        
        fs.writeFile('db/db.json', JSON.stringify(result), (err) => {
            if (err) {
                res.status(400);
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        })
    })
})

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));