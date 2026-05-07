const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow configured client origin
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Body parser — limit payload size to prevent abuse
app.use(express.json({ limit: '1mb' }));

// Rate limiter for auth routes (20 requests per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for AI routes (30 requests per 15 min per IP)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many AI requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, require('./src/routes/auth'));
app.use('/api/resumes', require('./src/routes/resumes'));
app.use('/api/ai', aiLimiter, require('./src/routes/ai'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.get('/', (_, res) => {
  const port = process.env.PORT || 5000;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>ResumeAI Backend</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px 48px; text-align: center; max-width: 420px; width: 100%; }
        .dot { width: 12px; height: 12px; background: #22c55e; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 6px; }
        .subtitle { color: #94a3b8; font-size: 0.875rem; margin-bottom: 28px; }
        .status { display: inline-flex; align-items: center; background: #14532d; color: #86efac; border: 1px solid #166534; border-radius: 999px; padding: 6px 16px; font-size: 0.8rem; font-weight: 600; margin-bottom: 28px; }
        .routes { text-align: left; background: #0f172a; border-radius: 10px; padding: 16px 20px; }
        .routes p { font-size: 0.75rem; color: #64748b; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .route { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 0.8rem; }
        .method { background: #1d4ed8; color: #bfdbfe; border-radius: 4px; padding: 2px 7px; font-size: 0.7rem; font-weight: 700; min-width: 42px; text-align: center; }
        .method.post { background: #065f46; color: #6ee7b7; }
        .method.del { background: #7f1d1d; color: #fca5a5; }
        .method.put { background: #78350f; color: #fcd34d; }
        .path { color: #cbd5e1; font-family: monospace; }
        .port { color: #38bdf8; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>ResumeAI Backend</h1>
        <p class="subtitle">Running on port <span class="port">${port}</span></p>
        <div class="status"><span class="dot"></span> Server is running</div>
        <div class="routes">
          <p>Available Routes</p>
          <div class="route"><span class="method post">POST</span><span class="path">/api/auth/signup</span></div>
          <div class="route"><span class="method post">POST</span><span class="path">/api/auth/login</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/api/resumes</span></div>
          <div class="route"><span class="method post">POST</span><span class="path">/api/resumes</span></div>
          <div class="route"><span class="method put">PUT</span><span class="path">/api/resumes/:id</span></div>
          <div class="route"><span class="method del">DEL</span><span class="path">/api/resumes/:id</span></div>
          <div class="route"><span class="method post">POST</span><span class="path">/api/ai/improve-summary</span></div>
          <div class="route"><span class="method post">POST</span><span class="path">/api/ai/improve-bullets</span></div>
          <div class="route"><span class="method">GET</span><span class="path">/api/health</span></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://res:res@cluster0.aykgr7w.mongodb.net/?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.log('Starting server without database (auth/resume save will not work)');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (no DB)`));
  });
