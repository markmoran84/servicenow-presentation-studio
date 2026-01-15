const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { analysis, originalContent, companyName, industry, currentAccountData } = await req.json();

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

    const prompt = `You are a senior presentation consultant for ServiceNow. Based on the analysis of an existing presentation about ${companyName || "a company"} in ${industry || "their industry"}, generate IMPROVED CONTENT that will populate an existing account plan template.

ORIGINAL PRESENTATION CONTENT:
${originalContent?.slice(0, 12000) || "Not provided"}

CURRENT ACCOUNT DATA (if available):
${JSON.stringify(currentAccountData || {}, null, 2).slice(0, 5000)}

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

Your task is to generate IMPROVED account plan content that:
1. Addresses all high-priority gaps identified
2. Incorporates web research insights
3. Maintains the identified strengths
4. Creates a cohesive strategic narrative

The output will populate existing slide templates, so generate content that fits these sections:
- Executive Summary (narrative + 4 strategic pillars)
- Strategic Observations, Implications, Tensions, Insights
- Value Hypotheses (4 testable hypotheses)
- Strategic Priorities (3 must-win priorities)
- Key Workstreams (initiatives with ACV targets)
- Risks & Mitigations
- Roadmap Phases
- Success Metrics
- Core Value Drivers
- AI Use Cases`;

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
            content: "You are an elite McKinsey-caliber enterprise account strategist for ServiceNow. Generate comprehensive, board-ready strategic content.",
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
              name: "generate_improved_account_plan",
              description: "Generate improved account plan content to populate existing slide templates",
              parameters: {
                type: "object",
                properties: {
                  executiveSummaryNarrative: {
                    type: "string",
                    description: "A compelling 3-4 sentence executive summary",
                  },
                  executiveSummaryPillars: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { type: "string", enum: ["network", "customer", "technology", "efficiency"] },
                        keyword: { type: "string" },
                        title: { type: "string" },
                        tagline: { type: "string" },
                        description: { type: "string" },
                        outcome: { type: "string" },
                      },
                      required: ["icon", "keyword", "title", "tagline", "description", "outcome"],
                    },
                    description: "4 strategic pillars",
                  },
                  strategicObservations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        detail: { type: "string" },
                      },
                      required: ["heading", "detail"],
                    },
                    description: "4 strategic observations",
                  },
                  strategicImplications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        detail: { type: "string" },
                      },
                      required: ["heading", "detail"],
                    },
                    description: "4 strategic implications",
                  },
                  strategicTensions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        detail: { type: "string" },
                        leftLabel: { type: "string" },
                        leftDescription: { type: "string" },
                        rightLabel: { type: "string" },
                        rightDescription: { type: "string" },
                        dilemma: { type: "string" },
                      },
                      required: ["heading", "detail", "leftLabel", "leftDescription", "rightLabel", "rightDescription", "dilemma"],
                    },
                    description: "4 strategic tensions",
                  },
                  strategicInsights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        heading: { type: "string" },
                        detail: { type: "string" },
                      },
                      required: ["heading", "detail"],
                    },
                    description: "4 strategic insights",
                  },
                  valueHypotheses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        outcome: { type: "string" },
                        mechanism: { type: "string" },
                        timeframe: { type: "string" },
                        impact: { type: "string" },
                      },
                      required: ["outcome", "mechanism", "timeframe", "impact"],
                    },
                    description: "4 value hypotheses",
                  },
                  strategicPriorities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        whyNow: { type: "string" },
                        ifWeLose: { type: "string" },
                        winningLooks: { type: "string" },
                        alignment: { type: "string" },
                        color: { type: "string" },
                      },
                      required: ["title", "whyNow", "ifWeLose"],
                    },
                    description: "3 strategic priorities",
                  },
                  keyWorkstreams: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        subtitle: { type: "string" },
                        dealStatus: { type: "string" },
                        targetClose: { type: "string" },
                        acv: { type: "string" },
                        steadyStateBenefit: { type: "string" },
                        insight: { type: "string" },
                        people: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              role: { type: "string" },
                            },
                          },
                        },
                      },
                      required: ["title", "targetClose", "acv", "insight"],
                    },
                    description: "3-5 key workstreams",
                  },
                  risksMitigations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        risk: { type: "string" },
                        mitigation: { type: "string" },
                        level: { type: "string" },
                      },
                      required: ["risk", "mitigation", "level"],
                    },
                    description: "4 risks with mitigations",
                  },
                  roadmapPhases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        quarter: { type: "string" },
                        title: { type: "string" },
                        activities: { type: "array", items: { type: "string" } },
                      },
                      required: ["quarter", "title", "activities"],
                    },
                    description: "3 roadmap phases",
                  },
                  engagementStrategy: {
                    type: "object",
                    properties: {
                      executiveAlignment: { type: "array", items: { type: "string" } },
                      keyForums: { type: "array", items: { type: "string" } },
                    },
                  },
                  successMetrics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        metric: { type: "string" },
                        label: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["metric", "label", "description"],
                    },
                    description: "4 success metrics",
                  },
                  coreValueDrivers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        outcomes: { type: "array", items: { type: "string" } },
                        alignment: { type: "string" },
                      },
                      required: ["title", "description", "outcomes", "alignment"],
                    },
                    description: "4 core value drivers",
                  },
                  aiUseCases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { type: "string" },
                        status: { type: "string" },
                      },
                      required: ["title", "description", "priority", "status"],
                    },
                    description: "4 AI use cases",
                  },
                  fy1Retrospective: {
                    type: "object",
                    properties: {
                      focusAreas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            description: { type: "string" },
                          },
                        },
                      },
                      keyLessons: { type: "string" },
                      lookingAhead: { type: "string" },
                    },
                  },
                  customerStrategySynthesis: {
                    type: "object",
                    properties: {
                      narrative: { type: "string" },
                      serviceNowAlignment: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            customerPriority: { type: "string" },
                            serviceNowValue: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
                required: [
                  "executiveSummaryNarrative",
                  "executiveSummaryPillars",
                  "strategicObservations",
                  "strategicImplications",
                  "strategicPriorities",
                  "keyWorkstreams",
                  "risksMitigations",
                  "successMetrics",
                ],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_improved_account_plan" } },
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
      throw new Error("No plan data generated");
    }

    let improvedPlan;
    try {
      improvedPlan = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Failed to parse generated plan");
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: improvedPlan,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating improved plan:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate improved plan",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
