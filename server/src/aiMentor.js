const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SYSTEM_INSTRUCTION = `You are a Principal SAP Technical Architect and Clean Core Lead (ABAP Cloud, CDS View Entities, RAP, OData V4, React).

Rules:
- Return ONLY the final answer. Never output thinking steps, drafts, checklists, self-corrections, greetings, or restated instructions.
- Follow the user's requested length or format first (for example, if asked "in 2 lines", reply in at most 2 lines).
- Keep answers concise, accurate, and strictly Clean Core (never recommend classic ABAP like SE38, WRITE, direct table UPDATEs, or unreleased BAPIs except to contrast briefly).
- Use clean WhatsApp formatting (*bold*, _italic_, \`inline code\`, "- " bullets, and a short fenced code block only when helpful). Never use ### headings or **double asterisks**.`;

// Model cascade: Gemma 4 26B primary -> Gemini Flash-Lite fallbacks
export const MODEL_CASCADE = [
  { name: 'gemma-4-26b-a4b-it', retries: 2, label: 'Gemma 4 26B', tier: 'primary' },
  { name: 'gemini-3.5-flash-lite', retries: 1, label: 'Gemini 3.5 Flash-Lite', tier: 'fallback' },
  { name: 'gemini-3.1-flash-lite', retries: 1, label: 'Gemini 3.1 Flash-Lite', tier: 'fallback' }
];

const primaryModels = MODEL_CASCADE.filter((m) => m.tier === 'primary').map((m) => m.name);
const fallbackModels = MODEL_CASCADE.filter((m) => m.tier !== 'primary').map((m) => m.name);
export const CASCADE_SUMMARY =
  `${primaryModels.join(' -> ')}${fallbackModels.length ? ` (fallback: ${fallbackModels.join(' -> ')})` : ''}`;

export const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

/**
 * Extract only final text output from Interactions API (`steps` / `outputs`)
 * or fallback `candidates`, strictly excluding thinking/thought blocks.
 */
export function extractInteractionText(data) {
  if (Array.isArray(data?.steps)) {
    const texts = [];
    for (const step of data.steps) {
      if (step?.type !== 'model_output' || !Array.isArray(step.content)) continue;
      for (const item of step.content) {
        if (item?.type === 'text' && typeof item.text === 'string' && item.text.trim()) {
          texts.push(item.text.trim());
        }
      }
    }
    if (texts.length > 0) return texts.join('\n\n');
  }

  if (Array.isArray(data?.outputs)) {
    const texts = data.outputs
      .filter((item) => item?.type === 'text' && typeof item.text === 'string' && item.text.trim())
      .map((item) => item.text.trim());
    if (texts.length > 0) return texts.join('\n\n');
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts
      .filter((part) => !part?.thought && typeof part?.text === 'string' && part.text.trim())
      .map((part) => part.text.trim())
      .join('\n\n');
  }

  return '';
}

/**
 * Call the Gemini Interactions API using the configured Gemma 4 primary
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
          model: modelDef.name,
          input: content,
          system_instruction: SYSTEM_INSTRUCTION,
          store: false
        };

        const response = await fetchImpl(INTERACTIONS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
            'Api-Revision': '2026-05-20'
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

        const text = extractInteractionText(data);
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
