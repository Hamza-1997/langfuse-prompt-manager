import { langfuse } from './langfuseClient'

async function main() {
  console.log('=== Production Flow Simulation ===\n')

  // 1. Backend Master Prompt — predefined system template
  const masterPrompt = `You are an expert assessment generator for a coding bootcamp.
Your role is to create fair, accurate, and pedagogically valuable test questions.

Instructions:
{langfuse_instructions}

Student submission to assess:
{student_submission}

Expected answer key:
{answer_key}

Generate a detailed assessment with scores and feedback.`

  // 2. Assessment Input — simulated student data
  const assessmentInput = {
    student_submission: `
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
`.trim(),
    answer_key: `
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b
`.trim(),
  }

  // 3. Langfuse Testpack Prompt — fetch active production version
  console.log('Fetching active Langfuse prompt...')
  const langfusePrompt = await langfuse.prompt.get('testpack-python-backend', {
    label: 'production',
  })

  console.log(`  Name: ${langfusePrompt.name}`)
  console.log(`  Version: ${langfusePrompt.version}`)
  console.log(`  Labels: ${langfusePrompt.labels}`)
  console.log(`  Content: ${JSON.stringify(langfusePrompt.prompt)}\n`)

  // 4. Render the final prompt
  const finalPrompt = masterPrompt
    .replace('{langfuse_instructions}', langfusePrompt.prompt)
    .replace('{student_submission}', assessmentInput.student_submission)
    .replace('{answer_key}', assessmentInput.answer_key)

  console.log('=== Rendered Final Prompt ===\n')
  console.log(finalPrompt)

  await langfuse.shutdown()
}

main()
