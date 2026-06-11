import { langfuse } from './langfuseClient'

async function main() {
  const name = 'testpack-python-backend'

  console.log(`Creating version 2 of prompt "${name}"...`)

  const prompt = await langfuse.prompt.create({
    name,
    prompt: 'Answer the user query concisely based on the provided context. Cite sources when possible.',
    labels: ['production'],
    commitMessage: 'Added source citation instruction',
  })

  console.log('Prompt version created:')
  console.log(`  Name: ${prompt.name}`)
  console.log(`  Version: ${prompt.version}`)
  console.log(`  Labels: ${prompt.labels}`)

  await langfuse.shutdown()
}

main()
