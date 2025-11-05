import { perplexity_stream_ask } from "./perplexity.ts";

// Global state for interactive mode
let promptHistory: string[] = [];
let historyIndex = -1;
let isStreaming = false;
let promptQueue: string[] = [];

/**
 * Stream and display response from Perplexity API
 */
async function streamFromPerplexity(question: string): Promise<void> {
  try {
    const stream = perplexity_stream_ask({
      messages: [{ role: "user", content: question }]
    });

    for await (const chunk of stream) {
      if (chunk.done) {
        break;
      }
      Deno.stdout.write(new TextEncoder().encode(chunk.content));
    }

    console.log();
    console.log();
  } catch (error) {
    console.error("? Error:", error instanceof Error ? error.message : String(error));
  }
}


/**
 * Start the interactive CLI mode
 */
export async function startInteractiveMode(): Promise<void> {
  console.log("?? Welcome to Perplexity CLI! Type your questions and press Enter.");
  console.log("?? Use ?/? arrows to navigate history, Ctrl+C to exit.\n");

  while (true) {
    const input = await getUserInput();
    console.log();

    if (input === null) {
      // User pressed Ctrl+C or input stream ended
      console.log("\n?? Goodbye!");
      break;
    }

    if (input.trim()) {
      promptHistory.unshift(input);
      historyIndex = -1;

      if (isStreaming) {
        // Queue the prompt if currently streaming a response
        promptQueue.push(input);
        console.log(`?? Queued: ${input}`);
      } else {
        // Send immediately
        await processPrompt(input);
      }
    }
  }
}

/**
 * Process a user prompt by streaming the response
 */
async function processPrompt(question: string): Promise<void> {
  isStreaming = true;

  try {
    await streamFromPerplexity(question);
  } finally {
    isStreaming = false;

    // Process next queued prompt if any
    if (promptQueue.length > 0) {
      const nextPrompt = promptQueue.shift()!;
      console.log(`\n?? Processing queued prompt: ${nextPrompt}`);
      await processPrompt(nextPrompt);
    }
  }
}

/**
 * Handles reading user input from stdin, supporting both interactive and piped input
 */
class InputReader {
  private buffer: string[] = [];
  private index = 0;

  async readInput(): Promise<string | null> {
    // Display prompt
    Deno.stdout.write(new TextEncoder().encode("? "));

    try {
      // If we have buffered input, use it first
      if (this.buffer.length > this.index) {
        return this.buffer[this.index++];
      }

      // Read all available input at once (for piped input)
      const buffer = new Uint8Array(1024);
      const n = await Deno.stdin.read(buffer);

      if (n === null) {
        return null; // No more input
      }

      const allInput = new TextDecoder().decode(buffer.subarray(0, n));

      // Split by lines and buffer them
      this.buffer = allInput.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      this.index = 0;

      if (this.buffer.length > 0) {
        return this.buffer[this.index++];
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

const inputReader = new InputReader();

async function getUserInput(): Promise<string | null> {
  return await inputReader.readInput();
}
