// POST /api/auth/register { email, password, name }
const bcrypt = require('bcryptjs');
const prisma = require('../../../lib/prisma-wrapper');
export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { email, password, name } = req.body || {};
if (!email || !password) return res.status(400).json({ error: 'email and 
password required' });
try {
const existing = await prisma.user.findUnique({ where: { email } });
if (existing) return res.status(400).json({ error: 'User already exists' });
const hashed = await bcrypt.hash(password, 10);
const user = await prisma.user.create({ data: { email, password: hashed,
name } });
res.json({ ok: true, user: { id: user.id, email: user.email, name:
user.name } });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
}