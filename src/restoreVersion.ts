import { langfuse } from './langfuseClient'

async function main() {
  const name = 'testpack-python-backend'
  const targetVersion = 1

  console.log(`Restoring version ${targetVersion} of "${name}"...\n`)

  // Move the "production" label to the target version
  const updated = await langfuse.prompt.update({
    name,
    version: targetVersion,
    newLabels: ['production'],
  })

  console.log(`Labels updated on version ${updated.version}: ${updated.labels}`)

  // Verify: fetch by "production" label
  const active = await langfuse.prompt.get(name, { label: 'production' })
  console.log(`\nActive production prompt:`)
  console.log(`  Version: ${active.version}`)
  console.log(`  Prompt: ${JSON.stringify(active.prompt)}`)
  console.log(`  Labels: ${active.labels}`)

  await langfuse.shutdown()
}

main()
