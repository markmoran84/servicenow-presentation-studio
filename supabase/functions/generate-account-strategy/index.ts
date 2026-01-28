/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Check if there's an existing strategy to build upon
    const existingStrategy = accountData.accountStrategy?.strategyNarrative;
    const existingBigBets = accountData.accountStrategy?.bigBets || [];
    
    // Extract rich context from all data sources
    const basics = accountData.basics || {};
    const strategy = accountData.strategy || {};
    const painPoints = accountData.painPoints?.painPoints || [];
    const opportunities = accountData.opportunities?.opportunities || [];
    const annualReport = accountData.annualReport || {};
    const swot = accountData.swot || {};
    const financial = accountData.financial || {};
    const engagement = accountData.engagement || {};
    
    // Build dynamic context sections based on available data
    const hasAnnualReport = annualReport.executiveSummaryNarrative || annualReport.strategicAchievements?.length > 0;
    const hasTransformationThemes = strategy.transformationThemes?.length > 0;
    const hasDigitalStrategies = strategy.digitalStrategies?.length > 0;
    const hasCeoPriorities = strategy.ceoBoardPriorities?.length > 0;
    const hasFinancialContext = financial.customerRevenue || financial.growthRate;
    const hasExecutives = engagement.knownExecutiveSponsors?.length > 0;
    const hasCorporateStrategy = strategy.corporateStrategy?.length > 0;
    const hasPainPoints = painPoints.length > 0;
    const hasOpportunities = opportunities.length > 0;
    const hasSwot = swot.strengths?.length > 0 || swot.threats?.length > 0;
    const hasBigBets = existingBigBets.length > 0;

    // Track which data sources were used
    const dataSources: { name: string; available: boolean; weight: number }[] = [
      { name: "Annual Report", available: hasAnnualReport, weight: 25 },
      { name: "CEO/Board Priorities", available: hasCeoPriorities, weight: 20 },
      { name: "Transformation Themes", available: hasTransformationThemes, weight: 15 },
      { name: "Digital Strategies", available: hasDigitalStrategies, weight: 10 },
      { name: "Corporate Strategy", available: hasCorporateStrategy, weight: 10 },
      { name: "Pain Points", available: hasPainPoints, weight: 5 },
      { name: "Opportunities", available: hasOpportunities, weight: 5 },
      { name: "SWOT Analysis", available: hasSwot, weight: 5 },
      { name: "Financial Context", available: hasFinancialContext, weight: 3 },
      { name: "Executive Sponsors", available: hasExecutives, weight: 2 },
    ];

    const usedSources = dataSources.filter(s => s.available);
    const confidenceScore = usedSources.reduce((acc, s) => acc + s.weight, 0);

    const prompt = `You are a strategic account planning expert for enterprise technology sales at ServiceNow. Your task is to write a compelling, highly specific account strategy narrative that demonstrates deep understanding of this customer's unique situation.

CRITICAL REQUIREMENTS:
- Be SPECIFIC to this account - reference their actual initiatives, metrics, and terminology
- Connect ServiceNow capabilities DIRECTLY to their stated priorities and pain points
- Use their language and strategic framing (quote their transformation themes if available)
- The narrative should feel like it was written by someone who deeply understands their business
- Avoid generic statements that could apply to any company

FORMAT:
- 2-3 paragraphs (200-300 words)
- Written in first-person plural ("Our strategy..." "We will...")
- Professional and confident tone for executive presentations
- Each paragraph should have a distinct purpose: (1) Strategic context & alignment, (2) Value proposition & differentiation, (3) Execution approach & outcomes

=== ACCOUNT CONTEXT ===

Company: ${basics.accountName || "Unknown"}
Industry: ${basics.industry || "Unknown"}
${hasFinancialContext ? `Revenue: ${financial.customerRevenue || "Unknown"} | Growth: ${financial.growthRate || "Unknown"}` : ""}
Current ACV: ${basics.currentContractValue || "Not specified"}
FY Target: ${basics.nextFYAmbition || "Not specified"} | 3-Year Ambition: ${basics.threeYearAmbition || "Not specified"}

${hasAnnualReport ? `=== EXECUTIVE SUMMARY (from their Annual Report) ===
${annualReport.executiveSummaryNarrative || ""}

Key Achievements:
${annualReport.strategicAchievements?.map((a: string) => `• ${a}`).join("\n") || "Not available"}
` : ""}

${hasTransformationThemes ? `=== TRANSFORMATION THEMES (their strategic priorities) ===
${strategy.transformationThemes.map((t: any) => `• ${t.title}: ${t.description}`).join("\n")}
` : ""}

${hasCeoPriorities ? `=== CEO/BOARD PRIORITIES ===
${strategy.ceoBoardPriorities.map((p: any) => `• ${p.title}: ${p.description}`).join("\n")}
` : ""}

${hasDigitalStrategies ? `=== DIGITAL STRATEGY INITIATIVES ===
${strategy.digitalStrategies.map((d: any) => `• ${d.title}: ${d.description}`).join("\n")}
` : ""}

=== CORPORATE STRATEGY ===
${strategy.corporateStrategy?.map((s: any) => `• ${s.title}: ${s.description}`).join("\n") || "Not specified"}

=== PAIN POINTS (opportunities for ServiceNow) ===
${painPoints.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

=== STRATEGIC OPPORTUNITIES ===
${opportunities.map((o: any) => `• ${o.title}: ${o.description}`).join("\n") || "Not specified"}

${swot.strengths?.length > 0 ? `=== CUSTOMER STRENGTHS (to leverage) ===
${swot.strengths.slice(0, 4).map((s: string) => `• ${s}`).join("\n")}
` : ""}

${swot.threats?.length > 0 ? `=== MARKET THREATS (where ServiceNow can help) ===
${swot.threats.slice(0, 3).map((t: string) => `• ${t}`).join("\n")}
` : ""}

${existingBigBets.length > 0 ? `=== DEFINED BIG BETS / WORKSTREAMS ===
${existingBigBets.map((b: any) => `• ${b.title}: ${b.subtitle || ""} (${b.dealStatus}, ${b.netNewACV})`).join("\n")}
` : ""}

${hasExecutives ? `=== KEY EXECUTIVE SPONSORS ===
${engagement.knownExecutiveSponsors.join(", ")}
` : ""}

${existingStrategy ? `=== EXISTING STRATEGY (improve and build upon) ===
${existingStrategy}
` : ""}

Write the strategy narrative now. Be specific, reference their actual initiatives by name, and make clear connections between their priorities and ServiceNow's platform capabilities.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable API error:", errorText);
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Not enough AI credits. Please add credits to your Lovable workspace in Settings → Workspace → Usage." 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "AI rate limit exceeded. Please wait a moment and try again." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    const strategyNarrative = result.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ 
        success: true, 
        strategyNarrative,
        metadata: {
          dataSources: usedSources.map(s => s.name),
          confidenceScore,
          generatedAt: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating account strategy:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
