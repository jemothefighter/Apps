
// custom server to enable Socket.io + Next.js and to run Prisma migrations on 
startup
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const prismaLib = require('./lib/prisma-wrapper');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
app.prepare().then(async () => {
// ensure prisma generate/migrate when running in container or debug mode
if (!dev) {
try {
// run migrations (deployed mode) - expects migrations already created
const { execSync } = require('child_process');
execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (e) {
console.warn('prisma migrate deploy failed or not configured:',
e.message);
}
}
const server = express();
server.use(express.json());
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
cors: { origin: '*' }
});
// Socket.io: broadcast messages into rooms. We keep ephemeral chat only.
io.on('connection', (socket) => {
console.log('socket connected', socket.id);
socket.on('joinRoom', (room) => {
socket.join(room);
});
socket.on('message', (msg) => {
if (msg && msg.room) {
io.to(msg.room).emit('message', msg);
}
});
socket.on('disconnect', () => {
console.log('socket disconnected', socket.id);
});
});
// Let Next handle all other routes
server.all('*', (req, res) => handle(req, res));
httpServer.listen(port, () => {
console.log(`> Ready on http://localhost:${port}`);
});
});