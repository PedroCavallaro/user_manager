import * as dotenv from 'dotenv'

dotenv.config()

export const CACHE_CONFIG = {
  url: process.env.CACHE_URL
}
