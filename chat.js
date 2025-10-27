
import { aiReply } from '../../lib/ai';
export default async function handler(req, res) {
try {
const body = req.body || {};
const reply = await aiReply(body);
res.json({ ok: true, reply });
} catch (err) {
console.error(err);
res.status(500).json({ ok: false, error: err.message });
}
}