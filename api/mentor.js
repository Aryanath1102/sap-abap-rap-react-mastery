/**
 * Vercel Serverless AI Mentor Chat Proxy
 * Model Cascade: Gemma 4 26B → Gemini 2.0 Flash (fallback) → Built-in SAP Engine
 * Features: 5,000 queries/day rate limit, exponential backoff retry on 503/overload
 */

// Daily in-memory rate limiter (5,000 requests per day)
let dailyUsage = {
  date: new Date().toISOString().slice(0, 10),
  count: 0
};

// Sleep helper for retry backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { content, apiKey } = req.body || {};
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      // Check daily rate limit (5,000 queries / day)
      const today = new Date().toISOString().slice(0, 10);
      if (dailyUsage.date !== today) {
        dailyUsage = { date: today, count: 0 };
      }

      const DAILY_LIMIT = 5000;
      if (dailyUsage.count >= DAILY_LIMIT) {
        return res.status(429).json({
          error: `Daily rate limit of ${DAILY_LIMIT} queries reached for today (${today}). Resets at 00:00 UTC.`
        });
      }

      const key = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in environment variables or request body.' });
      }

      const systemInstruction = 'You are a Principal SAP Technical Architect and Clean Core Lead. You teach Modern ABAP (7.50+ / 7.57+ / ABAP Cloud), CDS View Entities (7.55+), SAP RAP (strict ( 2 )), OData V4, and React UI integration. NEVER teach or allow classic ABAP (no WRITE, no FORM/PERFORM, no HEADER LINE, no OCCURS 0, no unreleased tables like BUT000/MARA). Format answers with Level 1 (Layman terms & real-world analogy) followed by Level 2 (SAP Technical specifications, internal mechanics, and Clean Core vs On-Premise distinctions).';

      // Model cascade: Gemma 4 26B first (user preference), then Gemini Flash as fallback
      const modelCascade = [
        { name: 'gemma-4-26b-a4b-it', retries: 2, label: 'Gemma 4 26B' },
        { name: 'gemma-4-26b-it', retries: 1, label: 'Gemma 4 26B' },
        { name: 'gemini-2.0-flash', retries: 2, label: 'Gemini 2.0 Flash' },
        { name: 'gemini-1.5-flash', retries: 1, label: 'Gemini 1.5 Flash' }
      ];

      let botResponse = '';
      let usedModel = '';
      let lastErr = null;

      for (const model of modelCascade) {
        for (let attempt = 0; attempt <= model.retries; attempt++) {
          try {
            if (attempt > 0) {
              // Exponential backoff: 1s, 2s, 4s
              await sleep(1000 * Math.pow(2, attempt - 1));
            }

            const payload = {
              contents: [{
                role: 'user',
                parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER QUESTION]\n${content}` }]
              }]
            };

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model.name)}:generateContent`;
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': key
              },
              body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              botResponse = data.candidates[0].content.parts[0].text;
              usedModel = model.label;
              dailyUsage.count++;
              break;
            }
            if (data.error) {
              lastErr = new Error(data.error.message || `API error ${data.error.code}`);
              const msg = data.error.message || '';
              // Retryable: high demand / overloaded / 503
              if (msg.includes('high demand') || msg.includes('overloaded') || data.error.code === 503) {
                continue; // retry same model
              }
              // Not found / deprecated → skip to next model
              if (msg.includes('not found') || msg.includes('404') || msg.includes('no longer available') || msg.includes('not supported')) {
                break; // skip to next model in cascade
              }
              // Other errors → skip to next model
              break;
            }
          } catch (e) {
            lastErr = e;
          }
        }
        if (botResponse) break;
      }

      if (!botResponse) {
        throw lastErr || new Error('All AI models are temporarily unavailable. Please try again in a moment.');
      }

      return res.status(200).json({
        response: botResponse,
        model: usedModel,
        messages: [
          { role: 'user', content },
          { role: 'assistant', content: botResponse }
        ],
        rateLimit: {
          today,
          used: dailyUsage.count,
          limit: DAILY_LIMIT,
          remaining: DAILY_LIMIT - dailyUsage.count
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
