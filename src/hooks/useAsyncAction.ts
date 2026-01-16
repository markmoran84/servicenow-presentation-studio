import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseAsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  toastId?: string;
}

interface UseAsyncActionReturn<T, Args extends unknown[]> {
  execute: (...args: Args) => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useAsyncAction<T, Args extends unknown[] = []>(
  action: (...args: Args) => Promise<T>,
  options: UseAsyncActionOptions<T> = {}
): UseAsyncActionReturn<T, Args> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    loadingMessage,
    toastId,
  } = options;

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      const id = toastId || `async-action-${Date.now()}`;

      if (loadingMessage) {
        toast.loading(loadingMessage, { id });
      }

      try {
        const result = await action(...args);
        setData(result);
        
        if (successMessage) {
          toast.success(successMessage, { id });
        } else if (loadingMessage) {
          toast.dismiss(id);
        }
        
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Handle specific error types
        const message = getErrorMessage(error, errorMessage);
        toast.error(message, { id });
        
        onError?.(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [action, onSuccess, onError, successMessage, errorMessage, loadingMessage, toastId]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, isLoading, error, data, reset };
}

function getErrorMessage(error: Error, fallbackMessage?: string): string {
  const message = error.message.toLowerCase();
  
  // Rate limiting
  if (message.includes("rate limit") || message.includes("429")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  
  // Payment required
  if (message.includes("credit") || message.includes("402") || message.includes("payment")) {
    return "AI credits exhausted. Please add credits to continue.";
  }
  
  // Network errors
  if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
    return "Network error. Please check your connection and try again.";
  }
  
  // Timeout
  if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Gateway errors
  if (message.includes("503") || message.includes("502") || message.includes("gateway")) {
    return "Service temporarily unavailable. Please try again in a moment.";
  }
  
  return fallbackMessage || error.message || "An unexpected error occurred.";
}

// Specialized hook for AI generation actions
export function useAIGeneration<T>(
  action: () => Promise<T>,
  options: Omit<UseAsyncActionOptions<T>, "loadingMessage"> & { 
    actionName: string;
  }
) {
  return useAsyncAction(action, {
    ...options,
    loadingMessage: `Generating ${options.actionName}...`,
    successMessage: options.successMessage || `${options.actionName} generated successfully!`,
    errorMessage: options.errorMessage || `Failed to generate ${options.actionName}. Please try again.`,
    toastId: `ai-gen-${options.actionName.toLowerCase().replace(/\s/g, "-")}`,
  });
}
