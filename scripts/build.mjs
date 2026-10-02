import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const entry of ['index.html', 'src', 'public']) {
  await cp(entry, `dist/${entry}`, { recursive: true });
}
console.log('Static website copied to dist/');
