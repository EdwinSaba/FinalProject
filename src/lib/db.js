import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://neondb_owner:npg_Akrna5HJ2UiR@ep-bold-feather-aixxr4kj-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
})

export default prisma