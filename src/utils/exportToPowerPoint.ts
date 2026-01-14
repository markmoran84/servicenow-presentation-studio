import pptxgen from "pptxgenjs";
import { AccountData } from "@/context/AccountDataContext";

// =============================================================================
// COLOR PALETTE (matching index.css HSL → Hex conversion)
// =============================================================================
const C = {
  bg: "0B1D26",
  bgLight: "121F28",
  card: "162937",
  primary: "5EC93F",
  primaryDark: "4AAE2E",
  accent: "29A9E1",
  white: "FFFFFF",
  muted: "8BA3B0",
  border: "2D4351",
  danger: "EF4444",
  warning: "F59E0B",
  purple: "A855F7",
  blue: "3B82F6",
};

// 16:9 Slide dimensions (10" × 5.625")
const W = 10;
const H = 5.625;

// Margins
const MX = 0.5;
const MY = 0.35;
const CONTENT_W = W - 2 * MX;

// Font sizes (points)
const TITLE_SIZE = 28;
const SUBTITLE_SIZE = 12;
const HEADING_SIZE = 14;
const BODY_SIZE = 10;
const SMALL_SIZE = 8;
const TINY_SIZE = 7;

// Font faces
const FONT_HEADING = "Century Gothic";
const FONT_BODY = "Calibri";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
const setBackground = (slide: pptxgen.Slide) => {
  slide.background = { color: C.bg };
};

const addGradientBg = (pptx: pptxgen, slide: pptxgen.Slide) => {
  slide.background = { color: "0A1A22" };
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1.5, y: -0.8, w: 5, h: 4,
    fill: { color: "153040", transparency: 60 },
    line: { color: "153040", transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 6, y: 2, w: 5.5, h: 4.5,
    fill: { color: "1A2540", transparency: 65 },
    line: { color: "1A2540", transparency: 100 },
  });
};

const addTitle = (slide: pptxgen.Slide, title: string, subtitle?: string) => {
  slide.addText(title, {
    x: MX, y: MY, w: CONTENT_W, h: 0.5,
    fontSize: TITLE_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: MX, y: MY + 0.45, w: CONTENT_W, h: 0.3,
      fontSize: SUBTITLE_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  }
};

const addFooter = (slide: pptxgen.Slide, num: number, total: number, name: string) => {
  slide.addText(`ServiceNow | ${name} Account Plan`, {
    x: MX, y: H - 0.35, w: 5, h: 0.2,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(`${num} / ${total}`, {
    x: W - MX - 1, y: H - 0.35, w: 1, h: 0.2,
    fontSize: TINY_SIZE, color: C.muted, align: "right", fontFace: FONT_BODY,
  });
};

const addCard = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, w: number, h: number, opts?: { accentBorder?: string }) => {
  const borderCol = opts?.accentBorder || C.border;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: C.card, transparency: 30 },
    line: { color: borderCol, width: 0.75, transparency: 40 },
    rectRadius: 0.1,
  });
};

const addLeftBorder = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, h: number, color: string) => {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.06, h,
    fill: { color },
    line: { color, transparency: 100 },
  });
};

const addBadge = (slide: pptxgen.Slide, x: number, y: number, text: string, color: string) => {
  const badgeW = text.length * 0.07 + 0.35;
  slide.addShape("roundRect" as any, {
    x, y, w: badgeW, h: 0.22,
    fill: { color, transparency: 85 },
    line: { color, width: 0.5, transparency: 60 },
    rectRadius: 0.11,
  });
  slide.addText(text, {
    x, y, w: badgeW, h: 0.22,
    fontSize: TINY_SIZE, color, align: "center", valign: "middle", fontFace: FONT_BODY, bold: true,
  });
};

const truncate = (str: string | undefined, len: number) => {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "…" : str;
};

// =============================================================================
// SLIDE 1: COVER (matches web CoverSlide)
// =============================================================================
const createCoverSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addGradientBg(pptx, slide);

  const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  slide.addText(data.basics.accountName || "Customer Name", {
    x: 0.7, y: 1.4, w: 8.5, h: 0.85,
    fontSize: 48, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  slide.addText("Global Account Plan", {
    x: 0.7, y: 2.25, w: 8.5, h: 0.75,
    fontSize: 38, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  slide.addText(monthYear, {
    x: 0.7, y: 3.0, w: 4, h: 0.35,
    fontSize: 16, color: C.white, fontFace: FONT_BODY,
  });

  const members = data.basics.coreTeamMembers || [];
  members.slice(0, 4).forEach((m, i) => {
    const xPos = 0.7 + i * 2.3;
    slide.addText(`${m.firstName} ${m.lastName}`, {
      x: xPos, y: 4.6, w: 2.2, h: 0.22,
      fontSize: 11, bold: true, color: C.primary, fontFace: FONT_BODY,
    });
    slide.addText(m.title, {
      x: xPos, y: 4.82, w: 2.2, h: 0.2,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 2: EXECUTIVE SUMMARY
// =============================================================================
const createExecutiveSummarySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Executive Summary");

  const topY = 0.9;
  const leftW = 4.5;
  const rightX = MX + leftW + 0.15;
  const rightW = CONTENT_W - leftW - 0.15;

  addCard(pptx, slide, MX, topY, leftW, 4.0);

  const pillars = data.annualReport.strategicPillars || data.generatedPlan?.executiveSummaryPillars || [];
  const narrative = data.annualReport.executiveSummaryNarrative || data.generatedPlan?.executiveSummaryNarrative || "No executive summary generated.";

  slide.addText("Strategic Vision", {
    x: MX + 0.15, y: topY + 0.1, w: leftW - 0.3, h: 0.3,
    fontSize: HEADING_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  slide.addText(truncate(narrative, 400), {
    x: MX + 0.15, y: topY + 0.45, w: leftW - 0.3, h: 1.0,
    fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
  });

  slide.addText("Strategic Pillars", {
    x: MX + 0.15, y: topY + 1.5, w: leftW - 0.3, h: 0.25,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  pillars.slice(0, 4).forEach((p, i) => {
    const py = topY + 1.8 + i * 0.5;
    addLeftBorder(pptx, slide, MX + 0.15, py, 0.4, C.primary);
    slide.addText(p.title || "", {
      x: MX + 0.3, y: py, w: leftW - 0.45, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(truncate(p.tagline || p.description, 80), {
      x: MX + 0.3, y: py + 0.18, w: leftW - 0.45, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  const rCards = [
    { label: "Revenue", value: data.annualReport.revenue || data.financial.customerRevenue || "—" },
    { label: "Growth", value: data.financial.growthRate || "—" },
  ];
  rCards.forEach((c, i) => {
    const cy = topY + i * 0.95;
    addCard(pptx, slide, rightX, cy, rightW / 2 - 0.08, 0.85);
    slide.addText(c.label, {
      x: rightX + 0.1, y: cy + 0.08, w: rightW / 2 - 0.2, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(c.value, {
      x: rightX + 0.1, y: cy + 0.28, w: rightW / 2 - 0.2, h: 0.4,
      fontSize: 22, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
  });

  const mileY = topY + 2.0;
  addCard(pptx, slide, rightX, mileY, rightW, 1.9);
  slide.addText("Key Milestones", {
    x: rightX + 0.1, y: mileY + 0.08, w: rightW - 0.2, h: 0.22,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  const milestones = data.annualReport.keyMilestones || [];
  milestones.slice(0, 6).forEach((m, i) => {
    slide.addText(`• ${truncate(m, 60)}`, {
      x: rightX + 0.1, y: mileY + 0.32 + i * 0.25, w: rightW - 0.2, h: 0.23,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 3: CUSTOMER SNAPSHOT
// =============================================================================
const createCustomerSnapshotSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Customer Snapshot", `${data.basics.accountName} at a Glance`);

  const topY = 0.95;
  const metrics = [
    { label: "Annual Revenue", value: data.financial.customerRevenue || "—" },
    { label: "Growth Rate", value: data.financial.growthRate || "—" },
    { label: "EBIT Margin", value: data.financial.marginEBIT || "—" },
    { label: "Contract Value", value: data.basics.currentContractValue || "—" },
  ];

  const metricW = (CONTENT_W - 0.36) / 4;
  metrics.forEach((m, i) => {
    const mx = MX + i * (metricW + 0.12);
    addCard(pptx, slide, mx, topY, metricW, 0.8);
    slide.addText(m.label, {
      x: mx + 0.08, y: topY + 0.08, w: metricW - 0.16, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(m.value, {
      x: mx + 0.08, y: topY + 0.28, w: metricW - 0.16, h: 0.4,
      fontSize: 18, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
  });

  const colW = (CONTENT_W - 0.12) / 2;
  const overviewY = topY + 1.0;
  addCard(pptx, slide, MX, overviewY, colW, 1.8);
  slide.addText("Company Overview", {
    x: MX + 0.12, y: overviewY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const overviewItems = [
    { label: "Account", value: data.basics.accountName || "—" },
    { label: "FY Ambition", value: data.basics.nextFYAmbition || "—" },
    { label: "Cost Pressures", value: truncate(data.financial.costPressureAreas, 50) || "—" },
    { label: "Investment Areas", value: truncate(data.financial.strategicInvestmentAreas, 50) || "—" },
  ];

  overviewItems.forEach((item, i) => {
    slide.addText(`${item.label}:`, {
      x: MX + 0.12, y: overviewY + 0.38 + i * 0.35, w: 1.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(item.value, {
      x: MX + 1.4, y: overviewY + 0.38 + i * 0.35, w: colW - 1.6, h: 0.18,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, overviewY, colW, 1.8, { accentBorder: C.primary });
  slide.addText("ServiceNow Position", {
    x: rx + 0.12, y: overviewY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  const snItems = [
    { label: "Current ACV", value: data.basics.currentContractValue || "—" },
    { label: "FY Ambition", value: data.basics.nextFYAmbition || "—" },
    { label: "3-Year Target", value: data.basics.threeYearAmbition || "—" },
    { label: "Renewal Date", value: data.basics.renewalDates || "—" },
  ];

  snItems.forEach((item, i) => {
    slide.addText(`${item.label}:`, {
      x: rx + 0.12, y: overviewY + 0.38 + i * 0.35, w: 1.5, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(item.value, {
      x: rx + 1.6, y: overviewY + 0.38 + i * 0.35, w: colW - 1.8, h: 0.18,
      fontSize: SMALL_SIZE, color: C.primary, fontFace: FONT_BODY,
    });
  });

  const visY = overviewY + 1.95;
  addCard(pptx, slide, MX, visY, CONTENT_W, 0.75, { accentBorder: C.primary });
  slide.addText("ServiceNow Vision", {
    x: MX + 0.12, y: visY + 0.08, w: CONTENT_W - 0.24, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.visionStatement || "No vision statement defined.", {
    x: MX + 0.12, y: visY + 0.3, w: CONTENT_W - 0.24, h: 0.4,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  return slide;
};

// =============================================================================
// SLIDE 4: CUSTOMER STRATEGY
// =============================================================================
const createCustomerStrategySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Customer Strategy", `${data.basics.accountName} Strategic Direction`);

  const topY = 0.95;
  const colW = (CONTENT_W - 0.12) / 2;

  addCard(pptx, slide, MX, topY, colW, 2.0);
  slide.addText("Corporate Strategy", {
    x: MX + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const corporate = (data.strategy.corporateStrategy || []).filter(s => s.title?.trim());
  if (corporate.length === 0) {
    slide.addText("No corporate strategy data available", {
      x: MX + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    corporate.slice(0, 4).forEach((s, i) => {
      const sy = topY + 0.38 + i * 0.4;
      addLeftBorder(pptx, slide, MX + 0.12, sy, 0.35, C.primary);
      slide.addText(s.title, {
        x: MX + 0.22, y: sy, w: colW - 0.35, h: 0.18,
        fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
      });
      slide.addText(truncate(s.description, 60), {
        x: MX + 0.22, y: sy + 0.17, w: colW - 0.35, h: 0.18,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 2.0);
  slide.addText("Digital Strategy", {
    x: rx + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.accent, fontFace: FONT_HEADING,
  });

  const digital = (data.strategy.digitalStrategies || []).filter(s => s.title?.trim());
  if (digital.length === 0) {
    slide.addText("No digital strategy data available", {
      x: rx + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    digital.slice(0, 4).forEach((s, i) => {
      const sy = topY + 0.38 + i * 0.4;
      addLeftBorder(pptx, slide, rx + 0.12, sy, 0.35, C.accent);
      slide.addText(s.title, {
        x: rx + 0.22, y: sy, w: colW - 0.35, h: 0.18,
        fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
      });
      slide.addText(truncate(s.description, 60), {
        x: rx + 0.22, y: sy + 0.17, w: colW - 0.35, h: 0.18,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  const prioY = topY + 2.15;
  addCard(pptx, slide, MX, prioY, colW, 1.2);
  slide.addText("CEO/Board Priorities", {
    x: MX + 0.12, y: prioY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.warning, fontFace: FONT_HEADING,
  });

  const ceo = (data.strategy.ceoBoardPriorities || []).filter(s => s.title?.trim());
  ceo.slice(0, 3).forEach((s, i) => {
    slide.addText(`• ${s.title}`, {
      x: MX + 0.12, y: prioY + 0.35 + i * 0.28, w: colW - 0.24, h: 0.26,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  addCard(pptx, slide, rx, prioY, colW, 1.2);
  slide.addText("Transformation Themes", {
    x: rx + 0.12, y: prioY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.purple, fontFace: FONT_HEADING,
  });

  const themes = (data.strategy.transformationThemes || []).filter(s => s.title?.trim());
  themes.slice(0, 3).forEach((s, i) => {
    slide.addText(`• ${s.title}`, {
      x: rx + 0.12, y: prioY + 0.35 + i * 0.28, w: colW - 0.24, h: 0.26,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 5: ACCOUNT STRATEGY (Premium Executive Design)
// =============================================================================
const createAccountStrategySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  
  // Dark premium background
  slide.background = { color: "0F172A" };
  
  // Add subtle gradient overlays
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -0.5, w: 4, h: 3,
    fill: { color: "3B82F6", transparency: 92 },
    line: { color: "3B82F6", transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: 3, w: 4, h: 3,
    fill: { color: "10B981", transparency: 92 },
    line: { color: "10B981", transparency: 100 },
  });

  const customerPriorities = data.strategy.ceoBoardPriorities || [];
  const strategicOpportunities = data.opportunities.opportunities || [];

  // Header with accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: MX, y: MY, w: 0.08, h: 0.7,
    fill: { type: "solid", color: "3B82F6" },
    line: { color: "3B82F6", transparency: 100 },
  });
  
  slide.addText("Account Strategy", {
    x: MX + 0.2, y: MY, w: 5, h: 0.4,
    fontSize: 26, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText("FY26", {
    x: MX + 2.8, y: MY, w: 1, h: 0.4,
    fontSize: 26, bold: true, color: "3B82F6", fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.accountName || "Strategic Account", {
    x: MX + 0.2, y: MY + 0.35, w: 4, h: 0.25,
    fontSize: SMALL_SIZE, color: "64748B", fontFace: FONT_BODY,
  });

  // Vision Banner
  const visionY = 0.85;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: MX, y: visionY, w: CONTENT_W, h: 0.85,
    fill: { color: "1E3A5F", transparency: 50 },
    line: { color: "3B82F6", width: 0.5, transparency: 70 },
    rectRadius: 0.08,
  });
  
  slide.addText("OUR VISION", {
    x: MX + 0.15, y: visionY + 0.1, w: 2, h: 0.18,
    fontSize: TINY_SIZE, bold: true, color: "3B82F6", fontFace: FONT_BODY,
  });
  
  const vision = data.basics.accountName 
    ? `Build the digital backbone that powers ${data.basics.accountName}'s transformation strategy—enabling AI-first execution at scale.`
    : "Build the digital backbone that powers the customer's transformation strategy—enabling AI-first execution at scale.";
  
  slide.addText(vision, {
    x: MX + 0.15, y: visionY + 0.3, w: CONTENT_W - 0.3, h: 0.48,
    fontSize: 14, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  // Strategic Pillars Section (Left - 2x2 grid)
  const pillarsY = 1.85;
  const leftW = 5.5;
  const pillarsGap = 0.12;
  const pillarW = (leftW - pillarsGap) / 2;
  const pillarH = 1.65;

  slide.addText("WHAT WE'LL FOCUS ON", {
    x: MX, y: pillarsY, w: 3, h: 0.2,
    fontSize: TINY_SIZE, color: "64748B", fontFace: FONT_BODY,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: MX + 2.4, y: pillarsY + 0.08, w: 2.5, h: 0.01,
    fill: { color: "334155" },
    line: { color: "334155", transparency: 100 },
  });

  const pillars = [
    {
      title: customerPriorities[0]?.title || "Customer & Commercial Transformation",
      desc: truncate(customerPriorities[0]?.description || "Deliver scalable, orchestrated customer service and commercial execution foundation.", 80),
      whyNow: "Decision window is live. Time to expand from replacement to end-to-end orchestration.",
      accent: "3B82F6"
    },
    {
      title: customerPriorities[1]?.title || "Operationalising AI",
      desc: truncate(customerPriorities[1]?.description || "Move AI beyond isolated use cases to improve execution speed and decision quality.", 80),
      whyNow: "AI-first ambition is clear. This is the inflection point to embed AI in workflows.",
      accent: "8B5CF6"
    },
    {
      title: strategicOpportunities[0]?.title || "Platform Expansion Beyond IT",
      desc: truncate(strategicOpportunities[0]?.description || "Broaden platform adoption using customer and service workflows as the entry point.", 80),
      whyNow: "Scaling integrated operations requires a common orchestration layer.",
      accent: "10B981"
    },
    {
      title: strategicOpportunities[1]?.title || "Strategic Partnership Maturity",
      desc: truncate(strategicOpportunities[1]?.description || "Evolve toward long-term strategic partner underpinning digital and AI ambition.", 80),
      whyNow: "Relationship has renewed confidence. Window to shift to strategic partnership.",
      accent: "F59E0B"
    }
  ];

  const pillarStartY = pillarsY + 0.3;
  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = MX + col * (pillarW + pillarsGap);
    const py = pillarStartY + row * (pillarH + 0.1);

    // Card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x: px, y: py, w: pillarW, h: pillarH,
      fill: { color: "1E293B", transparency: 60 },
      line: { color: "334155", width: 0.5, transparency: 50 },
      rectRadius: 0.06,
    });

    // Top accent line
    slide.addShape(pptx.ShapeType.rect, {
      x: px, y: py, w: pillarW, h: 0.035,
      fill: { color: p.accent },
      line: { color: p.accent, transparency: 100 },
    });

    // Number badge
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: px + 0.55, y: py + 0.1, w: 0.4, h: 0.18,
      fontSize: TINY_SIZE, color: "475569", fontFace: "Courier New",
    });

    // Title
    slide.addText(truncate(p.title, 32), {
      x: px + 0.1, y: py + 0.32, w: pillarW - 0.2, h: 0.28,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, valign: "top",
    });

    // Description
    slide.addText(p.desc, {
      x: px + 0.1, y: py + 0.58, w: pillarW - 0.2, h: 0.45,
      fontSize: TINY_SIZE, color: "94A3B8", fontFace: FONT_BODY, valign: "top",
    });

    // Why Now section - separator line
    slide.addShape(pptx.ShapeType.rect, {
      x: px + 0.1, y: py + 1.05, w: pillarW - 0.2, h: 0.01,
      fill: { color: "334155" },
      line: { color: "334155", transparency: 100 },
    });

    // Why Now label and text
    slide.addText("Why now:", {
      x: px + 0.1, y: py + 1.12, w: 0.6, h: 0.15,
      fontSize: 6, bold: true, color: p.accent, fontFace: FONT_BODY,
    });
    slide.addText(truncate(p.whyNow, 60), {
      x: px + 0.65, y: py + 1.12, w: pillarW - 0.8, h: 0.45,
      fontSize: 6, color: "64748B", fontFace: FONT_BODY, valign: "top",
    });
  });

  // How We'll Win Section (Right)
  const rightX = MX + leftW + 0.25;
  const rightW = CONTENT_W - leftW - 0.25;
  
  slide.addText("HOW WE'LL WIN", {
    x: rightX, y: pillarsY, w: 2, h: 0.2,
    fontSize: TINY_SIZE, color: "64748B", fontFace: FONT_BODY,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: rightX + 1.5, y: pillarsY + 0.08, w: rightW - 1.6, h: 0.01,
    fill: { color: "334155" },
    line: { color: "334155", transparency: 100 },
  });

  // How We'll Win card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: rightX, y: pillarStartY, w: rightW, h: 2.2,
    fill: { color: "1E293B", transparency: 40 },
    line: { color: "334155", width: 0.5, transparency: 50 },
    rectRadius: 0.08,
  });

  const winningMoves = [
    { headline: "Align on a Single Narrative", subtext: "Integrator → Digital Backbone → AI-first → Customer outcomes" },
    { headline: "Sequence to Protect Continuity", subtext: "Stabilise foundations, scale orchestration, embed AI" },
    { headline: "Focus Value on Cost-to-Serve", subtext: "Cycle time, automation rate, service performance" },
    { headline: "Co-create Multi-Year Roadmap", subtext: "Governance reducing risk and accelerating adoption" },
  ];

  winningMoves.forEach((move, i) => {
    const my = pillarStartY + 0.15 + i * 0.5;
    
    // Bullet circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: rightX + 0.12, y: my + 0.02, w: 0.16, h: 0.16,
      fill: { type: "solid", color: "3B82F6" },
      line: { color: "3B82F6", transparency: 100 },
    });
    
    slide.addText(move.headline, {
      x: rightX + 0.35, y: my, w: rightW - 0.5, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(move.subtext, {
      x: rightX + 0.35, y: my + 0.2, w: rightW - 0.5, h: 0.2,
      fontSize: TINY_SIZE, color: "64748B", fontFace: FONT_BODY,
    });
  });

  // Target Outcomes (bottom right)
  const outcomesY = pillarStartY + 2.35;
  const outcomes = [
    { value: "20-30%", label: "Cost Reduction" },
    { value: "40%+", label: "Automation" },
    { value: "50%", label: "Faster Cycles" },
  ];
  
  const outcomeW = (rightW - 0.16) / 3;
  outcomes.forEach((o, i) => {
    const ox = rightX + i * (outcomeW + 0.08);
    
    slide.addShape(pptx.ShapeType.roundRect, {
      x: ox, y: outcomesY, w: outcomeW, h: 0.65,
      fill: { color: "1E293B", transparency: 70 },
      line: { color: "334155", width: 0.5, transparency: 60 },
      rectRadius: 0.05,
    });
    
    slide.addText(o.value, {
      x: ox, y: outcomesY + 0.08, w: outcomeW, h: 0.28,
      fontSize: 14, bold: true, color: "3B82F6", fontFace: FONT_HEADING, align: "center",
    });
    slide.addText(o.label.toUpperCase(), {
      x: ox, y: outcomesY + 0.38, w: outcomeW, h: 0.18,
      fontSize: 6, color: "64748B", fontFace: FONT_BODY, align: "center",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 6: FY-1 RETROSPECTIVE (matches web FY1RetrospectiveSlide exactly)
// =============================================================================
const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "FY-1 Retrospective", "What Actually Happened — Honest Assessment");

  const { history, generatedPlan, basics } = data;
  const focusAreas = generatedPlan?.fy1Retrospective?.focusAreas || [];
  const keyLessons = generatedPlan?.fy1Retrospective?.keyLessons || history.lastPlanSummary || "";
  const lookingAhead = generatedPlan?.fy1Retrospective?.lookingAhead || "";

  // Start content below title+subtitle (title at 0.35, subtitle at 0.8, so content at 1.05)
  const topY = 1.05;
  const cardH = 0.38;
  const halfW = (CONTENT_W - 0.15) / 2;
  const gap = 0.1;

  // Top row - Date and Planner info cards (inline with subtitle style)
  addCard(pptx, slide, MX, topY, halfW, cardH);
  slide.addText("Previous Account Plan Date:", {
    x: MX + 0.1, y: topY + 0.09, w: 2.0, h: 0.2,
    fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(history.lastPlanDate || "Not specified", {
    x: MX + halfW - 1.8, y: topY + 0.09, w: 1.7, h: 0.2,
    fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "right",
  });

  const rx = MX + halfW + 0.15;
  addCard(pptx, slide, rx, topY, halfW, cardH);
  slide.addText("Previous Account Planner:", {
    x: rx + 0.1, y: topY + 0.09, w: 2.0, h: 0.2,
    fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  const plannerInfo = history.plannerName ? 
    (history.plannerRole ? `${history.plannerName} (${history.plannerRole})` : history.plannerName) : 
    "Not specified";
  slide.addText(plannerInfo, {
    x: rx + halfW - 1.8, y: topY + 0.09, w: 1.7, h: 0.2,
    fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "right",
  });

  // Main content row
  const mainY = topY + cardH + gap;
  const mainH = 1.5;

  // Left column - What Happened
  addCard(pptx, slide, MX, mainY, halfW, mainH);
  slide.addText("What Happened", {
    x: MX + 0.12, y: mainY + 0.1, w: halfW - 0.24, h: 0.2,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  
  if (history.lastPlanSummary) {
    slide.addText(truncate(history.lastPlanSummary, 180), {
      x: MX + 0.12, y: mainY + 0.32, w: halfW - 0.24, h: 0.6,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
    });
  } else {
    slide.addText("No summary provided", {
      x: MX + 0.12, y: mainY + 0.32, w: halfW - 0.24, h: 0.25,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, italic: true,
    });
  }

  // Challenges section within left card
  if (history.whatDidNotWork) {
    const chalY = mainY + 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: MX + 0.1, y: chalY, w: halfW - 0.2, h: 0.45,
      fill: { color: C.danger, transparency: 90 },
      line: { color: C.danger, width: 0.5, transparency: 70 },
      rectRadius: 0.04,
    });
    slide.addText("Challenges Encountered", {
      x: MX + 0.15, y: chalY + 0.04, w: halfW - 0.3, h: 0.14,
      fontSize: TINY_SIZE, bold: true, color: C.danger, fontFace: FONT_BODY,
    });
    slide.addText(truncate(history.whatDidNotWork, 90), {
      x: MX + 0.15, y: chalY + 0.18, w: halfW - 0.3, h: 0.22,
      fontSize: TINY_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  }

  // Right column - What FY-1 Focused On
  addCard(pptx, slide, rx, mainY, halfW, mainH);
  slide.addText("What FY-1 Focused On", {
    x: rx + 0.12, y: mainY + 0.1, w: 2.5, h: 0.2,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  // Badge positioned at right edge of card
  addBadge(slide, rx + halfW - 1.35, mainY + 0.1, "Previous Strategy", C.primary);

  if (focusAreas.length > 0) {
    focusAreas.slice(0, 4).forEach((area, i) => {
      const ay = mainY + 0.38 + i * 0.27;
      slide.addText(area.title || "", {
        x: rx + 0.12, y: ay, w: halfW - 0.24, h: 0.13,
        fontSize: SMALL_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
      });
      slide.addText(truncate(area.description, 55) || "", {
        x: rx + 0.12, y: ay + 0.12, w: halfW - 0.24, h: 0.13,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  } else {
    slide.addText("Generate an AI plan to see focus area analysis", {
      x: rx + 0.12, y: mainY + 0.38, w: halfW - 0.24, h: 0.25,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, italic: true,
    });
  }

  // Bottom row - Key Lessons & Looking Ahead
  const bottomY = mainY + mainH + gap;
  const bottomH = 0.62;

  if (keyLessons) {
    addCard(pptx, slide, MX, bottomY, halfW, bottomH, { accentBorder: C.warning });
    addLeftBorder(pptx, slide, MX, bottomY, bottomH, C.warning);
    slide.addText("Key Lessons Learned", {
      x: MX + 0.12, y: bottomY + 0.06, w: halfW - 0.24, h: 0.16,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(truncate(keyLessons, 140), {
      x: MX + 0.12, y: bottomY + 0.24, w: halfW - 0.24, h: 0.32,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  }

  if (lookingAhead) {
    addCard(pptx, slide, rx, bottomY, halfW, bottomH, { accentBorder: C.primary });
    slide.addText(`Looking Ahead${basics.accountName ? ` to ${basics.accountName}` : ""}`, {
      x: rx + 0.12, y: bottomY + 0.06, w: halfW - 0.24, h: 0.16,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(truncate(lookingAhead, 140), {
      x: rx + 0.12, y: bottomY + 0.24, w: halfW - 0.24, h: 0.32,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  }

  // Status bar at bottom
  const statusY = bottomY + bottomH + gap;
  addCard(pptx, slide, MX, statusY, CONTENT_W, 0.28);
  slide.addText("Historical context for strategic planning", {
    x: MX + 0.12, y: statusY + 0.05, w: CONTENT_W / 2, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText("✓ Context Loaded", {
    x: MX + CONTENT_W / 2, y: statusY + 0.05, w: CONTENT_W / 2 - 0.24, h: 0.18,
    fontSize: TINY_SIZE, color: C.primary, fontFace: FONT_BODY, align: "right",
  });

  return slide;
};

// =============================================================================
// SLIDE 7: STRATEGIC ALIGNMENT
// =============================================================================
const createStrategicAlignmentSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Strategic Alignment", "Connecting priorities to ServiceNow value");

  const topY = 1.0;
  const colW = (CONTENT_W - 0.12) / 2;

  addCard(pptx, slide, MX, topY, CONTENT_W, 0.75, { accentBorder: C.primary });
  slide.addText(`ServiceNow Vision for ${data.basics.accountName}`, {
    x: MX + 0.12, y: topY + 0.08, w: CONTENT_W - 0.24, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.visionStatement || "No vision statement defined.", {
    x: MX + 0.12, y: topY + 0.3, w: CONTENT_W - 0.24, h: 0.4,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  const alignY = topY + 0.85;
  const alignments = data.generatedPlan?.strategicAlignment?.alignments || [];

  addCard(pptx, slide, MX, alignY, CONTENT_W, 2.3);
  slide.addText("Strategic Alignment Matrix", {
    x: MX + 0.12, y: alignY + 0.08, w: CONTENT_W - 0.24, h: 0.25,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  if (alignments.length === 0) {
    slide.addText("No strategic alignment data. Generate AI plan to populate.", {
      x: MX + 0.12, y: alignY + 0.5, w: CONTENT_W - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    alignments.slice(0, 4).forEach((a, i) => {
      const ay = alignY + 0.4 + i * 0.45;
      slide.addText(`${a.customerObjective}`, {
        x: MX + 0.15, y: ay, w: colW - 0.3, h: 0.2,
        fontSize: SMALL_SIZE, bold: true, color: C.accent, fontFace: FONT_BODY,
      });
      slide.addText(`→ ${a.serviceNowCapability}`, {
        x: MX + colW, y: ay, w: colW - 0.3, h: 0.2,
        fontSize: SMALL_SIZE, color: C.primary, fontFace: FONT_BODY,
      });
      slide.addText(truncate(a.outcome, 80), {
        x: MX + 0.15, y: ay + 0.2, w: CONTENT_W - 0.3, h: 0.2,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  return slide;
};

// =============================================================================
// SLIDE 8: ACCOUNT TEAM
// =============================================================================
const createAccountTeamSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Global Account Team");

  const topY = 1.0;
  const members = data.basics.coreTeamMembers || [];

  if (members.length === 0) {
    slide.addText("No team members defined.", {
      x: MX, y: topY, w: CONTENT_W, h: 0.5,
      fontSize: BODY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 1.2;

  members.slice(0, 8).forEach((m, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cx = MX + col * (cardW + 0.12);
    const cy = topY + row * (cardH + 0.12);

    addCard(pptx, slide, cx, cy, cardW, cardH, { accentBorder: i < 4 ? C.primary : C.accent });

    slide.addText(`${m.firstName} ${m.lastName}`, {
      x: cx + 0.1, y: cy + 0.15, w: cardW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "center",
    });
    slide.addText(m.title || "", {
      x: cx + 0.1, y: cy + 0.45, w: cardW - 0.2, h: 0.6,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 9: TASK-BASED AGILE AM MODEL
// =============================================================================
const createAgileTeamModelSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);

  const accountName = data.basics.accountName || "Account";

  addTitle(
    slide,
    "The Task-Based Agile AM Model",
    `${accountName} Account Team — Dynamic Resource Activation`
  );

  const topY = 0.95;
  const gap = 0.15;
  const leftW = 4.15;
  const rightW = CONTENT_W - leftW - gap;

  // Left: Wheel graphic card
  addCard(pptx, slide, MX, topY, leftW, 3.9, { accentBorder: C.primary });
  slide.addText("The GTM Wheel of Fire", {
    x: MX + 0.15,
    y: topY + 0.12,
    w: leftW - 0.3,
    h: 0.3,
    fontSize: HEADING_SIZE,
    bold: true,
    color: C.primary,
    fontFace: FONT_HEADING,
  });

  // Draw the wheel graphic - matching the UI exactly
  const wheelCenterX = MX + leftW / 2;
  const wheelCenterY = topY + 2.15;
  const outerR = 1.25;    // Outer ring edge
  const middleR = 0.9;    // Middle ring (dark gap)
  const innerR = 0.52;    // Core team circle

  const outerRoles = [
    { name: "BU Sales", color: C.accent },
    { name: "Inspire Value", color: C.primary },
    { name: "Impact", color: C.purple },
    { name: "Sales Mgmt.", color: C.warning },
    { name: "Elevate", color: C.accent },
    { name: "Prod. Mgmt.", color: C.primary },
    { name: "Marketing", color: C.purple },
    { name: "Exec Sponsor", color: C.warning },
  ];

  // Active segments (static snapshot for export - showing a typical scenario)
  const activeSegments = [0, 2, 5, 7];

  // Draw outer ring (dark background)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: wheelCenterX - outerR,
    y: wheelCenterY - outerR,
    w: outerR * 2,
    h: outerR * 2,
    fill: { color: "0A1525" },
    line: { color: C.border, width: 1 },
  });

  // Draw middle dark ring
  slide.addShape(pptx.ShapeType.ellipse, {
    x: wheelCenterX - middleR,
    y: wheelCenterY - middleR,
    w: middleR * 2,
    h: middleR * 2,
    fill: { color: "0A1525" },
    line: { color: "1E3A5F", width: 2 },
  });

  // Draw segment indicator lines (from middle ring outward)
  outerRoles.forEach((role, i) => {
    const segmentAngle = 360 / outerRoles.length;
    const midAngle = i * segmentAngle - 90;
    const midRad = (midAngle * Math.PI) / 180;
    const isActive = activeSegments.includes(i);
    
    // Line from middle ring to outer ring
    const startX = wheelCenterX + Math.cos(midRad) * middleR;
    const startY = wheelCenterY + Math.sin(midRad) * middleR;
    const endX = wheelCenterX + Math.cos(midRad) * outerR;
    const endY = wheelCenterY + Math.sin(midRad) * outerR;

    slide.addShape(pptx.ShapeType.line, {
      x: startX,
      y: startY,
      w: endX - startX === 0 ? 0.001 : endX - startX,
      h: endY - startY === 0 ? 0.001 : endY - startY,
      line: { color: isActive ? C.primary : "1E3A5F", width: isActive ? 2 : 1 },
    });
  });

  // Draw arrows from core to middle ring
  outerRoles.forEach((role, i) => {
    const segmentAngle = 360 / outerRoles.length;
    const midAngle = i * segmentAngle - 90;
    const midRad = (midAngle * Math.PI) / 180;
    const isActive = activeSegments.includes(i);
    
    const startX = wheelCenterX + Math.cos(midRad) * (innerR + 0.08);
    const startY = wheelCenterY + Math.sin(midRad) * (innerR + 0.08);
    const endX = wheelCenterX + Math.cos(midRad) * (middleR - 0.08);
    const endY = wheelCenterY + Math.sin(midRad) * (middleR - 0.08);

    slide.addShape(pptx.ShapeType.line, {
      x: startX,
      y: startY,
      w: endX - startX === 0 ? 0.001 : endX - startX,
      h: endY - startY === 0 ? 0.001 : endY - startY,
      line: { color: isActive ? C.primary : "374151", width: isActive ? 2 : 1 },
    });
  });

  // Draw Core Team circle (solid green)
  slide.addShape(pptx.ShapeType.ellipse, {
    x: wheelCenterX - innerR,
    y: wheelCenterY - innerR,
    w: innerR * 2,
    h: innerR * 2,
    fill: { color: "34D399" },
    line: { color: "6EE7B7", width: 2 },
  });

  // Core Team text
  slide.addText("Core\nTeam", {
    x: wheelCenterX - innerR,
    y: wheelCenterY - 0.18,
    w: innerR * 2,
    h: 0.38,
    fontSize: 10,
    bold: true,
    color: "065F46", // Dark green text
    fontFace: FONT_HEADING,
    align: "center",
    valign: "middle",
  });

  // Role labels positioned around the wheel
  outerRoles.forEach((role, i) => {
    const segmentAngle = 360 / outerRoles.length;
    const midAngle = i * segmentAngle - 90;
    const midRad = (midAngle * Math.PI) / 180;
    const isActive = activeSegments.includes(i);
    
    const labelR = outerR + 0.18;
    const labelX = wheelCenterX + Math.cos(midRad) * labelR - 0.45;
    const labelY = wheelCenterY + Math.sin(midRad) * labelR - 0.08;

    slide.addText(role.name, {
      x: labelX,
      y: labelY,
      w: 0.9,
      h: 0.2,
      fontSize: TINY_SIZE,
      color: isActive ? C.white : C.muted,
      fontFace: FONT_BODY,
      align: "center",
    });
  });

  // Right: Supporting bullets
  addCard(pptx, slide, MX + leftW + gap, topY, rightW, 2.85, { accentBorder: C.accent });
  slide.addText("Agile Operating Model", {
    x: MX + leftW + gap + 0.15,
    y: topY + 0.12,
    w: rightW - 0.3,
    h: 0.3,
    fontSize: HEADING_SIZE,
    bold: true,
    color: C.accent,
    fontFace: FONT_HEADING,
  });

  const bullets = [
    {
      t: "Dynamic Resource Activation",
      d: "Core team activates specific resources based on current pursuit phase and customer needs",
    },
    {
      t: "Scenario-Based Engagement",
      d: "Different workstreams engage different combinations of expertise",
    },
    {
      t: "Flexible Scale",
      d: "Resources scale up or down based on deal complexity and strategic importance",
    },
    {
      t: "Rapid Mobilization",
      d: "Quick activation of specialized expertise when opportunities arise",
    },
  ];

  bullets.forEach((b, i) => {
    const y = topY + 0.55 + i * 0.55;
    slide.addText(`${i + 1}. ${b.t}`, {
      x: MX + leftW + gap + 0.15,
      y,
      w: rightW - 0.3,
      h: 0.22,
      fontSize: SMALL_SIZE,
      bold: true,
      color: C.white,
      fontFace: FONT_BODY,
    });
    slide.addText(truncate(b.d, 72), {
      x: MX + leftW + gap + 0.3,
      y: y + 0.22,
      w: rightW - 0.45,
      h: 0.28,
      fontSize: TINY_SIZE,
      color: C.muted,
      fontFace: FONT_BODY,
    });
  });

  // Quote bar
  addCard(pptx, slide, MX + leftW + gap, topY + 2.95, rightW, 0.95, { accentBorder: C.primary });
  slide.addText(
    "\"We operate in an agile fashion — the core team dynamically activates specialized resources as opportunities emerge and evolve.\"",
    {
      x: MX + leftW + gap + 0.15,
      y: topY + 3.1,
      w: rightW - 0.3,
      h: 0.7,
      fontSize: SMALL_SIZE,
      italic: true,
      color: C.white,
      fontFace: FONT_BODY,
      valign: "top",
    }
  );

  return slide;
};

// =============================================================================
// SLIDE 9: SWOT ANALYSIS
// =============================================================================
const createSWOTSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "SWOT Analysis", "Strategic Position Assessment");

  const topY = 0.95;
  const cardGap = 0.1;
  const cardW = (CONTENT_W - cardGap) / 2;
  const cardH = 1.65;

  const swotData = [
    { title: "Strengths", items: data.swot.strengths || [], color: C.primary, x: MX, y: topY },
    { title: "Weaknesses", items: data.swot.weaknesses || [], color: C.danger, x: MX + cardW + cardGap, y: topY },
    { title: "Opportunities", items: data.swot.opportunities || [], color: C.accent, x: MX, y: topY + cardH + cardGap },
    { title: "Threats", items: data.swot.threats || [], color: C.warning, x: MX + cardW + cardGap, y: topY + cardH + cardGap },
  ];

  swotData.forEach((section) => {
    addCard(pptx, slide, section.x, section.y, cardW, cardH, { accentBorder: section.color });
    slide.addText(section.title, {
      x: section.x + 0.12, y: section.y + 0.08, w: cardW - 0.24, h: 0.25,
      fontSize: HEADING_SIZE - 2, bold: true, color: section.color, fontFace: FONT_HEADING,
    });

    if (section.items.length === 0) {
      slide.addText("No data available", {
        x: section.x + 0.12, y: section.y + 0.4, w: cardW - 0.24, h: 0.28,
        fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    } else {
      section.items.slice(0, 4).forEach((item, i) => {
        slide.addText(`• ${truncate(item, 55)}`, {
          x: section.x + 0.12, y: section.y + 0.4 + i * 0.3, w: cardW - 0.24, h: 0.28,
          fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
        });
      });
    }
  });

  return slide;
};

// =============================================================================
// SLIDE 10: VALUE DRIVERS
// =============================================================================
const createValueDriversSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Core Value Drivers", "How ServiceNow Delivers Value");

  const topY = 0.95;
  const cardW = (CONTENT_W - 0.24) / 2;
  const cardH = 1.55;

  const drivers = data.generatedPlan?.coreValueDrivers || [];
  const colors = [C.primary, C.accent, C.blue, C.purple];

  if (drivers.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No value drivers defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  drivers.slice(0, 4).forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MX + col * (cardW + 0.12);
    const cy = topY + row * (cardH + 0.1);
    const color = colors[i % colors.length];

    addCard(pptx, slide, cx, cy, cardW, cardH, { accentBorder: color });

    slide.addText(d.title || "", {
      x: cx + 0.15, y: cy + 0.15, w: cardW - 0.3, h: 0.28,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(truncate(d.description, 120), {
      x: cx + 0.15, y: cy + 0.5, w: cardW - 0.3, h: 0.9,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 11: KEY WORKSTREAMS (BIG BETS)
// =============================================================================
const createBigBetsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Key Transformation Workstreams", "Priority initiatives for value realisation");

  const topY = 0.95;
  const workstreams = data.generatedPlan?.keyWorkstreams || data.accountStrategy?.bigBets || [];
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.3;
  const colors = [C.primary, C.accent, C.blue];

  if (workstreams.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No workstreams defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  workstreams.slice(0, 3).forEach((w, i) => {
    const cx = MX + i * (cardW + 0.12);
    const color = colors[i % colors.length];
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: color });
    
    if (w.status) {
      addBadge(slide, cx + 0.08, topY + 0.08, w.status, color);
    }
    
    slide.addText(w.title || w.workflow || "", {
      x: cx + 0.1, y: topY + 0.4, w: cardW - 0.2, h: 0.35,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    
    slide.addText(truncate(w.description || w.outcome, 100), {
      x: cx + 0.1, y: topY + 0.8, w: cardW - 0.2, h: 0.6,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
    
    if (w.targetACV) {
      slide.addText("Target ACV", {
        x: cx + 0.1, y: topY + 1.5, w: cardW - 0.2, h: 0.16,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
      slide.addText(w.targetACV, {
        x: cx + 0.1, y: topY + 1.7, w: cardW - 0.2, h: 0.4,
        fontSize: 20, bold: true, color: color, fontFace: FONT_HEADING,
      });
    }
  });

  return slide;
};

// =============================================================================
// SLIDE 12: WORKSTREAM DETAIL
// =============================================================================
const createWorkstreamDetailSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Workstream Detail", "Detailed breakdown of key initiatives");

  const topY = 0.95;
  const workstreams = data.generatedPlan?.keyWorkstreams || [];

  if (workstreams.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No workstream details. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  const cardH = 0.7;
  workstreams.slice(0, 4).forEach((w, i) => {
    const wy = topY + i * (cardH + 0.1);
    addCard(pptx, slide, MX, wy, CONTENT_W, cardH, { accentBorder: C.primary });
    
    slide.addText(w.title || "", {
      x: MX + 0.12, y: wy + 0.08, w: 3.0, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    
    if (w.dealStatus) {
      addBadge(slide, MX + 3.2, wy + 0.08, w.dealStatus, C.accent);
    }
    
    slide.addText(truncate(w.subtitle || w.insight || "", 100), {
      x: MX + 0.12, y: wy + 0.35, w: CONTENT_W - 0.24, h: 0.28,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 13: AI USE CASES
// =============================================================================
const createAIUseCasesSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "AI-Led Use Case Portfolio", "Priority AI use cases aligned to strategy");

  const topY = 0.95;
  const useCases = data.generatedPlan?.aiUseCases || [];
  const cardW = (CONTENT_W - 0.12) / 2;
  const cardH = 1.5;

  if (useCases.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No AI use cases defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  useCases.slice(0, 4).forEach((uc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MX + col * (cardW + 0.12);
    const cy = topY + row * (cardH + 0.1);

    addCard(pptx, slide, cx, cy, cardW, cardH, { accentBorder: C.accent });
    
    if (uc.status) {
      addBadge(slide, cx + cardW - 1.0, cy + 0.08, uc.status, C.accent);
    }

    slide.addText(uc.title || "", {
      x: cx + 0.12, y: cy + 0.4, w: cardW - 0.24, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(truncate(uc.description, 100), {
      x: cx + 0.12, y: cy + 0.7, w: cardW - 0.24, h: 0.65,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 14: PLATFORM VISION
// =============================================================================
const createPlatformSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Platform Vision", "ServiceNow as the enterprise backbone");

  const topY = 1.0;
  const capabilities = data.generatedPlan?.platformCapabilities?.capabilities || [];
  const narrative = data.generatedPlan?.platformCapabilities?.narrative;

  if (capabilities.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.5);
    slide.addText("No platform capabilities defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  const colors = [C.accent, C.primary, C.purple, C.blue];
  const layerH = 0.75;
  
  capabilities.slice(0, 4).forEach((cap, i) => {
    const ly = topY + i * (layerH + 0.08);
    const color = colors[i % colors.length];
    addCard(pptx, slide, MX, ly, CONTENT_W, layerH, { accentBorder: color });
    slide.addText(cap.title || "", {
      x: MX + 0.12, y: ly + 0.08, w: 2.2, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: color, fontFace: FONT_HEADING,
    });
    slide.addText(truncate(cap.description, 80), {
      x: MX + 2.4, y: ly + 0.08, w: CONTENT_W - 2.6, h: layerH - 0.16,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
  });

  if (narrative) {
    const narY = topY + capabilities.slice(0, 4).length * (layerH + 0.08) + 0.1;
    slide.addText(truncate(narrative, 150), {
      x: MX, y: narY, w: CONTENT_W, h: 0.4,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  }

  return slide;
};

// =============================================================================
// SLIDE 15: ROADMAP
// =============================================================================
const createRoadmapSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Transformation Roadmap", "Phased execution plan");

  const topY = 1.0;
  const roadmapItems = data.generatedPlan?.roadmapPhases || [];
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.6;

  if (roadmapItems.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No roadmap defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  roadmapItems.slice(0, 3).forEach((item, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: C.primary });
    slide.addText(item.quarter || `Phase ${i + 1}`, {
      x: cx + 0.1, y: topY + 0.1, w: cardW - 0.2, h: 0.35,
      fontSize: 18, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
    slide.addText(item.title || "", {
      x: cx + 0.1, y: topY + 0.5, w: cardW - 0.2, h: 0.25,
      fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    
    const activities = item.activities || [];
    activities.slice(0, 4).forEach((m, j) => {
      slide.addText(`→  ${truncate(m, 30)}`, {
        x: cx + 0.1, y: topY + 0.85 + j * 0.28, w: cardW - 0.2, h: 0.26,
        fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 16: KEY ASKS
// =============================================================================
const createKeyAsksSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  
  // Dark premium background
  slide.background = { color: "0F172A" };
  
  // Gradient overlays
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -0.5, w: 4, h: 3,
    fill: { color: "3B82F6", transparency: 92 },
    line: { color: "3B82F6", transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: 3, w: 4, h: 3,
    fill: { color: "10B981", transparency: 92 },
    line: { color: "10B981", transparency: 100 },
  });

  // Header with accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: MX, y: MY, w: 0.08, h: 0.7,
    fill: { type: "solid", color: "3B82F6" },
    line: { color: "3B82F6", transparency: 100 },
  });
  
  slide.addText("Key Asks", {
    x: MX + 0.2, y: MY, w: 5, h: 0.4,
    fontSize: 26, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText("FY26", {
    x: MX + 1.8, y: MY, w: 1, h: 0.4,
    fontSize: 26, bold: true, color: "3B82F6", fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.accountName || "Account", {
    x: MX + 0.2, y: MY + 0.38, w: 5, h: 0.2,
    fontSize: SUBTITLE_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  const topY = 1.0;
  const colW = (CONTENT_W - 0.15) / 2;
  const cardH = 2.6;

  // Left Column: From P5 Leadership
  addCard(pptx, slide, MX, topY, colW, cardH, { accentBorder: "3B82F6" });
  slide.addText("From P5 Leadership", {
    x: MX + 0.15, y: topY + 0.12, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: "3B82F6", fontFace: FONT_HEADING,
  });

  const leadershipAsks = [
    { title: "Executive Sponsorship", items: ["CCO/CTO alignment meetings", "Quarterly business reviews"] },
    { title: "Resource Commitment", items: ["Dedicated account resources", "Specialist overlay support"] },
    { title: "Investment Support", items: ["Strategic initiative funding", "Innovation partnerships"] },
  ];

  leadershipAsks.forEach((ask, i) => {
    const ay = topY + 0.45 + i * 0.7;
    addLeftBorder(pptx, slide, MX + 0.15, ay, 0.55, "3B82F6");
    slide.addText(ask.title, {
      x: MX + 0.28, y: ay, w: colW - 0.45, h: 0.2,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    ask.items.slice(0, 2).forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: MX + 0.28, y: ay + 0.22 + j * 0.16, w: colW - 0.45, h: 0.16,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  // Right Column: From the Organisation
  const rx = MX + colW + 0.15;
  addCard(pptx, slide, rx, topY, colW, cardH, { accentBorder: "10B981" });
  slide.addText("From the Organisation", {
    x: rx + 0.15, y: topY + 0.12, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: "10B981", fontFace: FONT_HEADING,
  });

  const orgAsks = [
    { title: "Strategic Alignment", items: ["Cross-functional coordination", "Unified messaging"] },
    { title: "Enablement Support", items: ["Training & certification", "Use case development"] },
    { title: "Execution Velocity", items: ["Fast-track procurement", "Streamlined governance"] },
  ];

  orgAsks.forEach((ask, i) => {
    const ay = topY + 0.45 + i * 0.7;
    addLeftBorder(pptx, slide, rx + 0.15, ay, 0.55, "10B981");
    slide.addText(ask.title, {
      x: rx + 0.28, y: ay, w: colW - 0.45, h: 0.2,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    ask.items.slice(0, 2).forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: rx + 0.28, y: ay + 0.22 + j * 0.16, w: colW - 0.45, h: 0.16,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  // Critical Success Factors banner
  const bannerY = topY + cardH + 0.15;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: MX, y: bannerY, w: CONTENT_W, h: 0.55,
    fill: { color: "1E293B" },
    line: { color: "334155", width: 0.5 },
    rectRadius: 0.08,
  });
  slide.addText("Critical Success Factors:", {
    x: MX + 0.15, y: bannerY + 0.08, w: 2, h: 0.18,
    fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText("Executive visibility  •  Cross-functional alignment  •  Strategic investment  •  Fast execution", {
    x: MX + 0.15, y: bannerY + 0.28, w: CONTENT_W - 0.3, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 17: EXECUTION TIMELINE
// =============================================================================
const createExecutionTimelineSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  
  // Dark premium background
  slide.background = { color: "0F172A" };
  
  // Gradient overlays
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -0.5, w: 4, h: 3,
    fill: { color: "3B82F6", transparency: 92 },
    line: { color: "3B82F6", transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7, y: 3, w: 4, h: 3,
    fill: { color: "10B981", transparency: 92 },
    line: { color: "10B981", transparency: 100 },
  });

  // Header with accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: MX, y: MY, w: 0.08, h: 0.7,
    fill: { type: "solid", color: "3B82F6" },
    line: { color: "3B82F6", transparency: 100 },
  });
  
  slide.addText("Roadmap to ", {
    x: MX + 0.2, y: MY, w: 2, h: 0.4,
    fontSize: 24, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText("$21M ACV", {
    x: MX + 2.1, y: MY, w: 1.8, h: 0.4,
    fontSize: 24, bold: true, color: "10B981", fontFace: FONT_HEADING,
  });
  slide.addText(`${data.basics.accountName || "Account"} • Target: December 31, 2026`, {
    x: MX + 0.2, y: MY + 0.38, w: 5, h: 0.2,
    fontSize: SUBTITLE_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  const topY = 0.95;
  const quarters = ["Q1-26", "Q2-26", "Q3-26", "Q4-26", "2027", "2028"];
  const tracks = [
    { name: "AI", color: "3B82F6", value: "$2M" },
    { name: "CRM", color: "8B5CF6", value: "$17M" },
    { name: "Security", color: "10B981", value: "$2M" },
    { name: "Exec Connect", color: "F59E0B", value: "" },
  ];

  // Table header
  const tableX = MX;
  const tableW = CONTENT_W;
  const colW = 0.9;
  const trackColW = 0.8;
  const qColW = (tableW - trackColW - 0.6 - 0.5) / 6;
  const rowH = 0.55;
  const headerH = 0.35;

  // Header row background
  slide.addShape(pptx.ShapeType.rect, {
    x: tableX, y: topY, w: tableW, h: headerH,
    fill: { color: "1E293B" },
    line: { color: "334155", width: 0.5 },
  });

  // Header labels
  slide.addText("Workstream", {
    x: tableX + 0.08, y: topY + 0.08, w: trackColW - 0.1, h: 0.2,
    fontSize: TINY_SIZE, bold: true, color: C.muted, fontFace: FONT_BODY,
  });

  quarters.forEach((q, i) => {
    slide.addText(q, {
      x: tableX + trackColW + i * qColW + 0.05, y: topY + 0.08, w: qColW - 0.1, h: 0.2,
      fontSize: TINY_SIZE, bold: true, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
  });

  slide.addText("NNACV", {
    x: tableX + tableW - 0.55, y: topY + 0.08, w: 0.5, h: 0.2,
    fontSize: TINY_SIZE, bold: true, color: C.muted, fontFace: FONT_BODY, align: "center",
  });

  // Track rows
  tracks.forEach((track, i) => {
    const ry = topY + headerH + i * rowH;
    
    // Row background
    slide.addShape(pptx.ShapeType.rect, {
      x: tableX, y: ry, w: tableW, h: rowH,
      fill: { color: i % 2 === 0 ? "0F172A" : "1E293B", transparency: 50 },
      line: { color: "334155", width: 0.25 },
    });

    // Track name with color
    slide.addShape(pptx.ShapeType.rect, {
      x: tableX, y: ry, w: trackColW, h: rowH,
      fill: { color: track.color, transparency: 80 },
      line: { color: track.color, width: 0.5 },
    });
    slide.addText(track.name, {
      x: tableX + 0.08, y: ry + 0.15, w: trackColW - 0.16, h: 0.25,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });

    // NNACV value
    if (track.value) {
      slide.addText(track.value, {
        x: tableX + tableW - 0.55, y: ry + 0.15, w: 0.5, h: 0.25,
        fontSize: BODY_SIZE, bold: true, color: "10B981", fontFace: FONT_HEADING, align: "center",
      });
    }
  });

  // Legend
  const legendY = topY + headerH + tracks.length * rowH + 0.2;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: MX, y: legendY, w: CONTENT_W, h: 0.4,
    fill: { color: "1E293B", transparency: 50 },
    line: { color: "334155", width: 0.5 },
    rectRadius: 0.08,
  });

  const legendItems = [
    { label: "Key Milestone", color: "3B82F6" },
    { label: "Implementation", color: "8B5CF6" },
    { label: "Activity", color: "64748B" },
  ];

  legendItems.forEach((item, i) => {
    const lx = MX + 0.3 + i * 1.6;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: lx, y: legendY + 0.14, w: 0.12, h: 0.12,
      fill: { color: item.color },
      line: { color: item.color, transparency: 100 },
    });
    slide.addText(item.label, {
      x: lx + 0.18, y: legendY + 0.1, w: 1.2, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Mega deal indicator
  slide.addShape(pptx.ShapeType.roundRect, {
    x: MX + 5.5, y: legendY + 0.05, w: 3.4, h: 0.3,
    fill: { color: "3B82F6", transparency: 85 },
    line: { color: "3B82F6", width: 0.5 },
    rectRadius: 0.15,
  });
  slide.addText("Close mega deal (AI, L&S) = 6-8M USD", {
    x: MX + 5.6, y: legendY + 0.08, w: 3.2, h: 0.24,
    fontSize: TINY_SIZE, bold: true, color: "60A5FA", fontFace: FONT_BODY, align: "center",
  });

  return slide;
};

// =============================================================================
// SLIDE 18: RISK & MITIGATION
// =============================================================================
const createRiskMitigationSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Risk & Mitigation", "Proactive risk management approach");

  const topY = 0.95;
  const risks = data.generatedPlan?.risksMitigations || [];
  const cardH = 0.75;

  if (risks.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No risks identified. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  risks.slice(0, 4).forEach((r, i) => {
    const ry = topY + i * (cardH + 0.1);
    const levelColor = r.level === "High" ? C.danger : r.level === "Medium" ? C.warning : C.primary;
    addCard(pptx, slide, MX, ry, CONTENT_W, cardH, { accentBorder: levelColor });

    slide.addText(r.level || "Medium", {
      x: MX + 0.12, y: ry + 0.12, w: 0.7, h: 0.22,
      fontSize: TINY_SIZE, bold: true, color: levelColor, fontFace: FONT_BODY,
    });
    slide.addText(r.risk || "", {
      x: MX + 0.9, y: ry + 0.12, w: 2.5, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(truncate(r.mitigation, 100), {
      x: MX + 0.12, y: ry + 0.4, w: CONTENT_W - 0.24, h: 0.28,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 17: GOVERNANCE
// =============================================================================
const createGovernanceSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Governance Model");

  const topY = 0.85;
  const colW = (CONTENT_W - 0.15) / 2;
  const mainH = 3.0;

  addCard(pptx, slide, MX, topY, colW, mainH);
  slide.addText("Execution Governance", {
    x: MX + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const events = data.engagement.plannedExecutiveEvents || [];
  const sponsors = data.engagement.knownExecutiveSponsors || [];
  
  slide.addText("Key Forums & Events", {
    x: MX + 0.15, y: topY + 0.4, w: colW - 0.3, h: 0.2,
    fontSize: SMALL_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
  });
  
  events.slice(0, 3).forEach((e, i) => {
    slide.addText(`• ${truncate(e, 40)}`, {
      x: MX + 0.15, y: topY + 0.65 + i * 0.25, w: colW - 0.3, h: 0.23,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  slide.addText("Executive Sponsors", {
    x: MX + 0.15, y: topY + 1.5, w: colW - 0.3, h: 0.2,
    fontSize: SMALL_SIZE, bold: true, color: C.accent, fontFace: FONT_BODY,
  });
  
  sponsors.slice(0, 3).forEach((s, i) => {
    slide.addText(`• ${truncate(s, 40)}`, {
      x: MX + 0.15, y: topY + 1.75 + i * 0.25, w: colW - 0.3, h: 0.23,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  const rx = MX + colW + 0.15;
  addCard(pptx, slide, rx, topY, colW, mainH);
  slide.addText("Success Metrics", {
    x: rx + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const metrics = data.generatedPlan?.successMetrics || [];
  metrics.slice(0, 4).forEach((m, i) => {
    const my = topY + 0.45 + i * 0.6;
    slide.addText(m.metric || "", {
      x: rx + 0.2, y: my, w: 1.0, h: 0.28,
      fontSize: 16, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
    slide.addText(m.label || "", {
      x: rx + 1.3, y: my, w: colW - 1.5, h: 0.28,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
    slide.addText(truncate(m.description, 50), {
      x: rx + 0.2, y: my + 0.28, w: colW - 0.4, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 18: WEEKLY UPDATE
// =============================================================================
const createWeeklyUpdateSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Weekly Update", "Current status and next steps");

  const topY = 0.95;
  const update = data.generatedPlan?.weeklyUpdateContext;

  if (!update) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No weekly update data. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  const colW = (CONTENT_W - 0.12) / 2;

  addCard(pptx, slide, MX, topY, colW, 1.3, { accentBorder: C.primary });
  slide.addText("This Week's Wins", {
    x: MX + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  (update.keyHighlights || []).slice(0, 3).forEach((w, i) => {
    slide.addText(`✓ ${truncate(w, 50)}`, {
      x: MX + 0.12, y: topY + 0.38 + i * 0.28, w: colW - 0.24, h: 0.26,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 1.3, { accentBorder: C.accent });
  slide.addText("Next Steps", {
    x: rx + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.accent, fontFace: FONT_HEADING,
  });
  (update.criticalActions || []).slice(0, 3).forEach((n, i) => {
    slide.addText(`→ ${truncate(n, 50)}`, {
      x: rx + 0.12, y: topY + 0.38 + i * 0.28, w: colW - 0.24, h: 0.26,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
    });
  });

  const blockersY = topY + 1.45;
  addCard(pptx, slide, MX, blockersY, CONTENT_W, 1.0, { accentBorder: C.warning });
  slide.addText("Status", {
    x: MX + 0.12, y: blockersY + 0.08, w: CONTENT_W - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.warning, fontFace: FONT_HEADING,
  });
  slide.addText(update.overallStatus || "On Track", {
    x: MX + 0.12, y: blockersY + 0.38, w: CONTENT_W - 0.24, h: 0.26,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 19: EXECUTIVE ENGAGEMENT
// =============================================================================
const createEngagementSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Executive Engagement Model", "Tiered engagement structure and key forums");

  const topY = 0.95;
  const colW = (CONTENT_W - 0.12) / 2;

  addCard(pptx, slide, MX, topY, colW, 2.2);
  slide.addText("Executive Sponsors", {
    x: MX + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.25,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  const sponsors = data.engagement.knownExecutiveSponsors || [];
  if (sponsors.length === 0) {
    slide.addText("No sponsors defined.", {
      x: MX + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    sponsors.slice(0, 5).forEach((s, i) => {
      slide.addText(`• ${s}`, {
        x: MX + 0.12, y: topY + 0.4 + i * 0.35, w: colW - 0.24, h: 0.32,
        fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
      });
    });
  }

  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 2.2, { accentBorder: C.accent });
  slide.addText("Planned Executive Events", {
    x: rx + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.25,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.accent, fontFace: FONT_HEADING,
  });

  const events = data.engagement.plannedExecutiveEvents || [];
  if (events.length === 0) {
    slide.addText("No events planned.", {
      x: rx + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    events.slice(0, 5).forEach((e, i) => {
      slide.addText(`• ${e}`, {
        x: rx + 0.12, y: topY + 0.4 + i * 0.35, w: colW - 0.24, h: 0.32,
        fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
      });
    });
  }

  return slide;
};

// =============================================================================
// SLIDE 20: PURSUIT PLAN
// =============================================================================
const createPursuitPlanSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Pursuit Plan", "Key milestones and decision points");

  const topY = 1.0;
  const pursuits = data.generatedPlan?.keyWorkstreams || [];
  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 2.0;

  if (pursuits.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No pursuit plan defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  pursuits.slice(0, 4).forEach((p, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: C.primary });

    slide.addText(p.dealStatus || `Workstream ${i + 1}`, {
      x: cx + 0.08, y: topY + 0.1, w: cardW - 0.16, h: 0.3,
      fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING, align: "center",
    });
    
    if (p.targetClose) {
      addBadge(slide, cx + (cardW - 0.6) / 2, topY + 0.45, p.targetClose, C.accent);
    }

    slide.addText(p.title || "", {
      x: cx + 0.08, y: topY + 0.8, w: cardW - 0.16, h: 0.26,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(truncate(p.insight || "", 60), {
      x: cx + 0.08, y: topY + 1.1, w: cardW - 0.16, h: 0.5,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 21: SUCCESS METRICS
// =============================================================================
const createSuccessMetricsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Success Metrics", "Measuring impact and value realisation");

  const topY = 1.0;
  const metrics = data.generatedPlan?.successMetrics || [];
  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 1.6;

  if (metrics.length === 0) {
    addCard(pptx, slide, MX, topY, CONTENT_W, 2.0);
    slide.addText("No success metrics defined. Generate AI plan to populate.", {
      x: MX + 0.15, y: topY + 0.5, w: CONTENT_W - 0.3, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    return slide;
  }

  metrics.slice(0, 4).forEach((m, i) => {
    const cx = MX + i * (cardW + 0.12);
    const color = i % 2 === 0 ? C.primary : C.accent;
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: color });
    slide.addText(m.metric || "", {
      x: cx + 0.1, y: topY + 0.2, w: cardW - 0.2, h: 0.5,
      fontSize: 28, bold: true, color: color, fontFace: FONT_HEADING, align: "center",
    });
    slide.addText(m.label || "", {
      x: cx + 0.1, y: topY + 0.75, w: cardW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "center",
    });
    slide.addText(truncate(m.description, 40), {
      x: cx + 0.1, y: topY + 1.05, w: cardW - 0.2, h: 0.35,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 22: CLOSING / THANK YOU
// =============================================================================
const createClosingSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addGradientBg(pptx, slide);

  const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  slide.addText("Thank You", {
    x: 0.5, y: 1.5, w: 9, h: 0.7,
    fontSize: 48, bold: true, color: C.primary, fontFace: FONT_HEADING, align: "center",
  });
  slide.addText(`${data.basics.accountName} Global Account Plan`, {
    x: 0.5, y: 2.3, w: 9, h: 0.45,
    fontSize: 20, color: C.white, fontFace: FONT_BODY, align: "center",
  });
  slide.addText(monthYear, {
    x: 0.5, y: 2.85, w: 9, h: 0.3,
    fontSize: 14, color: C.muted, fontFace: FONT_BODY, align: "center",
  });

  const members = data.basics.coreTeamMembers || [];
  const teamText = members.map((m) => `${m.firstName} ${m.lastName}`).join("  •  ");
  slide.addText(teamText, {
    x: 0.5, y: 3.8, w: 9, h: 0.3,
    fontSize: 12, color: C.primary, fontFace: FONT_BODY, align: "center",
  });

  slide.addText("servicenow.com", {
    x: 0.5, y: 4.4, w: 9, h: 0.25,
    fontSize: 11, color: C.accent, fontFace: FONT_BODY, align: "center",
  });

  return slide;
};

// =============================================================================
// MAIN EXPORT FUNCTION - EXACT MATCH TO WEB SLIDE ORDER
// =============================================================================
export const exportToPowerPoint = async (data: AccountData) => {
  const pptx = new pptxgen();

  pptx.author = "ServiceNow";
  pptx.title = `${data.basics.accountName} Account Plan`;
  pptx.subject = "Global Account Plan";
  pptx.layout = "LAYOUT_16x9";

  const slides: pptxgen.Slide[] = [];

  // EXACT WEB ORDER (skipping Input Form):
  // 1. Cover
  // 2. Executive Summary
  // 3. Customer Snapshot
  // 4. Customer Strategy
  // 5. Account Strategy
  // 6. FY-1 Retrospective
  // 7. Strategic Alignment
  // 8. Account Team
  // 9. Task-Based Agile AM Model
  // 10. SWOT Analysis
  // 11. Value Drivers
  // 12. Key Workstreams (Big Bets)
  // 13. Workstream Detail
  // 14. AI Portfolio
  // 15. Platform Vision
  // 16. Roadmap
  // 17. Key Asks
  // 18. Execution Timeline
  // 19. Risk & Mitigation
  // 20. Governance
  // 21. Weekly Update
  // 22. Engagement
  // 23. Pursuit Plan
  // 24. Success Metrics
  // 25. Thank You

  slides.push(createCoverSlide(pptx, data));                    // 1
  slides.push(createExecutiveSummarySlide(pptx, data));         // 2
  slides.push(createCustomerSnapshotSlide(pptx, data));         // 3
  slides.push(createCustomerStrategySlide(pptx, data));         // 4
  slides.push(createAccountStrategySlide(pptx, data));          // 5
  slides.push(createRetrospectiveSlide(pptx, data));            // 6
  slides.push(createStrategicAlignmentSlide(pptx, data));       // 7
  slides.push(createAccountTeamSlide(pptx, data));              // 8
  slides.push(createAgileTeamModelSlide(pptx, data));           // 9
  slides.push(createSWOTSlide(pptx, data));                     // 10
  slides.push(createValueDriversSlide(pptx, data));             // 11
  slides.push(createBigBetsSlide(pptx, data));                  // 12
  slides.push(createWorkstreamDetailSlide(pptx, data));         // 13
  slides.push(createAIUseCasesSlide(pptx, data));               // 14
  slides.push(createPlatformSlide(pptx, data));                 // 15
  slides.push(createRoadmapSlide(pptx, data));                  // 16
  slides.push(createKeyAsksSlide(pptx, data));                  // 17
  slides.push(createExecutionTimelineSlide(pptx, data));        // 18
  slides.push(createRiskMitigationSlide(pptx, data));           // 19
  slides.push(createGovernanceSlide(pptx, data));               // 20
  slides.push(createWeeklyUpdateSlide(pptx, data));             // 21
  slides.push(createEngagementSlide(pptx, data));               // 22
  slides.push(createPursuitPlanSlide(pptx, data));              // 23
  slides.push(createSuccessMetricsSlide(pptx, data));           // 24
  slides.push(createClosingSlide(pptx, data));                  // 25

  const exportId = new Date()
    .toISOString()
    .replace(/\..+/, "")
    .replace(/[-:]/g, "")
    .replace("T", "_");

  slides.forEach((slide, i) => {
    slide.addNotes(`export_id: ${exportId}\nslide: ${i + 1}/${slides.length}`);

    if (i > 0 && i < slides.length - 1) {
      addFooter(slide, i + 1, slides.length, data.basics.accountName);
    }
  });

  await pptx.writeFile({
    fileName: `${data.basics.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_${exportId}.pptx`,
  });
};
