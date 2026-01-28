import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getDocument, GlobalWorkerOptions } from "https://esm.sh/pdfjs-dist@4.0.379/legacy/build/pdf.mjs";
import { corsHeaders, createErrorResponse, validateFilePath } from "../_shared/validation.ts";

// Disable worker for edge function environment
GlobalWorkerOptions.workerSrc = "";

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

    // Validate file size (max 20MB for processing - larger files cause CPU timeouts)
    const maxSize = 20 * 1024 * 1024;
    if (uint8Array.length > maxSize) {
      // Clean up the file
      await supabase.storage.from("annual-reports").remove([validatedPath]);
      return createErrorResponse(400, "File too large for processing. Maximum size is 20MB. Please use a smaller file or copy/paste the text content.");
    }

    console.log("PDF size:", uint8Array.length, "bytes");

    // Extract text via PDF.js with strict limits
    const rawText = await extractTextFromPDF(uint8Array);
    const textContent = cleanExtractedText(rawText);

    if (!looksLikeExtractedText(textContent)) {
      // Clean up the file
      await supabase.storage.from("annual-reports").remove([validatedPath]);
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
    return createErrorResponse(500, "Failed to process PDF. The file may be too complex or large. Please try a smaller file or copy/paste the text content.", error);
  }
});

async function extractTextFromPDF(uint8Array: Uint8Array): Promise<string> {
  // Strict limits to prevent CPU timeout
  const maxPages = 30; // Limit to first 30 pages
  const maxChars = 300_000; // Max characters to extract

  const loadingTask = getDocument({ 
    data: uint8Array,
    useSystemFonts: true,
    disableFontFace: true, // Reduces CPU usage
    isEvalSupported: false, // Disable eval for security/performance
  });
  
  const doc = await loadingTask.promise;
  const pagesToProcess = Math.min(doc.numPages, maxPages);
  
  console.log(`Processing ${pagesToProcess} of ${doc.numPages} pages`);
  
  const parts: string[] = [];
  let total = 0;

  for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
    try {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = (content.items as any[])
        .map((it) => (typeof it?.str === "string" ? it.str : ""))
        .filter(Boolean)
        .join(" ");

      if (pageText) {
        parts.push(pageText);
        total += pageText.length;
        if (total >= maxChars) {
          console.log(`Character limit reached at page ${pageNum}`);
          break;
        }
      }
      
      // Release page resources
      page.cleanup();
    } catch (pageError) {
      console.warn(`Error processing page ${pageNum}:`, pageError);
      // Continue with other pages
    }
  }

  // Clean up document resources
  await doc.cleanup();
  await doc.destroy();

  return parts.join("\n\n");
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
