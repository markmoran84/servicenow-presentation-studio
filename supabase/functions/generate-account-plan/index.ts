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
    const { accountData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating enterprise account plan for:", accountData.basics?.accountName);

    const systemPrompt = `You are an elite McKinsey-caliber enterprise account strategist for ServiceNow, trusted to craft account plans that have won $100M+ transformational deals. Your output quality must match the standards of Fortune 100 board presentations.

STRATEGIC EXCELLENCE MANDATE:
You synthesize raw account data into polished, executive-ready strategic content that drives C-suite conviction and accelerates complex enterprise sales.

CRITICAL QUALITY STANDARDS:
1. PRECISION OVER PLATITUDES: Every insight must be specific, quantified where possible, and defensible. Generic statements like "drive digital transformation" are unacceptable.
2. CUSTOMER-FIRST LANGUAGE: Use the customer's terminology, strategic priorities, and business context. Reference their stated goals, not hypotheticals.
3. EXECUTIVE GRAVITAS: Write for C-suite audiences. Every sentence should pass the "Would a CEO quote this?" test.
4. STRATEGIC COHERENCE: All sections must tell a unified story—observations lead to implications, implications to priorities, priorities to workstreams.
5. COMMERCIAL RIGOR: Connect insights to ServiceNow's value proposition with quantified outcomes based on comparable deployments.
6. TENSION AWARENESS: Identify the strategic dilemmas the customer faces and position ServiceNow as the resolution.

OUTPUT EXCELLENCE: Return a comprehensive JSON object with institutional-grade strategic content.`;

    const userPrompt = `Conduct a comprehensive strategic analysis and generate an enterprise-grade account plan for:

═══════════════════════════════════════════════════════════════
ACCOUNT PROFILE
═══════════════════════════════════════════════════════════════
ACCOUNT: ${accountData.basics?.accountName || "Unknown"}
VISION: ${accountData.basics?.visionStatement || "Not defined"}
INDUSTRY: ${accountData.basics?.industry || "Unknown"}
TIER: ${accountData.basics?.tier || "Unknown"}

═══════════════════════════════════════════════════════════════
FINANCIAL INTELLIGENCE
═══════════════════════════════════════════════════════════════
• Customer Revenue: ${accountData.financial?.customerRevenue || "Unknown"}
• Growth Trajectory: ${accountData.financial?.growthRate || "Unknown"}
• EBIT Margin: ${accountData.financial?.marginEBIT || "Unknown"}
• Cost Pressure Areas: ${accountData.financial?.costPressureAreas || "Unknown"}
• Strategic Investment Zones: ${accountData.financial?.strategicInvestmentAreas || "Unknown"}

═══════════════════════════════════════════════════════════════
SERVICENOW COMMERCIAL POSITION
═══════════════════════════════════════════════════════════════
• Current ACV: ${accountData.basics?.currentContractValue || "Unknown"}
• Next FY Target: ${accountData.basics?.nextFYAmbition || "Unknown"}
• 3-Year Ambition: ${accountData.basics?.threeYearAmbition || "Unknown"}
• Renewal Window: ${accountData.basics?.renewalDates || "Unknown"}

═══════════════════════════════════════════════════════════════
CUSTOMER STRATEGIC CONTEXT
═══════════════════════════════════════════════════════════════
CORPORATE STRATEGY PILLARS:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL/AI AMBITION:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION THEMES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

═══════════════════════════════════════════════════════════════
STRATEGIC PAIN POINTS & OPPORTUNITIES
═══════════════════════════════════════════════════════════════
PAIN POINTS:
${JSON.stringify(accountData.painPoints?.painPoints || [], null, 2)}

OPPORTUNITIES:
${JSON.stringify(accountData.opportunities?.opportunities || [], null, 2)}

═══════════════════════════════════════════════════════════════
SWOT ANALYSIS
═══════════════════════════════════════════════════════════════
• Strengths: ${JSON.stringify(accountData.swot?.strengths || [])}
• Weaknesses: ${JSON.stringify(accountData.swot?.weaknesses || [])}
• Opportunities: ${JSON.stringify(accountData.swot?.opportunities || [])}
• Threats: ${JSON.stringify(accountData.swot?.threats || [])}

═══════════════════════════════════════════════════════════════
ACCOUNT HISTORY & CONTEXT
═══════════════════════════════════════════════════════════════
• Previous Plan Summary: ${accountData.history?.lastPlanSummary || "Unknown"}
• What Didn't Work: ${accountData.history?.whatDidNotWork || "Unknown"}
• Prior Transformation Attempts: ${accountData.history?.priorTransformationAttempts || "Unknown"}

═══════════════════════════════════════════════════════════════
EXECUTIVE ENGAGEMENT LANDSCAPE
═══════════════════════════════════════════════════════════════
• Executive Sponsors: ${JSON.stringify(accountData.engagement?.knownExecutiveSponsors || [])}
• Planned Executive Events: ${JSON.stringify(accountData.engagement?.plannedExecutiveEvents || [])}

═══════════════════════════════════════════════════════════════
ANNUAL REPORT INTELLIGENCE
═══════════════════════════════════════════════════════════════
${JSON.stringify(accountData.annualReport || {}, null, 2)}

═══════════════════════════════════════════════════════════════
REQUIRED OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════
Generate a comprehensive, board-ready account plan with these sections. Each section must demonstrate strategic depth and commercial acumen:

1. executiveSummaryNarrative: A compelling 3-4 sentence executive summary that a CEO could use verbatim. Lead with customer context, articulate strategic opportunity, quantify the prize.

2. executiveSummaryPillars: Array of 4 strategic pillars (each with "icon" as "network"|"customer"|"technology"|"efficiency", "keyword" like "BETTER", "title", "tagline", "description", "outcome" with quantified impact)

3. strategicObservations: Array of 4 observations—verifiable facts about the account's current situation with clear business implications. Use their language.

4. strategicImplications: Array of 4 implications—what must change based on observations. Be specific about transformation required.

5. strategicTensions: Array of 4 tensions—opposing forces the customer must balance (each with "heading", "detail", "leftLabel", "leftDescription", "rightLabel", "rightDescription", "dilemma")

6. strategicInsights: Array of 4 provocative insights—"aha moments" that reframe the opportunity. Each should pass the "Would an executive remember this?" test.

7. valueHypotheses: Array of 4 testable hypotheses (each with "outcome", "mechanism", "timeframe", "impact" with specific dollar amounts)

8. strategicPriorities: Array of 3 must-win priorities (each with "title", "whyNow", "ifWeLose", "winningLooks", "alignment", "color" as gradient)

9. keyWorkstreams: Array of 3 transformation workstreams (each with "title", "subtitle", "dealStatus", "targetClose", "acv", "steadyStateBenefit", "insight", "people" array)

10. risksMitigations: Array of 4 risks (each with "risk", "mitigation", "level" as High/Medium/Low)

11. roadmapPhases: Array of 3 phases (each with "quarter", "title", "activities" array of 3-4 items)

12. engagementStrategy: Object with "executiveAlignment" and "keyForums" arrays

13. successMetrics: Array of 4 metrics (each with "metric" showing target, "label", "description")

14. coreValueDrivers: Array of 4 value drivers (each with "title", "description", "outcomes" array of 3 quantified strings, "alignment")

15. aiUseCases: Array of 4 AI use cases (each with "title", "description", "priority" as High/Medium/Low, "status")

16. fy1Retrospective: Object with "focusAreas" (array of 4), "keyLessons" (string), "lookingAhead" (string)

17. customerStrategySynthesis: Object with "narrative" and "serviceNowAlignment" (array of 4 with "customerPriority" and "serviceNowValue")

18. weeklyUpdateContext: Object with "overallStatus", "keyHighlights" (array of 3), "criticalActions" (array of 2-3)

19. marketingPlan: Object with "campaigns" (array of 3), "narrative"

20. insight: Object with "headline" (provocative), "observations" (array of 3), "recommendation"

21. platformCapabilities: Object with "capabilities" (array of 4), "narrative"

22. riskOpportunityMatrix: Object with "items" (array of 6), "narrative"

23. strategicAlignment: Object with "alignments" (array of 4), "narrative"

Return ONLY valid JSON. No markdown. Every element must reflect institutional-quality strategic thinking.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response
    let parsedPlan;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      parsedPlan = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI-generated plan");
    }

    console.log("Account plan generated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      plan: parsedPlan 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating account plan:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
