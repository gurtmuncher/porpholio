import path from 'path';

Bun.serve({
    port: 3000,
    async fetch(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const filepath = url.pathname === '/' ? '/index.html' : url.pathname;
        const fullpath = path.join(import.meta.dir, 'public', filepath);
        const file = Bun.file(fullpath);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response('not found', { status: 404 });
    }
});

console.log('http://localhost:3000');