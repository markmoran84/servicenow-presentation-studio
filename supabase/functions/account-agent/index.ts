import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert AI assistant for enterprise account planning. You have FULL AUTHORITY to create, modify, and adjust all aspects of the account plan, INCLUDING GENERATING COMPLETE PRESENTATION SLIDES.

You can manipulate the following data structures:

## BASICS (basics)
- accountName, industry, region, tier (Strategic/Enterprise/Growth)
- numberOfEmployees, currentContractValue, nextFYAmbition, threeYearAmbition
- renewalDates, visionStatement
- coreTeamMembers: [{firstName, lastName, title}]
- extendedTeam: [{firstName, lastName, title, email, phone, responsibilities[], subTeams[], region, roleType}]

## FINANCIAL (financial)
- customerRevenue, growthRate, marginEBIT, costPressureAreas, strategicInvestmentAreas

## STRATEGY (strategy)
- corporateStrategy: [{title, description}]
- digitalStrategies: [{title, description}]
- ceoBoardPriorities: [{title, description}]
- transformationThemes: [{title, description}]

## PAIN POINTS (painPoints)
- painPoints: [{title, description}]

## OPPORTUNITIES (opportunities)
- opportunities: [{title, description}]

## SWOT (swot)
- strengths[], weaknesses[], opportunities[], threats[]

## ACCOUNT STRATEGY (accountStrategy)
- strategyNarrative
- bigBets: [{title, subtitle, sponsor, dealStatus, targetClose, netNewACV, steadyStateBenefit, insight, people[], products[]}]
- keyExecutives: [{name, role}]

## ENGAGEMENT (engagement)
- knownExecutiveSponsors[], plannedExecutiveEvents[], decisionDeadlines, renewalRFPTiming

## GENERATED PLAN (generatedPlan) - AI-generated strategic content
- executiveSummaryNarrative
- strategicObservations: [{heading, detail}]
- strategicImplications: [{heading, detail}]
- strategicTensions: [{heading, detail, leftLabel, leftDescription, rightLabel, rightDescription, dilemma}]
- strategicInsights: [{heading, detail}]
- valueHypotheses: [{outcome, mechanism, timeframe, impact}]
- strategicPriorities: [{title, whyNow, ifWeLose, winningLooks, alignment, color}]
- keyWorkstreams: [{title, subtitle, dealStatus, targetClose, acv, steadyStateBenefit, insight, people[]}]
- risksMitigations: [{risk, mitigation, level}]
- roadmapPhases: [{quarter, title, activities[]}]
- successMetrics: [{metric, label, description}]

## PRESENTATION SLIDES (improvedPresentation)
You can generate complete presentation decks! Each slide has:
- slideNumber: number
- title: string (compelling slide title)
- keyPoints: string[] (3-5 bullet points)
- visualSuggestion?: string (design recommendations)
- dataHighlight?: string (key metric to emphasize)
- speakerNotes: {
    openingHook: string (attention-grabbing opener),
    talkingPoints: string[] (what to say),
    dataToMention?: string[] (stats to reference),
    transitionToNext?: string (how to transition),
    estimatedDuration: string (e.g., "2-3 minutes")
  }

When generating slides, use the generate_slides tool. Create compelling, strategic presentations with:
- Clear narrative arc across slides
- Strong opening hooks in speaker notes
- Data-driven key points when possible
- Professional transitions between slides

When the user asks you to do something, respond with:
1. A brief explanation of what you'll do
2. Call the appropriate tool with the exact changes

Be proactive, creative, and strategic. If something is unclear, make reasonable assumptions and proceed. Always aim to enhance the account plan with rich, strategic content.`;

const tools = [
  {
    type: "function",
    function: {
      name: "update_account_data",
      description: "Update any section of the account data. Can update basics, financial, strategy, painPoints, opportunities, swot, accountStrategy, engagement, or generatedPlan.",
      parameters: {
        type: "object",
        properties: {
          updates: {
            type: "array",
            description: "Array of updates to apply",
            items: {
              type: "object",
              properties: {
                section: {
                  type: "string",
                  enum: ["basics", "financial", "strategy", "painPoints", "opportunities", "swot", "accountStrategy", "engagement", "generatedPlan"],
                  description: "The section to update"
                },
                data: {
                  type: "object",
                  description: "The data to merge into this section"
                }
              },
              required: ["section", "data"]
            }
          }
        },
        required: ["updates"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_team_member",
      description: "Add a new team member to either core team or extended team",
      parameters: {
        type: "object",
        properties: {
          teamType: { type: "string", enum: ["core", "extended"] },
          member: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              title: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              responsibilities: { type: "array", items: { type: "string" } },
              subTeams: { type: "array", items: { type: "string" } },
              region: { type: "string" },
              roleType: { type: "string", enum: ["Guiding the Team", "Building the PoV", "Supporting the Team", "Mapping the Value"] }
            },
            required: ["firstName", "lastName", "title"]
          }
        },
        required: ["teamType", "member"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_big_bet",
      description: "Add a new Big Bet / strategic initiative",
      parameters: {
        type: "object",
        properties: {
          bigBet: {
            type: "object",
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
              sponsor: { type: "string" },
              dealStatus: { type: "string", enum: ["Active Pursuit", "Strategic Initiative", "Foundation Growth", "Pipeline"] },
              targetClose: { type: "string" },
              netNewACV: { type: "string" },
              steadyStateBenefit: { type: "string" },
              insight: { type: "string" },
              people: { type: "array", items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" } } } },
              products: { type: "array", items: { type: "string" } }
            },
            required: ["title", "insight"]
          }
        },
        required: ["bigBet"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_content",
      description: "Generate strategic content for specific sections like executive summary, observations, priorities, etc.",
      parameters: {
        type: "object",
        properties: {
          contentType: {
            type: "string",
            enum: ["executiveSummary", "strategicObservations", "strategicPriorities", "valueHypotheses", "roadmap", "swot", "risksMitigations"]
          },
          context: { type: "string", description: "Additional context for generation" }
        },
        required: ["contentType"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_and_enrich",
      description: "Search for company information and enrich the account data",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "What to search for" },
          enrichSections: { 
            type: "array", 
            items: { type: "string" },
            description: "Which sections to enrich with findings" 
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_slides",
      description: "Generate a complete presentation slide deck. Use this when the user asks to create slides, a presentation, or a deck.",
      parameters: {
        type: "object",
        properties: {
          title: { 
            type: "string", 
            description: "Overall presentation title" 
          },
          overallNarrative: {
            type: "string",
            description: "The key story/message of the entire presentation"
          },
          keyThemes: {
            type: "array",
            items: { type: "string" },
            description: "3-5 key themes that run through the presentation"
          },
          slides: {
            type: "array",
            description: "Array of slides to generate",
            items: {
              type: "object",
              properties: {
                slideNumber: { type: "number" },
                title: { type: "string", description: "Compelling slide title" },
                keyPoints: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "3-5 key bullet points"
                },
                visualSuggestion: { type: "string", description: "Design/visual recommendations" },
                dataHighlight: { type: "string", description: "Key metric or data point to emphasize" },
                speakerNotes: {
                  type: "object",
                  properties: {
                    openingHook: { type: "string", description: "Attention-grabbing opener" },
                    talkingPoints: { type: "array", items: { type: "string" } },
                    dataToMention: { type: "array", items: { type: "string" } },
                    transitionToNext: { type: "string" },
                    estimatedDuration: { type: "string" }
                  },
                  required: ["openingHook", "talkingPoints", "estimatedDuration"]
                }
              },
              required: ["slideNumber", "title", "keyPoints", "speakerNotes"]
            }
          },
          closingTips: {
            type: "array",
            items: { type: "string" },
            description: "Tips for delivering the presentation effectively"
          }
        },
        required: ["title", "overallNarrative", "keyThemes", "slides"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_slide",
      description: "Add a single slide to the existing presentation",
      parameters: {
        type: "object",
        properties: {
          position: { 
            type: "number", 
            description: "Where to insert the slide (1-based). If not specified, adds to end." 
          },
          slide: {
            type: "object",
            properties: {
              title: { type: "string" },
              keyPoints: { type: "array", items: { type: "string" } },
              visualSuggestion: { type: "string" },
              dataHighlight: { type: "string" },
              speakerNotes: {
                type: "object",
                properties: {
                  openingHook: { type: "string" },
                  talkingPoints: { type: "array", items: { type: "string" } },
                  dataToMention: { type: "array", items: { type: "string" } },
                  transitionToNext: { type: "string" },
                  estimatedDuration: { type: "string" }
                },
                required: ["openingHook", "talkingPoints", "estimatedDuration"]
              }
            },
            required: ["title", "keyPoints", "speakerNotes"]
          }
        },
        required: ["slide"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_slide",
      description: "Update an existing slide in the presentation",
      parameters: {
        type: "object",
        properties: {
          slideNumber: { type: "number", description: "Which slide to update (1-based)" },
          updates: {
            type: "object",
            properties: {
              title: { type: "string" },
              keyPoints: { type: "array", items: { type: "string" } },
              visualSuggestion: { type: "string" },
              dataHighlight: { type: "string" },
              speakerNotes: {
                type: "object",
                properties: {
                  openingHook: { type: "string" },
                  talkingPoints: { type: "array", items: { type: "string" } },
                  dataToMention: { type: "array", items: { type: "string" } },
                  transitionToNext: { type: "string" },
                  estimatedDuration: { type: "string" }
                }
              }
            }
          }
        },
        required: ["slideNumber", "updates"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "remove_slide",
      description: "Remove a slide from the presentation",
      parameters: {
        type: "object",
        properties: {
          slideNumber: { type: "number", description: "Which slide to remove (1-based)" }
        },
        required: ["slideNumber"]
      }
    }
  }
];

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

    // Build context about current account state
    const presentationInfo = accountData?.improvedPresentation 
      ? `Current Presentation: "${accountData.improvedPresentation.title}" with ${accountData.improvedPresentation.slides?.length || 0} slides`
      : "No presentation generated yet.";
    
    const accountContext = `
## CURRENT ACCOUNT STATE
Company: ${accountData?.basics?.accountName || "Not set"}
Industry: ${accountData?.basics?.industry || "Not set"}
Tier: ${accountData?.basics?.tier || "Not set"}
Contract Value: ${accountData?.basics?.currentContractValue || "Not set"}
Vision: ${accountData?.basics?.visionStatement || "Not set"}

Financial:
- Revenue: ${accountData?.financial?.customerRevenue || "Not set"}
- Growth: ${accountData?.financial?.growthRate || "Not set"}

Team Size: ${accountData?.basics?.coreTeamMembers?.length || 0} core, ${accountData?.basics?.extendedTeam?.length || 0} extended
Big Bets: ${accountData?.accountStrategy?.bigBets?.length || 0}
Pain Points: ${accountData?.painPoints?.painPoints?.length || 0}
Opportunities: ${accountData?.opportunities?.opportunities?.length || 0}

${accountData?.generatedPlan ? "Has AI-generated strategic plan." : "No AI-generated plan yet."}
${presentationInfo}
`;

    const fullMessages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + accountContext },
      ...messages
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: fullMessages,
        tools,
        tool_choice: "auto",
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please wait a moment and try again." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add more credits." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Agent error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
