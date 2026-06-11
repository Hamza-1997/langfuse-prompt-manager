# Langfuse Prompt Manager

A small proof-of-concept to validate whether Langfuse can handle prompt versioning for an assessment generation platform.

## What this does

Langfuse keeps a history of every change you make to a prompt. This project tests that workflow:

- Create prompts and update them — every version is preserved
- Label a version as "production" to mark it as the live one
- Move the label to an older version to roll back
- Fetch the active prompt by label so your app always gets the right version without code changes
- A web UI to browse versions, edit the prompt text, and save new versions

Prompts are stored in Langfuse's cloud, not locally.

## Project structure

```
├── src/
│   ├── langfuseClient.ts      # Langfuse SDK setup
│   ├── createPrompt.ts        # Creates the initial prompt
│   ├── updatePrompt.ts        # Creates a new version
│   ├── getPrompt.ts           # Fetches the latest version
│   ├── getPromptHistory.ts    # Lists all versions and their content
│   ├── restoreVersion.ts      # Moves production label to an older version
│   ├── simulateProduction.ts  # Template composition demo
│   ├── server.ts              # HTTP server + API for the web UI
│   └── testConnection.ts      # Connectivity check
├── public/
│   └── index.html             # Web UI
├── .env
├── package.json
└── tsconfig.json
```

## Setup

```
npm install
```

Create `.env` with your Langfuse credentials:

```
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_BASE_URL="https://us.cloud.langfuse.com"
```

## Running the web UI

```
npm start
```

Open http://localhost:3000. The page shows a version dropdown and an editor where you can edit the prompt and save new versions.

## Other scripts

| Command | What it does |
|---|---|
| `npm run test:connection` | Checks connectivity with your credentials |
| `npm run create:prompt` | Creates `testpack-python-backend` version 1 |
| `npm run update:prompt` | Creates a new version |
| `npm run get:prompt` | Fetches the latest version |
| `npm run get:history` | Lists every version and its content |
| `npm run restore:version` | Moves the production label back to version 1 |
| `npm run simulate:production` | Combines master template + Langfuse prompt + student data |
