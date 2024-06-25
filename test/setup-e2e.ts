import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()

if (!process.env.DATABASE_URL) {
  throw new Error('Please provide a "DATABASE_URL" environment variable!')
}

function generateUniqueDatabaseUrl(schemaId: string) {
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  // Run migrations with new DATABASE_URL in .env schema
  execSync('npx prisma migrate deploy')

  console.log(databaseUrl)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
