import dotenv from 'dotenv'
import { LangfuseClient } from '@langfuse/client'

dotenv.config()

const {
  LANGFUSE_SECRET_KEY: secretKey,
  LANGFUSE_PUBLIC_KEY: publicKey,
  LANGFUSE_BASE_URL: baseUrl,
} = process.env

if (!secretKey || !publicKey || !baseUrl) {
  throw new Error(
    'Missing Langfuse credentials. Ensure LANGFUSE_SECRET_KEY, LANGFUSE_PUBLIC_KEY, and LANGFUSE_BASE_URL are set in .env'
  )
}

export const langfuse = new LangfuseClient({ secretKey, publicKey, baseUrl })
