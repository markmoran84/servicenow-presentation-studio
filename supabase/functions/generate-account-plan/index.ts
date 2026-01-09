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

    const systemPrompt = `You are an expert enterprise account strategist for ServiceNow. Your role is to analyze raw account data and produce a polished, strategic account plan.

You will receive raw input data about a customer account and must synthesize it into enterprise-grade strategic content.

CRITICAL RULES:
1. Be specific and actionable - avoid generic platitudes
2. Reference the customer's actual situation, not hypotheticals
3. Use executive-level language appropriate for C-suite presentations
4. Connect insights to ServiceNow's value proposition
5. Quantify impact where possible
6. Identify strategic tensions and how ServiceNow resolves them

OUTPUT FORMAT: Return a JSON object with the enhanced account plan content.`;

    const userPrompt = `Analyze this account data and generate an enterprise-grade strategic account plan:

ACCOUNT: ${accountData.basics?.accountName || "Unknown"}
VISION: ${accountData.basics?.visionStatement || "Not defined"}

FINANCIAL CONTEXT:
- Revenue: ${accountData.financial?.customerRevenue || "Unknown"}
- Growth: ${accountData.financial?.growthRate || "Unknown"}
- EBIT Margin: ${accountData.financial?.marginEBIT || "Unknown"}
- Cost Pressures: ${accountData.financial?.costPressureAreas || "Unknown"}
- Strategic Investments: ${accountData.financial?.strategicInvestmentAreas || "Unknown"}

SERVICENOW POSITION:
- Current Contract: ${accountData.basics?.currentContractValue || "Unknown"}
- FY Target: ${accountData.basics?.nextFYAmbition || "Unknown"}
- 3-Year Target: ${accountData.basics?.threeYearAmbition || "Unknown"}
- Renewal Date: ${accountData.basics?.renewalDates || "Unknown"}

CORPORATE STRATEGY:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL STRATEGY:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION THEMES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

PAIN POINTS:
${JSON.stringify(accountData.painPoints?.painPoints || [], null, 2)}

SWOT ANALYSIS:
- Strengths: ${JSON.stringify(accountData.swot?.strengths || [])}
- Weaknesses: ${JSON.stringify(accountData.swot?.weaknesses || [])}
- Opportunities: ${JSON.stringify(accountData.swot?.opportunities || [])}
- Threats: ${JSON.stringify(accountData.swot?.threats || [])}

HISTORY:
- Last Plan: ${accountData.history?.lastPlanSummary || "Unknown"}
- What Didn't Work: ${accountData.history?.whatDidNotWork || "Unknown"}
- Prior Attempts: ${accountData.history?.priorTransformationAttempts || "Unknown"}

EXECUTIVE ENGAGEMENT:
- Sponsors: ${JSON.stringify(accountData.engagement?.knownExecutiveSponsors || [])}
- Events: ${JSON.stringify(accountData.engagement?.plannedExecutiveEvents || [])}

ANNUAL REPORT DATA:
${JSON.stringify(accountData.annualReport || {}, null, 2)}

Generate a comprehensive, enterprise-grade account plan with the following sections:

1. executiveSummaryNarrative: A compelling 3-4 sentence executive summary that synthesizes the strategic opportunity
2. executiveSummaryPillars: Array of 4 strategic pillars (each with "icon" as one of "network"|"customer"|"technology"|"efficiency", "keyword", "title", "tagline", "description", "outcome")
3. strategicObservations: Array of 4 strategic observations (each with "heading" and "detail")
4. strategicImplications: Array of 4 implications for action (each with "heading" and "detail")
5. strategicTensions: Array of 4 strategic tensions (each with "heading", "detail", "leftLabel", "leftDescription", "rightLabel", "rightDescription", "dilemma" - representing opposing forces the customer must balance)
6. strategicInsights: Array of 4 key insights (each with "heading" and "detail")
7. valueHypotheses: Array of 4 testable value hypotheses (each with "outcome", "mechanism", "timeframe", "impact")
8. strategicPriorities: Array of 3 must-win priorities (each with "title", "whyNow", "ifWeLose", "winningLooks", "alignment", "color" as gradient like "from-primary to-accent")
9. keyWorkstreams: Array of 3 transformation workstreams (each with "title", "subtitle", "dealStatus", "targetClose", "acv", "steadyStateBenefit", "insight", "people" array with name/role objects)
10. risksMitigations: Array of 4 risks (each with "risk", "mitigation", "level" as High/Medium/Low)
11. roadmapPhases: Array of 3 phases (each with "quarter", "title", "activities" array)
12. engagementStrategy: Object with "executiveAlignment" and "keyForums" arrays
13. successMetrics: Array of 4 metrics (each with "metric", "label", "description")
14. coreValueDrivers: Array of 4 value drivers (each with "title", "description", "outcomes" array of 3 strings, "alignment")
15. aiUseCases: Array of 4 AI use cases (each with "title", "description", "priority" as High/Medium/Low, "status" as "Pilot Ready"|"Discovery"|"Scoped"|"Planned")
16. fy1Retrospective: Object with "focusAreas" (array of 4 objects with "title" and "description"), "keyLessons" (string summarizing what was learned), "lookingAhead" (string about how FY-1 sets up FY+1)
17. customerStrategySynthesis: Object with "narrative" (2-3 sentence synthesis of customer strategy and ServiceNow alignment), "serviceNowAlignment" (array of 4 objects with "customerPriority" and "serviceNowValue" showing how ServiceNow addresses each priority)
18. weeklyUpdateContext: Object with "overallStatus" ("On Track"|"At Risk"|"Blocked"), "keyHighlights" (array of 3 key points for stakeholder update), "criticalActions" (array of 2-3 decisions or actions needed)
19. marketingPlan: Object with "campaigns" (array of 3 campaigns, each with "title", "description", "timeline", "channels" array), "narrative" (2-3 sentences describing overall marketing approach)
20. insight: Object with "headline" (provocative strategic insight headline), "observations" (array of 3 objects with "title" and "detail"), "recommendation" (actionable next step)
21. platformCapabilities: Object with "capabilities" (array of 4 platform capabilities, each with "title", "description", "value" explaining business impact), "narrative" (2-3 sentences on platform strategy)
22. riskOpportunityMatrix: Object with "items" (array of 6 items, each with "title", "type" as "risk"|"opportunity", "impact" as High/Medium/Low, "likelihood" as High/Medium/Low, "mitigation" for risks), "narrative" (summary of risk/opportunity balance)
23. strategicAlignment: Object with "alignments" (array of 4 alignment pairs, each with "customerObjective", "serviceNowCapability", "outcome"), "narrative" (2-3 sentences on strategic fit)

Return ONLY valid JSON, no markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
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
