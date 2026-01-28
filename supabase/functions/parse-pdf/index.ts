import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { extractText } from "https://esm.sh/unpdf@0.12.1";
import { corsHeaders, createErrorResponse, validateFilePath } from "../_shared/validation.ts";

const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15MB (URL import + uploads)
const MAX_PAGES = 20; // Limit pages to process

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

    // File size limit to avoid CPU/memory spikes
    if (uint8Array.length > MAX_PDF_SIZE) {
      console.log("File too large:", uint8Array.length, "bytes");
      // Clean up the file
      await supabase.storage.from("annual-reports").remove([validatedPath]);
      return createErrorResponse(
        400, 
        `This PDF is too large (${Math.round(uint8Array.length / 1024 / 1024)}MB). Maximum is ${Math.round(MAX_PDF_SIZE / 1024 / 1024)}MB. Please use the text paste option instead, or upload a smaller file.`
      );
    }

    console.log("PDF size:", uint8Array.length, "bytes");

    // Extract text using unpdf's simpler extractText function
    const { text: rawText, totalPages } = await extractText(uint8Array, { mergePages: true });
    console.log(`Extracted text from ${totalPages} pages, raw length: ${rawText?.length || 0}`);
    
    const textContent = cleanExtractedText(rawText || "");
    console.log("Cleaned text length:", textContent.length);

    // Be more lenient - if we got any substantial text, use it
    if (textContent.length < 100) {
      console.log("Text too short, likely image-based PDF");
      // Clean up the file
      await supabase.storage.from("annual-reports").remove([validatedPath]);
      return createErrorResponse(
        400,
        "Could not extract readable text from this PDF. It may be image-based or protected. Please copy/paste the text content instead.",
      );
    }

    console.log("PDF text extracted successfully, final length:", textContent.length);

    // Clean up the uploaded file
    await supabase.storage.from("annual-reports").remove([validatedPath]);

    // Return both keys for compatibility with any older callers.
    return new Response(JSON.stringify({ success: true, content: textContent, text: textContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PDF processing error:", error);
    return createErrorResponse(
      500, 
      "Failed to process PDF. This file may be too complex. Please use the text paste option instead, or try a simpler PDF.", 
      error
    );
  }
});

// Removed extractTextFromPDF - now using unpdf's extractText directly

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\n /g, "\n")
    // Remove control characters
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();
}
