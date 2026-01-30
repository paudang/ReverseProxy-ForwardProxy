const http = require('http');

const startServer = (port, name) => {
    http.createServer((req, res) => {
        console.log(`[${name}] Received request: ${req.method} ${req.url}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Hello from ${name} running on port ${port}\n`);
    }).listen(port, () => {
        console.log(`${name} listening on port ${port}`);
    });
};

// Start two backend servers
startServer(3001, 'Backend Server 1');
startServer(3002, 'Backend Server 2');
