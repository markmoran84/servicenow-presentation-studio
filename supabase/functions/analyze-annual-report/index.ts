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

    // Senior Corporate Strategist Analysis Prompt
    const initialPrompt = `═══════════════════════════════════════════════════════════════
ROLE & SENIORITY
═══════════════════════════════════════════════════════════════
You are acting as a senior corporate strategy leader (Group Strategy / Board Office level) with responsibility for deep strategic analysis of published company materials.

Your role is to UNDERSTAND, CONNECT, and FRAME the organisation's strategy as it is INTENDED, even when:
- Terminology varies across sections or documents
- Strategy is implicit rather than explicitly labelled
- Language differs between CEO statements, investor sections, and operational commentary

═══════════════════════════════════════════════════════════════
PRIMARY OBJECTIVE
═══════════════════════════════════════════════════════════════
Read the provided document and identify the organisation's CORPORATE STRATEGY, DIGITAL STRATEGY, and CEO/BOARD PRIORITIES based on CONTEXTUAL UNDERSTANDING — not keyword matching.

You MUST:
1. PRESERVE the original intent and meaning
2. Use language AS CLOSE AS POSSIBLE to the company's own phrasing
3. AVOID inventing new strategy constructs or consultant-style labels
4. DO NOT convert strategy into action-verb themes
5. DO NOT introduce external frameworks or renamed pillars
6. DO NOT modernise language or add strategic ambition that is not stated

Your task is to FRAME the strategy so it is understandable, NOT to rewrite it.

${accountContextStr}

═══════════════════════════════════════════════════════════════
HOW TO HANDLE TERMINOLOGY VARIATIONS (CRITICAL)
═══════════════════════════════════════════════════════════════
The same strategic intent may be expressed using different words (e.g., "integration," "end-to-end solutions," "connected supply chains").

In these cases:
- Treat them as the SAME strategic intent ONLY if the context clearly supports it
- Frame the strategy using the MOST REPRESENTATIVE or DOMINANT wording used by the company
- Acknowledge terminology variation where relevant, without redefining it
- Do not force exact wording if it obscures meaning — clarity of intent takes precedence over literal repetition

═══════════════════════════════════════════════════════════════
HOW TO IDENTIFY STRATEGY WHEN IT IS IMPLICIT
═══════════════════════════════════════════════════════════════
Strategy may NOT appear under a "Strategy" heading. You should INFER strategic intent by analysing:
- Repetition across CEO messages, board commentary, and outlook sections
- Long-term commitments, investment priorities, and structural changes
- Statements describing what the company IS BECOMING, not just what it is doing this quarter

HOWEVER:
- Inference must be DIRECTLY grounded in the text
- If intent is implied rather than explicit, clearly label it as "contextually derived"

═══════════════════════════════════════════════════════════════
EXTRACTION & FRAMING RULES
═══════════════════════════════════════════════════════════════

STEP 1: COMPANY IDENTIFICATION
- Find the official company name on the cover page, header, or legal disclaimers
- The accountName field MUST match the EXACT company name from the document

STEP 2: FINANCIAL DATA
- Copy revenue, growth rates, EBIT/margins EXACTLY as stated
- Only extract figures you can find explicitly stated

STEP 3: EXECUTIVE SUMMARY
- Write 2-3 sentences summarizing the company using ONLY facts from the document
- Describe the COMPANY (market position, scale, strategic direction), not "the document"

STEP 4: CORPORATE STRATEGY (Contextually Framed)
For each strategy element, provide:
- Strategy statement: NEAR-VERBATIM or contextually framed from the company's language
- Confidence: "explicit" (clearly stated) OR "contextually_derived" (not directly stated but clearly supported)
- Source reference: Where it appears (section/context, e.g., "CEO Letter", "Strategic Priorities section")
- Terminology notes: Any variation in how this is expressed across the document

WHAT CORPORATE STRATEGY IS:
- Enterprise-wide strategic direction and themes
- Enduring commitments that define what the company is becoming
- Priorities that appear consistently across CEO/Chair/outlook sections

WHAT CORPORATE STRATEGY IS NOT:
- Business units or segments (e.g., "Ocean", "Logistics", "Terminals" are NOT strategies)
- Operational performance metrics
- Short-term tactical activities

STEP 5: DIGITAL & TECHNOLOGY STRATEGY (Explicit or Implied)
- ONLY include items that explicitly reference technology, digital, data, AI, automation, platform, cloud, IT
- Use the company's own language — do not translate into tech buzzwords
- Mark confidence as "explicit" or "contextually_derived"
- If NO digital strategy is clearly stated or implied, return an EMPTY array

STEP 6: CEO / BOARD PRIORITIES
- Evidenced priorities from CEO Letter, Chairman Statement, or Investor Communications
- Note how frequently or strongly they appear
- Include source reference
- These should reflect LEADERSHIP emphasis, not operational detail

STEP 7: PAIN POINTS & OPPORTUNITIES
- Derive from explicitly stated challenges, risks, or strategic gaps
- Use the customer's exact terminology

STEP 8: SWOT ANALYSIS
- Strengths/Weaknesses: What the company says about itself
- Opportunities/Threats: Market factors mentioned in the report

STEP 9: EXECUTIVE EXTRACTION
- Only include executives explicitly named in the document
- Copy names and titles EXACTLY as written

═══════════════════════════════════════════════════════════════
ANALYTICAL LENS (How to Think)
═══════════════════════════════════════════════════════════════
Apply senior-strategist judgement to:
- DISTINGUISH corporate strategy from operational performance
- SEPARATE enduring strategic direction from short-term commentary
- IDENTIFY what the CEO and Board consistently emphasise versus supporting detail

This judgement influences SELECTION and GROUPING, not wording.

═══════════════════════════════════════════════════════════════
CONFIDENCE & INTEGRITY CHECK
═══════════════════════════════════════════════════════════════
For each strategy element, assign one of:
- "explicit" — clearly stated in the text
- "contextually_derived" — not directly stated but clearly supported

If intent is unclear or weakly supported, DO NOT include it.

═══════════════════════════════════════════════════════════════
FINAL VALIDATION
═══════════════════════════════════════════════════════════════
Before responding, verify that:
□ A company executive would recognise this as their strategy
□ Nothing has been introduced that could not be defended with a source reference
□ The framing reflects strategic intent, not consultant interpretation
□ Corporate Strategy, Digital Strategy, and CEO Priorities are DISTINCT (no duplication)`;

    const userPrompt = `DOCUMENT FOR STRATEGIC ANALYSIS:

${validatedContent}

═══════════════════════════════════════════════════════════════
YOUR TASK AS SENIOR STRATEGIST:
═══════════════════════════════════════════════════════════════

1. Read the ENTIRE document comprehensively
2. Identify the EXACT company name as it appears officially
3. Apply senior-strategist judgement to distinguish:
   - Corporate strategy from operational performance
   - Enduring strategic direction from short-term commentary
   - What leadership consistently emphasises vs supporting detail
4. PRESERVE the company's own language — do not rewrite into consultant frameworks
5. For each strategy element, note:
   - Whether it is EXPLICIT or CONTEXTUALLY DERIVED
   - Where in the document it appears (CEO Letter, Strategy section, etc.)
6. If intent is unclear or weakly supported, state: "This cannot be reliably concluded from the published material"

CRITICAL: A company executive must be able to recognise this as THEIR strategy, not a consultant's interpretation.`;

    // Truncate content if too large to prevent model failures
    const maxContentLength = 200000; // ~200k chars max to leave room for prompt
    const truncatedContent = validatedContent.length > maxContentLength 
      ? validatedContent.substring(0, maxContentLength) + "\n\n[Document truncated for processing]"
      : validatedContent;

    const userPromptFinal = `DOCUMENT FOR STRATEGIC ANALYSIS:

${truncatedContent}

═══════════════════════════════════════════════════════════════
YOUR TASK AS SENIOR STRATEGIST:
═══════════════════════════════════════════════════════════════

1. Read the ENTIRE document comprehensively
2. Identify the EXACT company name as it appears officially
3. Apply senior-strategist judgement to distinguish:
   - Corporate strategy from operational performance
   - Enduring strategic direction from short-term commentary
   - What leadership consistently emphasises vs supporting detail
4. PRESERVE the company's own language — do not rewrite into consultant frameworks
5. For each strategy element, note:
   - Whether it is EXPLICIT or CONTEXTUALLY DERIVED
   - Where in the document it appears (CEO Letter, Strategy section, etc.)
6. If intent is unclear or weakly supported, state: "This cannot be reliably concluded from the published material"

CRITICAL: A company executive must be able to recognise this as THEIR strategy, not a consultant's interpretation.`;

    // Make API request with retry logic
    const models = ["google/gemini-3-flash-preview", "google/gemini-2.5-flash"];
    let response: Response | null = null;
    let lastError: Error | null = null;
    let aiData: any | null = null;

    for (const model of models) {
      console.log(`Attempting analysis with model: ${model}`);

      try {
        response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 16000,
            messages: [
              { role: "system", content: initialPrompt },
              { role: "user", content: userPromptFinal },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_annual_report_data",
                  description:
                    "Extract strategic intelligence as a senior corporate strategist would frame it. Preserve company language, note confidence levels, include source references.",
                  parameters: {
                    type: "object",
                    properties: {
                      accountName: {
                        type: "string",
                        description:
                          "EXACT company name as written in the document header/title. Copy character-for-character.",
                      },
                      industry: {
                        type: "string",
                        description:
                          "Primary industry/sector with specificity using company's own terminology",
                      },
                      revenue: {
                        type: "string",
                        description: "Total revenue with currency and period, EXACTLY as stated",
                      },
                      revenueComparison: { type: "string", description: "Prior year revenue for comparison" },
                      growthRate: {
                        type: "string",
                        description: "YoY growth rate with context, EXACTLY as stated",
                      },
                      ebitImprovement: { type: "string", description: "EBIT improvement or margin change" },
                      marginEBIT: { type: "string", description: "EBIT margin percentage or absolute figure" },
                      costPressureAreas: {
                        type: "string",
                        description: "Key cost pressure areas mentioned by leadership",
                      },
                      strategicInvestmentAreas: {
                        type: "string",
                        description: "Where the company is investing for growth",
                      },
                      corporateStrategy: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: {
                              type: "string",
                              description: "Strategy statement using the company's OWN language",
                            },
                            description: {
                              type: "string",
                              description: "2-3 sentences explaining what the report says",
                            },
                            confidence: { type: "string", enum: ["explicit", "contextually_derived"] },
                            sourceReference: { type: "string", description: "Where this appears" },
                          },
                          required: ["title", "description", "confidence", "sourceReference"],
                        },
                        description: "Corporate strategy elements framed in company's own language",
                      },
                      digitalStrategies: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: {
                              type: "string",
                              description: "Digital/tech strategy using company's OWN terminology",
                            },
                            description: {
                              type: "string",
                              description: "Explanation using company's language",
                            },
                            confidence: { type: "string", enum: ["explicit", "contextually_derived"] },
                            sourceReference: { type: "string", description: "Where this appears" },
                          },
                          required: ["title", "description", "confidence", "sourceReference"],
                        },
                        description: "ONLY digital/technology strategies",
                      },
                      ceoBoardPriorities: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string", description: "CEO/Board priority in their own words" },
                            description: {
                              type: "string",
                              description: "Explanation with emphasis",
                            },
                            confidence: { type: "string", enum: ["explicit", "contextually_derived"] },
                            sourceReference: { type: "string", description: "Source location" },
                          },
                          required: ["title", "description", "confidence", "sourceReference"],
                        },
                        description: "Priorities explicitly attributed to CEO/Chair/Board",
                      },
                      transformationThemes: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { title: { type: "string" }, description: { type: "string" } },
                          required: ["title", "description"],
                        },
                        description: "3-5 digital/operational transformation themes",
                      },
                      painPoints: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string", description: "5-7 word punchy headline" },
                            description: {
                              type: "string",
                              description: "1-2 sentences linking pain to priority",
                            },
                          },
                          required: ["title", "description"],
                        },
                        description: "3-5 strategically-aligned pain points",
                      },
                      opportunities: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string", description: "Action-oriented 5-8 word headline" },
                            description: { type: "string", description: "Exec-ready value proposition" },
                          },
                          required: ["title", "description"],
                        },
                        description: "3-5 ServiceNow opportunities",
                      },
                      strengths: { type: "array", items: { type: "string" }, description: "4-6 strengths" },
                      weaknesses: { type: "array", items: { type: "string" }, description: "4-6 weaknesses" },
                      swotOpportunities: {
                        type: "array",
                        items: { type: "string" },
                        description: "4-6 opportunities",
                      },
                      threats: { type: "array", items: { type: "string" }, description: "4-6 threats" },
                      netZeroTarget: { type: "string", description: "Sustainability/Net Zero commitment" },
                      keyMilestones: { type: "array", items: { type: "string" }, description: "3-5 key milestones" },
                      strategicAchievements: {
                        type: "array",
                        items: { type: "string" },
                        description: "3-5 strategic achievements",
                      },
                      executiveSummaryNarrative: { type: "string", description: "2-3 sentence board-ready summary" },
                      keyExecutives: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            title: { type: "string" },
                            priorities: { type: "string" },
                            relevance: { type: "string" },
                          },
                          required: ["name", "title", "priorities", "relevance"],
                        },
                        description: "5-8 key executives",
                      },
                    },
                    required: [
                      "accountName",
                      "executiveSummaryNarrative",
                      "painPoints",
                      "opportunities",
                      "strengths",
                      "weaknesses",
                      "swotOpportunities",
                      "threats",
                      "keyExecutives",
                    ],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "extract_annual_report_data" } },
          }),
        });

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

        if (response.ok) {
          // IMPORTANT: Response bodies can only be read once. Parse + keep it.
          const parsed = await response.json();
          const message = parsed.choices?.[0]?.message;
          const toolCall = message?.tool_calls?.[0];

          if (toolCall && toolCall.function.name === "extract_annual_report_data") {
            console.log(`Success with model: ${model}`);
            aiData = parsed;
            break;
          }

          console.log(`Model ${model} returned no tool call, trying next...`);
          lastError = new Error("No tool call returned");
          aiData = null;
        } else {
          const errorText = await response.text();
          console.error(`Model ${model} failed:`, response.status, errorText);
          lastError = new Error(`AI gateway error: ${response.status}`);
          aiData = null;
        }
      } catch (err) {
        console.error(`Model ${model} threw error:`, err);
        lastError = err instanceof Error ? err : new Error(String(err));
        aiData = null;
      }
    }

    if (!response || !response.ok || !aiData) {
      throw lastError || new Error("All models failed to analyze document");
    }

    const data = aiData;
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

    // Post-process strategy lists - preserve company language but ensure distinctness
    type StrategyItem = { 
      title: string; 
      description: string; 
      confidence?: string; 
      sourceReference?: string;
    };

    const normalizeKey = (s: { title?: string; description?: string }) =>
      `${(s.title ?? "").trim().toLowerCase().replace(/\s+/g, " ")}||${(s.description ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")}`;

    const toStrategyArray = (val: unknown): StrategyItem[] =>
      Array.isArray(val)
        ? (val as any[])
            .map((it) => ({ 
              title: String(it?.title ?? "").trim(), 
              description: String(it?.description ?? "").trim(),
              confidence: String(it?.confidence ?? "explicit"),
              sourceReference: String(it?.sourceReference ?? "")
            }))
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

    // Business unit/segment names to filter out (these are NOT strategies)
    const businessUnitPatterns = /^(ocean|logistics|terminals|air|supply chain|freight|shipping|services|ports|warehousing|trucking|rail|intermodal)$/i;
    const digitalSignals = /(digital|technology|tech|ai|artificial intelligence|data|analytics|automation|platform|cloud|cyber|cybersecurity|it\b|systems|moderni[sz]ation)/i;

    const corporateRaw = dedupe(toStrategyArray((extractedData as any).corporateStrategy));
    const digitalRaw = dedupe(toStrategyArray((extractedData as any).digitalStrategies));

    // Filter out pure business unit names from corporate strategy
    const corporateFinal = corporateRaw.filter((it) => !businessUnitPatterns.test(it.title.trim()));

    // Filter digital list to items that actually reference digital/tech
    const digitalFiltered = digitalRaw.filter((it) => digitalSignals.test(`${it.title} ${it.description}`));

    // Prevent corporate items from being duplicated into digital
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
