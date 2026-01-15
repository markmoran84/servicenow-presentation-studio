import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, fileType } = await req.json();

    if (!filePath) {
      return new Response(
        JSON.stringify({ success: false, error: "File path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Storage not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the file from storage
    console.log("Downloading file:", filePath);
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

    // Get file extension
    const extension = filePath.split('.').pop()?.toLowerCase() || fileType || '';
    console.log("File extension:", extension);

    let extractedText = "";
    let slideCount = 0;

    if (extension === 'pptx') {
      // Parse PPTX file
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Use JSZip to extract PPTX contents (PPTX is a ZIP file)
      const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default;
      const zip = await JSZip.loadAsync(uint8Array);
      
      const slideTexts: string[] = [];
      
      // Get all slide files
      const slideFiles = Object.keys(zip.files)
        .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
        .sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0');
          const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0');
          return numA - numB;
        });
      
      slideCount = slideFiles.length;
      console.log(`Found ${slideCount} slides`);
      
      for (const slideFile of slideFiles) {
        const content = await zip.file(slideFile)?.async('string');
        if (content) {
          // Extract text from XML - simple regex extraction
          const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          const slideText = textMatches
            .map(match => match.replace(/<a:t>([^<]*)<\/a:t>/, '$1'))
            .filter(text => text.trim().length > 0)
            .join(' ');
          
          if (slideText.trim()) {
            const slideNum = slideFile.match(/slide(\d+)\.xml/)?.[1] || '?';
            slideTexts.push(`[Slide ${slideNum}]\n${slideText}`);
          }
        }
      }
      
      // Also try to get notes
      const noteFiles = Object.keys(zip.files)
        .filter(name => name.match(/ppt\/notesSlides\/notesSlide\d+\.xml$/));
      
      for (const noteFile of noteFiles) {
        const content = await zip.file(noteFile)?.async('string');
        if (content) {
          const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          const noteText = textMatches
            .map(match => match.replace(/<a:t>([^<]*)<\/a:t>/, '$1'))
            .filter(text => text.trim().length > 0 && !text.match(/^\d+$/)) // Filter out slide numbers
            .join(' ');
          
          if (noteText.trim() && noteText.length > 20) {
            const slideNum = noteFile.match(/notesSlide(\d+)\.xml/)?.[1] || '?';
            slideTexts.push(`[Notes for Slide ${slideNum}]\n${noteText}`);
          }
        }
      }
      
      extractedText = slideTexts.join('\n\n');
      
    } else if (extension === 'pdf') {
      // For PDF, use the existing parse-pdf logic
      return new Response(
        JSON.stringify({ success: false, error: "Use parse-pdf endpoint for PDF files" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported file type: ${extension}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Could not extract meaningful text from the document. The file may be image-based or corrupted." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Extracted ${extractedText.length} characters from ${slideCount} slides`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: extractedText.slice(0, 100000), // Limit content size
        slideCount
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Document parsing error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to parse document" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
