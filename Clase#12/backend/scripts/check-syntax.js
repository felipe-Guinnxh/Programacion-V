import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

async function findJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findJavaScriptFiles(path));
    else if (extname(entry.name) === '.js') files.push(path);
  }

  return files;
}

const files = [
  ...await findJavaScriptFiles('src'),
  ...await findJavaScriptFiles('test'),
];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Sintaxis correcta en ${files.length} archivos JavaScript.`);
