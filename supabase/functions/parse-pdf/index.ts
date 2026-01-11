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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

    // Convert blob to base64 for AI processing
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log("PDF downloaded, size:", arrayBuffer.byteLength, "bytes");

    // Use Gemini's vision capabilities to extract text from PDF
    // Gemini 2.5 Pro has native PDF understanding
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a precise document text extractor. Your task is to extract ALL text content from this PDF document, preserving the structure and information.

EXTRACTION INSTRUCTIONS:
1. Extract ALL text content from every page of the PDF
2. Preserve the document structure (headings, paragraphs, lists, tables)
3. Include ALL financial figures, percentages, and metrics
4. Capture CEO letters, strategic statements, and executive commentary word-for-word
5. Include table data in a readable format
6. Preserve company names, executive names, and titles exactly as written
7. Extract mission statements, vision statements, and strategic priorities
8. Include any footnotes or annotations that contain important data
9. DO NOT summarize or paraphrase - extract the ACTUAL TEXT
10. If text is in tables, format as: "Column1: Value1 | Column2: Value2"

OUTPUT FORMAT:
Return the complete extracted text, organized by section/page when possible. Use clear section headers where the document has them.`
          },
          {
            role: "user",
            content: [
              {
                type: "file",
                file: {
                  filename: filePath,
                  file_data: `data:application/pdf;base64,${base64Content}`
                }
              },
              {
                type: "text",
                text: "Extract ALL text content from this PDF document. Include every piece of text, every number, every table, every heading. This is an annual report and I need COMPLETE extraction for strategic analysis."
              }
            ]
          }
        ],
        max_tokens: 100000
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI extraction failed:", response.status, errorText);
      throw new Error(`AI extraction failed: ${response.status}`);
    }

    const aiData = await response.json();
    const extractedText = aiData.choices?.[0]?.message?.content || "";

    if (!extractedText || extractedText.length < 100) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Could not extract sufficient text from PDF. The file may be image-based, corrupted, or protected." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("PDF text extracted via AI, length:", extractedText.length);

    // Clean up the uploaded file
    await supabase.storage.from("annual-reports").remove([filePath]);

    return new Response(
      JSON.stringify({ success: true, content: extractedText }),
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
