 (simple central Prisma client export)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;