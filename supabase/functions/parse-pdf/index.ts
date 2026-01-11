import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, createErrorResponse, validateFilePath } from "../_shared/validation.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate file path input
    let validatedPath: string;
    try {
      validatedPath = validateFilePath(requestData.filePath);
    } catch (validationError) {
      return createErrorResponse(400, validationError instanceof Error ? validationError.message : 'Invalid file path');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase configuration missing");
      return createErrorResponse(503, "Service temporarily unavailable");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("annual-reports")
      .download(validatedPath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError?.message);
      return createErrorResponse(400, "Failed to download file. Please try uploading again.");
    }

    console.log("PDF downloaded, processing...");

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (uint8Array.length > maxSize) {
      return createErrorResponse(400, "File too large. Maximum size is 50MB.");
    }

    console.log("PDF size:", uint8Array.length, "bytes");

    // Extract text using improved methods
    let textContent = extractTextFromPDF(uint8Array);

    // Clean up extracted text
    textContent = textContent
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n /g, '\n')
      .trim();

    if (textContent.length < 100) {
      return createErrorResponse(
        400, 
        "Could not extract sufficient text from PDF. The file may be image-based or protected. Please copy and paste the text content instead."
      );
    }

    console.log("PDF text extracted, length:", textContent.length);

    // Clean up the uploaded file
    await supabase.storage.from("annual-reports").remove([validatedPath]);

    return new Response(
      JSON.stringify({ success: true, content: textContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return createErrorResponse(500, "Failed to process PDF. Please try again.", error);
  }
});

// Improved PDF text extraction
function extractTextFromPDF(uint8Array: Uint8Array): string {
  const pdfString = new TextDecoder("latin1").decode(uint8Array);
  const extractedParts: string[] = [];
  const seenTexts = new Set<string>();
  
  // Method 1: Extract from BT...ET text blocks
  const btEtMatches = pdfString.matchAll(/BT\s*([\s\S]*?)\s*ET/g);
  for (const match of btEtMatches) {
    const textBlock = match[1];
    
    // Extract Tj operator text
    const tjMatches = textBlock.matchAll(/\(((?:[^()\\]|\\[()\\])*)\)\s*Tj/gi);
    for (const tjMatch of tjMatches) {
      const text = decodePDFText(tjMatch[1]);
      if (isValidText(text) && !seenTexts.has(text)) {
        seenTexts.add(text);
        extractedParts.push(text);
      }
    }
    
    // Extract TJ array text
    const tjArrayMatches = textBlock.matchAll(/\[((?:[^\[\]]|\[(?:[^\[\]])*\])*)\]\s*TJ/gi);
    for (const tjArrayMatch of tjArrayMatches) {
      const content = tjArrayMatch[1];
      const textParts = content.matchAll(/\(((?:[^()\\]|\\[()\\])*)\)/g);
      for (const textMatch of textParts) {
        const text = decodePDFText(textMatch[1]);
        if (isValidText(text) && !seenTexts.has(text)) {
          seenTexts.add(text);
          extractedParts.push(text);
        }
      }
    }
  }

  // Method 2: Extract from stream objects (for compressed content)
  if (extractedParts.length < 100) {
    const streamMatches = pdfString.matchAll(/stream\s*([\s\S]*?)\s*endstream/g);
    for (const match of streamMatches) {
      const streamContent = match[1];
      const textMatches = streamContent.matchAll(/\(((?:[^()\\]|\\[()\\])*)\)/g);
      for (const textMatch of textMatches) {
        const text = decodePDFText(textMatch[1]);
        if (isValidText(text) && text.length > 2 && text.length < 500 && !seenTexts.has(text)) {
          seenTexts.add(text);
          extractedParts.push(text);
        }
      }
    }
  }

  // Method 3: Simple parentheses extraction as last resort
  if (extractedParts.length < 50) {
    const simpleMatches = pdfString.matchAll(/\(((?:[^()\\]|\\[()\\])*)\)/g);
    for (const match of simpleMatches) {
      const text = decodePDFText(match[1]);
      if (isValidText(text) && text.length > 3 && text.length < 300 && !seenTexts.has(text)) {
        seenTexts.add(text);
        extractedParts.push(text);
      }
    }
  }

  return extractedParts.join(" ");
}

// Decode PDF text escape sequences
function decodePDFText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

// Check if text is valid printable content
function isValidText(text: string): boolean {
  if (!text || text.length === 0) return false;
  const printableCount = (text.match(/[\x20-\x7E\xA0-\xFF\n\r\t]/g) || []).length;
  const ratio = printableCount / text.length;
  return ratio > 0.8 && text.length > 0;
}
