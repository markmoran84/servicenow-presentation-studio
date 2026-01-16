import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Search for company information to enrich talking notes
async function searchCompanyInfo(companyName: string, searchType: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping web search");
    return "";
  }

  try {
    const sanitizedName = companyName.replace(/[^\w\s-]/g, '').substring(0, 100);
    
    const queries: Record<string, string> = {
      news: `${sanitizedName} latest news announcements 2024 2025`,
      earnings: `${sanitizedName} earnings call investor day key messages CEO quotes`,
      industry: `${sanitizedName} industry trends market position competitive landscape`,
      challenges: `${sanitizedName} challenges transformation digital initiatives press release`,
    };

    const query = queries[searchType] || `${sanitizedName} business overview`;
    console.log(`Searching ${searchType} for talking notes`);

    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 3,
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
      .slice(0, 6000);

    console.log(`Found ${results.length} results for ${searchType}`);
    return content;
  } catch (error) {
    console.error(`Search error for ${searchType}`);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData, documentContent, slideInfo, audienceType = "external" } = await req.json();

    if (!accountData?.basics?.accountName) {
      return new Response(
        JSON.stringify({ success: false, error: "Account name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const companyName = accountData.basics.accountName;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch web intelligence in parallel
    console.log(`Fetching web intelligence for ${companyName}`);
    const [newsData, earningsData, industryData, challengesData] = await Promise.all([
      searchCompanyInfo(companyName, "news"),
      searchCompanyInfo(companyName, "earnings"),
      searchCompanyInfo(companyName, "industry"),
      searchCompanyInfo(companyName, "challenges"),
    ]);

    const webContext = `
═══════════════════════════════════════════════════════════════
LIVE WEB INTELLIGENCE (Use to make notes current and compelling)
═══════════════════════════════════════════════════════════════
${newsData ? `\n📰 RECENT NEWS & ANNOUNCEMENTS:\n${newsData.slice(0, 3000)}\n` : ""}
${earningsData ? `\n📊 EARNINGS & INVESTOR MESSAGING:\n${earningsData.slice(0, 3000)}\n` : ""}
${industryData ? `\n🏢 INDUSTRY & COMPETITIVE CONTEXT:\n${industryData.slice(0, 2000)}\n` : ""}
${challengesData ? `\n⚠️ CHALLENGES & TRANSFORMATION:\n${challengesData.slice(0, 2000)}\n` : ""}
`;

    // Build slide context from slideInfo
    const slideContext = slideInfo?.map((slide: any) => 
      `- ${slide.label}: ${slide.description || 'Presentation slide'}`
    ).join('\n') || '';

    // Build account context
    const accountContext = `
═══════════════════════════════════════════════════════════════
ACCOUNT CONTEXT
═══════════════════════════════════════════════════════════════
COMPANY: ${companyName}
INDUSTRY: ${accountData.basics.industry || 'Not specified'}
REGION: ${accountData.basics.region || 'Not specified'}
TIER: ${accountData.basics.tier || 'Enterprise'}

FINANCIAL POSITION:
- Revenue: ${accountData.financial?.customerRevenue || 'Unknown'}
- Growth: ${accountData.financial?.growthRate || 'Unknown'}
- EBIT Margin: ${accountData.financial?.marginEBIT || 'Unknown'}

STRATEGIC PRIORITIES:
${accountData.strategy?.corporateStrategy?.map((s: any) => `- ${s.title}: ${s.description}`).join('\n') || 'Not defined'}

CEO/BOARD PRIORITIES:
${accountData.strategy?.ceoBoardPriorities?.map((p: any) => `- ${p.title}: ${p.description}`).join('\n') || 'Not defined'}

PAIN POINTS IDENTIFIED:
${accountData.painPoints?.painPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join('\n') || 'Not defined'}

KEY OPPORTUNITIES:
${accountData.opportunities?.opportunities?.map((o: any) => `- ${o.title}: ${o.description}`).join('\n') || 'Not defined'}

SWOT SUMMARY:
- Strengths: ${accountData.swot?.strengths?.slice(0, 3).join(', ') || 'Not analyzed'}
- Weaknesses: ${accountData.swot?.weaknesses?.slice(0, 3).join(', ') || 'Not analyzed'}
- Opportunities: ${accountData.swot?.opportunities?.slice(0, 3).join(', ') || 'Not analyzed'}
- Threats: ${accountData.swot?.threats?.slice(0, 3).join(', ') || 'Not analyzed'}
`;

    const documentContext = documentContent ? `
═══════════════════════════════════════════════════════════════
UPLOADED DOCUMENT CONTENT (Annual Report / Account Plan)
═══════════════════════════════════════════════════════════════
${documentContent.slice(0, 30000)}
` : '';

    // Audience-specific guidance
    const audienceGuidance = audienceType === "internal" 
      ? `
═══════════════════════════════════════════════════════════════
AUDIENCE: INTERNAL STAKEHOLDERS
═══════════════════════════════════════════════════════════════

This presentation is for INTERNAL stakeholders (leadership, account teams, sales reviews).

ADJUST YOUR NOTES TO:
- Be candid about challenges and risks - internal audiences need the full picture
- Include competitive positioning and internal strategy discussions
- Reference internal metrics, pipeline numbers, and forecasts openly
- Discuss resource needs, asks, and escalations directly
- Use internal terminology and acronyms freely
- Include win/loss analysis and lessons learned
- Be direct about what support is needed from leadership
- Discuss internal dependencies and coordination needs
- Include honest assessments of competitive threats
- Reference internal playbooks and methodologies
`
      : `
═══════════════════════════════════════════════════════════════
AUDIENCE: EXTERNAL CUSTOMER
═══════════════════════════════════════════════════════════════

This presentation is for CUSTOMER/EXTERNAL stakeholders (executives at ${companyName}).

ADJUST YOUR NOTES TO:
- Focus on customer value and outcomes, not internal metrics
- Avoid internal jargon, acronyms, and processes
- Emphasize partnership language and collaborative framing
- Reference the customer's strategic priorities and how we align
- Use their terminology and industry language
- Focus on business outcomes they care about
- Include thought leadership and industry insights
- Be polished and executive-ready in tone
- Avoid discussing internal pricing, margins, or competitive comparisons
- Frame everything in terms of their success, not ours
`;

    const systemPrompt = `You are an elite executive presentation coach and sales strategist. Your job is to create CONVERSATIONAL, NATURAL talking notes that help the presenter sound confident, knowledgeable, and compelling.

${audienceGuidance}

═══════════════════════════════════════════════════════════════
YOUR MISSION
═══════════════════════════════════════════════════════════════

Create presenter notes that are:
1. CONVERSATIONAL - Written as you would actually speak, not formal text
2. CONFIDENT - Use assertive language, not hedging
3. VALUE-FOCUSED - Always tie back to ${audienceType === "internal" ? "account success and internal objectives" : "customer outcomes"}
4. STORY-DRIVEN - Use real data points and examples from the research
5. EXECUTIVE-READY - Language appropriate for ${audienceType === "internal" ? "internal leadership" : "C-suite"} conversations

═══════════════════════════════════════════════════════════════
TONE & STYLE GUIDELINES
═══════════════════════════════════════════════════════════════

✅ DO:
- Use natural contractions: "we've", "you're", "they're"
- Include specific numbers and data points from research
- Reference recent news or announcements when relevant
- Use transition phrases: "What's interesting is...", "The key insight here..."
- Include rhetorical questions to engage
- Add emphasis cues: [PAUSE], [KEY POINT], [TRANSITION]
${audienceType === "internal" ? "- Be direct about challenges, risks, and asks\n- Include internal metrics and competitive intel" : "- Keep focus on customer value and partnership\n- Avoid internal terminology"}

❌ DON'T:
- Sound robotic or scripted
- Use corporate jargon without purpose
- Be vague when you have specific data
${audienceType === "internal" ? "- Sugarcoat challenges or risks" : "- Discuss internal pricing or competitive details"}
- Ignore the competitive context

═══════════════════════════════════════════════════════════════
OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════

For each slide, provide:
1. OPENING HOOK (1-2 sentences) - Attention-grabbing opener
2. KEY TALKING POINTS (3-5 bullets) - Main messages to convey
3. DATA POINTS TO MENTION - Specific numbers/facts to cite
4. ANTICIPATED QUESTIONS - What ${audienceType === "internal" ? "leadership" : "execs"} might ask, with suggested responses
5. TRANSITION TO NEXT - How to smoothly move to the next slide

${webContext}
${accountContext}
${documentContext}

SLIDES TO CREATE NOTES FOR:
${slideContext}
`;

    const userPrompt = audienceType === "internal" 
      ? `Generate comprehensive talking notes for presenting this account plan in an INTERNAL review setting (leadership, account team, sales reviews).

The notes should:
1. Be candid about challenges, risks, and asks
2. Include internal metrics and competitive intelligence
3. Reference pipeline, forecast, and resource needs directly
4. Anticipate questions from internal leadership
5. Build a compelling case for support and resources

This is an internal presentation about ${companyName} - we can be direct about our strategy, challenges, and what we need.`
      : `Generate comprehensive, conversational talking notes for presenting this account plan to executive stakeholders at ${companyName}.

The notes should:
1. Sound natural when spoken aloud
2. Include specific data points from the research
3. Reference recent company news/announcements when relevant
4. Anticipate executive questions
5. Build a compelling narrative across all slides

Make me sound like I deeply understand ${companyName}'s business, challenges, and opportunities.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_talking_notes",
              description: "Generate conversational talking notes for each presentation slide",
              parameters: {
                type: "object",
                properties: {
                  overallNarrative: {
                    type: "string",
                    description: "2-3 sentence summary of the key story arc across the entire presentation"
                  },
                  keyThemes: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 recurring themes to weave throughout the presentation"
                  },
                  slideNotes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        slideId: { type: "string", description: "Slide identifier (e.g., 'cover', 'executive-summary')" },
                        slideLabel: { type: "string", description: "Human-readable slide name" },
                        openingHook: { type: "string", description: "Attention-grabbing 1-2 sentence opener" },
                        keyPoints: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "3-5 main talking points in conversational tone"
                        },
                        dataToMention: {
                          type: "array",
                          items: { type: "string" },
                          description: "Specific numbers, quotes, or facts to cite"
                        },
                        anticipatedQuestions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              question: { type: "string" },
                              suggestedResponse: { type: "string" }
                            }
                          },
                          description: "Executive questions with suggested responses"
                        },
                        transitionToNext: { type: "string", description: "Smooth transition phrase to next slide" },
                        speakingDuration: { type: "string", description: "Suggested time for this slide (e.g., '2-3 minutes')" }
                      },
                      required: ["slideId", "slideLabel", "openingHook", "keyPoints"]
                    }
                  },
                  closingRecommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 tips for delivering this presentation effectively"
                  }
                },
                required: ["overallNarrative", "keyThemes", "slideNotes"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_talking_notes" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate talking notes" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const talkingNotes = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: talkingNotes,
        webSearchUsed: !!(newsData || earningsData || industryData || challengesData)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating talking notes:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
