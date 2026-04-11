import OpenAI from "openai";

let client: OpenAI | null = null;

/** Cliente OpenAI-compatible apuntando a DeepSeek. */
export function getDeepSeek(): OpenAI | null {
  if (!process.env.DEEPSEEK_API_KEY) return null;
  client ??= new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
  });
  return client;
}
