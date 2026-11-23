export default function handler(req,res) { res.status(503).json({error:'Run the SQLite Express server with persistent storage. Standalone serverless API is disabled.'}); }
