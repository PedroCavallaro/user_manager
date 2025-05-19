import * as dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

export const DATABASE_CONFIG = {
  name: process.env.DATABASE_NAME,
  type: process.env.DATABASE_TYPE,
  database: process.env.DATABASE_NAME,
  url: process.env.DATABASE_URL
}
