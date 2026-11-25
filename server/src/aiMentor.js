const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SYSTEM_INSTRUCTION =
  'You are a Principal SAP Technical Architect and Clean Core Lead. You teach Modern ABAP (7.50+ / 7.57+ / ABAP Cloud), CDS View Entities (7.55+), SAP RAP (strict ( 2 )), OData V4, and React UI integration. NEVER teach or allow classic ABAP (no WRITE, no FORM/PERFORM, no HEADER LINE, no OCCURS 0, no unreleased tables like BUT000/MARA). Format answers with Level 1 (Layman terms & real-world analogy) followed by Level 2 (SAP Technical specifications, internal mechanics, and Clean Core vs On-Premise distinctions).';

// Model cascade: Gemma 4 31B & 26B primary -> Gemini 4 / 3 text fallbacks
export const MODEL_CASCADE = [
  { name: 'gemma-4-31b-it', retries: 2, label: 'Gemma 4 31B', tier: 'primary' },
  { name: 'gemma-4-26b-a4b-it', retries: 2, label: 'Gemma 4 26B', tier: 'primary' },
  { name: 'gemini-4-hydrogen', retries: 2, label: 'Gemini 4 Hydrogen', tier: 'fallback' },
  { name: 'gemini-3.8-flash', retries: 2, label: 'Gemini 3.8 Flash', tier: 'fallback' },
  { name: 'gemini-3.5-flash-lite', retries: 1, label: 'Gemini 3.5 Flash-Lite', tier: 'fallback' }
];

export const CASCADE_SUMMARY =
  'gemma-4-31b-it -> gemma-4-26b-a4b-it (fallback: gemini-4-hydrogen -> gemini-3.8-flash -> gemini-3.5-flash-lite)';

/**
 * Call the Google Generative Language API using the configured Gemma 4 primary
 * and Gemini text fallback cascade with exponential backoff on transient errors.
 */
export async function callGenerativeLanguageApi(apiKey, content, { fetchImpl = fetch, sleepImpl = sleep } = {}) {
  let lastError = null;

  for (const modelDef of MODEL_CASCADE) {
    for (let attempt = 0; attempt <= modelDef.retries; attempt++) {
      try {
        if (attempt > 0) {
          await sleepImpl(1000 * Math.pow(2, attempt - 1));
        }

        const payload = {
          contents: [{
            role: 'user',
            parts: [{
              text: `[SYSTEM INSTRUCTION]\n${SYSTEM_INSTRUCTION}\n\n[USER QUESTION]\n${content}`
            }]
          }]
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelDef.name)}:generateContent`;
        const response = await fetchImpl(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.error) {
          const status = data.error?.code ?? response.status;
          const msg = data.error?.message || `API error (${status})`;
          lastError = new Error(msg);

          if (status === 401 || status === 403 || msg.includes('API key') || msg.includes('API_KEY_INVALID')) {
            lastError.fatalAuth = true;
            throw lastError;
          }

          if (status === 404 || msg.includes('not found') || msg.includes('404') || msg.includes('no longer available') || msg.includes('not supported')) {
            console.warn(`[AI] ${modelDef.name}: not available, trying next model...`);
            break;
          }

          if (status === 429 || status === 500 || status === 503 || msg.includes('high demand') || msg.includes('overloaded') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('rate limit')) {
            console.warn(`[AI] ${modelDef.name} attempt ${attempt + 1}: ${msg} — retrying...`);
            continue;
          }

          console.warn(`[AI] ${modelDef.name} error (${status}): ${msg} — trying next model...`);
          break;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`[AI] Success with ${modelDef.label} (${modelDef.name})`);
          return { text, model: modelDef.label, modelId: modelDef.name, tier: modelDef.tier };
        }
        lastError = new Error('No candidate content received from model API');
        break;
      } catch (err) {
        lastError = err;
        if (err.fatalAuth) {
          throw err;
        }
        if (err.message && (err.message.includes('not found') || err.message.includes('404') || err.message.includes('is not supported') || err.message.includes('no longer available'))) {
          break;
        }
        if (attempt >= modelDef.retries) break;
      }
    }
  }

  throw lastError || new Error('All AI models are temporarily unavailable');
}
