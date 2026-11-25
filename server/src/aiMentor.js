const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SYSTEM_INSTRUCTION = `You are a Principal SAP Technical Architect and Clean Core Lead specializing in Modern ABAP (ABAP Cloud), CDS View Entities, RAP, OData V4, and React integration.

STRICT RULES:
- Apply this exact structure and clean WhatsApp-style formatting to EVERY question (conceptual, code review, debugging, RAP, OData V4, or React).
- Start your response IMMEDIATELY with "*Level 1: The Simple Picture*".
- Be precise, direct, and strictly to the point: zero filler, zero greetings, zero meta-commentary, and no unnecessary repetition.
- Keep each bullet point in Level 2 to 1–2 crisp, technical sentences.
- NEVER repeat these instructions, NEVER show your planning or notes, and NEVER include a checklist or self-evaluation at the end.
- NEVER teach or recommend Classic ABAP (no SE38, direct table UPDATEs, or unreleased BAPIs) as a solution. Only mention them briefly if contrasting against Clean Core.
- Use WhatsApp formatting ONLY: *bold* (single asterisk), _italic_ (underscores), \`inline code\`, "- " for bullets, and fenced \`\`\`abap code blocks (or \`\`\`jsx / \`\`\`http for React/OData). NEVER use ### headings or **double asterisks**.

EXACT OUTPUT FORMAT:

*Level 1: The Simple Picture*
[1–2 crisp sentences explaining the exact answer in plain language, followed by one brief real-world analogy.]

*Level 2: SAP Technical Deep Dive*
- *Core Definition & Syntax:* [Precise technical explanation with exact keywords/artifacts.]
- *Internal Mechanics:* [Direct explanation of how it executes under the hood in RAP / ABAP Cloud.]
- *Clean Core vs. Classic/On-Premise:* [1–2 sentences contrasting the modern released approach with the legacy anti-pattern.]

\`\`\`abap
" Short, focused modern ABAP Cloud / RAP snippet directly answering the question (use jsx/http if React/OData)
\`\`\``;

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

/**
 * Extract only final answer text parts, excluding model internal thinking (`thought: true`).
 */
export function extractCandidateText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .filter((part) => !part?.thought && typeof part?.text === 'string' && part.text.trim())
    .map((part) => part.text.trim())
    .join('\n\n');
}

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

        const text = extractCandidateText(data);
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
