import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getResolvedPDFJS } from "https://esm.sh/unpdf@0.12.1";
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
  // IMPORTANT: Avoid `extractText()` which reads the entire PDF and can exceed
  // edge CPU/memory limits. Instead, use the PDF.js API and only process the
  // first N pages with an overall character cap.
  const maxPages = 10;
  const maxChars = 240_000;

  const pdfjs = await getResolvedPDFJS();
  const loadingTask = pdfjs.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
    stopAtErrors: true,
  });

  let doc: any;
  try {
    doc = await loadingTask.promise;
    const pagesToRead = Math.min(doc.numPages || 0, maxPages);

    const parts: string[] = [];
    let total = 0;

    for (let pageNum = 1; pageNum <= pagesToRead; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = (content.items as any[])
        .map((it) => (typeof it?.str === "string" ? it.str : ""))
        .filter(Boolean)
        .join(" ");

      if (pageText) {
        parts.push(pageText);
        total += pageText.length;
        if (total >= maxChars) break;
      }

      // Best-effort cleanup to reduce memory pressure
      try {
        page.cleanup?.();
      } catch {
        // ignore
      }
    }

    console.log(`PDF pages processed: ${pagesToRead}/${doc.numPages}, chars: ${total}`);
    return parts.join("\n\n");
  } catch (extractError) {
    console.error("PDF extraction failed:", extractError);
    throw new Error("PDF text extraction failed");
  } finally {
    try {
      await loadingTask.destroy?.();
    } catch {
      // ignore
    }
    try {
      await doc?.destroy?.();
    } catch {
      // ignore
    }
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
  // Very short content is likely metadata-only
  if (text.length < 100) {
    console.log("Validation failed: text too short", text.length);
    return false;
  }

  // If there are too many control characters, it's almost certainly binary/garbage.
  const controlChars = (text.match(/[\x00-\x1f\x7f]/g) || []).length;
  const controlRatio = controlChars / Math.max(1, text.length);
  if (controlRatio > 0.02) {
    console.log("Validation failed: too many control chars", controlRatio);
    return false;
  }

  // Count word-like tokens (letters, numbers, common punctuation in words)
  // More lenient regex to handle financial data, non-English chars, etc.
  const words = (text.match(/[\w\u00C0-\u024F]{2,}/g) || []).length;
  
  // For longer texts, require proportionally fewer words (annual reports have tables/numbers)
  const minWords = Math.min(30, Math.floor(text.length / 200));
  
  if (words < minWords) {
    console.log("Validation failed: not enough words", words, "< min", minWords);
    return false;
  }

  console.log("Validation passed: chars", text.length, "words", words);
  return true;
}
