import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Vercel routes current and legacy API entry points to MongoDB', async () => {
 const config=JSON.parse(await readFile(new URL('../../vercel.json',import.meta.url),'utf8'));
 assert.equal(config.rewrites[0].source,'/api/:path*');
 assert.equal(config.rewrites[0].destination,'/api/index');
 for(const name of ['index','auth','mentor','db-status']) {
  const source=await readFile(new URL(`../../api/${name}.js`,import.meta.url),'utf8');
  assert.match(source,/import handler from '..\/server\/src\/index.js'/);
  assert.match(source,/return handler\(req, res\)/);
  assert.doesNotMatch(source,/Standalone serverless API is disabled/);
 }
});
