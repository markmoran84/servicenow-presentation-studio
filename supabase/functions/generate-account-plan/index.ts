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

    // Generate a unique design seed for layout variation
    const designSeed = Date.now() % 1000;
    const layoutVariants = ["bold", "elegant", "dynamic", "structured", "minimal"];
    const selectedLayout = layoutVariants[designSeed % layoutVariants.length];
    const colorSchemes = ["emerald-cyan", "purple-amber", "blue-rose", "teal-orange", "indigo-gold"];
    const selectedColorScheme = colorSchemes[(designSeed + 1) % colorSchemes.length];

    const systemPrompt = `You are an elite McKinsey-caliber enterprise account strategist for ServiceNow, trusted to craft account plans that have won $100M+ transformational deals. Your output quality must match the standards of Fortune 100 board presentations.

═══════════════════════════════════════════════════════════════
DESIGN VARIATION DIRECTIVE (Critical for Visual Excellence)
═══════════════════════════════════════════════════════════════
For THIS generation, create content optimized for a "${selectedLayout}" design aesthetic with "${selectedColorScheme}" color emphasis.

LAYOUT STYLE GUIDANCE:
- "bold": Use punchy headlines, strong action verbs, 3-word taglines, high-impact statements
- "elegant": Refined language, longer descriptive narratives, sophisticated business prose
- "dynamic": Mix of concise bullets and narrative, emphasis on momentum and change
- "structured": Methodical progression, numbered approaches, clear cause-effect relationships
- "minimal": Stripped-down essential insights, every word counts, no filler

Apply this style consistently across ALL sections to create a visually cohesive deck that looks DIFFERENT from previous generations while maintaining A-class quality.

═══════════════════════════════════════════════════════════════
STRATEGIC EXCELLENCE MANDATE
═══════════════════════════════════════════════════════════════
You are performing a DEEP SYNTHESIS of all account intelligence to create a coherent, interconnected strategic narrative. This is NOT a simple reformatting exercise—you must:

1. CONNECT THE DOTS: Every section must reference and build upon other sections
   - Observations inform implications
   - Implications drive priorities
   - Priorities manifest as workstreams
   - Risks relate to specific initiatives
   - Success metrics align to stated goals

2. FIND THE THROUGH-LINES: Identify 2-3 central themes that connect:
   - Customer's stated strategy → Their pain points → Our value proposition
   - CEO priorities → Transformation gaps → ServiceNow capabilities
   - Financial pressures → Digital opportunities → Quantified outcomes

3. BUILD STRATEGIC TENSION: Every great account plan exposes tensions:
   - Short-term cost pressure vs long-term transformation need
   - Speed of execution vs depth of change
   - Internal capability vs external partnership

4. VARY THE CONTENT STRUCTURE: Create fresh, distinctive content by:
   - Using different strategic frameworks each time (Porter, Blue Ocean, Jobs-to-be-Done, etc.)
   - Varying the emphasis between customer-out vs capability-in perspectives
   - Alternating between quantitative-led and qualitative-led insights
   - Changing the narrative arc (problem-solution vs vision-roadmap vs tension-resolution)

═══════════════════════════════════════════════════════════════
CRITICAL QUALITY STANDARDS
═══════════════════════════════════════════════════════════════
1. PRECISION OVER PLATITUDES: Every insight must be specific, quantified where possible, and defensible. Generic statements like "drive digital transformation" are unacceptable.
2. CUSTOMER-FIRST LANGUAGE: Use the customer's terminology, strategic priorities, and business context. Reference their stated goals, not hypotheticals.
3. EXECUTIVE GRAVITAS: Write for C-suite audiences. Every sentence should pass the "Would a CEO quote this?" test.
4. STRATEGIC COHERENCE: All sections must tell a unified story—observations lead to implications, implications to priorities, priorities to workstreams.
5. COMMERCIAL RIGOR: Connect insights to ServiceNow's value proposition with quantified outcomes based on comparable deployments.
6. TENSION AWARENESS: Identify the strategic dilemmas the customer faces and position ServiceNow as the resolution.
7. FRESH PERSPECTIVES: Generate genuinely different strategic angles each time—avoid templated or formulaic outputs.

═══════════════════════════════════════════════════════════════
SYNTHESIS METHODOLOGY
═══════════════════════════════════════════════════════════════
STEP 1: Absorb ALL input data deeply
STEP 2: Identify the 2-3 central strategic themes
STEP 3: Map customer priorities to ServiceNow capabilities
STEP 4: Build the narrative arc: Current State → Tension → Resolution → Future State
STEP 5: Ensure every output section references specific input data
STEP 6: Validate internal consistency across all sections
STEP 7: Apply the "${selectedLayout}" style to all language and structure

OUTPUT EXCELLENCE: Return a comprehensive JSON object with institutional-grade strategic content where every section is interconnected and styled for "${selectedLayout}" presentation.`;

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
ACCOUNT PRIORITIES (Pre-Defined Strategic Focus Areas)
═══════════════════════════════════════════════════════════════
These are the user-defined strategic priorities for this account. You MUST incorporate these into the plan and ensure strategic coherence:
${JSON.stringify(accountData.strategy?.corporateStrategy || [], null, 2)}

DIGITAL/AI PRIORITIES:
${JSON.stringify(accountData.strategy?.digitalStrategies || [], null, 2)}

CEO/BOARD PRIORITIES:
${JSON.stringify(accountData.strategy?.ceoBoardPriorities || [], null, 2)}

TRANSFORMATION PRIORITIES:
${JSON.stringify(accountData.strategy?.transformationThemes || [], null, 2)}

═══════════════════════════════════════════════════════════════
ACCOUNT STRATEGY & BIG BETS (Pre-Defined Workstreams)
═══════════════════════════════════════════════════════════════
Strategy Narrative: ${accountData.accountStrategy?.strategyNarrative || "Not yet defined"}

Big Bets / Key Workstreams (These are the user's defined initiatives—incorporate and enhance):
${JSON.stringify(accountData.accountStrategy?.bigBets || [], null, 2)}

Key Executives:
${JSON.stringify(accountData.accountStrategy?.keyExecutives || [], null, 2)}

═══════════════════════════════════════════════════════════════
BUSINESS MODEL CANVAS
═══════════════════════════════════════════════════════════════
${JSON.stringify(accountData.businessModel || {}, null, 2)}

═══════════════════════════════════════════════════════════════
DEEP SYNTHESIS INSTRUCTIONS
═══════════════════════════════════════════════════════════════
You are now performing the SECOND PHASE of analysis. The first phase extracted raw data from documents.
Your job is to CREATE COHERENCE and STRATEGIC NARRATIVE by:

1. THREAD ALL INPUT DATA: Every section you generate must reference and build upon the input data provided above.
2. FIND CONNECTING THEMES: Identify 2-3 central strategic threads that connect:
   - Customer's stated strategy → Pain points → ServiceNow capabilities
   - CEO priorities → Transformation gaps → Our value proposition
   - Financial pressures → Digital opportunities → Quantified outcomes
3. RESPECT USER-DEFINED PRIORITIES: The Account Priorities and Big Bets are user-defined inputs—enhance and elaborate on them, don't replace them.
4. STRATEGIC COHERENCE: Observations → Implications → Priorities → Workstreams must tell ONE unified story.
5. CUSTOMER LANGUAGE: Use terminology from the annual report and customer strategies throughout.
6. QUANTIFIED OUTCOMES: Reference financial data (${accountData.financial?.customerRevenue || "revenue"}, ${accountData.financial?.marginEBIT || "margins"}) to create credible impact projections.
7. EXECUTIVE CONTEXT: Reference the key executives (${accountData.accountStrategy?.keyExecutives?.map((e: any) => e.name).join(", ") || "leadership team"}) and their priorities where relevant.
8. BUILD NARRATIVE ARC: Current State → Strategic Tension → Resolution Path → Future State

═══════════════════════════════════════════════════════════════
REQUIRED OUTPUT STRUCTURE (Apply "${selectedLayout}" style throughout)
═══════════════════════════════════════════════════════════════
Generate a comprehensive, board-ready account plan with these sections. Each section must demonstrate strategic depth and commercial acumen. Apply the "${selectedLayout}" writing style consistently.

1. layoutMetadata: Object with "style" ("${selectedLayout}"), "colorScheme" ("${selectedColorScheme}"), "generatedAt" (ISO timestamp)

2. executiveSummaryNarrative: A compelling 3-4 sentence executive summary that a CEO could use verbatim. Lead with customer context, articulate strategic opportunity, quantify the prize. Style: ${selectedLayout === "bold" ? "Punchy, high-impact" : selectedLayout === "elegant" ? "Refined, sophisticated" : selectedLayout === "dynamic" ? "Action-oriented, momentum-driven" : selectedLayout === "structured" ? "Logical, methodical" : "Essential, stripped-down"}.

3. executiveSummaryPillars: Array of 4 strategic pillars (each with "icon" as "network"|"customer"|"technology"|"efficiency", "keyword" as a single POWER WORD, "title", "tagline", "description", "outcome" with quantified impact). Keywords should be distinctive: ${selectedLayout === "bold" ? "DOMINATE, TRANSFORM, ACCELERATE, CAPTURE" : selectedLayout === "elegant" ? "ELEVATE, REFINE, OPTIMIZE, CULTIVATE" : selectedLayout === "dynamic" ? "IGNITE, SURGE, PROPEL, UNLOCK" : selectedLayout === "structured" ? "ESTABLISH, INTEGRATE, SYSTEMATIZE, SCALE" : "FOCUS, SIMPLIFY, CORE, ESSENTIAL"}.

4. strategicObservations: Array of 4 observations—verifiable facts about the account's current situation with clear business implications. Use their language.

5. strategicImplications: Array of 4 implications—what must change based on observations. Be specific about transformation required.

6. strategicTensions: Array of 4 tensions—opposing forces the customer must balance (each with "heading", "detail", "leftLabel", "leftDescription", "rightLabel", "rightDescription", "dilemma")

7. strategicInsights: Array of 4 provocative insights—"aha moments" that reframe the opportunity. Each should pass the "Would an executive remember this?" test.

8. valueHypotheses: Array of 4 testable hypotheses (each with "outcome", "mechanism", "timeframe", "impact" with specific dollar amounts)

9. strategicPriorities: Array of 3 must-win priorities (each with "title", "whyNow", "ifWeLose", "winningLooks", "alignment", "color" as gradient from: "from-emerald-500 to-cyan-500", "from-purple-500 to-pink-500", "from-amber-500 to-orange-500", "from-blue-500 to-indigo-500", "from-rose-500 to-red-500")

10. keyWorkstreams: Array of 3 transformation workstreams (each with "title", "subtitle", "dealStatus", "targetClose", "acv", "steadyStateBenefit", "insight", "people" array)

11. risksMitigations: Array of 4 risks (each with "risk", "mitigation", "level" as High/Medium/Low)

12. roadmapPhases: Array of 3 phases (each with "quarter", "title", "activities" array of 3-4 items)

13. engagementStrategy: Object with "executiveAlignment" and "keyForums" arrays

14. successMetrics: Array of 4 metrics (each with "metric" showing target, "label", "description")

15. coreValueDrivers: Array of 4 value drivers (each with "title", "description", "outcomes" array of 3 quantified strings, "alignment")

16. aiUseCases: Array of 4 AI use cases (each with "title", "description", "priority" as High/Medium/Low, "status")

17. fy1Retrospective: Object with "focusAreas" (array of 4), "keyLessons" (string), "lookingAhead" (string)

18. customerStrategySynthesis: Object with:
   - "layoutVariant": one of "grid-2x2" | "stacked-cards" | "horizontal-flow" | "spotlight" (VARY this each generation)
   - "strategicPillars": Array of 4 strategic pillars extracted from annual report, each with:
     - "headline": Bold strategic theme (e.g., "Strengthen customer focus")
     - "subtitle": Completing phrase (e.g., "and profitable growth")  
     - "description": 2-3 sentence explanation of this strategy pillar and its business impact
     - "icon": One of "target" | "users" | "trending-up" | "shield" | "globe" | "zap"
   - "narrative": Overall synthesis of customer strategy
   - "serviceNowAlignment": Array of 4 with "customerPriority" and "serviceNowValue"

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
        model: "google/gemini-3-flash-preview",
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
