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
// SLIDE 5: ACCOUNT STRATEGY
// =============================================================================
const createAccountStrategySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Account Strategy", "ServiceNow Strategic Opportunities");

  const topY = 0.95;
  const colW = (CONTENT_W - 0.12) / 2;

  const customerPriorities = data.strategy.ceoBoardPriorities || [];
  const strategicOpportunities = data.opportunities.opportunities || [];

  addCard(pptx, slide, MX, topY, colW, 2.8);
  slide.addText("Customer Priorities", {
    x: MX + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.accent, fontFace: FONT_HEADING,
  });

  if (customerPriorities.length === 0) {
    slide.addText("No customer priorities defined", {
      x: MX + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    customerPriorities.slice(0, 5).forEach((p, i) => {
      const py = topY + 0.4 + i * 0.48;
      addLeftBorder(pptx, slide, MX + 0.12, py, 0.4, C.accent);
      slide.addText(p.title || "", {
        x: MX + 0.25, y: py, w: colW - 0.4, h: 0.2,
        fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
      });
      slide.addText(truncate(p.description, 70), {
        x: MX + 0.25, y: py + 0.2, w: colW - 0.4, h: 0.2,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 2.8, { accentBorder: C.primary });
  slide.addText("Strategic Opportunities", {
    x: rx + 0.12, y: topY + 0.08, w: colW - 0.24, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  if (strategicOpportunities.length === 0) {
    slide.addText("No strategic opportunities defined", {
      x: rx + 0.12, y: topY + 0.4, w: colW - 0.24, h: 0.3,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  } else {
    strategicOpportunities.slice(0, 5).forEach((o, i) => {
      const oy = topY + 0.4 + i * 0.48;
      addLeftBorder(pptx, slide, rx + 0.12, oy, 0.4, C.primary);
      slide.addText(o.title || "", {
        x: rx + 0.25, y: oy, w: colW - 0.4, h: 0.2,
        fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
      });
      slide.addText(truncate(o.description, 70), {
        x: rx + 0.25, y: oy + 0.2, w: colW - 0.4, h: 0.2,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  }

  return slide;
};

// =============================================================================
// SLIDE 6: FY-1 RETROSPECTIVE
// =============================================================================
const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "FY-1 Retrospective", "What Actually Happened — Honest Assessment");

  const topY = 0.9;
  const colW = (CONTENT_W - 0.15) / 2;

  addCard(pptx, slide, MX, topY, colW, 1.8);
  slide.addText("Prior Plan Summary", {
    x: MX + 0.15, y: topY + 0.1, w: colW - 0.3, h: 0.22,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText(`${data.history.lastPlanDate || "—"} • ${data.history.plannerName || "—"}`, {
    x: MX + 0.15, y: topY + 0.35, w: colW - 0.3, h: 0.16,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(truncate(data.history.lastPlanSummary, 250) || "No prior plan summary available.", {
    x: MX + 0.15, y: topY + 0.55, w: colW - 0.3, h: 1.15,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  const rx = MX + colW + 0.15;
  addCard(pptx, slide, rx, topY, colW, 1.8);
  addLeftBorder(pptx, slide, rx, topY, 1.8, C.danger);
  slide.addText("What Did Not Work", {
    x: rx + 0.2, y: topY + 0.1, w: colW - 0.35, h: 0.22,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText(truncate(data.history.whatDidNotWork, 200) || "No information available.", {
    x: rx + 0.2, y: topY + 0.38, w: colW - 0.35, h: 1.3,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  const lessonY = topY + 2.0;
  addCard(pptx, slide, MX, lessonY, CONTENT_W, 0.65, { accentBorder: C.primary });
  slide.addText("Key Lessons Learned", {
    x: MX + 0.12, y: lessonY + 0.08, w: CONTENT_W - 0.24, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
  });
  
  const lessonsText = data.generatedPlan?.fy1Retrospective?.keyLessons || "";
  slide.addText(lessonsText || "Understanding past challenges enables strategic positioning.", {
    x: MX + 0.12, y: lessonY + 0.3, w: CONTENT_W - 0.24, h: 0.3,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY,
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
// SLIDE 16: RISK & MITIGATION
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
  // 9. SWOT Analysis
  // 10. Value Drivers
  // 11. Key Workstreams (Big Bets)
  // 12. Workstream Detail
  // 13. AI Portfolio
  // 14. Platform Vision
  // 15. Roadmap
  // 16. Risk & Mitigation
  // 17. Governance
  // 18. Weekly Update
  // 19. Engagement
  // 20. Pursuit Plan
  // 21. Success Metrics
  // 22. Thank You

  slides.push(createCoverSlide(pptx, data));                    // 1
  slides.push(createExecutiveSummarySlide(pptx, data));         // 2
  slides.push(createCustomerSnapshotSlide(pptx, data));         // 3
  slides.push(createCustomerStrategySlide(pptx, data));         // 4
  slides.push(createAccountStrategySlide(pptx, data));          // 5
  slides.push(createRetrospectiveSlide(pptx, data));            // 6
  slides.push(createStrategicAlignmentSlide(pptx, data));       // 7
  slides.push(createAccountTeamSlide(pptx, data));              // 8
  slides.push(createSWOTSlide(pptx, data));                     // 9
  slides.push(createValueDriversSlide(pptx, data));             // 10
  slides.push(createBigBetsSlide(pptx, data));                  // 11
  slides.push(createWorkstreamDetailSlide(pptx, data));         // 12
  slides.push(createAIUseCasesSlide(pptx, data));               // 13
  slides.push(createPlatformSlide(pptx, data));                 // 14
  slides.push(createRoadmapSlide(pptx, data));                  // 15
  slides.push(createRiskMitigationSlide(pptx, data));           // 16
  slides.push(createGovernanceSlide(pptx, data));               // 17
  slides.push(createWeeklyUpdateSlide(pptx, data));             // 18
  slides.push(createEngagementSlide(pptx, data));               // 19
  slides.push(createPursuitPlanSlide(pptx, data));              // 20
  slides.push(createSuccessMetricsSlide(pptx, data));           // 21
  slides.push(createClosingSlide(pptx, data));                  // 22

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
