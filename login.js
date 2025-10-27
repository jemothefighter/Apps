// POST /api/auth/login { email, password }
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../../lib/prisma-wrapper');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { email, password } = req.body || {};
if (!email || !password) return res.status(400).json({ error: 'email and 
password required' });
try {
const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
expiresIn: '7d' });
res.json({ ok: true, token, user: { id: user.id, email: user.email, name:
user.name } });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
}