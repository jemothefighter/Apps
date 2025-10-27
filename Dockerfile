
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production --silent || npm install --production --silent
COPY . .
RUN npx prisma generate
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]