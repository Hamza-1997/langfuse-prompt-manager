import { langfuse } from './langfuseClient'

async function main() {
  const name = 'testpack-python-backend'

  console.log(`Fetching latest version of prompt "${name}"...`)

  const prompt = await langfuse.prompt.get(name)

  console.log('Latest prompt:')
  console.log(`  Name: ${prompt.name}`)
  console.log(`  Version: ${prompt.version}`)
  console.log(`  Prompt text: ${JSON.stringify(prompt.prompt)}`)
  console.log(`  Labels: ${prompt.labels}`)

  await langfuse.shutdown()
}

main()
