/**
 * Perplexity API integration for streaming chat completions
 */

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

/**
 * Represents a chunk of streaming response data
 */
export interface StreamChunk {
  content: string;
  done: boolean;
}

/**
 * Stream responses from Perplexity API
 * @param params.messages - Array of conversation messages
 * @returns Async generator yielding response chunks
 */
export async function* perplexity_stream_ask(params: {
  messages: Array<{ role: string; content: string }>;
}): AsyncGenerator<StreamChunk> {
  if (!API_KEY) {
    throw new Error("PERPLEXITY_API_KEY environment variable is required. Get one at https://www.perplexity.ai/settings/api");
  }

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: params.messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            yield { content: "", done: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              yield { content, done: false };
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
