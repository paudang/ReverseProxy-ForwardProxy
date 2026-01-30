const http = require('http');

const PORT = 3000;
const BACKENDS = [
    { host: 'localhost', port: 3001 },
    { host: 'localhost', port: 3002 }
];

let currentBackend = 0;

const server = http.createServer((req, res) => {
    // Round-robin selection
    const target = BACKENDS[currentBackend];
    currentBackend = (currentBackend + 1) % BACKENDS.length;

    console.log(`[Reverse Proxy] Routing ${req.method} ${req.url} to ${target.host}:${target.port}`);

    const options = {
        hostname: target.host,
        port: target.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`[Reverse Proxy] Error: ${err.message}`);
        res.writeHead(502);
        res.end('Bad Gateway');
    });

    req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
    console.log(`Reverse Proxy running on port ${PORT}`);
    console.log(`Backends expected at: ${BACKENDS.map(b => b.port).join(', ')}`);
});
