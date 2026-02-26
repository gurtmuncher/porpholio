const path = require('path');
const fs = require('fs');
const { Hono } = require('hono');
const { serveStatic } = require('@hono/node-server/serve-static');
const { serve } = require('@hono/node-server');

const app = new Hono();

const publicDir = path.join(__dirname, 'public');

app.use('/*', serveStatic({ root: publicDir }));

app.get('/', (c) => {
    return c.html(
        fs.readFileSync(path.join(publicDir, 'index.html'), 'utf-8')
    );
});

app.notFound((c) => {
    return c.html(
        fs.readFileSync(path.join(publicDir, '404.html'), 'utf-8'),
        404
    );
});

const port = 3000;
serve({ fetch: app.fetch, port });

console.log(`Running at http://localhost:${port}`);