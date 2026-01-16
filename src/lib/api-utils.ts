import { supabase } from "@/integrations/supabase/client";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }

  static fromResponse(response: { error?: string; success?: boolean }, statusCode?: number): APIError {
    return new APIError(
      response.error || "An unexpected error occurred",
      statusCode
    );
  }

  isRateLimited(): boolean {
    return this.statusCode === 429 || this.message.toLowerCase().includes("rate limit");
  }

  isPaymentRequired(): boolean {
    return this.statusCode === 402 || this.message.toLowerCase().includes("credit");
  }

  isNetworkError(): boolean {
    return this.message.toLowerCase().includes("network") || 
           this.message.toLowerCase().includes("fetch");
  }
}

// Wrapper for edge function calls with proper error handling
export async function invokeEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<APIResponse<T>>(
    functionName,
    { body }
  );

  if (error) {
    console.error(`Edge function ${functionName} error:`, error);
    throw new APIError(error.message, error.status);
  }

  if (!data?.success) {
    throw APIError.fromResponse(data || {});
  }

  return data.data as T;
}

// Retry wrapper for transient failures
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: "linear" | "exponential";
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = "exponential",
    shouldRetry = (error) => {
      if (error instanceof APIError) {
        // Retry on transient errors (503, 502, network issues)
        return (
          error.statusCode === 503 ||
          error.statusCode === 502 ||
          error.isNetworkError()
        );
      }
      return false;
    },
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (!shouldRetry(lastError) || attempt === maxRetries - 1) {
        throw lastError;
      }

      // Calculate delay
      const delay = backoff === "exponential"
        ? delayMs * Math.pow(2, attempt)
        : delayMs * (attempt + 1);

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

// Debounce utility for search/input handlers
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Format error messages for user display
export function formatErrorForUser(error: unknown): string {
  if (error instanceof APIError) {
    if (error.isRateLimited()) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (error.isPaymentRequired()) {
      return "AI credits exhausted. Please add credits to continue.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    // Clean up technical error messages
    const message = error.message;
    
    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      return "Network error. Please check your connection and try again.";
    }
    
    return message;
  }

  return "An unexpected error occurred. Please try again.";
}
