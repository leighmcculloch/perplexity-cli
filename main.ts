#!/usr/bin/env -S deno run --allow-net --allow-env

import { Command } from "@cliffy/command";
import { askPerplexity, startInteractiveMode } from "./cli.ts";

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