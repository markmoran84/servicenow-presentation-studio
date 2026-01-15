const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { analysis, originalContent, companyName, industry, slideCount } = await req.json();

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
    const slides: { number: number; content: string }[] = [];
    let match;
    while ((match = slideRegex.exec(originalContent)) !== null) {
      slides.push({
        number: parseInt(match[1], 10),
        content: match[2].trim(),
      });
    }

    // If no slides found, create placeholders
    const effectiveSlideCount = slides.length > 0 ? slides.length : (slideCount || 10);

    const slideSuggestions = analysis.slideSuggestions || [];
    const gaps = analysis.gaps || [];
    const webInsights = analysis.webInsights || [];
    const strengths = analysis.strengths || [];

    const prompt = `You are a senior presentation consultant. Based on the analysis of an existing PowerPoint presentation about ${companyName || "a company"} in ${industry || "their industry"}, generate IMPROVED SLIDE CONTENT that maintains the EXACT same slide order and structure as the original.

ORIGINAL PRESENTATION HAS ${effectiveSlideCount} SLIDES:
${slides.map(s => `[Slide ${s.number}]: ${s.content.slice(0, 500)}`).join("\n\n")}

ANALYSIS:
- Overall Score: ${analysis.overallScore}/10
- Assessment: ${analysis.overallAssessment}

STRENGTHS TO MAINTAIN:
${strengths.map((s: { title: string; detail: string }) => `- ${s.title}: ${s.detail}`).join("\n")}

GAPS TO ADDRESS:
${gaps.map((g: { priority: string; title: string; detail: string }) => `- [${g.priority.toUpperCase()}] ${g.title}: ${g.detail}`).join("\n")}

SLIDE SUGGESTIONS:
${slideSuggestions.map((s: { slideTitle: string; currentState: string; suggestion: string }) => `- ${s.slideTitle}: ${s.suggestion}`).join("\n")}

WEB INSIGHTS:
${webInsights.map((w: { insight: string; suggestion: string }) => `- ${w.insight}`).join("\n")}

Generate improved content for EACH of the ${effectiveSlideCount} slides. Maintain the original slide order and purpose, but enhance the content based on the analysis. Each slide should have:
- A clear, impactful title
- 3-5 key bullet points (enhanced based on analysis)
- A visual suggestion
- A data highlight (if applicable)
- Speaker notes with opening hook, talking points, and transition`;

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
            content: "You are an elite presentation strategist. Generate improved slide content that maintains the original structure while addressing identified gaps.",
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
              name: "generate_improved_presentation",
              description: "Generate improved presentation slides matching the original structure",
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
                        title: { type: "string" },
                        keyPoints: {
                          type: "array",
                          items: { type: "string" },
                          description: "3-5 key bullet points",
                        },
                        visualSuggestion: { type: "string" },
                        dataHighlight: { type: "string" },
                        speakerNotes: {
                          type: "object",
                          properties: {
                            openingHook: { type: "string" },
                            talkingPoints: {
                              type: "array",
                              items: { type: "string" },
                            },
                            dataToMention: {
                              type: "array",
                              items: { type: "string" },
                            },
                            transitionToNext: { type: "string" },
                            estimatedDuration: { type: "string" },
                          },
                          required: ["openingHook", "talkingPoints", "estimatedDuration"],
                        },
                      },
                      required: ["slideNumber", "title", "keyPoints", "speakerNotes"],
                    },
                    description: `Array of ${effectiveSlideCount} improved slides`,
                  },
                  closingTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "Tips for delivering the presentation",
                  },
                },
                required: ["title", "companyName", "totalSlides", "overallNarrative", "keyThemes", "slides"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_improved_presentation" } },
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

    let improvedPresentation;
    try {
      improvedPresentation = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Failed to parse generated presentation");
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: improvedPresentation,
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
