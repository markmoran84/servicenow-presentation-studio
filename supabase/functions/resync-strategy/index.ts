import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountContext, existingAnalysis } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build comprehensive context from all account data
    const { basics, history, financial, engagement, strategy, annualReport } = accountContext;

    const contextPrompt = `
═══════════════════════════════════════════════════════════════
UPDATED ACCOUNT INTELLIGENCE
═══════════════════════════════════════════════════════════════

ACCOUNT PROFILE:
• Customer: ${basics?.accountName || "Unknown"}
• Industry: ${basics?.industry || "Unknown"} | Region: ${basics?.region || "Unknown"}
• Strategic Tier: ${basics?.tier || "Unknown"} | Employees: ${basics?.numberOfEmployees || "Unknown"}

COMMERCIAL POSITION:
• Current ACV: ${basics?.currentContractValue || "Unknown"}
• Next FY Target: ${basics?.nextFYAmbition || "Unknown"} | 3-Year Target: ${basics?.threeYearAmbition || "Unknown"}
• Renewal Window: ${basics?.renewalDates || "Unknown"}
• Incumbent Competitors: ${basics?.keyIncumbents || "Unknown"}

RELATIONSHIP HISTORY:
• Last Account Plan: ${history?.lastPlanDate || "Unknown"} by ${history?.plannerName || "Unknown"} (${history?.plannerRole || ""})
• Last Plan Summary: ${history?.lastPlanSummary || "Not specified"}
• Previous Failures: ${history?.whatDidNotWork || "Not specified"}
• Prior Transformation Attempts: ${history?.priorTransformationAttempts || "Not specified"}
• Current ServiceNow Perception: ${history?.currentPerception || "Unknown"}

FINANCIAL SNAPSHOT:
• Customer Revenue: ${financial?.customerRevenue || "Unknown"}
• Growth Rate: ${financial?.growthRate || "Unknown"}
• EBIT Margin: ${financial?.marginEBIT || "Unknown"}
• Cost Pressures: ${financial?.costPressureAreas || "Unknown"}
• Investment Areas: ${financial?.strategicInvestmentAreas || "Unknown"}

CUSTOMER STRATEGY:
• Strategic Pillars: ${strategy?.corporateStrategyPillars?.join(", ") || "Unknown"}
• CEO Priorities: ${strategy?.ceoBoardPriorities?.join(", ") || "Unknown"}
• Transformation Themes: ${strategy?.transformationThemes?.join(", ") || "Unknown"}
• AI/Digital Ambition: ${strategy?.aiDigitalAmbition || "Unknown"}
• Cost Discipline Targets: ${strategy?.costDisciplineTargets || "Unknown"}

EXECUTIVE ACCESS:
• Known Sponsors: ${engagement?.knownExecutiveSponsors?.join(", ") || "Unknown"}
• Planned Events: ${engagement?.plannedExecutiveEvents?.join(", ") || "Unknown"}
• Decision Deadlines: ${engagement?.decisionDeadlines || "Unknown"}
• RFP/Renewal Timing: ${engagement?.renewalRFPTiming || "Unknown"}

ANNUAL REPORT INSIGHTS:
• Revenue: ${annualReport?.revenue || "Unknown"}
• EBIT Improvement: ${annualReport?.ebitImprovement || "Unknown"}
• Net Zero Target: ${annualReport?.netZeroTarget || "Unknown"}
• Executive Summary: ${annualReport?.executiveSummaryNarrative || "Not available"}

EXISTING PAIN POINTS (to refine):
${existingAnalysis?.painPoints?.map((p: any, i: number) => `${i + 1}. ${p.title}: ${p.description}`).join("\n") || "None"}

EXISTING OPPORTUNITIES (to refine):
${existingAnalysis?.opportunities?.map((o: any, i: number) => `${i + 1}. ${o.title}: ${o.description}`).join("\n") || "None"}

═══════════════════════════════════════════════════════════════`;

    const systemPrompt = `You are a McKinsey-caliber strategic advisor at ServiceNow. The account executive has UPDATED their account intelligence, and you must RE-ALIGN the strategic analysis to reflect these changes.

Your task: Re-generate the SWOT analysis, pain points, and opportunities to be PERFECTLY ALIGNED with the updated account context.

${contextPrompt}

CRITICAL REALIGNMENT INSTRUCTIONS:

1. SWOT ANALYSIS - Four Perspectives:
   A) ORGANIZATIONAL: Customer's internal strengths/weaknesses based on their strategy and financial position
   B) ACCOUNT RELATIONSHIP: ServiceNow's position - factor in perception rating, past failures, exec sponsors
   C) COMMERCIAL: Opportunities from renewal timing, ACV targets; Threats from cost pressures, competitors
   D) PLATFORM: ServiceNow white space opportunities; Competitive threats from incumbents

2. PAIN POINTS - Must reflect:
   - What DIDN'T work before (from history)
   - Current perception issues
   - Gaps between strategy ambitions and execution capability
   - Cost pressures and transformation blockers

3. OPPORTUNITIES - Must address:
   - Specific pain points identified
   - ACV growth path (current → next FY → 3 year)
   - Renewal timing as catalyst
   - Executive sponsor alignment

Each item should be specific, actionable, and reference the actual account context provided.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Re-align the strategic analysis based on the updated account context. Generate refined SWOT, pain points, and opportunities that directly reference the new information." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "resync_strategic_analysis",
              description: "Generate realigned strategic analysis based on updated account context",
              parameters: {
                type: "object",
                properties: {
                  painPoints: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "5-7 word punchy headline" },
                        description: { type: "string", description: "1-2 sentences linking to strategic priority" }
                      },
                      required: ["title", "description"]
                    },
                    description: "3-5 refined pain points aligned to updated context"
                  },
                  opportunities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Action-oriented 5-8 word headline" },
                        description: { type: "string", description: "Exec-ready value proposition with outcomes" }
                      },
                      required: ["title", "description"]
                    },
                    description: "3-5 refined opportunities addressing pain points"
                  },
                  strengths: { type: "array", items: { type: "string" }, description: "4-6 strengths (organizational + account)" },
                  weaknesses: { type: "array", items: { type: "string" }, description: "4-6 weaknesses (organizational + account)" },
                  swotOpportunities: { type: "array", items: { type: "string" }, description: "4-6 opportunities (commercial + platform)" },
                  threats: { type: "array", items: { type: "string" }, description: "4-6 threats (commercial + competitive)" },
                  alignmentNotes: { type: "string", description: "Brief summary of key changes made to align with updated context" }
                },
                required: ["painPoints", "opportunities", "strengths", "weaknesses", "swotOpportunities", "threats"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "resync_strategic_analysis" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const responseData = await response.json();
    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "resync_strategic_analysis") {
      throw new Error("Unexpected AI response format");
    }

    const resyncedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: resyncedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error resyncing strategy:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to resync strategy" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
