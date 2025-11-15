import { config } from 'dotenv'

import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from './schema.ts'

config()

const connection = await mysql.createConnection(process.env.DATABASE_URL!)
export const db = drizzle(connection, { schema })
