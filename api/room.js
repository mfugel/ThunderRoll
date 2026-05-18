import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const TTL_SECONDS = 24 * 60 * 60;
const CODE_RE = /^[A-Z]{6}$/;

export default async function handler(req, res) {
  const code = (req.query.code || '').toUpperCase();
  if (!CODE_RE.test(code)) {
    return res.status(400).json({ error: 'Invalid room code; expected 6 uppercase letters.' });
  }
  const key = `room:${code}`;

  if (req.method === 'GET') {
    const data = await redis.get(key);
    if (!data) return res.status(404).json({ error: 'Room not found.' });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const { state, expectedVersion, host, ruleset } = body;
    if (!state || typeof expectedVersion !== 'number') {
      return res.status(400).json({ error: 'Body must include {state, expectedVersion} (numbers).' });
    }

    const current = await redis.get(key);

    const isCreate = !current && expectedVersion === 0;
    const isUpdate = current && expectedVersion === current.version;
    if (!isCreate && !isUpdate) {
      return res.status(409).json({
        error: 'Version mismatch — refetch and retry.',
        currentVersion: current?.version ?? null,
        latest: current,
      });
    }

    const now = new Date().toISOString();
    const next = {
      version: isCreate ? 1 : current.version + 1,
      createdAt: isCreate ? now : current.createdAt,
      updatedAt: now,
      host: isCreate ? (host || null) : current.host,
      ruleset: isCreate ? (ruleset || 'official') : (ruleset ?? current.ruleset),
      state,
    };
    await redis.set(key, next, { ex: TTL_SECONDS });
    return res.status(200).json(next);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
}
