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
    const { messages, accountData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from account data
    const accountContext = accountData ? `
## Current Account Data Context

**Account:** ${accountData.basics?.accountName || "Not specified"}
**Industry:** ${accountData.basics?.industry || "Not specified"}
**Region:** ${accountData.basics?.region || "Not specified"}
**Tier:** ${accountData.basics?.tier || "Not specified"}
**Current ACV:** ${accountData.basics?.currentContractValue || "Not specified"}
**Next FY Ambition:** ${accountData.basics?.nextFYAmbition || "Not specified"}

### Corporate Strategy
${accountData.strategy?.corporateStrategy?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

### Digital Strategies
${accountData.strategy?.digitalStrategies?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

### CEO/Board Priorities
${accountData.strategy?.ceoBoardPriorities?.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") || "Not specified"}

### Pain Points
${accountData.painPoints?.painPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join("\n") || "Not specified"}

### Opportunities
${accountData.opportunities?.opportunities?.map((o: any) => `- ${o.title}: ${o.description}`).join("\n") || "Not specified"}

### Big Bets / Key Workstreams
${accountData.accountStrategy?.bigBets?.map((b: any) => `- ${b.title}: ${b.subtitle} (${b.dealStatus})`).join("\n") || "Not specified"}

### SWOT
- Strengths: ${accountData.swot?.strengths?.join(", ") || "Not specified"}
- Weaknesses: ${accountData.swot?.weaknesses?.join(", ") || "Not specified"}
- Opportunities: ${accountData.swot?.opportunities?.join(", ") || "Not specified"}
- Threats: ${accountData.swot?.threats?.join(", ") || "Not specified"}

### Financial Snapshot
- Revenue: ${accountData.financial?.customerRevenue || "Not specified"}
- Growth Rate: ${accountData.financial?.growthRate || "Not specified"}
- EBIT Margin: ${accountData.financial?.marginEBIT || "Not specified"}

### Annual Report Highlights
${accountData.annualReport?.executiveSummaryNarrative || "Not available"}

### Vision Statement
${accountData.basics?.visionStatement || "Not specified"}
` : "";

    const systemPrompt = `You are an AI assistant helping with enterprise account planning. You have access to the current account data and can help users:

1. **Query Information**: Answer questions about the account, strategies, pain points, opportunities, etc.
2. **Generate Content**: Create or improve text for any field in the account plan.
3. **Provide Insights**: Offer strategic insights and recommendations based on the data.
4. **Draft Suggestions**: When asked to create content for a specific field, provide well-structured, professional content.
5. **Populate Fields**: When a user asks you to populate, update, add, or set content for a specific field, you MUST include a structured command block.

## CRITICAL: Field Population Commands

When the user asks to populate, add, set, update, or apply content to any form field, you MUST include a JSON command block in your response using this exact format:

\`\`\`fieldupdate
{
  "section": "basics|history|financial|strategy|painPoints|opportunities|engagement|accountStrategy|swot|annualReport|businessModel",
  "field": "field_name",
  "value": "the value to set" or ["array", "of", "values"] or [{"title": "...", "description": "..."}],
  "action": "set|append|replace"
}
\`\`\`

### Field Mapping Reference:
- **basics**: accountName, industry, region, tier, numberOfEmployees, currentContractValue, nextFYAmbition, threeYearAmbition, renewalDates, visionStatement
- **history**: lastPlanDate, plannerName, plannerRole, lastPlanSummary, whatDidNotWork, priorTransformationAttempts, currentPerception
- **financial**: customerRevenue, growthRate, marginEBIT, costPressureAreas, strategicInvestmentAreas
- **strategy**: corporateStrategy (array of {title, description}), digitalStrategies (array), ceoBoardPriorities (array), transformationThemes (array)
- **painPoints**: painPoints (array of {title, description})
- **opportunities**: opportunities (array of {title, description})
- **engagement**: knownExecutiveSponsors (array), plannedExecutiveEvents (array), decisionDeadlines, renewalRFPTiming
- **accountStrategy**: strategyNarrative, bigBets (array), keyExecutives (array of {name, role})
- **swot**: strengths (array), weaknesses (array), opportunities (array), threats (array)
- **annualReport**: revenue, revenueComparison, ebitImprovement, netZeroTarget, keyMilestones (array), strategicAchievements (array), executiveSummaryNarrative
- **businessModel**: keyPartners (array), keyActivities (array), keyResources (array), valueProposition (array), customerRelationships (array), channels (array), customerSegments (array), costStructure (array), revenueStreams (array), competitors (array)

### Actions:
- **set**: Replace the field value entirely
- **append**: Add to existing array (for array fields only)
- **replace**: Same as set

### Example Responses:

User: "Set the vision statement to 'Transform global logistics with AI-powered automation'"
Response: I'll set the vision statement for you.

\`\`\`fieldupdate
{
  "section": "basics",
  "field": "visionStatement",
  "value": "Transform global logistics with AI-powered automation",
  "action": "set"
}
\`\`\`

User: "Add 3 pain points about digital transformation"
Response: I'll add these pain points based on the account context:

\`\`\`fieldupdate
{
  "section": "painPoints",
  "field": "painPoints",
  "value": [
    {"title": "Legacy System Integration", "description": "Aging infrastructure creates barriers to modern digital initiatives"},
    {"title": "Data Silos", "description": "Fragmented data across business units prevents unified decision-making"},
    {"title": "Change Management", "description": "Organizational resistance slows digital adoption"}
  ],
  "action": "append"
}
\`\`\`

${accountContext}

Be concise but insightful. Always include the fieldupdate block when users want to populate fields.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Account chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
