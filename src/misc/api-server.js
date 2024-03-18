const express = require('express');
const cors    = require('cors');
const parser  = require('body-parser');

const app    = express();

let rows = {}
let lastUniqueId = 1;

app.use( cors({ origin: '*' }));

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Object.values(rows)));
});

app.post('/', parser.json(), async function(req, res) {
    const id = lastUniqueId++;
    rows[id] = { ...req.body, id };

    res.status(201).end();
});

app.put('/:id', parser.json(), function (req, res) {
    const id = req.params.id;
    if (id in rows) {
        rows[id] = { ...req.body, id };
    }

    res.status(201).end();
});

app.delete('/:id', function (req, res) {
    const id = req.params.id;
    delete rows[id];

    res.status(201).end();
});

if (process.argv[1] === __filename) {
    
    app.listen(3000, async () => {
        console.log('server running at http://localhost:3000');
    });
    
}