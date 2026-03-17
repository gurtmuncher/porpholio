const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filepath = url.pathname === '/' ? '/index.html' : url.pathname;
    const fullpath = path.join(__dirname, 'public', filepath);

    try {
        if (fs.existsSync(fullpath)) {
            const file = fs.readFileSync(fullpath);

            const ext = path.extname(fullpath);
            const contentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav'
            };

            res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
            res.end(file);
        } else {
            res.writeHead(404);
            res.end('not found');
        }
    } catch (err) {
        res.writeHead(500);
        res.end('server error');
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});