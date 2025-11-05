#!/usr/bin/env -S deno run --allow-net --allow-env

import { Command } from "@cliffy/command";
import { startInteractiveMode } from "./cli.ts";
import { perplexity_stream_ask } from "./perplexity.ts";

async function askPerplexity(question: string): Promise<void> {
  try {
    const stream = perplexity_stream_ask({
      messages: [{ role: "user", content: question }]
    });

    for await (const chunk of stream) {
      if (chunk.done) {
        console.log();
        break;
      }
      Deno.stdout.write(new TextEncoder().encode(chunk.content));
    }
  } catch (error) {
    console.error("? Error:", error instanceof Error ? error.message : String(error));
  }
}

const command = new Command()
  .name("perplexity-cli")
  .version("1.0.0")
  .description("CLI tool to ask questions to Perplexity AI")
  .arguments("[question...:string]")
  .action(async (_options, ...questionParts) => {
    const question = questionParts.join(" ");

    if (question) {
      // If arguments provided, send immediately
      await askPerplexity(question);
    } else {
      // Interactive mode
      await startInteractiveMode();
    }
  });

if (import.meta.main) {
  await command.parse(Deno.args);
}