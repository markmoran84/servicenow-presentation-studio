import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, createErrorResponse, validateUrl } from "../_shared/validation.ts";

const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15MB limit for PDF downloads (parse-pdf handles page limits)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate URL input
    let validatedUrl: string;
    try {
      validatedUrl = validateUrl(requestData.url);
    } catch (validationError) {
      return createErrorResponse(400, validationError instanceof Error ? validationError.message : 'Invalid URL');
    }

    // Check if URL points to a PDF - handle differently
    const urlLower = validatedUrl.toLowerCase();
    const isPdf = urlLower.endsWith('.pdf') || urlLower.includes('.pdf?') || urlLower.includes('/pdf/');
    
    if (isPdf) {
      return await handlePdfUrl(validatedUrl);
    }

    // Regular web page scraping via Firecrawl
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      console.error("FIRECRAWL_API_KEY not configured");
      return createErrorResponse(503, "Service temporarily unavailable");
    }

    console.log("Scraping URL:", validatedUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: validatedUrl,
          formats: ["markdown"],
          onlyMainContent: true,
          timeout: 20000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const status = response.status;
        console.error("External API error:", status);
        
        if (status === 408 || status === 504) {
          return createErrorResponse(504, "The page took too long to load. Please try again or paste the content manually.");
        }
        if (status === 402) {
          return createErrorResponse(402, "API credits exhausted. Please try again later.");
        }
        return createErrorResponse(502, "Unable to fetch URL content. The page may be blocked or unavailable.");
      }

      const data = await response.json();
      const markdown = data.data?.markdown || data.markdown || "";
      
      if (!markdown || markdown.length < 50) {
        return createErrorResponse(422, "Could not extract meaningful content from this URL. Try pasting the text manually.");
      }

      console.log("Scrape successful, content length:", markdown.length);
      return new Response(
        JSON.stringify({ success: true, content: markdown }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Request timed out");
        return createErrorResponse(504, "The page took too long to load. Please try again or paste the content manually.");
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return createErrorResponse(500, "An error occurred. Please try again.", error);
  }
});

async function handlePdfUrl(pdfUrl: string): Promise<Response> {
  console.log("Downloading PDF from URL:", pdfUrl);
  
  try {
    // Download the PDF with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for download
    
    const pdfResponse = await fetch(pdfUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AccountPlanBot/1.0)',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!pdfResponse.ok) {
      console.error("PDF download failed:", pdfResponse.status);
      return createErrorResponse(502, `Could not download PDF (status ${pdfResponse.status}). Please download and upload the file manually.`);
    }
    
    const contentType = pdfResponse.headers.get('content-type') || '';
    if (!contentType.includes('pdf') && !contentType.includes('octet-stream')) {
      console.log("Unexpected content type:", contentType);
      // Continue anyway - some servers don't set correct content-type
    }
    
    const arrayBuffer = await pdfResponse.arrayBuffer();
    const pdfSize = arrayBuffer.byteLength;
    
    console.log("Downloaded PDF size:", pdfSize, "bytes");
    
    if (pdfSize > MAX_PDF_SIZE) {
      return createErrorResponse(
        400, 
        `This PDF is too large (${Math.round(pdfSize / 1024 / 1024)}MB). Maximum is 5MB. Please download and upload a smaller file, or paste the text content.`
      );
    }
    
    if (pdfSize < 1000) {
      return createErrorResponse(400, "Downloaded file is too small to be a valid PDF.");
    }
    
    // Upload to Supabase storage temporarily
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const fileName = `url-import-${Date.now()}.pdf`;
    const filePath = `temp/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from("annual-reports")
      .upload(filePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return createErrorResponse(500, "Failed to process PDF. Please try uploading the file directly.");
    }
    
    console.log("PDF uploaded to storage:", filePath);
    
    // Call parse-pdf function to extract text
    const parseResponse = await fetch(`${supabaseUrl}/functions/v1/parse-pdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });
    
    const parseResult = await parseResponse.json();
    
    if (!parseResult.success) {
      console.error("PDF parsing failed:", parseResult.error);
      return createErrorResponse(500, parseResult.error || "Failed to extract text from PDF.");
    }
    
    console.log("PDF parsed successfully, content length:", parseResult.text?.length || 0);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        content: parseResult.text,
        source: "pdf_url"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("PDF URL handling error:", error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return createErrorResponse(504, "PDF download timed out. Please download and upload the file manually.");
    }
    
    return createErrorResponse(500, "Failed to process PDF from URL. Please download and upload the file manually.");
  }
}
