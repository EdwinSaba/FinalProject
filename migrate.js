const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Akrna5HJ2UiR@ep-bold-feather-aixxr4kj-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
};

execSync('npx prisma db push', { 
  env,
  stdio: 'inherit',
  cwd: process.cwd()
});
