import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse, validateContent, validateAccountContext, sanitizeForAI } from "../_shared/validation.ts";

// Comprehensive web research for multiple data types
async function searchCompanyInfo(companyName: string, searchType: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    // Sanitize company name for search
    const sanitizedName = companyName.replace(/[^\w\s-]/g, '').substring(0, 100);
    
    const queries: Record<string, string> = {
      financial: `${sanitizedName} annual report 2024 2025 revenue EBIT financial results earnings`,
      strategy: `${sanitizedName} strategic priorities 2024 2025 CEO vision transformation digital`,
      leadership: `${sanitizedName} CEO CIO CTO executive team leadership priorities investor day`,
      competitors: `${sanitizedName} competitors market share industry landscape competitive analysis`,
      challenges: `${sanitizedName} challenges risks pain points issues obstacles investor concerns`,
      technology: `${sanitizedName} technology stack digital transformation AI automation IT strategy`,
    };

    const query = queries[searchType] || `${sanitizedName} business overview`;
    console.log(`Searching ${searchType}`);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 4,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.error("Search failed:", response.status);
      return "";
    }

    const data = await response.json();
    const results = data.data || [];
    const content = results
      .map((r: any) => r.markdown || r.description || "")
      .join("\n\n")
      .slice(0, 8000);

    console.log(`Found ${results.length} results for ${searchType}`);
    return content;
  } catch (error) {
    console.error(`Search error for ${searchType}`);
    return "";
  }
}

// Fetch comprehensive web intelligence in parallel
async function fetchComprehensiveWebData(companyName: string): Promise<{
  financial: string;
  strategy: string;
  leadership: string;
  competitors: string;
  challenges: string;
  technology: string;
}> {
  const [financial, strategy, leadership, competitors, challenges, technology] = await Promise.all([
    searchCompanyInfo(companyName, "financial"),
    searchCompanyInfo(companyName, "strategy"),
    searchCompanyInfo(companyName, "leadership"),
    searchCompanyInfo(companyName, "competitors"),
    searchCompanyInfo(companyName, "challenges"),
    searchCompanyInfo(companyName, "technology"),
  ]);

  return { financial, strategy, leadership, competitors, challenges, technology };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate content input
    let validatedContent: string;
    try {
      validatedContent = validateContent(requestData.content, 100, 500000);
    } catch (validationError) {
      return createErrorResponse(400, validationError instanceof Error ? validationError.message : 'Invalid content');
    }
    
    // Validate account context
    let accountContext: Record<string, unknown> | null;
    try {
      accountContext = validateAccountContext(requestData.accountContext);
    } catch {
      accountContext = null;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return createErrorResponse(503, "Service temporarily unavailable");
    }

    // Build context from account data if provided
    let accountContextStr = "";
    if (accountContext) {
      const basics = (accountContext as any).basics || {};
      const history = (accountContext as any).history || {};
      const engagement = (accountContext as any).engagement || {};
      
      accountContextStr = `
═══════════════════════════════════════════════════════════════
ACCOUNT INTELLIGENCE (Pre-populated by Account Executive)
═══════════════════════════════════════════════════════════════
ACCOUNT PROFILE:
• Customer: ${basics.accountName || "Unknown"} 
• Industry: ${basics.industry || "Unknown"} | Region: ${basics.region || "Unknown"}
• Strategic Tier: ${basics.tier || "Unknown"} | Employees: ${basics.numberOfEmployees || "Unknown"}

COMMERCIAL POSITION:
• Current ACV: ${basics.currentContractValue || "Unknown"}
• Next FY Target: ${basics.nextFYAmbition || "Unknown"} | 3-Year Target: ${basics.threeYearAmbition || "Unknown"}
• Renewal Window: ${basics.renewalDates || "Unknown"}
• Incumbent Competitors: ${basics.keyIncumbents || "Unknown"}

RELATIONSHIP HISTORY:
• Last Account Plan: ${history.lastPlanDate || "Unknown"} by ${history.plannerName || "Unknown"} (${history.plannerRole || ""})
• Previous Failures: ${history.whatDidNotWork || "Not specified"}
• Prior Transformation Attempts: ${history.priorTransformationAttempts || "Not specified"}
• Current ServiceNow Perception: ${history.currentPerception || "Unknown"}

EXECUTIVE ACCESS:
• Known Sponsors: ${Array.isArray(engagement.knownExecutiveSponsors) ? engagement.knownExecutiveSponsors.join(", ") : "Unknown"}
• Decision Deadlines: ${engagement.decisionDeadlines || "Unknown"}
• RFP/Renewal Timing: ${engagement.renewalRFPTiming || "Unknown"}
═══════════════════════════════════════════════════════════════
`;
    }

    // Premium strategic analysis prompt with enhanced customer strategy extraction
    const initialPrompt = `You are a McKinsey-caliber strategic advisor with 25 years of experience analyzing Fortune 500 companies. Your analysis will be presented directly to C-level executives.

MISSION-CRITICAL: ACCURACY IS NON-NEGOTIABLE
- Extract ONLY information that is EXPLICITLY stated in the document
- Use the EXACT terminology, phrases, and language from the source document
- QUOTE directly when possible - especially CEO/executive statements
- If information is not present, leave the field empty - DO NOT fabricate
- Verify financial figures are EXACT as written (revenue, margins, growth rates)
- Cross-reference numbers if they appear multiple times

${accountContextStr}

═══════════════════════════════════════════════════════════════
ANALYSIS FRAMEWORK: PRECISION EXTRACTION
═══════════════════════════════════════════════════════════════

CRITICAL PRIORITY: CUSTOMER STRATEGY DEEP EXTRACTION (VERBATIM)
Your PRIMARY mission is to extract VERBATIM the customer's own strategic vision, priorities, and transformation agenda. Use their EXACT words and phrases.

ACCURACY MANDATE:
- Read the ENTIRE document before extracting anything
- Cross-reference information that appears in multiple sections
- Financial figures must match EXACTLY what's written (check CEO letter, financial summary, tables)
- When quoting strategy, use the EXACT terminology from the document
- If unsure about a fact, DO NOT include it

PHASE 0: CUSTOMER VISION & STRATEGY IMMERSION (MOST IMPORTANT)
Carefully extract strategic content using the customer's EXACT language:

A) CORPORATE STRATEGY (The "North Star") - VERBATIM EXTRACTION
   - SEARCH FOR: "Our strategy is...", "Strategic priorities include...", "Our vision is..."
   - SEARCH FOR: Named programs, initiatives, or transformation agendas
   - SEARCH FOR: CEO/Chairman letter statements about company direction
   - EXTRACT: 3-5 corporate strategy items with DIRECT QUOTES or close paraphrasing
   - INCLUDE: The exact name if it's a branded strategy (e.g., "Better Everyday Strategy", "Flywheel Growth Model")

B) CEO & BOARD PRIORITIES (The "Must-Wins") - DIRECT QUOTES REQUIRED
   - SEARCH FOR: CEO's letter to shareholders - extract key sentences VERBATIM
   - SEARCH FOR: "Our priorities are...", "We are focused on...", "This year we will..."
   - SEARCH FOR: Quantified commitments with specific numbers
   - EXTRACT: Exact executive quotes where possible with attribution
   - INCLUDE: Any 3-year or 5-year goals mentioned

C) DIGITAL & AI STRATEGIES (The "How We Transform") - SPECIFIC INITIATIVES
   - SEARCH FOR: Technology investment sections, Digital transformation mentions
   - SEARCH FOR: AI, automation, cloud, data platform initiatives BY NAME
   - SEARCH FOR: Technology spending figures or headcount
   - EXTRACT: Named technology programs with their stated objectives
   - INCLUDE: Timeline or maturity statements if present

D) TRANSFORMATION THEMES (The "What Must Change") - OPERATIONAL DETAILS
   - SEARCH FOR: Operating model changes, efficiency programs, restructuring
   - SEARCH FOR: Cost reduction targets, synergy goals, simplification efforts
   - SEARCH FOR: Cultural transformation or employee experience initiatives
   - EXTRACT: Specific programs with their objectives and metrics

QUALITY STANDARD - WHAT "GOOD" LOOKS LIKE:
{
  "title": "Better Everyday: Winning Model for Retail",
  "description": "Walmart's stated strategy focusing on 'saving people money and helping them live better lives.' As CEO Doug McMillon stated in the annual letter: 'We're a technology company that happens to be in retail.' The strategy targets seamless omnichannel experiences with specific focus on 'store remodels, eCommerce growth, and supply chain automation.'"
}

WHAT TO AVOID (GENERIC, FABRICATED):
{
  "title": "Growth Strategy",
  "description": "The company wants to grow through digital transformation."
}

PHASE 1: DEEP DOCUMENT ANALYSIS
Read the ENTIRE document with the precision of a financial analyst and the strategic lens of a management consultant:
• Extract exact financial figures - revenue, margins, EBIT, growth rates (check tables, footnotes, charts)
• Identify the CEO's voice - their exact language, priorities, and transformation vision
• Map the strategic narrative - what story is leadership telling investors?
• Detect tension points - where does ambition exceed current capability?

PHASE 2: EXECUTIVE SUMMARY NARRATIVE
Write a 2-3 sentence executive brief that a C-suite sponsor could use verbatim in a board presentation:
• Lead with market position and scale (revenue, geography, employee count)
• Articulate strategic direction using THEIR language
• Connect to transformation imperatives that ServiceNow can address
• NEVER describe the document - describe the COMPANY and its trajectory

EXCELLENT EXAMPLE:
"A.P. Møller-Maersk is the world's leading integrated logistics company, operating across 130+ countries with $55.5B in revenue and 100,000+ employees. Under CEO Vincent Clerc's 'Gemini Strategy,' Maersk is pivoting from container shipping to end-to-end supply chain orchestration, targeting 8% EBIT margins through operational AI and customer experience transformation."

POOR EXAMPLE (NEVER DO THIS):
"This annual report discusses Maersk's financial performance and strategic initiatives."

PHASE 3: STRATEGIC PAIN POINTS (The "Why Act Now" Story)
Extract 3-5 pain points that create URGENCY for executive action:
• Derive DIRECTLY from stated challenges, risks, or gaps in the annual report
• Use the customer's OWN LANGUAGE (if they say "fragmented systems," use that exact phrase)
• Connect each pain to a strategic priority they've publicly committed to
• Quantify impact where possible (e.g., "$2.3B cost overrun," "18-month delay in AI deployment")
• Frame as obstacles to achieving stated board-level goals

PAIN POINT FORMAT:
{
  "title": "Punchy 5-7 word headline using their terminology",
  "description": "1-2 sentences: [Specific pain] is blocking [their stated priority], resulting in [quantified impact or strategic risk]"
}

EXCELLENT PAIN POINT:
{
  "title": "Fragmented Tech Stack Blocking AI-First Vision",
  "description": "130+ disconnected systems across regions prevent the unified data layer CEO cited as prerequisite for AI operationalisation—directly threatening the 2026 'AI-first operations' commitment made to investors."
}

PHASE 4: STRATEGIC OPPORTUNITIES (The "How ServiceNow Wins" Story)
Extract 3-5 opportunities that position ServiceNow as the strategic enabler:
• Each opportunity MUST address a specific pain point
• Each opportunity MUST accelerate a stated customer priority
• Frame as business outcomes, not product features
• Use action verbs: Accelerate, Consolidate, Transform, Enable, Reduce, Eliminate
• Include proof points or benchmarks where credible

OPPORTUNITY FORMAT:
{
  "title": "Action-Oriented 5-8 word headline",
  "description": "1-2 sentences: ServiceNow enables [their goal] by [specific capability], delivering [quantified outcome based on comparable deployments]"
}

EXCELLENT OPPORTUNITY:
{
  "title": "Unified AI Platform for Global Operations",
  "description": "Consolidate 130+ regional systems onto ServiceNow's AI-native platform, enabling the CEO's 'single source of truth' vision and reducing AI deployment cycles from 18 months to 6 months—as achieved at comparable logistics enterprises."
}

PHASE 5: SWOT ANALYSIS (Four-Dimensional Strategic Assessment)
Generate SWOT items that synthesize annual report insights WITH account context across FOUR PERSPECTIVES:

A) ORGANIZATIONAL (Customer's Internal Capabilities)
   STRENGTHS: Operational excellence, market position, talent, culture, scale advantages
   WEAKNESSES: Legacy systems, skill gaps, silos, execution challenges, tech debt

B) ACCOUNT RELATIONSHIP (ServiceNow's Position)
   STRENGTHS: Existing deployments, exec relationships, proven value, expansion momentum
   WEAKNESSES: Limited footprint, past failures, competitive threats, perception gaps

C) COMMERCIAL (Financial & Business Dynamics)
   OPPORTUNITIES: Renewal timing, budget cycles, M&A activity, transformation funding
   THREATS: Cost-cutting mandates, procurement pressure, economic headwinds, competitive pricing

D) SERVICENOW PLATFORM (Technology & Market Position)
   OPPORTUNITIES: White space products, AI/workflow differentiation, consolidation plays, partner ecosystem
   THREATS: Incumbent entrenchment, build-vs-buy decisions, point solution alternatives, platform fatigue

SWOT QUALITY STANDARDS:
• Each item should be specific, actionable, and defensible with evidence
• Reference annual report data AND account context where relevant
• Prioritize insights that inform deal strategy and executive engagement
• Avoid generic statements that could apply to any company

PHASE 6: KEY EXECUTIVE EXTRACTION (For Executive Engagement Strategy)
Extract the key executives mentioned in the annual report for strategic engagement planning:

A) C-SUITE & BOARD EXECUTIVES
   - CEO, CFO, COO, CIO, CTO, CDO, CHRO and other C-level executives
   - Board members with strategic influence
   - Regional/divisional presidents if significant

B) FOR EACH EXECUTIVE CAPTURE:
   - Full name and exact title
   - Their stated priorities or focus areas (from their quotes, letters, or presentations)
   - Any transformation or technology initiatives they champion
   - Relevance to ServiceNow engagement (e.g., "Owns digital transformation", "Drives operational excellence")

C) EXECUTIVE QUALITY STANDARDS:
   - Only include executives who appear prominently in the document
   - Priorities must be derived from their actual statements or documented responsibilities
   - Focus on executives relevant to enterprise platform decisions

EXCELLENT EXECUTIVE EXAMPLE:
{
  "name": "Vincent Clerc",
  "title": "Chief Executive Officer",
  "priorities": "Driving the Gemini Strategy transformation from container shipping to integrated logistics. Focused on operational AI, customer experience excellence, and achieving 8% EBIT margins.",
  "relevance": "Primary sponsor for enterprise-wide transformation initiatives including digital platforms and AI adoption."
}

═══════════════════════════════════════════════════════════════`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: initialPrompt },
          { role: "user", content: `CRITICAL: Read this ENTIRE document carefully before extracting ANY data. Your extraction must be ACCURATE and use the EXACT language from the source.

EXTRACTION CHECKLIST:
1. First, identify the company name exactly as written
2. Find the CEO's letter and extract key quotes VERBATIM
3. Locate financial summary tables and extract EXACT figures
4. Search for "strategy", "priorities", "vision", "objectives" sections
5. Identify any named strategic programs or initiatives
6. Extract technology/digital transformation initiatives with their names
7. Find risk factors and challenges as written
8. Identify executives mentioned and their stated priorities

Now extract from this annual report:\n\n${validatedContent}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_annual_report_data",
              description: "Extract comprehensive structured data from an annual report for strategic account planning",
              parameters: {
                type: "object",
                properties: {
                  accountName: { type: "string", description: "Full company name as it appears officially" },
                  industry: { type: "string", description: "Primary industry/sector with specificity (e.g., 'Integrated Logistics & Container Shipping' not just 'Transportation')" },
                  revenue: { type: "string", description: "Total revenue with currency and period (e.g., '$55.5B FY2024')" },
                  revenueComparison: { type: "string", description: "Prior year revenue for comparison" },
                  growthRate: { type: "string", description: "YoY growth rate with context (e.g., '+12% YoY' or '-8% due to market normalization')" },
                  ebitImprovement: { type: "string", description: "EBIT improvement or margin change" },
                  marginEBIT: { type: "string", description: "EBIT margin percentage or absolute figure" },
                  costPressureAreas: { type: "string", description: "Key cost pressure areas mentioned by leadership" },
                  strategicInvestmentAreas: { type: "string", description: "Where the company is investing for growth" },
                  corporateStrategy: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Strategic pillar name using their exact terminology" },
                        description: { type: "string", description: "1-2 sentences explaining the strategic initiative" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 core corporate strategy pillars with descriptions" 
                  },
                  digitalStrategies: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Digital/AI strategy initiative name" },
                        description: { type: "string", description: "1-2 sentences explaining the digital ambition" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "2-4 digital/AI strategy initiatives with descriptions" 
                  },
                  ceoBoardPriorities: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "CEO/Board priority name" },
                        description: { type: "string", description: "1-2 sentences explaining the priority" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 CEO's stated priorities from letters/presentations" 
                  },
                  transformationThemes: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Transformation theme name" },
                        description: { type: "string", description: "1-2 sentences explaining the transformation" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 digital/operational transformation themes" 
                  },
                  painPoints: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "5-7 word punchy headline using customer's language" },
                        description: { type: "string", description: "1-2 sentences linking pain to strategic priority with quantification" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 strategically-aligned pain points derived from the document" 
                  },
                  opportunities: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Action-oriented 5-8 word headline" },
                        description: { type: "string", description: "Exec-ready value proposition with quantified outcomes" }
                      },
                      required: ["title", "description"]
                    }, 
                    description: "3-5 ServiceNow opportunities that address pain points" 
                  },
                  strengths: { type: "array", items: { type: "string" }, description: "4-6 strengths combining organizational and account relationship factors" },
                  weaknesses: { type: "array", items: { type: "string" }, description: "4-6 weaknesses combining organizational gaps and ServiceNow position challenges" },
                  swotOpportunities: { type: "array", items: { type: "string" }, description: "4-6 opportunities combining commercial timing and platform white space" },
                  threats: { type: "array", items: { type: "string" }, description: "4-6 threats combining market risks and competitive dynamics" },
                  netZeroTarget: { type: "string", description: "Sustainability/Net Zero commitment with year" },
                  keyMilestones: { type: "array", items: { type: "string" }, description: "3-5 key milestones or achievements from the year" },
                  strategicAchievements: { type: "array", items: { type: "string" }, description: "3-5 strategic achievements that demonstrate execution capability" },
                  executiveSummaryNarrative: { type: "string", description: "2-3 sentence board-ready company summary describing market position, scale, and strategic direction" },
                  keyExecutives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Full name of the executive" },
                        title: { type: "string", description: "Official title (e.g., 'Chief Executive Officer', 'Chief Digital Officer')" },
                        priorities: { type: "string", description: "2-3 sentences describing their stated priorities, focus areas, or initiatives they champion" },
                        relevance: { type: "string", description: "Why this executive is relevant for ServiceNow engagement (e.g., 'Owns digital transformation', 'Drives operational excellence')" }
                      },
                      required: ["name", "title", "priorities", "relevance"]
                    },
                    description: "5-8 key executives with their priorities for executive engagement strategy"
                  }
                },
                required: ["accountName", "executiveSummaryNarrative", "painPoints", "opportunities", "strengths", "weaknesses", "swotOpportunities", "threats", "keyExecutives"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_annual_report_data" } }
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

    const data = await response.json();
    console.log("Initial AI response received");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_annual_report_data") {
      throw new Error("Unexpected AI response format");
    }

    let extractedData = JSON.parse(toolCall.function.arguments);
    const companyName = extractedData.accountName || "";

    // Track data sources
    const dataSources: Record<string, "document" | "web"> = {};
    const documentFields = Object.keys(extractedData).filter(k => {
      const val = extractedData[k];
      return val && val !== "N/A" && val !== "Not specified" && 
        (typeof val === "string" ? val.length > 0 : Array.isArray(val) && val.length > 0);
    });
    documentFields.forEach(f => dataSources[f] = "document");

    // Always do comprehensive web research if company name is available
    let usedWebSearch = false;

    if (companyName) {
      console.log("Fetching comprehensive web intelligence for:", companyName);
      const webData = await fetchComprehensiveWebData(companyName);
      
      const hasWebData = Object.values(webData).some(v => v.length > 0);
      
      if (hasWebData) {
        usedWebSearch = true;
        
        // Build comprehensive web intelligence context
        const webIntelligence = `
═══════════════════════════════════════════════════════════════
SUPPLEMENTARY WEB INTELLIGENCE (Live Research)
═══════════════════════════════════════════════════════════════

FINANCIAL DATA & EARNINGS:
${webData.financial || "No additional financial data found"}

STRATEGIC PRIORITIES & CEO VISION:
${webData.strategy || "No additional strategy data found"}

EXECUTIVE LEADERSHIP TEAM:
${webData.leadership || "No leadership data found"}

COMPETITIVE LANDSCAPE:
${webData.competitors || "No competitor data found"}

CHALLENGES & RISKS:
${webData.challenges || "No challenges/risks data found"}

TECHNOLOGY & DIGITAL TRANSFORMATION:
${webData.technology || "No technology data found"}
═══════════════════════════════════════════════════════════════`;

        // Second pass with comprehensive web data - use pro model for best quality
        const enrichPrompt = `You are a McKinsey-caliber strategic analyst enriching an account analysis with comprehensive web intelligence.

CRITICAL PRIORITY: CUSTOMER STRATEGY DEEP UNDERSTANDING
Your PRIMARY mission is to deeply understand the customer's OWN strategic vision. This is about THEIR world, not ours.

ORIGINAL EXTRACTION (from annual report):
${JSON.stringify(extractedData, null, 2)}

${webIntelligence}

ENRICHMENT INSTRUCTIONS:

1. CUSTOMER STRATEGY (HIGHEST PRIORITY):
   - ENHANCE corporateStrategy with named programs, strategic pillars, and transformation initiatives
   - Each strategy item MUST have a rich 2-3 sentence description explaining WHY and HOW
   - Use the CUSTOMER'S OWN TERMINOLOGY from their public communications
   - Include quantified targets and timelines where available
   
2. CEO & BOARD PRIORITIES:
   - Extract EXACT language from CEO statements, investor calls, annual letters
   - Connect priorities to measurable outcomes and commitments
   - Include any publicly stated timelines or milestones
   
3. DIGITAL & AI STRATEGIES:
   - Enhance with specific AI/digital initiatives discovered in web research
   - Include maturity indicators: exploring, piloting, scaling
   - Connect to broader strategic agenda
   
4. TRANSFORMATION THEMES:
   - Add operational and business model changes underway
   - Include any named transformation programs
   
5. KEY EXECUTIVES (CRITICAL FOR ENGAGEMENT STRATEGY):
   - Identify CEO, CFO, CIO, CTO, CDO, COO and other C-level executives
   - For each executive, capture their stated priorities from investor calls, interviews, presentations
   - Note any transformation/technology initiatives they personally champion
   - Assess relevance to ServiceNow engagement (who owns digital, operations, employee experience?)
   - Include recent quotes or statements that reveal their agenda
   
6. FINANCIAL: Update revenue, EBIT, margins, growth with most accurate/recent data
7. COMPETITION: Incorporate competitive context into SWOT threats
8. PAIN POINTS: Refine with real-world challenges from news/analyst reports - use customer's language
9. NARRATIVE: Make executiveSummaryNarrative compelling with specific figures and strategic direction
10. SWOT: Enrich all quadrants with evidence from both document AND web research
11. PRESERVE: Maintain executive-grade quality - enhance, don't diminish existing content

QUALITY STANDARD:
- Every strategy item needs title + substantive description (not just a title)
- Use customer's exact terminology for named programs
- Quantify where possible`;

        const enrichResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: "You are a McKinsey-caliber analyst enriching strategic account data. Merge new intelligence while maintaining board-ready quality. Prioritize accuracy and strategic insight." },
              { role: "user", content: enrichPrompt }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_annual_report_data",
                  description: "Extract enriched data with deep customer strategy understanding",
                  parameters: {
                    type: "object",
                    properties: {
                      accountName: { type: "string" },
                      industry: { type: "string" },
                      revenue: { type: "string" },
                      revenueComparison: { type: "string" },
                      growthRate: { type: "string" },
                      ebitImprovement: { type: "string" },
                      marginEBIT: { type: "string" },
                      costPressureAreas: { type: "string" },
                      strategicInvestmentAreas: { type: "string" },
                      corporateStrategy: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string", description: "Strategic pillar name using customer's exact terminology" },
                            description: { type: "string", description: "2-3 sentence explanation of the strategic initiative, the WHY and HOW" }
                          },
                          required: ["title", "description"]
                        }, 
                        description: "3-5 core corporate strategy pillars with rich descriptions" 
                      },
                      digitalStrategies: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string", description: "Digital/AI strategy initiative name" },
                            description: { type: "string", description: "2-3 sentence explanation of the digital ambition and approach" }
                          },
                          required: ["title", "description"]
                        }, 
                        description: "2-4 digital/AI strategy initiatives with rich descriptions" 
                      },
                      ceoBoardPriorities: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string", description: "CEO/Board priority name" },
                            description: { type: "string", description: "2-3 sentence explanation of the priority and its importance" }
                          },
                          required: ["title", "description"]
                        }, 
                        description: "3-5 CEO's stated priorities with rich descriptions" 
                      },
                      transformationThemes: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string", description: "Transformation theme name" },
                            description: { type: "string", description: "2-3 sentence explanation of the transformation" }
                          },
                          required: ["title", "description"]
                        }, 
                        description: "3-5 digital/operational transformation themes with rich descriptions" 
                      },
                      aiDigitalAmbition: { type: "string" },
                      costDisciplineTargets: { type: "string" },
                      painPoints: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            description: { type: "string" }
                          },
                          required: ["title", "description"]
                        }
                      },
                      opportunities: { 
                        type: "array", 
                        items: { 
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            description: { type: "string" }
                          },
                          required: ["title", "description"]
                        }
                      },
                      strengths: { type: "array", items: { type: "string" } },
                      weaknesses: { type: "array", items: { type: "string" } },
                      swotOpportunities: { type: "array", items: { type: "string" } },
                      threats: { type: "array", items: { type: "string" } },
                      netZeroTarget: { type: "string" },
                      keyMilestones: { type: "array", items: { type: "string" } },
                      strategicAchievements: { type: "array", items: { type: "string" } },
                      executiveSummaryNarrative: { type: "string" },
                      keyExecutives: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string", description: "Full name of the executive" },
                            title: { type: "string", description: "Official title" },
                            priorities: { type: "string", description: "Their stated priorities and focus areas" },
                            relevance: { type: "string", description: "Why relevant for ServiceNow engagement" }
                          },
                          required: ["name", "title", "priorities", "relevance"]
                        },
                        description: "5-8 key executives with their priorities"
                      }
                    },
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "extract_annual_report_data" } }
          }),
        });

        if (enrichResponse.ok) {
          const enrichData = await enrichResponse.json();
          const enrichToolCall = enrichData.choices?.[0]?.message?.tool_calls?.[0];
          if (enrichToolCall) {
            const enrichedExtraction = JSON.parse(enrichToolCall.function.arguments);
            // Merge enriched data (prefer non-empty values)
            for (const key of Object.keys(enrichedExtraction)) {
              const newValue = enrichedExtraction[key];
              const oldValue = extractedData[key];
              if (newValue && newValue !== "N/A" && newValue !== "Not specified") {
                if (Array.isArray(newValue) && newValue.length > 0) {
                  if (!oldValue || oldValue.length === 0) {
                    extractedData[key] = newValue;
                    dataSources[key] = "web";
                  }
                } else if (!Array.isArray(newValue) && newValue) {
                  if (!oldValue || oldValue === "N/A" || oldValue === "Not specified") {
                    extractedData[key] = newValue;
                    dataSources[key] = "web";
                  }
                }
              }
            }
            console.log("Data enriched with web search results");
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData,
        dataSources,
        usedWebSearch 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return createErrorResponse(500, "Failed to analyze report. Please try again.", error);
  }
});
