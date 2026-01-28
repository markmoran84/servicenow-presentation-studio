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

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      console.error("FIRECRAWL_API_KEY not configured");
      return createErrorResponse(503, "Service temporarily unavailable");
    }

    console.log("Scraping URL:", validatedUrl);

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
      }),
    });

    if (!response.ok) {
      console.error("External API error:", response.status);
      return createErrorResponse(502, "Unable to fetch URL content. Please try again.");
    }

    const data = await response.json();
    const markdown = data.data?.markdown || data.markdown || "";
    
    console.log("Scrape successful, content length:", markdown.length);
    return new Response(
      JSON.stringify({ success: true, content: markdown }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return createErrorResponse(500, "An error occurred. Please try again.", error);
  }
});
