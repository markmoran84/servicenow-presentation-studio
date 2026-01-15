const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SlideContent {
  slideNumber: number;
  title: string;
  keyPoints: string[];
  visualSuggestion?: string;
  dataHighlight?: string;
  speakerNotes: {
    openingHook: string;
    talkingPoints: string[];
    dataToMention?: string[];
    transitionToNext?: string;
    estimatedDuration: string;
  };
}

interface ImprovedPresentation {
  title: string;
  companyName: string;
  totalSlides: number;
  overallNarrative: string;
  keyThemes: string[];
  slides: SlideContent[];
  closingTips?: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { analysis, originalContent, companyName, industry } = await req.json();

    if (!analysis) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing analysis data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare the context for slide generation
    const slideSuggestions = analysis.slideSuggestions || [];
    const gaps = analysis.gaps || [];
    const webInsights = analysis.webInsights || [];
    const missingSlides = analysis.missingSlides || [];
    const strengths = analysis.strengths || [];

    const prompt = `You are a senior presentation consultant. Based on the analysis of an existing presentation about ${companyName || "a company"} in ${industry || "their industry"}, create an improved version of the presentation as a series of web slides.

ORIGINAL PRESENTATION CONTENT:
${originalContent?.slice(0, 15000) || "Not provided"}

ANALYSIS SUMMARY:
- Overall Score: ${analysis.overallScore}/10
- Assessment: ${analysis.overallAssessment}

STRENGTHS TO MAINTAIN:
${strengths.map((s: any) => `- ${s.title}: ${s.detail}`).join("\n")}

GAPS TO ADDRESS:
${gaps.map((g: any) => `- [${g.priority.toUpperCase()}] ${g.title}: ${g.detail}`).join("\n")}

SLIDE SUGGESTIONS:
${slideSuggestions.map((s: any) => `- ${s.slideTitle}: Current: ${s.currentState} → Suggestion: ${s.suggestion}`).join("\n")}

WEB INSIGHTS TO INCORPORATE:
${webInsights.map((w: any) => `- ${w.insight} → ${w.suggestion}`).join("\n")}

MISSING SLIDES TO ADD:
${missingSlides.map((m: any) => `- ${m.title}: ${m.rationale} (Include: ${m.suggestedContent})`).join("\n")}

Create an improved presentation with 8-15 slides. For each slide, provide:
1. A compelling title
2. 3-5 key bullet points (concise, impactful)
3. A visual suggestion (chart type, image concept, or layout idea)
4. Data highlight if relevant
5. Comprehensive speaker notes including:
   - Opening hook (1 sentence to grab attention)
   - Talking points (detailed notes for the presenter)
   - Data points to mention verbally
   - Transition to next slide
   - Estimated speaking duration

Focus on:
- Addressing all high-priority gaps
- Incorporating web research insights
- Adding the missing slides
- Maintaining the identified strengths
- Creating a cohesive narrative flow
- Making each slide visually impactful`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert presentation consultant who creates compelling, executive-ready presentations with detailed speaker notes.",
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
              description: "Generate an improved presentation with slides and speaker notes",
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
                    description: "The overarching story arc of the presentation",
                  },
                  keyThemes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key themes running through the presentation",
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
      throw new Error("No slide data generated");
    }

    let improvedPresentation: ImprovedPresentation;
    try {
      improvedPresentation = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Failed to parse generated slides");
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: improvedPresentation,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating improved slides:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate improved slides",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
