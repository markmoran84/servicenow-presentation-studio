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

function safeText(input: any, isSample: boolean, companyRef: string) {
  const text = (input ?? "").toString();
  return isSample ? scrubSampleText(text, companyRef) : text;
}

const insightAngles = [
  "competitive urgency (what happens if a competitor wins first)",
  "board pressure (which KPI or mandate forces action now)",
  "hidden cost (the cost of inaction they haven't priced in)",
  "market timing (why the next 6–12 months matter)",
  "transformation unlock (what this unlocks next)",
  "risk (the operational / compliance / reputational failure mode)",
];

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

    const angle = insightAngles[Math.floor(Math.random() * insightAngles.length)];

    const strategyNarrative = safeText(accountData?.accountStrategy?.strategyNarrative, isSampleAccount, companyRef).trim();

    const betTitle = safeText(bet?.title, isSampleAccount, companyRef).trim();
    const betSubtitle = safeText(bet?.subtitle, isSampleAccount, companyRef).trim();
    const betTargetClose = safeText(bet?.targetClose, isSampleAccount, companyRef).trim();
    const betInvestment = safeText(bet?.netNewACV, isSampleAccount, companyRef).trim();

    const priorInsight = safeText(bet?.insight, isSampleAccount, companyRef).trim();

    const painPoints = Array.isArray(accountData?.painPoints?.painPoints)
      ? accountData.painPoints.painPoints
          .map((p: any) => `• ${safeText(p?.title, isSampleAccount, companyRef)}: ${safeText(p?.description, isSampleAccount, companyRef)}`)
          .join("\n")
      : "Not specified";

    const boardPriorities = Array.isArray(accountData?.strategy?.ceoBoardPriorities)
      ? accountData.strategy.ceoBoardPriorities
          .map((s: any) => `• ${safeText(s?.title, isSampleAccount, companyRef)}${s?.description ? `: ${safeText(s?.description, isSampleAccount, companyRef)}` : ""}`)
          .join("\n")
      : "Not specified";

    const decisionDeadlines = safeText(accountData?.engagement?.decisionDeadlines, isSampleAccount, companyRef).trim() || "Unknown";

    const prompt = `You are writing an internal account intelligence briefing note for enterprise sales.
Tone: JOURNALISTIC and FACTUAL — like an analyst briefing, not a sales pitch.

EXAMPLES (voice only):
- "${companyRef} is pursuing an ambitious AI strategy, but Salesforce's current offerings aren't delivering the required value. As a result, ${companyRef} plans to replace Service Cloud with solutions from ServiceNow, Microsoft, or Oracle. A final decision is expected in Q1."
- "${companyRef}'s CPQ process has been a long-standing challenge, with significant gaps still filled using Excel. Over 230 people currently maintain the existing system. The goal is to start with a small-scale implementation and expand over time."

STYLE RULES (mandatory):
- Start with "${companyRef} is..." OR "${companyRef}'s [process] has..."
- 2–3 short declarative sentences total
- Include at least ONE concrete detail taken from the context below (a number, date/quarter, or a specific stated issue)
- Include a decision timeline IF it is in the context
- No buzzwords. No hype. No "leverage", "synergy", "transform"
- Do NOT invent numbers. Only use numbers/dates explicitly present below.
- Output ONLY the insight text (no bullets, no labels, no JSON, no quotes)
${isSampleAccount ? "- IMPORTANT: Never use the word 'Maersk' or 'A.P. Møller'. Only refer to the company as 'the customer'." : ""}

ANGLE TO EMPHASIZE: ${angle}

BIG BET CONTEXT:
Title: ${betTitle}
Subtitle: ${betSubtitle}
Target Close: ${betTargetClose}
Investment: ${betInvestment}

ACCOUNT CONTEXT:
Company: ${companyRef} (${industryRef})
Current Contract: ${accountData?.basics?.currentContractValue || "Unknown"}
FY Ambition: ${accountData?.basics?.nextFYAmbition || "Unknown"}
Decision Deadlines: ${decisionDeadlines}

${strategyNarrative ? `STRATEGY CONTEXT:\n${strategyNarrative}` : ""}

PAIN POINTS:
${painPoints}

CEO/BOARD PRIORITIES:
${boardPriorities}

${priorInsight ? `PRIOR INSIGHT (do NOT restate; write something materially different):\n${priorInsight}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.8,
      }),
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
    let insight = (result?.choices?.[0]?.message?.content || "").toString().trim();

    // Clean up potential markdown formatting
    insight = insight.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Guardrail: if the model violates instructions and returns JSON, try to extract the first option
    if (insight.includes('"options"')) {
      try {
        const parsed = JSON.parse(insight);
        const opts = Array.isArray(parsed?.options) ? parsed.options : [];
        const first = opts.find((o: any) => typeof o === "string" && o.trim()) as string | undefined;
        if (first) insight = first.trim();
      } catch {
        // ignore
      }
    }

    if (isSampleAccount) {
      insight = scrubSampleText(insight, companyRef);
    }

    insight = insight.trim();
    if (!insight) {
      throw new Error("AI returned an empty insight. Please try again.");
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
