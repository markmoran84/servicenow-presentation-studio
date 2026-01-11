import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse, validateContent, validateAccountContext, sanitizeForAI } from "../_shared/validation.ts";

// Comprehensive web research for multiple data types using Firecrawl
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
      vision: `"${sanitizedName}" company vision purpose mission statement values 2024 2025`,
      strategy: `"${sanitizedName}" strategic priorities strategy pillars CEO priorities transformation 2024 2025`,
      goals: `"${sanitizedName}" corporate goals targets objectives KPIs 2024 2025 investor day`,
      digital: `"${sanitizedName}" digital transformation technology AI automation cloud strategy`,
      leadership: `"${sanitizedName}" CEO CIO CTO executive leadership priorities initiatives`,
      sustainability: `"${sanitizedName}" sustainability ESG net zero carbon emissions targets`,
    };

    const query = queries[searchType] || `${sanitizedName} business overview strategy`;
    console.log(`Searching web for ${searchType}: "${query.substring(0, 80)}..."`);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 5,
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
      .map((r: any) => {
        const text = r.markdown || r.description || "";
        const source = r.url || "";
        return source ? `[Source: ${source}]\n${text}` : text;
      })
      .join("\n\n---\n\n")
      .slice(0, 12000);

    console.log(`Found ${results.length} web results for ${searchType}`);
    return content;
  } catch (error) {
    console.error(`Search error for ${searchType}:`, error);
    return "";
  }
}

// Fetch comprehensive web intelligence in parallel
async function fetchComprehensiveWebData(companyName: string): Promise<{
  vision: string;
  strategy: string;
  goals: string;
  digital: string;
  leadership: string;
  sustainability: string;
  hasData: boolean;
}> {
  console.log(`Starting web research for: ${companyName}`);
  
  const [vision, strategy, goals, digital, leadership, sustainability] = await Promise.all([
    searchCompanyInfo(companyName, "vision"),
    searchCompanyInfo(companyName, "strategy"),
    searchCompanyInfo(companyName, "goals"),
    searchCompanyInfo(companyName, "digital"),
    searchCompanyInfo(companyName, "leadership"),
    searchCompanyInfo(companyName, "sustainability"),
  ]);

  const hasData = !!(vision || strategy || goals || digital || leadership || sustainability);
  console.log(`Web research complete. Has data: ${hasData}`);

  return { vision, strategy, goals, digital, leadership, sustainability, hasData };
}

// Synthesize document + web data into comprehensive customer profile
async function synthesizeCustomerProfile(
  documentData: Record<string, unknown>,
  webData: { vision: string; strategy: string; goals: string; digital: string; leadership: string; sustainability: string },
  apiKey: string
): Promise<Record<string, unknown>> {
  console.log("Synthesizing document + web data into comprehensive profile...");

  const companyName = documentData.accountName || "Unknown Company";

  const synthesisPrompt = `You are a strategic account intelligence analyst. Synthesize document-extracted data with web research to create a comprehensive customer profile.

DOCUMENT-EXTRACTED DATA (PRIMARY SOURCE - trust this for facts):
${JSON.stringify(documentData, null, 2)}

WEB RESEARCH DATA (SECONDARY SOURCE - use to fill gaps and add context):
═══════════════════════════════════════════════════════════════
VISION & PURPOSE:
${webData.vision || "No web data available"}

STRATEGIC PRIORITIES:
${webData.strategy || "No web data available"}

CORPORATE GOALS:
${webData.goals || "No web data available"}

DIGITAL/TECHNOLOGY STRATEGY:
${webData.digital || "No web data available"}

LEADERSHIP PRIORITIES:
${webData.leadership || "No web data available"}

SUSTAINABILITY:
${webData.sustainability || "No web data available"}
═══════════════════════════════════════════════════════════════

YOUR TASK:
1. PRESERVE all document-extracted data as the authoritative source
2. ENHANCE with web research where document data is missing or sparse
3. For STRATEGY fields specifically:
   - corporateStrategy: Enterprise-wide strategic themes (NOT business units)
   - digitalStrategies: Technology/digital/AI initiatives ONLY
   - ceoBoardPriorities: Priorities explicitly attributed to CEO/Board
   - DO NOT duplicate items across categories
   - Use action-oriented language (Strengthen, Drive, Accelerate, Transform, etc.)
4. Add company vision/purpose if found in web research but missing from document
5. Ensure all strategy items follow the headline + subtitle + description format`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      temperature: 0.1,
      messages: [
        { role: "system", content: synthesisPrompt },
        { role: "user", content: `Synthesize the comprehensive customer profile for ${companyName}. Return the enhanced data structure with web-enriched fields clearly marked.` }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_enriched_profile",
            description: "Return the synthesized customer profile with document + web data merged",
            parameters: {
              type: "object",
              properties: {
                companyVision: { type: "string", description: "Company's stated vision/purpose (from web if not in document)" },
                companyMission: { type: "string", description: "Company's mission statement (from web if not in document)" },
                corporateStrategy: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Action-oriented strategy theme (e.g., 'Strengthen customer focus')" },
                      description: { type: "string", description: "Completing phrase + explanation (e.g., 'and profitable growth - Focus on...')" },
                      source: { type: "string", enum: ["document", "web", "both"], description: "Where this came from" }
                    },
                    required: ["title", "description", "source"]
                  }
                },
                digitalStrategies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Digital/tech initiative name" },
                      description: { type: "string", description: "Initiative explanation" },
                      source: { type: "string", enum: ["document", "web", "both"] }
                    },
                    required: ["title", "description", "source"]
                  }
                },
                ceoBoardPriorities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "CEO/Board priority" },
                      description: { type: "string", description: "Priority explanation" },
                      source: { type: "string", enum: ["document", "web", "both"] }
                    },
                    required: ["title", "description", "source"]
                  }
                },
                sustainabilityGoals: { type: "string", description: "Net zero / ESG targets" },
                keyExecutivesEnriched: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      title: { type: "string" },
                      priorities: { type: "string" },
                      relevance: { type: "string" }
                    }
                  }
                }
              },
              required: ["corporateStrategy"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "return_enriched_profile" } }
    }),
  });

  if (!response.ok) {
    console.error("Synthesis API error:", response.status);
    return documentData; // Fall back to document-only data
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (!toolCall) {
    console.log("No synthesis tool call, returning document data");
    return documentData;
  }

  try {
    const enrichedProfile = JSON.parse(toolCall.function.arguments);
    console.log("Successfully synthesized enriched profile");

    // Merge enriched data back into document data
    const merged = { ...documentData };
    
    if (enrichedProfile.companyVision) {
      (merged as any).companyVision = enrichedProfile.companyVision;
    }
    if (enrichedProfile.companyMission) {
      (merged as any).companyMission = enrichedProfile.companyMission;
    }
    if (enrichedProfile.corporateStrategy?.length > 0) {
      (merged as any).corporateStrategy = enrichedProfile.corporateStrategy.map((s: any) => ({
        title: s.title,
        description: s.description,
        source: s.source
      }));
    }
    if (enrichedProfile.digitalStrategies?.length > 0) {
      (merged as any).digitalStrategies = enrichedProfile.digitalStrategies.map((s: any) => ({
        title: s.title,
        description: s.description,
        source: s.source
      }));
    }
    if (enrichedProfile.ceoBoardPriorities?.length > 0) {
      (merged as any).ceoBoardPriorities = enrichedProfile.ceoBoardPriorities.map((s: any) => ({
        title: s.title,
        description: s.description,
        source: s.source
      }));
    }
    if (enrichedProfile.sustainabilityGoals && !(merged as any).netZeroTarget) {
      (merged as any).netZeroTarget = enrichedProfile.sustainabilityGoals;
    }
    if (enrichedProfile.keyExecutivesEnriched?.length > 0 && !((merged as any).keyExecutives?.length > 0)) {
      (merged as any).keyExecutives = enrichedProfile.keyExecutivesEnriched;
    }

    return merged;
  } catch (parseErr) {
    console.error("Failed to parse synthesis response:", parseErr);
    return documentData;
  }
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
    const initialPrompt = `You are a precision data extraction system. Your SOLE purpose is to extract FACTUAL information from the document provided.

═══════════════════════════════════════════════════════════════
ABSOLUTE RULE #1: ACCURACY IS NON-NEGOTIABLE
═══════════════════════════════════════════════════════════════

BEFORE YOU EXTRACT ANYTHING:
1. Read the ENTIRE document first
2. Identify the EXACT company name as it appears in the document header, title page, or legal name
3. The company name MUST be copied EXACTLY as written - no modifications, no guessing
4. If the document is from "XYZ Corporation", output "XYZ Corporation" - not "XYZ" or "XYZ Corp" or anything else

CRITICAL EXTRACTION RULES:
- ONLY extract information that is EXPLICITLY stated in the provided document
- Use the EXACT words, phrases, and figures from the document
- If a piece of information is not in the document, return an EMPTY STRING - never fabricate
- Financial figures must be copied EXACTLY as written (e.g., "$55.5 billion" not "$55B")
- Executive names must be spelled EXACTLY as they appear
- If you are unsure about ANY fact, DO NOT include it

WHAT YOU MUST NEVER DO:
❌ Never make up a company name
❌ Never guess financial figures
❌ Never fabricate executive names
❌ Never create information that isn't in the document
❌ Never use generic placeholder content
❌ Never hallucinate strategies or initiatives

${accountContextStr}

═══════════════════════════════════════════════════════════════
EXTRACTION INSTRUCTIONS
═══════════════════════════════════════════════════════════════

STEP 1: COMPANY IDENTIFICATION (MANDATORY FIRST STEP)
- Find the official company name on the cover page, header, or legal disclaimers
- Look for patterns like "[Company Name] Annual Report" or "Report of [Company Name]"
- The accountName field MUST match the exact company name from the document
- If you cannot determine the company name with certainty, leave it empty

STEP 2: FINANCIAL DATA EXTRACTION
- Revenue: Copy EXACTLY as stated (e.g., "Revenue of €47.2 billion")
- Growth rates: Copy EXACTLY (e.g., "5.3% increase year-over-year")
- EBIT/Margins: Copy EXACTLY as written
- Only extract figures you can find explicitly stated

STEP 3: EXECUTIVE SUMMARY
- Write 2-3 sentences summarizing the company using ONLY facts from the document
- Include: company name (as extracted), industry/what they do, and key facts
- DO NOT describe "the document" - describe the COMPANY

STEP 4: STRATEGY EXTRACTION (THIS IS THE PART YOU KEEP GETTING WRONG)
- Ignore business units/segments, service lines, and org structure. Examples of what is NOT a strategy: "Ocean", "Logistics & Services", "Terminals", "Air", "Supply Chain".
- Find ENTERPRISE-WIDE strategic priorities/pillars/initiatives (often phrased as action statements).
- Prefer headings/bullets that start with an action verb: Strengthen / Drive / Accelerate / Transform / Improve / Expand / Enable / Modernize.
- CORPORATE strategy: customer/growth/efficiency/sustainability/network excellence themes (enterprise-level, not segments).
- DIGITAL/AI strategy: ONLY items explicitly about technology, digital, data, AI, automation, platform, cloud, cybersecurity, IT.
- CEO/Board priorities: ONLY priorities explicitly attributed to CEO/Chair/Board communication (CEO letter, chairman statement, investor day).
- If you cannot find clear items in the text for a category, return an empty array for that category.
- Use the report’s language, but you may convert noun phrases into action statements if that better matches how the report describes intent.

STEP 5: PAIN POINTS & OPPORTUNITIES
- Derive from explicitly stated challenges, risks, or strategic gaps
- Use the customer's exact terminology
- Connect to stated business priorities

STEP 6: SWOT ANALYSIS
- Base on facts from the document
- Strengths/Weaknesses: What the company says about itself
- Opportunities/Threats: Market factors mentioned in the report

STEP 7: EXECUTIVE EXTRACTION
- Only include executives explicitly named in the document
- Copy names and titles EXACTLY as written
- Only attribute priorities that are explicitly stated

QUALITY CHECK BEFORE RESPONDING:
□ Is accountName the EXACT company name from the document?
□ Are all financial figures copied EXACTLY as written?
□ Are all executive names spelled correctly as they appear?
□ Is every piece of information traceable to the document?
□ Have I left empty any fields where data wasn't found?`;

    const userPrompt = `DOCUMENT FOR EXTRACTION:

${validatedContent}

═══════════════════════════════════════════════════════════════
YOUR TASK:
═══════════════════════════════════════════════════════════════

1. FIRST: Find and note the exact company name from this document
2. Extract ONLY factual information that appears in this document
3. Use EXACT wording - do not paraphrase or generalize
4. Leave fields EMPTY if the information is not in the document
5. For accountName: Use the EXACT legal/official company name as it appears

CRITICAL: Your accountName output MUST match exactly what is written in this document. If the document says "Acme Corporation" then output "Acme Corporation" - not "Acme" or "ACME Corporation" or anything else.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          temperature: 0,
          messages: [
            { role: "system", content: initialPrompt },
            { role: "user", content: userPrompt }
          ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_annual_report_data",
              description: "Extract ONLY factual data that appears explicitly in the provided document. Never fabricate information.",
              parameters: {
                type: "object",
                properties: {
                  accountName: { type: "string", description: "EXACT company name as written in the document header/title. Copy character-for-character. If document says 'ABC Ltd' output 'ABC Ltd' exactly." },
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
                        title: {
                          type: "string",
                          description:
                            "ENTERPRISE corporate strategy theme written as an action statement (start with a verb). Must not be a business unit/segment name. Example: 'Strengthen customer focus'.",
                        },
                        description: {
                          type: "string",
                          description:
                            "2-3 sentences explaining what the report says about this theme and why it matters (can include completing phrase like 'and profitable growth').",
                        },
                      },
                      required: ["title", "description"],
                    }, 
                    description: "0-6 CORPORATE strategy themes (enterprise-level). Do NOT list segments/business units. Must not overlap with digitalStrategies." 
                  },
                  digitalStrategies: { 
                    type: "array", 
                    items: { 
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description:
                            "DIGITAL/TECH strategy theme as an action statement. MUST explicitly reference technology/digital/data/AI/automation/platform/cloud/cyber/IT.",
                        },
                        description: { 
                          type: "string",
                          description:
                            "1-2 sentences describing the digital initiative as stated in the report. If not explicitly stated, do not invent.",
                        },
                      },
                      required: ["title", "description"],
                    }, 
                    description: "0-6 DIGITAL/AI strategy themes. If none are explicitly stated, return an empty array. Must not duplicate corporateStrategy." 
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

    // Debug: Log the full response structure
    const message = data.choices?.[0]?.message;
    console.log("Message structure:", JSON.stringify({
      hasToolCalls: !!message?.tool_calls,
      toolCallsLength: message?.tool_calls?.length,
      hasContent: !!message?.content,
      contentPreview: message?.content?.substring(0, 200)
    }));

    const toolCall = message?.tool_calls?.[0];
    
    // Handle case where AI responds with content instead of tool call
    if (!toolCall) {
      console.error("No tool call in response. Message content:", message?.content?.substring(0, 500));
      
      // Try to parse JSON from content as fallback
      if (message?.content) {
        try {
          // Look for JSON in the response
          const jsonMatch = message.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.accountName) {
              console.log("Recovered data from content fallback");
              return new Response(
                JSON.stringify({ 
                  success: true, 
                  data: parsed,
                  dataSources: {},
                  usedWebSearch: false,
                  warning: "Data extracted from fallback parsing"
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
        } catch (parseErr) {
          console.error("Fallback parsing failed:", parseErr);
        }
      }
      throw new Error("AI did not return structured data. Please try again.");
    }
    
    if (toolCall.function.name !== "extract_annual_report_data") {
      console.error("Wrong function called:", toolCall.function.name);
      throw new Error("AI used wrong extraction function");
    }

    let extractedData: Record<string, unknown>;
    try {
      extractedData = JSON.parse(toolCall.function.arguments);
    } catch (parseErr) {
      console.error("Failed to parse tool arguments:", toolCall.function.arguments?.substring(0, 500));
      throw new Error("Failed to parse AI response data");
    }

    // Post-process strategy lists to avoid the common failure mode where the model
    // confuses business units/segments for strategies (e.g., "Ocean", "Logistics & Services").
    type StrategyItem = { title: string; description: string };

    const normalizeKey = (s: { title?: string; description?: string }) =>
      `${(s.title ?? "").trim().toLowerCase().replace(/\s+/g, " ")}||${(s.description ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")}`;

    const toStrategyArray = (val: unknown): StrategyItem[] =>
      Array.isArray(val)
        ? (val as any[])
            .map((it) => ({ title: String(it?.title ?? ""), description: String(it?.description ?? "") }))
            .map((it) => ({ title: it.title.trim(), description: it.description.trim() }))
            .filter((it) => it.title.length > 0 || it.description.length > 0)
        : [];

    const dedupe = (items: StrategyItem[]) => {
      const seen = new Set<string>();
      return items.filter((it) => {
        const key = normalizeKey(it);
        if (key === "||") return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    const verbStart = /^(strengthen|drive|accelerate|transform|improve|expand|enable|moderni[sz]e|optimi[sz]e|increase|reduce|build|grow|scale|deliver|advance|reinvent|simplif(y|y)|unif(y|y)|protect|sustain|decarboni[sz]e)\b/i;
    const digitalSignals = /(digital|technology|tech|ai|artificial intelligence|data|analytics|automation|platform|cloud|cyber|cybersecurity|it\b|systems|moderni[sz]ation)/i;

    const corporateRaw = dedupe(toStrategyArray((extractedData as any).corporateStrategy));
    const digitalRaw = dedupe(toStrategyArray((extractedData as any).digitalStrategies));

    // Filter digital list to items that actually read like digital/tech initiatives.
    const digitalFiltered = digitalRaw.filter((it) => digitalSignals.test(`${it.title} ${it.description}`));

    // Prefer corporate themes that are action statements; segment-like noun labels tend to fail this.
    // (We do not force-empty if none match; we keep the raw list as fallback so the user can edit.)
    const corporatePreferred = corporateRaw.filter((it) => verbStart.test(it.title));
    const corporateFinal = corporatePreferred.length > 0 ? corporatePreferred : corporateRaw;

    // Prevent corporate items from being duplicated into digital.
    const corporateKeys = new Set(corporateFinal.map(normalizeKey));
    const digitalFinal = digitalFiltered.filter((it) => !corporateKeys.has(normalizeKey(it)));

    (extractedData as any).corporateStrategy = corporateFinal;
    (extractedData as any).digitalStrategies = digitalFinal;

    const companyName = String(extractedData.accountName || "").trim();

    // Track data sources
    const dataSources: Record<string, "document" | "web" | "both"> = {};
    const documentFields = Object.keys(extractedData).filter(k => {
      const val = extractedData[k];
      return val && val !== "N/A" && val !== "Not specified" && 
        (typeof val === "string" ? val.length > 0 : Array.isArray(val) && val.length > 0);
    });
    documentFields.forEach(f => dataSources[f] = "document");

    // PHASE 2: Web research enrichment (if company name was extracted and Firecrawl is configured)
    let finalData = extractedData;
    let usedWebSearch = false;

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (companyName && companyName.length > 2 && firecrawlKey) {
      console.log(`Starting web research enrichment for: ${companyName}`);
      
      try {
        const webData = await fetchComprehensiveWebData(companyName);
        
        if (webData.hasData) {
          usedWebSearch = true;
          console.log("Web data found, synthesizing comprehensive profile...");
          
          // Synthesize document + web data
          finalData = await synthesizeCustomerProfile(extractedData, webData, LOVABLE_API_KEY!);
          
          // Update data sources for web-enriched fields
          const finalDataAny = finalData as any;
          ["corporateStrategy", "digitalStrategies", "ceoBoardPriorities"].forEach(field => {
            const items = finalDataAny[field];
            if (Array.isArray(items)) {
              items.forEach((item: any) => {
                if (item.source === "web") {
                  dataSources[field] = "web";
                } else if (item.source === "both") {
                  dataSources[field] = "both";
                }
              });
            }
          });
          
          if (finalDataAny.companyVision) dataSources["companyVision"] = "web";
          if (finalDataAny.companyMission) dataSources["companyMission"] = "web";
        }
      } catch (webError) {
        console.error("Web enrichment failed, continuing with document data:", webError);
        // Continue with document-only data
      }
    } else if (!firecrawlKey) {
      console.log("Firecrawl not configured, skipping web enrichment");
    } else {
      console.log("No company name extracted, skipping web enrichment");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: finalData,
        dataSources,
        usedWebSearch 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return createErrorResponse(500, "Failed to analyze report. Please try again.", error);
  }
});
