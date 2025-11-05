import { perplexity_stream_ask } from "./perplexity.ts";

let promptHistory: string[] = [];
let historyIndex = -1;
let isStreaming = false;
let promptQueue: string[] = [];

// Stream text from Perplexity API
async function streamFromPerplexity(question: string): Promise<void> {
  try {
    const stream = perplexity_stream_ask({
      messages: [{ role: "user", content: question }]
    });

    for await (const chunk of stream) {
      if (chunk.done) {
        console.log(); // Add newline after streaming completes
        break;
      }
      Deno.stdout.write(new TextEncoder().encode(chunk.content));
    }
  } catch (error) {
    console.error("? Error:", error instanceof Error ? error.message : String(error));
  }
}

export async function askPerplexity(question: string): Promise<void> {
  await streamFromPerplexity(question);
}

export async function startInteractiveMode(): Promise<void> {
  console.log("?? Welcome to Perplexity CLI! Type your questions and press Enter.");
  console.log("?? Use ?/? arrows to navigate history, Ctrl+C to exit.\n");

  while (true) {
    const input = await getUserInput();

    if (input === null) {
      // User pressed Ctrl+C
      console.log("\n?? Goodbye!");
      break;
    }

    if (input.trim()) {
      promptHistory.unshift(input);
      historyIndex = -1;

      if (isStreaming) {
        // Queue the prompt if currently streaming
        promptQueue.push(input);
        console.log(`?? Queued: ${input}`);
      } else {
        // Send immediately
        await processPrompt(input);
      }
    }
  }
}

async function processPrompt(question: string): Promise<void> {
  isStreaming = true;

  try {
    await askPerplexity(question);
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

// Global buffer for piped input
let inputBuffer: string[] = [];
let bufferIndex = 0;

async function getUserInput(): Promise<string | null> {
  // Display prompt
  Deno.stdout.write(new TextEncoder().encode("? "));

  try {
    // If we have buffered input, use it first
    if (inputBuffer.length > bufferIndex) {
      const input = inputBuffer[bufferIndex++];
      return input;
    }

    // Read all available input at once (for piped input)
    const buffer = new Uint8Array(1024);
    let allInput = "";

    const n = await Deno.stdin.read(buffer);
    if (n === null) {
      return null; // No more input
    }

    allInput = new TextDecoder().decode(buffer.subarray(0, n));

    // Split by lines and buffer them
    inputBuffer = allInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    bufferIndex = 0;

    if (inputBuffer.length > 0) {
      const input = inputBuffer[bufferIndex++];
      return input;
    }

    return null;
  } catch (error) {
    return null;
  }
}