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

// Slide dimensions (LAYOUT_16x9: 10" × 5.625")
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
// SLIDE 2: EXECUTIVE SUMMARY (matches web ExecutiveSummarySlide)
// =============================================================================
const createExecutiveSummarySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Executive Summary");

  const topY = 0.9;
  const leftW = 4.5;
  const rightX = MX + leftW + 0.15;
  const rightW = CONTENT_W - leftW - 0.15;

  // Left card - Narrative
  addCard(pptx, slide, MX, topY, leftW, 4.0);

  const lastName = data.basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";
  slide.addText(`Powering A STRONGER ${lastName}`, {
    x: MX + 0.15, y: topY + 0.1, w: leftW - 0.3, h: 0.35,
    fontSize: HEADING_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  slide.addText(data.annualReport.executiveSummaryNarrative || "No executive summary provided.", {
    x: MX + 0.15, y: topY + 0.5, w: leftW - 0.3, h: 0.9,
    fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
  });

  // Strategic Pillars from data
  slide.addText("Strategic Pillars", {
    x: MX + 0.15, y: topY + 1.5, w: leftW - 0.3, h: 0.25,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const pillars = data.annualReport.strategicPillars?.slice(0, 4) || [];
  pillars.forEach((p, i) => {
    const py = topY + 1.8 + i * 0.5;
    addLeftBorder(pptx, slide, MX + 0.15, py, 0.4, C.primary);
    slide.addText(p.title || "", {
      x: MX + 0.3, y: py, w: leftW - 0.45, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((p.tagline || "").substring(0, 80), {
      x: MX + 0.3, y: py + 0.18, w: leftW - 0.45, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Right column - Key Metrics
  const rCards = [
    { label: "FY Revenue", value: data.annualReport.revenue || data.financial.customerRevenue, sub: data.annualReport.revenueComparison },
    { label: "EBIT Improvement", value: data.annualReport.ebitImprovement || data.financial.marginEBIT, sub: "YoY" },
  ];
  rCards.forEach((c, i) => {
    const cy = topY + i * 0.95;
    addCard(pptx, slide, rightX, cy, rightW / 2 - 0.08, 0.85);
    slide.addText(c.label, {
      x: rightX + 0.1, y: cy + 0.08, w: rightW / 2 - 0.2, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(c.value || "—", {
      x: rightX + 0.1, y: cy + 0.28, w: rightW / 2 - 0.2, h: 0.4,
      fontSize: 26, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
    slide.addText(c.sub ? `(${c.sub})` : "", {
      x: rightX + 0.1, y: cy + 0.65, w: rightW / 2 - 0.2, h: 0.15,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Key Milestones
  const mileY = topY + 2.0;
  addCard(pptx, slide, rightX, mileY, rightW, 1.1);
  slide.addText("Key Milestones", {
    x: rightX + 0.1, y: mileY + 0.08, w: rightW - 0.2, h: 0.22,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  (data.annualReport.keyMilestones || []).slice(0, 4).forEach((m, i) => {
    slide.addText(`• ${m}`, {
      x: rightX + 0.1, y: mileY + 0.32 + i * 0.19, w: rightW - 0.2, h: 0.19,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Strategic Achievements
  const achY = topY + 3.2;
  addCard(pptx, slide, rightX, achY, rightW, 0.7);
  slide.addText("Strategic Achievements", {
    x: rightX + 0.1, y: achY + 0.06, w: rightW - 0.2, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  (data.annualReport.strategicAchievements || []).slice(0, 2).forEach((a, i) => {
    slide.addText(`• ${a}`, {
      x: rightX + 0.1, y: achY + 0.28 + i * 0.19, w: rightW - 0.2, h: 0.19,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 3: CUSTOMER SNAPSHOT (matches web CustomerSnapshotSlide)
// =============================================================================
const createCustomerSnapshotSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Customer Snapshot", `${data.basics.accountName} at a Glance`);

  const topY = 0.95;
  const cardGap = 0.12;
  const colW = (CONTENT_W - cardGap) / 2;

  // Key Metrics Row
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

  // Company Overview
  const overviewY = topY + 1.0;
  addCard(pptx, slide, MX, overviewY, colW, 1.8);
  slide.addText("Company Overview", {
    x: MX + 0.12, y: overviewY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const overviewItems = [
    { label: "Account", value: data.basics.accountName || "—" },
    { label: "FY Ambition", value: data.basics.nextFYAmbition || "—" },
    { label: "Cost Pressures", value: data.financial.costPressureAreas || "—" },
    { label: "Investment Areas", value: data.financial.strategicInvestmentAreas || "—" },
  ];

  overviewItems.forEach((item, i) => {
    slide.addText(`${item.label}:`, {
      x: MX + 0.12, y: overviewY + 0.38 + i * 0.35, w: 1.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(item.value.substring(0, 50), {
      x: MX + 1.4, y: overviewY + 0.38 + i * 0.35, w: colW - 1.6, h: 0.18,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // ServiceNow Position
  const rx = MX + colW + cardGap;
  addCard(pptx, slide, rx, overviewY, colW, 1.8, { accentBorder: C.primary });
  slide.addText("ServiceNow Position", {
    x: rx + 0.12, y: overviewY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  const snItems = [
    { label: "Current Contract Value", value: data.basics.currentContractValue || "—" },
    { label: "FY26 Ambition", value: data.basics.nextFYAmbition || "—" },
    { label: "3-Year Target", value: data.basics.threeYearAmbition || "—" },
    { label: "Renewal Date", value: data.basics.renewalDates || "—" },
  ];

  snItems.forEach((item, i) => {
    slide.addText(`${item.label}:`, {
      x: rx + 0.12, y: overviewY + 0.38 + i * 0.35, w: 1.6, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(item.value.substring(0, 40), {
      x: rx + 1.7, y: overviewY + 0.38 + i * 0.35, w: colW - 1.9, h: 0.18,
      fontSize: SMALL_SIZE, color: C.primary, fontFace: FONT_BODY,
    });
  });

  // Vision Statement
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
// SLIDE 4: CUSTOMER STRATEGY (matches web CustomerStrategySlide)
// =============================================================================
const createCustomerStrategySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Customer Strategy", `${data.basics.accountName} Strategic Direction`);

  const topY = 0.95;
  const cardGap = 0.12;
  const colW = (CONTENT_W - cardGap) / 2;

  // Corporate Strategy
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
      slide.addText((s.description || "").substring(0, 60), {
        x: MX + 0.22, y: sy + 0.17, w: colW - 0.35, h: 0.18,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  // Digital Strategy
  const rx = MX + colW + cardGap;
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
      slide.addText((s.description || "").substring(0, 60), {
        x: rx + 0.22, y: sy + 0.17, w: colW - 0.35, h: 0.18,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  // CEO/Board Priorities
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

  // Transformation Themes
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
// SLIDE 5: FY-1 RETROSPECTIVE (matches web FY1RetrospectiveSlide)
// =============================================================================
const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "FY-1 Retrospective", "What Actually Happened — Honest Assessment");

  const topY = 0.9;
  const cardGap = 0.15;
  const colW = (CONTENT_W - cardGap) / 2;

  // Prior Plan Summary
  addCard(pptx, slide, MX, topY, colW, 1.8);
  slide.addText("Prior Plan Summary", {
    x: MX + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.22,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText(`${data.history.lastPlanDate || "—"} • ${data.history.plannerName || "—"}, ${data.history.plannerRole || "—"}`, {
    x: MX + 0.15, y: topY + 0.35, w: colW - 0.3, h: 0.16,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText((data.history.lastPlanSummary || "No prior plan summary available.").substring(0, 250), {
    x: MX + 0.15, y: topY + 0.55, w: colW - 0.3, h: 1.15,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  // What Did Not Work
  const rx = MX + colW + cardGap;
  addCard(pptx, slide, rx, topY, colW, 1.8);
  addLeftBorder(pptx, slide, rx, topY, 1.8, C.danger);
  slide.addText("What Did Not Work", {
    x: rx + 0.2, y: topY + 0.1, w: colW - 0.35, h: 0.22,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText((data.history.whatDidNotWork || "No information available.").substring(0, 200), {
    x: rx + 0.2, y: topY + 0.38, w: colW - 0.35, h: 0.7,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });
  slide.addText("Prior Transformation Attempts", {
    x: rx + 0.2, y: topY + 1.15, w: colW - 0.35, h: 0.18,
    fontSize: TINY_SIZE, bold: true, color: C.danger, fontFace: FONT_BODY,
  });
  slide.addText((data.history.priorTransformationAttempts || "—").substring(0, 100), {
    x: rx + 0.2, y: topY + 1.35, w: colW - 0.35, h: 0.35,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  // Summary Box
  const sumY = topY + 2.0;
  addCard(pptx, slide, MX, sumY, CONTENT_W, 0.65, { accentBorder: C.primary });
  slide.addText("FY-1 Insight", {
    x: MX + 0.12, y: sumY + 0.08, w: CONTENT_W - 0.24, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
  });
  slide.addText("Understanding past challenges enables strategic positioning for future growth.", {
    x: MX + 0.12, y: sumY + 0.3, w: CONTENT_W - 0.24, h: 0.3,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 6: STRATEGIC ALIGNMENT (matches web StrategicAlignmentSlide)
// =============================================================================
const createStrategicAlignmentSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Strategic Alignment", "Connecting corporate priorities to ServiceNow value");

  const topY = 1.0;
  const colW = (CONTENT_W - 0.12) / 2;

  // Vision Statement at top
  addCard(pptx, slide, MX, topY, CONTENT_W, 0.75, { accentBorder: C.primary });
  slide.addText(`ServiceNow Vision for ${data.basics.accountName}`, {
    x: MX + 0.12, y: topY + 0.08, w: CONTENT_W - 0.24, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.visionStatement || "No vision statement defined.", {
    x: MX + 0.12, y: topY + 0.3, w: CONTENT_W - 0.24, h: 0.4,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  // Digital Strategies
  const dsY = topY + 0.85;
  addCard(pptx, slide, MX, dsY, colW, 1.5);
  slide.addText("Digital Strategies", {
    x: MX + 0.1, y: dsY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  (data.strategy.digitalStrategies || []).slice(0, 3).forEach((ds, i) => {
    const dy = dsY + 0.35 + i * 0.38;
    slide.addText(ds.title || "", {
      x: MX + 0.15, y: dy, w: colW - 0.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((ds.description || "").substring(0, 70), {
      x: MX + 0.15, y: dy + 0.18, w: colW - 0.3, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Transformation Themes
  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, dsY, colW, 1.5);
  slide.addText("Transformation Themes", {
    x: rx + 0.1, y: dsY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  (data.strategy.transformationThemes || []).slice(0, 3).forEach((t, i) => {
    const ty = dsY + 0.35 + i * 0.38;
    slide.addText(t.title || "", {
      x: rx + 0.15, y: ty, w: colW - 0.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((t.description || "").substring(0, 70), {
      x: rx + 0.15, y: ty + 0.18, w: colW - 0.3, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Financial Context
  const finY = dsY + 1.6;
  addCard(pptx, slide, MX, finY, colW, 0.75);
  slide.addText("Financial Context", {
    x: MX + 0.1, y: finY + 0.06, w: colW - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText(`Revenue: ${data.financial.customerRevenue || "—"}  |  Growth: ${data.financial.growthRate || "—"}  |  EBIT: ${data.financial.marginEBIT || "—"}`, {
    x: MX + 0.1, y: finY + 0.28, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(`Investments: ${(data.financial.strategicInvestmentAreas || "").substring(0, 50)}`, {
    x: MX + 0.1, y: finY + 0.48, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  // Account Position
  addCard(pptx, slide, rx, finY, colW, 0.75);
  slide.addText("Account Position", {
    x: rx + 0.1, y: finY + 0.06, w: colW - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText(`Current: ${data.basics.currentContractValue || "—"} → FY: ${data.basics.nextFYAmbition || "—"} → 3Y: ${data.basics.threeYearAmbition || "—"}`, {
    x: rx + 0.1, y: finY + 0.28, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.primary, fontFace: FONT_BODY,
  });
  slide.addText(`Renewal: ${data.basics.renewalDates || "—"}`, {
    x: rx + 0.1, y: finY + 0.48, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 7: ACCOUNT TEAM (simplified version of web AccountTeamSlide)
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
      x: cx + 0.1, y: cy + 0.45, w: cardW - 0.2, h: 0.5,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
    slide.addText("", {
      x: cx + 0.1, y: cy + 0.7, w: cardW - 0.2, h: 0.18,
      fontSize: 6, color: C.primary, fontFace: FONT_BODY, align: "center",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 8: SWOT ANALYSIS (matches web SWOTSlide)
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

    section.items.slice(0, 4).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 60)}`, {
        x: section.x + 0.12, y: section.y + 0.4 + i * 0.3, w: cardW - 0.24, h: 0.28,
        fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
      });
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 9: VALUE DRIVERS (matches web CoreValueDriversSlide)
// =============================================================================
const createValueDriversSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Core Value Drivers", "How ServiceNow Delivers Value");

  const topY = 0.95;
  const cardW = (CONTENT_W - 0.24) / 2;
  const cardH = 1.55;

  const drivers = [
    { title: "Operational Efficiency", desc: "Streamlined workflows reduce manual effort and accelerate delivery", color: C.primary },
    { title: "Cost Optimisation", desc: "Platform consolidation and automation drive significant cost reduction", color: C.accent },
    { title: "Customer Experience", desc: "Unified service delivery improves satisfaction and retention", color: C.blue },
    { title: "Digital Transformation", desc: "Modern platform enables AI-first strategy and innovation", color: C.purple },
  ];

  drivers.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MX + col * (cardW + 0.12);
    const cy = topY + row * (cardH + 0.1);

    addCard(pptx, slide, cx, cy, cardW, cardH, { accentBorder: d.color });

    slide.addShape(pptx.ShapeType.ellipse, {
      x: cx + 0.15, y: cy + 0.15, w: 0.35, h: 0.35,
      fill: { color: d.color, transparency: 70 },
      line: { color: d.color },
    });

    slide.addText(d.title, {
      x: cx + 0.6, y: cy + 0.18, w: cardW - 0.75, h: 0.28,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(d.desc, {
      x: cx + 0.15, y: cy + 0.6, w: cardW - 0.3, h: 0.8,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 10: KEY WORKSTREAMS / BIG BETS (matches web BigBetsSlide)
// =============================================================================
const createBigBetsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Key Transformation Workstreams", "Priority initiatives for value realisation");
  addBadge(slide, W - MX - 1.1, MY + 0.05, "FY26 Big Bets", C.primary);

  const topY = 0.95;
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.3;

  const streams = [
    { title: "CRM Modernisation", status: "Active", acv: "$5M", color: C.primary },
    { title: "AI Use Cases", status: "Strategic", acv: "$2M", color: C.accent },
    { title: "Platform Expansion", status: "Foundation", acv: "$3M", color: C.blue },
  ];

  streams.forEach((s, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: s.color });
    addBadge(slide, cx + 0.08, topY + 0.08, s.status, s.color);
    slide.addText(s.title, {
      x: cx + 0.1, y: topY + 0.4, w: cardW - 0.2, h: 0.35,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText("Target ACV", {
      x: cx + 0.1, y: topY + 1.0, w: cardW - 0.2, h: 0.16,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(s.acv, {
      x: cx + 0.1, y: topY + 1.2, w: cardW - 0.2, h: 0.5,
      fontSize: 24, bold: true, color: s.color, fontFace: FONT_HEADING,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 11: AI USE CASES (matches web AIUseCasesSlide)
// =============================================================================
const createAIUseCasesSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "AI-Led Use Case Portfolio", "Priority AI use cases aligned to strategy");

  const topY = 0.95;
  const cardW = (CONTENT_W - 0.12) / 2;
  const cardH = 1.5;

  const useCases = [
    { title: "Predictive Case Routing", desc: "AI-powered case classification and intelligent routing", status: "Pilot Ready" },
    { title: "Intelligent Document Processing", desc: "Automated extraction and processing of documents", status: "Discovery" },
    { title: "Customer Sentiment Analysis", desc: "Real-time sentiment detection for case prioritisation", status: "Scoped" },
    { title: "AI Knowledge Management", desc: "Generative AI-powered knowledge recommendations", status: "Planned" },
  ];

  useCases.forEach((uc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MX + col * (cardW + 0.12);
    const cy = topY + row * (cardH + 0.1);

    addCard(pptx, slide, cx, cy, cardW, cardH, { accentBorder: C.accent });
    addBadge(slide, cx + cardW - 1.0, cy + 0.08, uc.status, C.accent);

    slide.addText(uc.title, {
      x: cx + 0.12, y: cy + 0.4, w: cardW - 0.24, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(uc.desc, {
      x: cx + 0.12, y: cy + 0.7, w: cardW - 0.24, h: 0.65,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 12: PLATFORM VISION (matches web PlatformSlide)
// =============================================================================
const createPlatformSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Platform Vision", "ServiceNow as the enterprise backbone");

  const topY = 1.0;
  const layers = [
    { title: "Experience Layer", items: ["Customer Portal", "Employee Center", "Mobile"], color: C.accent },
    { title: "Workflow Layer", items: ["Case Management", "Fulfillment", "Approvals", "SLAs"], color: C.primary },
    { title: "Integration Layer", items: ["API Hub", "IntegrationHub", "Spokes"], color: C.purple },
    { title: "Data & AI Layer", items: ["CMDB", "AI Search", "Predictive Intelligence"], color: C.blue },
  ];

  const layerH = 0.85;
  layers.forEach((l, i) => {
    const ly = topY + i * (layerH + 0.08);
    addCard(pptx, slide, MX, ly, CONTENT_W, layerH, { accentBorder: l.color });
    slide.addText(l.title, {
      x: MX + 0.12, y: ly + 0.08, w: 2.0, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: l.color, fontFace: FONT_HEADING,
    });
    slide.addText(l.items.join("  •  "), {
      x: MX + 2.2, y: ly + 0.08, w: CONTENT_W - 2.4, h: layerH - 0.16,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 13: ROADMAP (matches web RoadmapSlide)
// =============================================================================
const createRoadmapSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Transformation Roadmap", "FY26 phased execution plan");

  const phases = [
    { quarter: "Q1 FY26", title: "Foundation", items: ["Decision forum", "EBC execution", "Pilot scoping"] },
    { quarter: "Q2 FY26", title: "Commercialisation", items: ["Contract finalisation", "SOW development", "Kick-off planning"] },
    { quarter: "Q3-Q4", title: "Expansion", items: ["AI use case deployment", "Integration", "Platform scaling"] },
  ];

  const topY = 1.0;
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.6;

  phases.forEach((p, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: C.primary });
    slide.addText(p.quarter, {
      x: cx + 0.1, y: topY + 0.1, w: cardW - 0.2, h: 0.35,
      fontSize: 20, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
    slide.addText(p.title, {
      x: cx + 0.1, y: topY + 0.5, w: cardW - 0.2, h: 0.25,
      fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    p.items.forEach((item, j) => {
      slide.addText(`→  ${item}`, {
        x: cx + 0.1, y: topY + 0.85 + j * 0.28, w: cardW - 0.2, h: 0.26,
        fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 14: RISK & MITIGATION (matches web RiskMitigationSlide)
// =============================================================================
const createRiskMitigationSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Risk & Mitigation", "Proactive risk management approach");

  const topY = 0.95;
  const risks = [
    { risk: "Budget Constraints", mitigation: "Phased investment approach; quick-win ROI demonstration", level: "High" },
    { risk: "Change Resistance", mitigation: "Executive sponsorship; clear communication plan", level: "Medium" },
    { risk: "Technical Complexity", mitigation: "Proven methodology; experienced delivery team", level: "Medium" },
    { risk: "Timeline Pressure", mitigation: "Agile delivery; milestone-based progress tracking", level: "Low" },
  ];

  const cardH = 0.75;
  risks.forEach((r, i) => {
    const ry = topY + i * (cardH + 0.1);
    addCard(pptx, slide, MX, ry, CONTENT_W, cardH, { accentBorder: r.level === "High" ? C.danger : r.level === "Medium" ? C.warning : C.primary });

    slide.addText(r.level, {
      x: MX + 0.12, y: ry + 0.12, w: 0.7, h: 0.22,
      fontSize: TINY_SIZE, bold: true, color: r.level === "High" ? C.danger : r.level === "Medium" ? C.warning : C.primary, fontFace: FONT_BODY,
    });
    slide.addText(r.risk, {
      x: MX + 0.9, y: ry + 0.12, w: 2.5, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(r.mitigation, {
      x: MX + 0.12, y: ry + 0.4, w: CONTENT_W - 0.24, h: 0.28,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 15: GOVERNANCE (matches web GovernanceSlide)
// =============================================================================
const createGovernanceSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Governance Model");

  const topY = 0.85;
  const cardGap = 0.15;
  const colW = (CONTENT_W - cardGap) / 2;
  const mainH = 3.0;

  // Execution Governance
  addCard(pptx, slide, MX, topY, colW, mainH);
  slide.addText("Execution Governance", {
    x: MX + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const govItems = [
    { title: "Executive Steering Committee", freq: "Quarterly" },
    { title: "Operational Cadence", freq: "Bi-weekly" },
    { title: "Value Tracking", freq: "Monthly" },
  ];

  govItems.forEach((g, i) => {
    const gy = topY + 0.45 + i * 0.8;
    slide.addText(g.title, {
      x: MX + 0.2, y: gy, w: colW - 1.4, h: 0.22,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    addBadge(slide, MX + colW - 1.1, gy, g.freq, C.primary);
  });

  // Prioritisation Framework
  const rx = MX + colW + cardGap;
  addCard(pptx, slide, rx, topY, colW, mainH);
  slide.addText("Prioritisation Framework", {
    x: rx + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.25,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const steps = [
    { step: "1", label: "Strategic Alignment" },
    { step: "2", label: "Economic Impact" },
    { step: "3", label: "Execution Readiness" },
    { step: "4", label: "Stakeholder Commitment" },
  ];

  steps.forEach((s, i) => {
    const sy = topY + 0.45 + i * 0.6;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: rx + 0.2, y: sy + 0.02, w: 0.28, h: 0.28,
      fill: { color: C.primary, transparency: 60 },
      line: { color: C.primary },
    });
    slide.addText(s.step, {
      x: rx + 0.2, y: sy + 0.02, w: 0.28, h: 0.28,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING, align: "center", valign: "middle",
    });
    slide.addText(s.label, {
      x: rx + 0.55, y: sy + 0.02, w: colW - 0.75, h: 0.28,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 16: EXECUTIVE ENGAGEMENT (matches web ExecutiveEngagementSlide)
// =============================================================================
const createEngagementSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Executive Engagement Model", "Tiered engagement structure and key forums");

  const topY = 0.95;
  const cardGap = 0.12;
  const colW = (CONTENT_W - cardGap) / 2;

  // Executive Sponsors
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

  // Planned Events
  const rx = MX + colW + cardGap;
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
// SLIDE 17: PURSUIT PLAN (matches web PursuitPlanSlide)
// =============================================================================
const createPursuitPlanSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Pursuit Plan", "Key milestones and decision points");

  const topY = 1.0;
  const stages = [
    { stage: "Discovery", actions: ["Stakeholder mapping", "Requirements gathering"], due: "Q1" },
    { stage: "Proposal", actions: ["Solution design", "Business case development"], due: "Q1" },
    { stage: "Negotiation", actions: ["Commercial alignment", "Contract finalisation"], due: "Q2" },
    { stage: "Close", actions: ["Executive sign-off", "Implementation kick-off"], due: "Q2" },
  ];

  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 2.0;

  stages.forEach((s, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: C.primary });

    slide.addText(s.stage, {
      x: cx + 0.08, y: topY + 0.1, w: cardW - 0.16, h: 0.3,
      fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING, align: "center",
    });
    addBadge(slide, cx + (cardW - 0.6) / 2, topY + 0.45, s.due, C.accent);

    s.actions.forEach((a, j) => {
      slide.addText(`• ${a}`, {
        x: cx + 0.08, y: topY + 0.8 + j * 0.28, w: cardW - 0.16, h: 0.26,
        fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 18: SUCCESS METRICS (matches web SuccessSlide)
// =============================================================================
const createSuccessMetricsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Success Metrics", "Measuring impact and value realisation");

  const topY = 1.0;
  const metrics = [
    { metric: "30%", label: "Cost Reduction", sub: "Operational efficiency gains" },
    { metric: "15pt", label: "CSAT Improvement", sub: "Customer satisfaction increase" },
    { metric: "50%", label: "Time Savings", sub: "Faster resolution times" },
    { metric: "$10M+", label: "ACV Target", sub: "Revenue opportunity" },
  ];

  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 1.6;

  metrics.forEach((m, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: i % 2 === 0 ? C.primary : C.accent });
    slide.addText(m.metric, {
      x: cx + 0.1, y: topY + 0.2, w: cardW - 0.2, h: 0.6,
      fontSize: 36, bold: true, color: i % 2 === 0 ? C.primary : C.accent, fontFace: FONT_HEADING, align: "center",
    });
    slide.addText(m.label, {
      x: cx + 0.1, y: topY + 0.85, w: cardW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "center",
    });
    slide.addText(m.sub, {
      x: cx + 0.1, y: topY + 1.12, w: cardW - 0.2, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
  });

  // Vision statement at bottom
  const visY = topY + cardH + 0.2;
  addCard(pptx, slide, MX, visY, CONTENT_W, 0.7, { accentBorder: C.primary });
  slide.addText("Strategic Vision", {
    x: MX + 0.12, y: visY + 0.08, w: CONTENT_W - 0.24, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.visionStatement || "Partner to transform operations and accelerate strategic objectives.", {
    x: MX + 0.12, y: visY + 0.32, w: CONTENT_W - 0.24, h: 0.32,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 19: CLOSING / THANK YOU
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
// MAIN EXPORT FUNCTION - MATCHING WEB SLIDE ORDER
// =============================================================================
export const exportToPowerPoint = async (data: AccountData) => {
  const pptx = new pptxgen();

  pptx.author = "ServiceNow";
  pptx.title = `${data.basics.accountName} Account Plan`;
  pptx.subject = "Global Account Plan";
  pptx.layout = "LAYOUT_16x9";

  const slides: pptxgen.Slide[] = [];

  // Web Order (skipping Input Form):
  // 1. Cover
  // 2. Executive Summary
  // 3. Customer Snapshot
  // 4. Customer Strategy
  // 5. FY-1 Retrospective
  // 6. Strategic Alignment
  // 7. Account Team
  // 8. SWOT Analysis
  // 9. Value Drivers
  // 10. Key Workstreams (Big Bets)
  // 11. AI Portfolio
  // 12. Platform Vision
  // 13. Roadmap
  // 14. Risk & Mitigation
  // 15. Governance
  // 16. Engagement
  // 17. Pursuit Plan
  // 18. Success Metrics
  // 19. Thank You

  slides.push(createCoverSlide(pptx, data));                    // 1
  slides.push(createExecutiveSummarySlide(pptx, data));         // 2
  slides.push(createCustomerSnapshotSlide(pptx, data));         // 3
  slides.push(createCustomerStrategySlide(pptx, data));         // 4
  slides.push(createRetrospectiveSlide(pptx, data));            // 5
  slides.push(createStrategicAlignmentSlide(pptx, data));       // 6
  slides.push(createAccountTeamSlide(pptx, data));              // 7
  slides.push(createSWOTSlide(pptx, data));                     // 8
  slides.push(createValueDriversSlide(pptx, data));             // 9
  slides.push(createBigBetsSlide(pptx, data));                  // 10
  slides.push(createAIUseCasesSlide(pptx, data));               // 11
  slides.push(createPlatformSlide(pptx, data));                 // 12
  slides.push(createRoadmapSlide(pptx, data));                  // 13
  slides.push(createRiskMitigationSlide(pptx, data));           // 14
  slides.push(createGovernanceSlide(pptx, data));               // 15
  slides.push(createEngagementSlide(pptx, data));               // 16
  slides.push(createPursuitPlanSlide(pptx, data));              // 17
  slides.push(createSuccessMetricsSlide(pptx, data));           // 18
  slides.push(createClosingSlide(pptx, data));                  // 19

  const exportId = new Date()
    .toISOString()
    .replace(/\..+/, "")
    .replace(/[-:]/g, "")
    .replace("T", "_");

  // Add footers + speaker notes
  slides.forEach((slide, i) => {
    slide.addNotes(`export_id: ${exportId}\nslide: ${i + 1}/${slides.length}`);

    // Add footers to all slides except cover (0) and closing (last)
    if (i > 0 && i < slides.length - 1) {
      addFooter(slide, i + 1, slides.length, data.basics.accountName);
    }
  });

  await pptx.writeFile({
    fileName: `${data.basics.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_FY26_${exportId}.pptx`,
  });
};
