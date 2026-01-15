const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { analysis, originalContent, companyName, industry, slideCount, extractedSlides } = await req.json();

    if (!analysis || !originalContent) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing analysis or originalContent" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extract slide information from original content
    const slideRegex = /\[Slide (\d+)\]\n([\s\S]*?)(?=\[Slide \d+\]|\[Notes for Slide|\s*$)/g;
    const slides: { number: number; content: string; title?: string }[] = [];
    let match;
    while ((match = slideRegex.exec(originalContent)) !== null) {
      const content = match[2].trim();
      // Try to extract title (first line or first sentence)
      const firstLine = content.split('\n')[0]?.trim() || '';
      slides.push({
        number: parseInt(match[1], 10),
        content,
        title: firstLine.length < 100 ? firstLine : undefined,
      });
    }

    // If we have extracted slides with layout data, include that context
    const hasLayoutData = extractedSlides && Array.isArray(extractedSlides) && extractedSlides.length > 0;

    // Build detailed slide context for each slide
    const slideContexts = slides.map((s, idx) => {
      const layoutInfo = hasLayoutData && extractedSlides[idx] ? extractedSlides[idx] : null;
      let layoutDescription = "";
      
      if (layoutInfo?.layout) {
        const layout = layoutInfo.layout;
        layoutDescription = `
Layout Type: ${layout.layoutType}
Number of shapes/elements: ${layout.shapes?.length || 0}
Has title placeholder: ${layout.shapes?.some((sh: any) => sh.placeholder?.type === 'title') || false}
Has body/content area: ${layout.shapes?.some((sh: any) => sh.placeholder?.type === 'body' || sh.placeholder?.type === 'content') || false}`;
      }
      
      return `
═══════════════════════════════════════
SLIDE ${s.number}${s.title ? ` - "${s.title}"` : ''}
═══════════════════════════════════════
ORIGINAL CONTENT:
${s.content}
${layoutDescription}
`;
    }).join('\n');

    // If no slides found, create placeholders
    const effectiveSlideCount = slides.length > 0 ? slides.length : (slideCount || 10);

    const slideSuggestions = analysis.slideSuggestions || [];
    const gaps = analysis.gaps || [];
    const webInsights = analysis.webInsights || [];
    const strengths = analysis.strengths || [];

    const prompt = `You are a world-class presentation designer and content strategist. Your task is to TRANSFORM this uploaded PowerPoint presentation into a polished, executive-ready deck.

COMPANY CONTEXT:
- Company: ${companyName || "the company"}
- Industry: ${industry || "their industry"}

ANALYSIS FINDINGS:
- Current Score: ${analysis.overallScore}/10
- Assessment: ${analysis.overallAssessment}
- Strengths: ${strengths.map((s: { title: string }) => s.title).join(", ")}
- Gaps to address: ${gaps.map((g: { title: string; detail: string }) => `${g.title}: ${g.detail}`).join("; ")}
- Web research insights: ${webInsights.map((w: { insight: string }) => w.insight).join("; ")}

SLIDE-BY-SLIDE CONTENT TO IMPROVE:
${slideContexts}

═══════════════════════════════════════════════════════════════════════════════
CRITICAL INSTRUCTIONS - READ CAREFULLY:
═══════════════════════════════════════════════════════════════════════════════

1. PRESERVE THE ORIGINAL SLIDE STRUCTURE
   - Keep the same number of slides (${effectiveSlideCount})
   - Maintain the original slide order and general topic flow
   - Each slide should stay focused on its original topic

2. TRANSFORM THE CONTENT - DON'T DESCRIBE IT
   ❌ DON'T write: "Add specific revenue figures"
   ✅ DO write: "$4.2B revenue with 12% YoY growth"
   
   ❌ DON'T write: "Include customer pain points"
   ✅ DO write: "Legacy systems causing 40% operational overhead"
   
   ❌ DON'T write: "Mention strategic priorities"
   ✅ DO write: "Digital transformation to reduce time-to-market by 60%"

3. MAKE EVERY BULLET POINT CONCRETE AND ACTIONABLE
   - Use specific numbers, percentages, dollar amounts
   - Name specific products, technologies, or initiatives
   - Include timeframes and measurable outcomes
   - Reference actual business context from the analysis

4. MATCH THE VISUAL STYLE
   - Keep titles concise (under 8 words)
   - Use parallel structure in bullet points
   - Maintain professional, executive-level language
   - Each slide should have 3-5 key points maximum

5. SPEAKER NOTES SHOULD BE PRESENTER-READY
   - Opening hooks should grab attention
   - Talking points should expand on the slides naturally
   - Include specific data points to mention verbally
   - Provide smooth transitions between slides

Generate THE ACTUAL IMPROVED CONTENT for all ${effectiveSlideCount} slides.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are McKinsey's top presentation strategist. Your job is to REWRITE presentations with actual improved content, not meta-commentary about what to improve.

REMEMBER:
- Write the actual content, not descriptions of content
- Every bullet point must be a complete, polished statement
- Use specific data, metrics, and business context
- Match executive presentation standards
- Never use placeholder language like "Add X" or "Include Y"`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_enhanced_presentation",
              description: "Generate an enhanced presentation with improved content for each slide, maintaining the original structure",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Presentation title",
                  },
                  companyName: {
                    type: "string",
                    description: "Company name",
                  },
                  totalSlides: {
                    type: "number",
                    description: "Total number of slides",
                  },
                  overallNarrative: {
                    type: "string",
                    description: "Overall narrative thread connecting all slides",
                  },
                  keyThemes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key themes across the presentation",
                  },
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        slideNumber: { type: "number" },
                        title: { 
                          type: "string",
                          description: "Concise slide title (under 8 words)"
                        },
                        improvedContent: {
                          type: "object",
                          properties: {
                            title: { type: "string", description: "The improved slide title" },
                            keyPoints: {
                              type: "array",
                              items: { type: "string" },
                              description: "3-5 polished, specific bullet points with actual content (not meta-descriptions)"
                            },
                            dataPoints: {
                              type: "array",
                              items: { type: "string" },
                              description: "Specific metrics, percentages, or figures to highlight"
                            },
                            visualSuggestion: { 
                              type: "string",
                              description: "Specific visual element that would enhance this slide"
                            }
                          },
                          required: ["keyPoints"]
                        },
                        speakerNotes: {
                          type: "object",
                          properties: {
                            openingHook: { type: "string", description: "Attention-grabbing opening line" },
                            talkingPoints: {
                              type: "array",
                              items: { type: "string" },
                              description: "Expanded talking points for the presenter"
                            },
                            dataToMention: {
                              type: "array",
                              items: { type: "string" },
                              description: "Specific data points to mention verbally"
                            },
                            transitionToNext: { type: "string", description: "Smooth transition to next slide" },
                            estimatedDuration: { type: "string", description: "e.g., '2-3 minutes'" },
                          },
                          required: ["openingHook", "talkingPoints", "estimatedDuration"],
                        },
                      },
                      required: ["slideNumber", "title", "improvedContent", "speakerNotes"],
                    },
                    description: `Array of ${effectiveSlideCount} improved slides`,
                  },
                  closingTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "Tips for delivering the presentation effectively",
                  },
                },
                required: ["title", "companyName", "totalSlides", "overallNarrative", "keyThemes", "slides"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_enhanced_presentation" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const aiData = await response.json();

    // Extract the tool call result
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("Unexpected AI response:", JSON.stringify(aiData));
      throw new Error("No presentation data generated");
    }

    let enhancedPresentation;
    try {
      enhancedPresentation = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Failed to parse generated presentation");
    }

    // Merge with extracted layout data if available
    if (hasLayoutData && enhancedPresentation.slides) {
      enhancedPresentation.slides = enhancedPresentation.slides.map((slide: any, idx: number) => {
        const extractedSlide = extractedSlides[idx];
        if (extractedSlide?.layout) {
          return {
            ...slide,
            originalLayout: extractedSlide.layout,
          };
        }
        return slide;
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: enhancedPresentation,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating improved presentation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate improved presentation",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
