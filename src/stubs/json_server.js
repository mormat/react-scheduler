const jsonServer = require('json-server');

function createJsonServer() {

    const server = jsonServer.create();
    const router = jsonServer.router({
        'events': [
            { id: 1, label: 'Meeting',         start: '2024-08-12 09:00', end: '2024-08-12 12:00' },
            { id: 2, label: 'Interview',       start: '2024-08-14 14:00', end: '2024-08-14 15:00' },
            { id: 3, label: 'Training course', start: '2024-08-15 08:00', end: '2024-08-16 18:00' },
        ]
    })

    const middlewares = jsonServer.defaults()

    server.use((req, res, next) => {

        if ('from' in req.query) {
            req.query.end_gte = req.query.from;
            delete req.query.from;
        }

        if ('to' in req.query) {
            req.query.start_lte = req.query.to;
            delete req.query.from;
        }

        next();

    });

    server.use(middlewares);
    server.use(router);
    
    return server;
    
}

module.exports = { createJsonServer }
