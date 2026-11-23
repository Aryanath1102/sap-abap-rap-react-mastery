/**
 * Vercel Serverless Gemma 4 31B AI Mentor Chat Proxy
 * Configured with Gemma 4 31B model and 5,000 queries/day rate limit.
 */

// Daily in-memory rate limiter (5,000 requests per day)
let dailyUsage = {
  date: new Date().toISOString().slice(0, 10),
  count: 0
};

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

      // Strictly use Gemma 4 31B only
      const modelsToTry = [
        'gemma-4-31b-it',
        'gemma-4-31b'
      ];

      let botResponse = '';
      let lastErr = null;

      for (const m of modelsToTry) {
        try {
          const payload = {
            contents: [{
              role: 'user',
              parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER QUESTION]\n${content}` }]
            }]
          };

          // For Google Auth keys (starting with AQ.), the key MUST be passed in x-goog-api-key header
          // and NOT in ?key= query param to prevent 400 'API key not valid' errors.
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`;
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
            dailyUsage.count++;
            break;
          }
          if (data.error) {
            lastErr = new Error(data.error.message || `API error ${data.error.code}`);
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (!botResponse) {
        throw lastErr || new Error('No candidate content received from Gemma 4 31B model');
      }

      return res.status(200).json({
        response: botResponse,
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
