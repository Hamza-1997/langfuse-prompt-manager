import { langfuse } from './langfuseClient'

async function main() {
  const name = 'testpack-python-backend'

  console.log('=== Prompt Metadata ===\n')

  const meta = await langfuse.api.prompts.list({ name })

  if (meta.data.length === 0) {
    console.log(`No prompt found with name "${name}".`)
    await langfuse.shutdown()
    return
  }

  for (const prompt of meta.data) {
    console.log(`Name: ${prompt.name}`)
    console.log(`Type: ${prompt.type}`)
    console.log(`Versions: ${prompt.versions.join(', ')}`)
    console.log(`Labels: ${prompt.labels.join(', ')}`)
    console.log(`Tags: ${prompt.tags.join(', ') || '(none)'}`)
    console.log(`Last updated: ${prompt.lastUpdatedAt}`)
  }

  console.log('\n=== Version History ===\n')

  for (const version of meta.data[0].versions) {
    const prompt = await langfuse.prompt.get(name, { version })
    console.log(`Version ${prompt.version}:`)
    console.log(`  Prompt: ${JSON.stringify(prompt.prompt)}`)
    console.log(`  Labels: ${prompt.labels}`)
    console.log()
  }

  await langfuse.shutdown()
}

main()
