# Perplexity CLI

A command-line interface for interacting with Perplexity AI, built with Deno v2.

## Features

- **Interactive Mode**: Start without arguments for an interactive prompt
- **Streaming Responses**: Real-time streaming of AI responses
- **Command Arguments**: Pass questions directly as command arguments
- **Prompt History**: Use ?/? arrows to navigate through previous prompts
- **Queue Management**: Type new prompts while responses are streaming - they'll be queued automatically
- **Graceful Exit**: Ctrl+C to exit

## Installation

1. Clone or download this repository
2. Ensure you have Deno v2 installed
3. Get a Perplexity API key from [perplexity.ai](https://www.perplexity.ai/settings/api)

## Setup

1. Get a Perplexity API key from [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Set your API key as an environment variable:

```bash
export PERPLEXITY_API_KEY=your_api_key_here
```

## Usage

### Interactive Mode

```bash
deno run --allow-net --allow-env main.ts
```

This starts an interactive session where you can:
- Type questions and press Enter
- Use ?/? arrows to browse prompt history
- Type new questions while responses are streaming (they'll be queued)
- Press Ctrl+C to exit

### Direct Question Mode

```bash
deno run --allow-net --allow-env main.ts "What is the capital of France?"
```

Pass your question directly as command arguments for immediate processing.

## Requirements

- Deno v2 or later
- Perplexity API key (get one at [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api))
- Network access for API calls
