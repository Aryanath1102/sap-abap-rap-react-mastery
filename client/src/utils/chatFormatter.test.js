import test from 'node:test';
import assert from 'node:assert/strict';
import { splitCodeBlocks, tokenizeInline } from './chatFormatter.js';

test('tokenizeInline terminates immediately on nested bold, italic, and snake_case identifiers', () => {
  const tokens = tokenizeInline('*Level 1:* Use `zi_travel_m` with _safe_ ~old~ **RAP** and SELECT * FROM ztab.');
  assert.deepEqual(
    tokens.map((t) => t.type),
    ['bold', 'text', 'code', 'text', 'italic', 'text', 'strike', 'text', 'bold', 'text']
  );
  assert.equal(tokens[2].value, 'zi_travel_m');
});

test('tokenizeInline handles unclosed markers, snake_case with bold, and repeated asterisks without hanging', () => {
  const messy = '*   *Level 1:* *Wait*, * * * * unclosed **bold and _under_score_test a_b *bold* c_d';
  const tokens = tokenizeInline(messy);
  assert.ok(Array.isArray(tokens));
  assert.ok(tokens.some((t) => t.type === 'bold'));
});

test('splitCodeBlocks separates prose from fenced code blocks', () => {
  const blocks = splitCodeBlocks('*Level 1*\n```abap\nFINAL(x) = 1.\n```\nDone');
  assert.equal(blocks.length, 3);
  assert.equal(blocks[1].type, 'code');
  assert.equal(blocks[1].language, 'abap');
  assert.equal(blocks[1].value, 'FINAL(x) = 1.');
});
