
// GET -> returns recent posts, POST -> creates a post (JWT optional)
const prisma = require('../../lib/prisma-wrapper');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
function getUserFromReq(req) {
const h = req.headers && req.headers.authorization;
if (!h) return null;
const parts = h.split(' ');
if (parts[0] !== 'Bearer') return null;
try {
const payload = jwt.verify(parts[1], JWT_SECRET);
return payload;
} catch (e) { return null }
}
export default async function handler(req, res) {
if (req.method === 'GET') {
const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' },
take: 50, include: { author: true } });
const out = posts.map(p =>uh ({ id: p.id, content: p.content, createdAt:
p.createdAt, authorId: p.authorId, authorName: p.author.name ||
p.author.email }));
return res.json({ posts: out });
}
if (req.method === 'POST') {
const userPayload = getUserFromReq(req);
if (!userPayload) return res.status(401).json({ error: 'Unauthorized. 
Provide valid JWT in Authorization header' });
const userId = userPayload.sub;
const { content } = req.body || {};
if (!content || !content.trim()) return res.status(400).json({ error:
'content required' });
try {
const post = await prisma.post.create({ data: { authorId: userId,
content } });
const author = await prisma.user.findUnique({ where: { id: userId } });
res.json({ post: { id: post.id, content: post.content, createdAt:
post.createdAt, authorId, authorName: author.name || author.email } });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
} else {
res.status(405).end();
}
}

				
				
				
				
				
				
				