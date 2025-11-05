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

## Example Session

```
?? Welcome to Perplexity CLI! Type your questions and press Enter.
?? Use ?/? arrows to navigate history, Ctrl+C to exit.

? What is machine learning?

?? What is machine learning?

Machine learning is a subset of artificial intelligence (AI) that focuses on the development of algorithms and statistical models that enable computers to perform specific tasks without being explicitly programmed for each task. Instead, these systems learn from data and improve their performance over time through experience.

The core idea is that machines can learn patterns from data and make predictions or decisions based on that learning, rather than following pre-written rules for every possible scenario.

? Tell me about neural networks

?? Tell me about neural networks

Neural networks are computational models inspired by the structure and function of biological neural networks in the human brain. They consist of interconnected nodes (neurons) organized in layers that process and transmit information.

[response continues streaming...]
```

## Requirements

- Deno v2 or later
- Perplexity API key (get one at [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api))
- Network access for API calls

## Permissions

The CLI requires the following Deno permissions:
- `--allow-net`: For making HTTP requests to the Perplexity API
- `--allow-env`: For reading the PERPLEXITY_API_KEY environment variable

## Development

The project structure:

- `main.ts`: CLI entry point and argument parsing
- `cli.ts`: Interactive UI logic and prompt handling
- `perplexity.ts`: Perplexity API integration with streaming support
- `deno.json`: Project configuration and dependencies
>>>>>>> 5b20a10 (Initial)
