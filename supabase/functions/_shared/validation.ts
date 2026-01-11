// Shared validation utilities for edge functions

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Safe error response - never expose internal details
export function createErrorResponse(
  statusCode: number, 
  publicMessage: string, 
  internalError?: unknown
): Response {
  // Log detailed error server-side only
  if (internalError) {
    console.error('Internal error:', {
      message: internalError instanceof Error ? internalError.message : String(internalError),
      timestamp: new Date().toISOString()
    });
  }
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: publicMessage 
    }),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Validate text content
export function validateContent(content: unknown, minLength = 100, maxLength = 500000): string {
  if (typeof content !== 'string') {
    throw new Error('Content must be a string');
  }
  
  const trimmed = content.trim();
  
  if (trimmed.length < minLength) {
    throw new Error(`Content too short (minimum ${minLength} characters)`);
  }
  
  if (trimmed.length > maxLength) {
    throw new Error(`Content too large (maximum ${maxLength} characters)`);
  }
  
  return trimmed;
}

// Validate URL with SSRF protection
export function validateUrl(url: unknown): string {
  if (typeof url !== 'string') {
    throw new Error('URL must be a string');
  }
  
  let trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    throw new Error('URL is required');
  }
  
  // Auto-prepend https if missing
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    trimmedUrl = `https://${trimmedUrl}`;
  }
  
  // Validate URL format
  let urlObj: URL;
  try {
    urlObj = new URL(trimmedUrl);
  } catch {
    throw new Error('Invalid URL format');
  }
  
  // SSRF protection - block internal addresses
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254', // AWS metadata
    '10.',
    '172.16.',
    '172.17.',
    '172.18.',
    '172.19.',
    '172.20.',
    '172.21.',
    '172.22.',
    '172.23.',
    '172.24.',
    '172.25.',
    '172.26.',
    '172.27.',
    '172.28.',
    '172.29.',
    '172.30.',
    '172.31.',
    '192.168.',
    '::1',
    'fe80::'
  ];
  
  const hostname = urlObj.hostname.toLowerCase();
  
  for (const blocked of blockedHosts) {
    if (hostname === blocked || hostname.startsWith(blocked)) {
      throw new Error('URL not allowed');
    }
  }
  
  // Only allow http/https protocols
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS URLs are allowed');
  }
  
  return trimmedUrl;
}

// Validate file path with path traversal protection
export function validateFilePath(filePath: unknown): string {
  if (typeof filePath !== 'string') {
    throw new Error('File path must be a string');
  }
  
  const trimmed = filePath.trim();
  
  if (!trimmed) {
    throw new Error('File path is required');
  }
  
  // Prevent path traversal
  if (trimmed.includes('..') || trimmed.includes('//') || trimmed.startsWith('/')) {
    throw new Error('Invalid file path');
  }
  
  // Only allow safe characters
  if (!/^[\w\-./]+$/.test(trimmed)) {
    throw new Error('Invalid characters in file path');
  }
  
  return trimmed;
}

// Validate account context object
export function validateAccountContext(context: unknown): Record<string, unknown> | null {
  if (context === null || context === undefined) {
    return null;
  }
  
  if (typeof context !== 'object' || Array.isArray(context)) {
    throw new Error('Invalid account context format');
  }
  
  return context as Record<string, unknown>;
}

// Sanitize text for AI processing
export function sanitizeForAI(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}
