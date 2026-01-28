import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse, validateUrl } from "../_shared/validation.ts";

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

    // Check if URL points to a PDF - Firecrawl cannot scrape PDFs
    const urlLower = validatedUrl.toLowerCase();
    if (urlLower.endsWith('.pdf') || urlLower.includes('.pdf?')) {
      return createErrorResponse(
        400, 
        "PDF files cannot be scraped directly. Please upload the PDF file instead, or paste the text content manually."
      );
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      console.error("FIRECRAWL_API_KEY not configured");
      return createErrorResponse(503, "Service temporarily unavailable");
    }

    console.log("Scraping URL:", validatedUrl);

    // Add timeout to prevent long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

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
          timeout: 20000, // Tell Firecrawl to timeout after 20s
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
