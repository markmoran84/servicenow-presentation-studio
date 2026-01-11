import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return new Response(
        JSON.stringify({ success: false, error: "File path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("annual-reports")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to download file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("PDF downloaded, processing...");

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Could not extract sufficient text from PDF. The file may be image-based or protected. Please copy and paste the text content instead." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("PDF text extracted, length:", textContent.length);

    // Clean up the uploaded file
    await supabase.storage.from("annual-reports").remove([filePath]);

    return new Response(
      JSON.stringify({ success: true, content: textContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error parsing PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to parse PDF";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
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
    // Try to find uncompressed streams
    const streamMatches = pdfString.matchAll(/stream\s*([\s\S]*?)\s*endstream/g);
    for (const match of streamMatches) {
      const streamContent = match[1];
      // Look for text in streams
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
  // Must contain mostly printable ASCII and common extended chars
  const printableCount = (text.match(/[\x20-\x7E\xA0-\xFF\n\r\t]/g) || []).length;
  const ratio = printableCount / text.length;
  return ratio > 0.8 && text.length > 0;
}
