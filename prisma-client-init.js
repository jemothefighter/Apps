 (runs once to ensure client generation in dev)
// run this script after installing to generate Prisma client in some 
environments
const { execSync } = require('child_process');
try {
execSync('npx prisma generate', { stdio: 'inherit' });
console.log('prisma client generated');
} catch (e) {
console.error('prisma generate failed', e);
}