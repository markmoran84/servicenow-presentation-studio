// Shared validation and utility functions for edge functions

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AI Gateway configuration
export const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const DEFAULT_MODEL = "google/gemini-3-flash-preview";
export const PREMIUM_MODEL = "google/gemini-2.5-pro";

// Response helpers
export function successResponse<T>(data: T, extra: Record<string, unknown> = {}): Response {
  return new Response(
    JSON.stringify({ success: true, data, ...extra }),
    { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

export function errorResponse(
  statusCode: number, 
  publicMessage: string, 
  internalError?: unknown
): Response {
  if (internalError) {
    console.error("Internal error:", {
      message: internalError instanceof Error ? internalError.message : String(internalError),
      stack: internalError instanceof Error ? internalError.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
  
  return new Response(
    JSON.stringify({ success: false, error: publicMessage }),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

// Legacy alias for backward compatibility
export const createErrorResponse = errorResponse;

// Retry wrapper with exponential backoff for AI gateway calls
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Retry on transient errors (502, 503)
      if (response.status === 502 || response.status === 503) {
        const errorText = await response.text();
        console.log(`Attempt ${attempt + 1}/${maxRetries}: Got ${response.status}, retrying...`);
        lastError = new Error(`Gateway error ${response.status}: ${errorText}`);
        
        // Exponential backoff
        const delay = initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      console.log(`Attempt ${attempt + 1}/${maxRetries}: Fetch failed, retrying...`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      const delay = initialDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

// AI Gateway helper with built-in retry and error handling
export async function callAIGateway(options: {
  apiKey: string;
  model?: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  tools?: unknown[];
  tool_choice?: unknown;
  max_tokens?: number;
}): Promise<{ content: string | null; toolCalls: unknown[] | null; rawResponse: unknown }> {
  const {
    apiKey,
    model = DEFAULT_MODEL,
    messages,
    temperature = 0.7,
    tools,
    tool_choice,
    max_tokens = 16000,
  } = options;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    if (tool_choice) {
      body.tool_choice = tool_choice;
    }
  }

  console.log(`Calling AI gateway with model: ${model}, max_tokens: ${max_tokens}`);

  const response = await fetchWithRetry(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Handle rate limiting and payment errors
  if (response.status === 429) {
    throw new RateLimitError("Rate limit exceeded. Please try again in a moment.");
  }
  
  if (response.status === 402) {
    throw new PaymentRequiredError("AI credits exhausted. Please add credits to continue.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    throw new Error(`AI gateway error: ${response.status}`);
  }

  // Parse response with better error handling
  let aiResponse;
  try {
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      throw new Error("Empty response from AI gateway");
    }
    aiResponse = JSON.parse(responseText);
  } catch (parseError) {
    console.error("Failed to parse AI gateway response:", parseError);
    throw new Error("Failed to parse AI gateway response - response may have been truncated");
  }
  
  const choice = aiResponse.choices?.[0];
  
  if (!choice) {
    console.error("No choices in AI response:", JSON.stringify(aiResponse).slice(0, 500));
    throw new Error("No response from AI model");
  }

  // Check if response was truncated
  if (choice.finish_reason === 'length') {
    console.warn("AI response was truncated due to max_tokens limit");
  }

  return {
    content: choice.message?.content || null,
    toolCalls: choice.message?.tool_calls || null,
    rawResponse: aiResponse,
  };
}

// Custom error classes for better error handling
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class PaymentRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentRequiredError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Handle API errors and return appropriate response
export function handleAPIError(error: unknown): Response {
  if (error instanceof RateLimitError) {
    return errorResponse(429, error.message, error);
  }
  
  if (error instanceof PaymentRequiredError) {
    return errorResponse(402, error.message, error);
  }
  
  if (error instanceof ValidationError) {
    return errorResponse(400, error.message, error);
  }
  
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return errorResponse(500, message, error);
}

// Validate text content
export function validateContent(content: unknown, minLength = 100, maxLength = 500000): string {
  if (typeof content !== "string") {
    throw new ValidationError("Content must be a string");
  }
  
  const trimmed = content.trim();
  
  if (trimmed.length < minLength) {
    throw new ValidationError(`Content too short (minimum ${minLength} characters)`);
  }
  
  if (trimmed.length > maxLength) {
    throw new ValidationError(`Content too large (maximum ${maxLength} characters)`);
  }
  
  return trimmed;
}

// Validate URL with SSRF protection
export function validateUrl(url: unknown): string {
  if (typeof url !== "string") {
    throw new ValidationError("URL must be a string");
  }
  
  let trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    throw new ValidationError("URL is required");
  }
  
  // Auto-prepend https if missing
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    trimmedUrl = `https://${trimmedUrl}`;
  }
  
  // Validate URL format
  let urlObj: URL;
  try {
    urlObj = new URL(trimmedUrl);
  } catch {
    throw new ValidationError("Invalid URL format");
  }
  
  // SSRF protection - block internal addresses
  const blockedHosts = [
    "localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254",
    "10.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.",
    "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.",
    "172.27.", "172.28.", "172.29.", "172.30.", "172.31.", "192.168.",
    "::1", "fe80::"
  ];
  
  const hostname = urlObj.hostname.toLowerCase();
  
  for (const blocked of blockedHosts) {
    if (hostname === blocked || hostname.startsWith(blocked)) {
      throw new ValidationError("URL not allowed");
    }
  }
  
  if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
    throw new ValidationError("Only HTTP and HTTPS URLs are allowed");
  }
  
  return trimmedUrl;
}

// Validate file path with path traversal protection
export function validateFilePath(filePath: unknown): string {
  if (typeof filePath !== "string") {
    throw new ValidationError("File path must be a string");
  }
  
  const trimmed = filePath.trim();
  
  if (!trimmed) {
    throw new ValidationError("File path is required");
  }
  
  if (trimmed.includes("..") || trimmed.includes("//")) {
    throw new ValidationError("Invalid file path");
  }
  
  if (trimmed.startsWith("/")) {
    throw new ValidationError("Invalid file path");
  }
  
  const dangerousChars = /[\x00-\x1f\x7f`$|><;&*?]/;
  if (dangerousChars.test(trimmed)) {
    throw new ValidationError("Invalid characters in file path");
  }
  
  if (trimmed.length > 500) {
    throw new ValidationError("File path too long");
  }
  
  return trimmed;
}

// Validate account context object
export function validateAccountContext(context: unknown): Record<string, unknown> | null {
  if (context === null || context === undefined) {
    return null;
  }
  
  if (typeof context !== "object" || Array.isArray(context)) {
    throw new ValidationError("Invalid account context format");
  }
  
  return context as Record<string, unknown>;
}

// Sanitize text for AI processing
export function sanitizeForAI(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// Clean JSON from AI response (remove markdown code blocks)
export function cleanJsonResponse(content: string): string {
  let s = (content || "").trim();
  if (s.startsWith("```json")) s = s.slice(7);
  if (s.startsWith("```")) s = s.slice(3);
  if (s.endsWith("```")) s = s.slice(0, -3);
  return s.trim();
}

// Parse JSON safely with better error messages
export function parseJsonSafe<T>(content: string, description = "response"): T {
  try {
    return JSON.parse(cleanJsonResponse(content));
  } catch (e) {
    console.error(`Failed to parse ${description}:`, content.slice(0, 500));
    throw new Error(`Failed to parse AI-generated ${description}`);
  }
}

// Get API key from environment with validation
export function getAPIKey(): string {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }
  return key;
}
