const http = require('http');
const net = require('net');
const url = require('url');

const PORT = 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
    console.log(`[Forward Proxy] HTTP Request: ${req.method} ${req.url}`);

    const parsedUrl = url.parse(req.url);

    if (!parsedUrl.hostname) {
        res.writeHead(400);
        res.end('Invalid request');
        return;
    }

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.path,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`[Forward Proxy] Error: ${err.message}`);
        res.writeHead(500);
        res.end('Proxy error');
    });

    req.pipe(proxyReq, { end: true });
});

// Handle HTTPS (CONNECT method)
server.on('connect', (req, clientSocket, head) => {
    console.log(`[Forward Proxy] HTTPS Connect: ${req.url}`);

    const { port, hostname } = url.parse(`//${req.url}`, false, true);

    const serverSocket = net.connect(port || 443, hostname, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node.js-Proxy\r\n' +
            '\r\n');
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
        console.error(`[Forward Proxy] Tunnel Error: ${err.message}`);
        clientSocket.end();
    });

    clientSocket.on('error', (err) => {
        console.error(`[Forward Proxy] Client Socket Error: ${err.message}`);
        serverSocket.end();
    });
});

server.listen(PORT, () => {
    console.log(`Forward Proxy running on port ${PORT}`);
    console.log(`To test: curl -x http://localhost:${PORT} http://example.com`);
});
