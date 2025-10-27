
# LOCOM
LOCOM is a social / chat aggregator app. This repo includes JWT auth (Prisma + 
Postgres), feed aggregation with caching, and Socket.io chat. Use Docker for 
easiest setup.
## Quick start (Docker)
1. Copy `.env.example` to `.env` and set `JWT_SECRET` and optionally 
`OPENAI_API_KEY`.
2. `docker-compose up --build`
3. Open http://localhost:3000
## Quick start (local Postgres)
1. Create a Postgres DB and set DATABASE_URL in `.env`.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run dev`
## Notes
- Posts and users are stored in Postgres via Prisma.
- Feed caching stored in `FeedCache` table.