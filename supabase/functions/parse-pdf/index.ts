import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { extractText } from "https://esm.sh/unpdf@0.12.1";
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
      return createErrorResponse(
        400,
        validationError instanceof Error ? validationError.message : "Invalid file path",
      );
    }

    // Create backend client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Backend configuration missing");
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

    // Validate file size (max 25MB for memory safety)
    const maxSize = 25 * 1024 * 1024;
    if (uint8Array.length > maxSize) {
      return createErrorResponse(400, "File too large. Maximum size is 25MB.");
    }

    console.log("PDF size:", uint8Array.length, "bytes");

    // Extract text via unpdf (lightweight, edge-compatible)
    const rawText = await extractTextFromPDF(uint8Array);
    const textContent = cleanExtractedText(rawText);

    if (!looksLikeExtractedText(textContent)) {
      return createErrorResponse(
        400,
        "Could not extract readable text from this PDF. It may be image-based or protected. Please copy/paste the text content instead.",
      );
    }

    console.log("PDF text extracted, length:", textContent.length);

    // Clean up the uploaded file
    await supabase.storage.from("annual-reports").remove([validatedPath]);

    return new Response(JSON.stringify({ success: true, content: textContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PDF processing error:", error);
    return createErrorResponse(500, "Failed to process PDF. Please try again.", error);
  }
});

async function extractTextFromPDF(uint8Array: Uint8Array): Promise<string> {
  // Use unpdf which is lighter weight and edge-compatible
  // Limit to first 40 pages to avoid memory issues
  const maxPages = 40;
  const maxChars = 400_000;

  try {
    const { text, totalPages } = await extractText(uint8Array, { 
      mergePages: true 
    });
    
    console.log(`Extracted text from PDF with ${totalPages} pages`);
    
    // Truncate if too long
    if (text.length > maxChars) {
      return text.slice(0, maxChars);
    }
    
    return text;
  } catch (extractError) {
    console.error("unpdf extraction failed:", extractError);
    throw new Error("PDF text extraction failed");
  }
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\n /g, "\n")
    .trim();
}

function looksLikeExtractedText(text: string): boolean {
  if (text.length < 200) return false;

  // If there are too many control characters, it's almost certainly binary/garbage.
  const controlChars = (text.match(/[\x00-\x1f\x7f]/g) || []).length;
  if (controlChars / Math.max(1, text.length) > 0.01) return false;

  // Require a minimal word count so we don't pass through short metadata-only results.
  const words = (text.match(/[A-Za-z0-9][A-Za-z0-9'\-]*/g) || []).length;
  return words >= 80;
}
