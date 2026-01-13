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

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Simple PDF text extraction - extract readable text content
    // This is a basic implementation that works for most text-based PDFs
    let textContent = "";
    
    // Convert to string and try to extract text between stream markers
    const pdfString = new TextDecoder("latin1").decode(uint8Array);
    
    // Extract text objects from PDF (simplified approach)
    const textMatches = pdfString.matchAll(/\((.*?)\)/g);
    const extractedParts: string[] = [];
    
    for (const match of textMatches) {
      const text = match[1];
      // Filter out binary garbage - only keep printable ASCII
      if (text && /^[\x20-\x7E\s]+$/.test(text) && text.length > 1) {
        extractedParts.push(text);
      }
    }
    
    // Also try to extract text from content streams with Tj/TJ operators
    const tjMatches = pdfString.matchAll(/\[(.*?)\]\s*TJ/g);
    for (const match of tjMatches) {
      const content = match[1];
      const textParts = content.matchAll(/\((.*?)\)/g);
      for (const textMatch of textParts) {
        const text = textMatch[1];
        if (text && /^[\x20-\x7E\s]+$/.test(text)) {
          extractedParts.push(text);
        }
      }
    }
    
    textContent = extractedParts.join(" ");
    
    // Clean up the text
    textContent = textContent
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E\n]/g, "")
      .trim();

    if (textContent.length < 50) {
      // If basic extraction failed, the PDF might be image-based
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Could not extract text from PDF. The file may be image-based or protected. Please copy and paste the text content instead." 
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
