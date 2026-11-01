# Kryptix AI

A conversational AI chatbot powered by Google's Gemini API, built using Node.js and Express.

## Features

- Gemini API integration using the official Google Gen AI SDK.
- Multi-turn conversations with unique conversation IDs.
- Context window management using message truncation.
- Custom system prompt defining the assistant's identity and behaviour.
- Responsive browser-based chatbot interface.
- Markdown rendering with headings, bold text, lists and code blocks.
- Interactive command-line chatbot.
- Persistent CLI memory and conversation summarisation.
- API error handling, rate-limit handling and request timeouts.
- Environment-based API key configuration.

## Technology Stack

- Node.js
- Express.js
- Google Gemini API
- HTML5, CSS3 and JavaScript
- dotenv

## Project Structure

```text
Kryptic-AI/
├── public/
│   └── index.html
├── api-server.mjs
├── chat-history.mjs
├── benchmark.mjs
├── test-gemini.mjs
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Vishal042006/Kryptic-AI.git
cd Kryptic-AI
npm install
```

Create a `local.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Never commit your actual API key.

## Run the Web Application

```bash
npm run server
```

Open http://localhost:3000

## Run the CLI Chatbot

```bash
npm start
```

Type `exit` to quit.

## API Documentation

### GET /health

Checks the backend status.

```bash
curl http://localhost:3000/health
```

### POST /chat

Sends a message to Gemini.

Example request:

```json
{
  "message": "Hello, introduce yourself."
}
```

The response contains a conversation ID, AI reply and history message count.

To continue a conversation, include the returned `conversationId` in subsequent requests.

## Context Management

The API maintains separate conversation histories using conversation IDs and retains the latest 12 messages per conversation.

The CLI additionally implements structured user profile extraction, running conversation summaries and persistent JSON memory.

## Error Handling

- HTTP 400: Invalid input.
- HTTP 429: Gemini rate limit.
- HTTP 502: AI service failure.
- HTTP 504: Request timeout.

## Security

- API keys are stored in `local.env`.
- Environment files are excluded through `.gitignore`.
- CLI memory files are excluded from Git.
- `node_modules` is excluded from Git.
- `.env.example` provides a safe configuration template.

## Author

**Vishal S**

GitHub: https://github.com/Vishal042006

## Internship Project

Developed as part of the AI / Generative AI internship assignment at Valentius Kryptix.

