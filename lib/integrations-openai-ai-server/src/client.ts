import OpenAI from "openai";

const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim() ?? "";
const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() ?? "";

/** True when both OpenAI integration env vars are present. */
export const isAiConfigured = baseURL.length > 0 && apiKey.length > 0;

/**
 * OpenAI client when AI env is configured; otherwise null.
 * Callers must degrade (skip commentary / return 422 on import) when null.
 */
export const openai: OpenAI | null = isAiConfigured
  ? new OpenAI({
      apiKey,
      baseURL,
    })
  : null;
