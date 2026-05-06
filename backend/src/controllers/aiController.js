const OpenAI = require('openai');

const hasValidKey =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

const client = hasValidKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

exports.improveSummary = async (req, res) => {
  try {
    const { summary, role } = req.body;
    if (!summary) return res.status(400).json({ message: 'Summary is required' });

    if (!client) return res.status(503).json({ message: 'OpenAI API key not configured' });

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Rewrite the given summary to be concise, impactful, and ATS-friendly. Use strong action-oriented language. Return only the improved summary text, no extra commentary.',
        },
        {
          role: 'user',
          content: `Role: ${role || 'Software Developer'}\nSummary: ${summary}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const improved = completion.choices[0]?.message?.content?.trim();
    if (!improved) return res.status(500).json({ message: 'No response from AI' });
    res.json({ improved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.improveBullets = async (req, res) => {
  try {
    const { bullets, context } = req.body;
    if (!bullets?.length) return res.status(400).json({ message: 'Bullets are required' });

    if (!client) return res.status(503).json({ message: 'OpenAI API key not configured' });

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Rewrite each bullet point to start with a strong action verb, include quantifiable impact where possible, and be ATS-friendly. Return a JSON array of improved bullet strings only.',
        },
        {
          role: 'user',
          content: `Context: ${context}\nBullets:\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return res.status(500).json({ message: 'No response from AI' });

    let improved;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Not an array');
      improved = parsed.filter((item) => typeof item === 'string');
    } catch {
      improved = raw.split('\n').filter(Boolean).map((l) => l.replace(/^\d+\.\s*/, '').trim());
    }

    res.json({ improved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
