import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { langfuse } from './langfuseClient'

const PROMPT_NAME = 'testpack-python-backend'
const PORT = parseInt(process.env.PORT || '3000', 10)
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
}

function serveStatic(res: http.ServerResponse, urlPath: string) {
  const filePath = urlPath === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, urlPath)
  const ext = path.extname(filePath)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  })
}

async function getPromptMeta(): Promise<{ versions: number[] }> {
  const result = await langfuse.api.prompts.list({ name: PROMPT_NAME })
  const prompt = result.data[0]
  if (!prompt) return { versions: [] }
  return { versions: prompt.versions }
}

async function getActivePrompt() {
  const prompt = await langfuse.prompt.get(PROMPT_NAME, { label: 'production', cacheTtlSeconds: 0 })
  return { name: prompt.name, version: prompt.version, prompt: prompt.prompt, labels: prompt.labels }
}

async function getPromptVersion(version: number) {
  const prompt = await langfuse.prompt.get(PROMPT_NAME, { version, cacheTtlSeconds: 0 })
  return { name: prompt.name, version: prompt.version, prompt: prompt.prompt, labels: prompt.labels }
}

async function sendJSON(res: http.ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data, null, 2))
}

async function sendError(res: http.ServerResponse, msg: string, status = 500) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: msg }))
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const parts = url.pathname.split('/').filter(Boolean)

  try {
    // GET /api/prompts/:name — list versions
    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'prompts' && parts.length === 3) {
      const meta = await getPromptMeta()
      return sendJSON(res, meta)
    }

    // GET /api/prompts/:name/active — active production prompt
    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'prompts' && parts.length === 4 && parts[3] === 'active') {
      const active = await getActivePrompt()
      return sendJSON(res, active)
    }

    // GET /api/prompts/:name/:version — specific version
    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'prompts' && parts.length === 4) {
      const version = parseInt(parts[3], 10)
      if (isNaN(version)) return sendError(res, 'Invalid version', 400)
      const prompt = await getPromptVersion(version)
      return sendJSON(res, prompt)
    }

    // POST /api/prompts/:name — create new production version
    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'prompts' && parts.length === 3) {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', async () => {
        try {
          const { prompt: promptText } = JSON.parse(body)
          if (!promptText || typeof promptText !== 'string') {
            return sendError(res, 'Missing or invalid "prompt" field', 400)
          }
          const result = await langfuse.prompt.create({
            name: PROMPT_NAME,
            prompt: promptText,
            labels: ['production'],
          })
          sendJSON(res, { name: result.name, version: result.version, prompt: result.prompt, labels: result.labels }, 201)
        } catch (err) {
          sendError(res, 'Failed to create prompt version')
        }
      })
      return
    }

    // Static files
    serveStatic(res, url.pathname)
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return sendJSON(res, { error: 'Not found' }, 404)
    }
    console.error('Server error:', err)
    sendError(res, err?.message || 'Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
  await langfuse.shutdown()
  process.exit(0)
})
