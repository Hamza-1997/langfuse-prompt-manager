import { langfuse } from './langfuseClient'

async function main() {
  const name = 'testpack-python-backend'

  console.log(`Creating prompt "${name}"...`)

  const prompt = await langfuse.prompt.create({
    name,
    prompt: 'Answer the user query based on the provided context.',
    labels: ['production'],
    commitMessage: 'Initial version',
  })

  console.log('Prompt created:')
  console.log(`  Name: ${prompt.name}`)
  console.log(`  Version: ${prompt.version}`)
  console.log(`  Labels: ${prompt.labels}`)

  await langfuse.shutdown()
}

main()
