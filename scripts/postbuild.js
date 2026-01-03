import fs from 'fs';
import path from 'path';

const serverDir = path.resolve('.netlify/functions-internal/server');
const oldPath = path.join(serverDir, 'server.mjs');
const newPath = path.join(serverDir, 'index.mjs');

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed server.mjs to index.mjs');
} else {
  console.log('server.mjs not found, skipping rename');
}
