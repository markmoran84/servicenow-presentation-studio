/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAMPLE_ACCOUNT_NAMES = new Set(["A.P. Møller - Maersk", "Maersk"]);

function scrubSampleText(input: string, companyRef: string) {
  let text = (input || "").toString();
  if (!text) return text;

  // Replace the full legal name first (including common dash variants)
  text = text.replaceAll("A.P. Møller - Maersk", companyRef);
  text = text.replaceAll("A.P. Møller – Maersk", companyRef);

  // Handle possessive forms
  text = text.replace(/Maersk['’]s/g, `${companyRef}'s`);

  // Replace remaining occurrences
  text = text.replace(/Maersk/gi, companyRef);

  return text;
}

function pickDistinct<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function extractOptionsLoosely(raw: string): string[] {
  const text = (raw || "").trim();
  if (!text || !text.includes('"options"')) return [];

  const start = text.indexOf('"options"');
  if (start === -1) return [];

  const arrStart = text.indexOf("[", start);
  if (arrStart === -1) return [];

  const slice = text.slice(arrStart);
  const matches = [...slice.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
  return matches.map((s) => s.trim()).filter(Boolean);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountData, bet } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const rawAccountName = (accountData?.basics?.accountName || "").trim();
    const isSampleAccount = !rawAccountName || SAMPLE_ACCOUNT_NAMES.has(rawAccountName);
    const companyRef = isSampleAccount ? "the customer" : rawAccountName;
    const industryRef = (accountData?.basics?.industry || "").trim() || "the industry";

    const accountStrategyNarrativeRaw = (accountData?.accountStrategy?.strategyNarrative || "").trim();
    const accountStrategyNarrative = isSampleAccount
      ? scrubSampleText(accountStrategyNarrativeRaw, companyRef)
      : accountStrategyNarrativeRaw;

    const betTitleRaw = (bet?.title || "").toString();
    const betSubtitleRaw = (bet?.subtitle || "").toString();
    const betTitle = isSampleAccount ? scrubSampleText(betTitleRaw, companyRef) : betTitleRaw;
    const betSubtitle = isSampleAccount ? scrubSampleText(betSubtitleRaw, companyRef) : betSubtitleRaw;

    const priorInsightRaw = (bet?.insight || "").toString().trim();
    const priorInsight = isSampleAccount ? scrubSampleText(priorInsightRaw, companyRef) : priorInsightRaw;

    const insightAngles = [
      "competitive urgency (what happens if a competitor wins first)",
      "board pressure (which KPI or mandate forces action now)",
      "hidden cost (the cost of inaction they haven't priced in)",
      "market timing (why the next 6–12 months matter)",
      "transformation unlock (how this unlocks the broader strategy)",
      "risk (the operational / compliance / reputational failure mode)",
    ];
    const [angle1, angle2, angle3] = pickDistinct(insightAngles, 3);

    const prompt = `You are writing internal account intelligence briefings for enterprise sales.
Your tone is JOURNALISTIC and FACTUAL — like an analyst briefing, not a sales pitch.

STUDY THESE EXAMPLES OF EXCELLENT INSIGHTS (tone/voice only):
- "${companyRef} is pursuing an ambitious AI strategy, but Salesforce's current offerings aren't delivering the required value. As a result, ${companyRef} plans to replace Service Cloud with solutions from ServiceNow, Microsoft, or Oracle. A final decision is expected in Q1."
- "${companyRef}'s CPQ process has been a long-standing challenge, with significant gaps still filled using Excel. Over 230 people currently maintain the existing system. The goal is to start with a small-scale implementation and expand over time."
- "${companyRef} Logistics currently lacks a CSM system, and the business line is relatively immature. ServiceNow is running a pilot, and the team is awaiting results from the Ocean RFP before further decisions."

CRITICAL STYLE RULES:
- Start with "${companyRef} is..." or "${companyRef}'s [process] has..."
- Short declarative sentences (2–3 sentences total)
- Name competitors if relevant (Salesforce, Microsoft, Oracle, SAP, ServiceNow)
- Include decision timelines or "current state" details
- NO buzzwords, NO hype, NO "leverage/synergy/transform"
- Do NOT invent numbers. If you use numbers, they must appear in the context below.

ANGLE REQUIREMENT:
- Write 3 DIFFERENT options, each using a different angle:
  1) ${angle1}
  2) ${angle2}
  3) ${angle3}

BIG BET CONTEXT:
- Title: ${betTitle}
- Subtitle: ${betSubtitle || ""}
- Target Close: ${bet?.targetClose || ""}
- Investment: ${bet?.netNewACV || ""}

ACCOUNT: ${companyRef} (${industryRef})
Current Contract: ${accountData?.basics?.currentContractValue || "Unknown"}
FY Ambition: ${accountData?.basics?.nextFYAmbition || "Unknown"}
Decision Deadlines: ${accountData?.engagement?.decisionDeadlines || "Unknown"}

${accountStrategyNarrative ? `STRATEGY CONTEXT:\n${accountStrategyNarrative}` : ""}

PAIN POINTS:
${accountData?.painPoints?.painPoints?.map((p: any) => `• ${p.title}: ${p.description}`).join("\n") || "Not specified"}

CEO/BOARD PRIORITIES:
${accountData?.strategy?.ceoBoardPriorities?.map((s: any) => `• ${s.title}${s.description ? `: ${s.description}` : ""}`).join("\n") || "Not specified"}

${priorInsight ? `PRIOR INSIGHT (write something COMPLETELY DIFFERENT):\n${priorInsight}` : ""}

Return 3 insight options.`;

    const body: any = {
      model: "google/gemini-2.5-pro",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 450,
      temperature: 0.95,
      tools: [
        {
          type: "function",
          function: {
            name: "return_insight_options",
            description: "Return 3 distinct insight options as short factual briefing notes.",
            parameters: {
              type: "object",
              properties: {
                options: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["options"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_insight_options" } },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const errorText = await response.text();
      console.error("Lovable AI error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();

    let options: string[] = [];
    const message = result?.choices?.[0]?.message;

    // Preferred: tool-calling
    const toolArgsRaw = message?.tool_calls?.[0]?.function?.arguments;
    if (typeof toolArgsRaw === "string" && toolArgsRaw.trim()) {
      try {
        const parsedArgs = JSON.parse(toolArgsRaw);
        if (Array.isArray(parsedArgs?.options)) {
          options = parsedArgs.options.map((s: any) => (s ?? "").toString().trim()).filter(Boolean);
        }
      } catch {
        // fall through to content parsing
      }
    }

    // Fallback: try to parse any returned content
    if (!options.length) {
      const contentRaw = (message?.content || "").toString().trim();
      const cleaned = contentRaw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed?.options)) {
          options = parsed.options.map((s: any) => (s ?? "").toString().trim()).filter(Boolean);
        }
      } catch {
        options = extractOptionsLoosely(cleaned);
      }

      if (!options.length && cleaned) options = [cleaned];
    }

    // Pick one option (avoid returning raw JSON to the client)
    let insight = options[Math.floor(Math.random() * options.length)] || "";
    insight = insight.toString().trim();

    if (isSampleAccount) {
      insight = scrubSampleText(insight, companyRef);
    }

    // Final guardrail: don't return JSON blobs to the UI
    if (insight.includes('"options"')) {
      const extracted = extractOptionsLoosely(insight);
      if (extracted.length) insight = extracted[0];
    }

    return new Response(
      JSON.stringify({ success: true, insight }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error generating insight:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

