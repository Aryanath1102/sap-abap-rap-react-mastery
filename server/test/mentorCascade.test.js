import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MODEL_CASCADE,
  CASCADE_SUMMARY,
  SYSTEM_INSTRUCTION,
  INTERACTIONS_URL,
  extractInteractionText,
  callGenerativeLanguageApi
} from '../src/aiMentor.js';

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
  const calledModels = [];
  const fakeFetch = async (url, init) => {
    assert.equal(url, INTERACTIONS_URL);
    const body = JSON.parse(init.body);
    calledModels.push(body.model);

    if (body.model === 'gemma-4-26b-a4b-it') {
      return jsonResponse({ error: { code: 503, message: 'Service overloaded' } }, 503);
    }
    if (body.model === 'gemini-3.5-flash-lite') {
      return jsonResponse({
        steps: [{ type: 'model_output', content: [{ type: 'text', text: 'Answer from 3.5 Flash-Lite' }] }]
      });
    }
    throw new Error(`Unexpected model: ${body.model}`);
  };

  const res = await callGenerativeLanguageApi('test-key', 'Explain EML', { fetchImpl: fakeFetch, sleepImpl: noopSleep });
  assert.equal(res.modelId, 'gemini-3.5-flash-lite');
  assert.equal(res.tier, 'fallback');
  assert.equal(res.text, 'Answer from 3.5 Flash-Lite');
  assert.equal(calledModels.filter((m) => m === 'gemma-4-26b-a4b-it').length, 3);
  assert.equal(calledModels.filter((m) => m === 'gemini-3.5-flash-lite').length, 1);
});

test('callGenerativeLanguageApi falls back to Gemini 3.1 Flash-Lite when earlier models fail', async () => {
  const calledModels = [];
  const fakeFetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calledModels.push(body.model);
    if (body.model === 'gemini-3.1-flash-lite') {
      return jsonResponse({
        outputs: [{ type: 'text', text: 'Answer from 3.1 Flash-Lite' }]
      });
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

test('SYSTEM_INSTRUCTION avoids Level 1/Level 2 and sends separated system_instruction via Interactions API', async () => {
  assert.doesNotMatch(SYSTEM_INSTRUCTION, /Level 1|Level 2/i);
  assert.match(SYSTEM_INSTRUCTION, /Return ONLY the final answer/);
  assert.match(SYSTEM_INSTRUCTION, /in 2 lines/);

  let capturedBody;
  const fakeFetch = async (url, init) => {
    assert.equal(url, INTERACTIONS_URL);
    assert.equal(init.headers['Api-Revision'], '2026-05-20');
    capturedBody = JSON.parse(init.body);
    return jsonResponse({
      steps: [{ type: 'model_output', content: [{ type: 'text', text: 'RAP builds cloud-ready OData V4 services.' }] }]
    });
  };

  await callGenerativeLanguageApi('test-key', 'what is RAP? in 2 lines', { fetchImpl: fakeFetch, sleepImpl: noopSleep });
  assert.equal(capturedBody.model, 'gemma-4-26b-a4b-it');
  assert.equal(capturedBody.input, 'what is RAP? in 2 lines');
  assert.equal(capturedBody.system_instruction, SYSTEM_INSTRUCTION);
  assert.equal(capturedBody.store, false);
});

test('extractInteractionText strips thought steps/outputs and returns only final text', async () => {
  const stepsPayload = {
    steps: [
      { type: 'thought', summary: [{ type: 'text', text: 'User Question: what is RAP? Self-Correction...' }] },
      { type: 'model_output', content: [{ type: 'text', text: '*RAP* builds cloud-ready OData V4 services in ABAP Cloud.' }] }
    ]
  };
  assert.equal(
    extractInteractionText(stepsPayload),
    '*RAP* builds cloud-ready OData V4 services in ABAP Cloud.'
  );

  const outputsPayload = {
    outputs: [
      { type: 'thought', text: 'Internal reasoning...' },
      { type: 'text', text: 'Clean 2-line answer.' }
    ]
  };
  assert.equal(extractInteractionText(outputsPayload), 'Clean 2-line answer.');

  const fakeFetch = async () => jsonResponse(stepsPayload);
  const res = await callGenerativeLanguageApi('test-key', 'what is RAP? in 2 lines', { fetchImpl: fakeFetch, sleepImpl: noopSleep });
  assert.equal(res.text.includes('Self-Correction'), false);
  assert.equal(res.text, '*RAP* builds cloud-ready OData V4 services in ABAP Cloud.');
});
