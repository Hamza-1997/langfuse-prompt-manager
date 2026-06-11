import { langfuse } from './langfuseClient'

async function main() {
  console.log('Testing Langfuse connection...')

  try {
    await langfuse.prompt.get('__test-connection-check__')
    console.log('UNEXPECTED: prompt was found. Connection works.')
  } catch (err: any) {
    if (err?.statusCode === 404) {
      console.log('SUCCESS: Connected to Langfuse successfully.')
      console.log(`  Base URL: ${process.env.LANGFUSE_BASE_URL}`)
      console.log('  Authentication: Valid')
    } else {
      console.log('FAILED: Could not connect to Langfuse.')
      console.log(`  Error: ${err?.message ?? err}`)
      if (err?.statusCode) {
        console.log(`  Status code: ${err.statusCode}`)
      }
      process.exit(1)
    }
  } finally {
    await langfuse.shutdown()
  }
}

main()
