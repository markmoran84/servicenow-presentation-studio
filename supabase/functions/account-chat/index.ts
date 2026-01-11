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

When generating content that can be added to form fields:
- Format actionable suggestions with a clear "**Suggested Content:**" prefix
- Keep content professional and strategic
- If creating multiple items (like strategies or pain points), use numbered lists
- Always ground your suggestions in the available account context

${accountContext}

Be concise but insightful. When providing content that can be added to forms, clearly delineate it so users can easily copy or apply it.`;

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
