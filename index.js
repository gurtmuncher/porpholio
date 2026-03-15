const path = require('path');

Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        let filepath = url.pathname === '/' ? '/index.html' : url.pathname;
        const fullpath = path.join(__dirname, 'public', filepath);
        const file = Bun.file(fullpath);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response('not found', { status: 404 });
    }
});

console.log('http://localhost:3000');