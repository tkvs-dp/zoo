import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 8080);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.webp':'image/webp', '.mp4':'video/mp4', '.woff2':'font/woff2', '.ttf':'font/ttf', '.txt':'text/plain; charset=utf-8' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, {'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Content-Length':body.length});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('找不到檔案');
  }
}).listen(port, '127.0.0.1', () => console.log(`Static preview: http://localhost:${port}/`));
