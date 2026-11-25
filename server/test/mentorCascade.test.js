import test from 'node:test';
import assert from 'node:assert/strict';
import { MODEL_CASCADE, CASCADE_SUMMARY, callGenerativeLanguageApi } from '../src/aiMentor.js';

const noopSleep = async () => {};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

test('MODEL_CASCADE prioritizes Gemma 4 26B followed by Gemini Flash-Lite fallbacks', () => {
  assert.deepEqual(
    MODEL_CASCADE.map((m) => ({ name: m.name, tier: m.tier })),
    [
      { name: 'gemma-4-26b-a4b-it', tier: 'primary' },
      { name: 'gemini-3.5-flash-lite', tier: 'fallback' },
      { name: 'gemini-3.1-flash-lite', tier: 'fallback' }
    ]
  );
  assert.equal(
    CASCADE_SUMMARY,
    'gemma-4-26b-a4b-it (fallback: gemini-3.5-flash-lite -> gemini-3.1-flash-lite)'
  );
});

test('callGenerativeLanguageApi retries Gemma 4 26B on overload and falls back to Gemini 3.5 Flash-Lite', async () => {
  const calledUrls = [];
  const fakeFetch = async (url) => {
    calledUrls.push(url);
    if (url.includes('gemma-4-26b-a4b-it')) {
      return jsonResponse({ error: { code: 503, message: 'Service overloaded' } }, 503);
    }
    if (url.includes('gemini-3.5-flash-lite')) {
      return jsonResponse({ candidates: [{ content: { parts: [{ text: 'Answer from 3.5 Flash-Lite' }] } }] });
    }
    throw new Error(`Unexpected model URL: ${url}`);
  };

  const res = await callGenerativeLanguageApi('test-key', 'Explain EML', { fetchImpl: fakeFetch, sleepImpl: noopSleep });
  assert.equal(res.modelId, 'gemini-3.5-flash-lite');
  assert.equal(res.tier, 'fallback');
  assert.equal(res.text, 'Answer from 3.5 Flash-Lite');
  assert.equal(calledUrls.filter((u) => u.includes('gemma-4-26b-a4b-it')).length, 3);
  assert.equal(calledUrls.filter((u) => u.includes('gemini-3.5-flash-lite')).length, 1);
});

test('callGenerativeLanguageApi falls back to Gemini 3.1 Flash-Lite when earlier models fail', async () => {
  const calledModels = [];
  const fakeFetch = async (url) => {
    const model = url.match(/models\/([^:]+):/)?.[1];
    calledModels.push(model);
    if (model === 'gemini-3.1-flash-lite') {
      return jsonResponse({ candidates: [{ content: { parts: [{ text: 'Answer from 3.1 Flash-Lite' }] } }] });
    }
    return jsonResponse({ error: { code: 404, message: 'Model not found' } }, 404);
  };

  const res = await callGenerativeLanguageApi('test-key', 'Explain RAP', { fetchImpl: fakeFetch, sleepImpl: noopSleep });
  assert.deepEqual(calledModels, ['gemma-4-26b-a4b-it', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']);
  assert.equal(res.modelId, 'gemini-3.1-flash-lite');
  assert.equal(res.model, 'Gemini 3.1 Flash-Lite');
  assert.equal(res.tier, 'fallback');
});

test('callGenerativeLanguageApi fails fast on invalid API key without retrying', async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls += 1;
    return jsonResponse({ error: { code: 403, message: 'API key not valid' } }, 403);
  };

  await assert.rejects(
    callGenerativeLanguageApi('bad-key', 'Hello', { fetchImpl: fakeFetch, sleepImpl: noopSleep }),
    /API key not valid/
  );
  assert.equal(calls, 1);
});
