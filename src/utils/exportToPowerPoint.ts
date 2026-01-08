import pptxgen from "pptxgenjs";
import { AccountData } from "@/context/AccountDataContext";

// =============================================================================
// COLOR PALETTE (matching index.css HSL → Hex conversion)
// =============================================================================
// background:     hsl(195 45% 8%)   → #0B1D26
// card:           hsl(195 40% 12%)  → #121F28
// primary:        hsl(110 74% 55%)  → #5EC93F (Wasabi Green)
// accent:         hsl(200 85% 55%)  → #29A9E1 (ServiceNow Blue)
// muted-fg:       hsl(195 20% 65%)  → #96A8B0
// border:         hsl(195 25% 22%)  → #2D3F4A
// foreground:     hsl(0 0% 100%)    → #FFFFFF
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
const CONTENT_H = H - MY - 0.6; // leave room for footer

// Font sizes (points)
const TITLE_SIZE = 28;
const SUBTITLE_SIZE = 12;
const HEADING_SIZE = 14;
const BODY_SIZE = 10;
const SMALL_SIZE = 8;
const TINY_SIZE = 7;

// Font faces - PPT typically supports these
const FONT_HEADING = "Century Gothic"; // closest to Sora
const FONT_BODY = "Calibri"; // closest to Inter

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const setBackground = (slide: pptxgen.Slide) => {
  slide.background = { color: C.bg };
};

const addGradientBg = (pptx: pptxgen, slide: pptxgen.Slide) => {
  slide.background = { color: "0A1A22" };
  // Gradient orbs
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
// SLIDE 1: COVER
// =============================================================================
const createCoverSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addGradientBg(pptx, slide);

  const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Customer Name
  slide.addText(data.basics.accountName || "Customer Name", {
    x: 0.7, y: 1.4, w: 8.5, h: 0.85,
    fontSize: 48, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  // Global Account Plan
  slide.addText("Global Account Plan", {
    x: 0.7, y: 2.25, w: 8.5, h: 0.75,
    fontSize: 38, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  // Date
  slide.addText(monthYear, {
    x: 0.7, y: 3.0, w: 4, h: 0.35,
    fontSize: 16, color: C.white, fontFace: FONT_BODY,
  });

  // Team members
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

  // Left card - Narrative
  addCard(pptx, slide, MX, topY, leftW, 4.0);

  const lastName = data.basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";
  slide.addText(`Powering A STRONGER ${lastName}`, {
    x: MX + 0.15, y: topY + 0.1, w: leftW - 0.3, h: 0.35,
    fontSize: HEADING_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });

  slide.addText(data.annualReport.executiveSummaryNarrative || "", {
    x: MX + 0.15, y: topY + 0.5, w: leftW - 0.3, h: 0.9,
    fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
  });

  // Strategic Pillars
  slide.addText("Strategic Pillars", {
    x: MX + 0.15, y: topY + 1.5, w: leftW - 0.3, h: 0.25,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  const pillars = data.strategy.corporateStrategy.slice(0, 4);
  pillars.forEach((p, i) => {
    const py = topY + 1.8 + i * 0.5;
    addLeftBorder(pptx, slide, MX + 0.15, py, 0.4, C.primary);
    slide.addText(p.title, {
      x: MX + 0.3, y: py, w: leftW - 0.45, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((p.description || "").substring(0, 80), {
      x: MX + 0.3, y: py + 0.18, w: leftW - 0.45, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Right column - Key Metrics
  const rCards = [
    { label: "FY Revenue", value: data.annualReport.revenue, sub: data.annualReport.revenueComparison },
    { label: "EBIT Improvement", value: data.annualReport.ebitImprovement, sub: "YoY" },
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

  // Milestones
  const mileY = topY + 2.0;
  addCard(pptx, slide, rightX, mileY, rightW, 1.1);
  slide.addText("Key Milestones", {
    x: rightX + 0.1, y: mileY + 0.08, w: rightW - 0.2, h: 0.22,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  data.annualReport.keyMilestones.slice(0, 4).forEach((m, i) => {
    slide.addText(`• ${m}`, {
      x: rightX + 0.1, y: mileY + 0.32 + i * 0.19, w: rightW - 0.2, h: 0.19,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Achievements
  const achY = topY + 3.2;
  addCard(pptx, slide, rightX, achY, rightW, 0.7);
  slide.addText("Strategic Achievements", {
    x: rightX + 0.1, y: achY + 0.06, w: rightW - 0.2, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  data.annualReport.strategicAchievements.slice(0, 2).forEach((a, i) => {
    slide.addText(`• ${a}`, {
      x: rightX + 0.1, y: achY + 0.28 + i * 0.19, w: rightW - 0.2, h: 0.19,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 3: CUSTOMER OVERVIEW
// =============================================================================
const createCustomerOverviewSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Customer Overview & Strategy", "Strategic direction and enterprise priorities");

  const topY = 1.0;
  const colW = (CONTENT_W - 0.15) / 2;

  // Left: Strategic Direction
  addCard(pptx, slide, MX, topY, colW, 3.9);
  slide.addText("Strategic Direction", {
    x: MX + 0.12, y: topY + 0.1, w: colW - 0.24, h: 0.28,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.accountName, {
    x: MX + 0.12, y: topY + 0.38, w: colW - 0.24, h: 0.22,
    fontSize: BODY_SIZE, color: C.primary, fontFace: FONT_BODY,
  });

  data.strategy.corporateStrategy.slice(0, 4).forEach((s, i) => {
    const sy = topY + 0.7 + i * 0.75;
    addLeftBorder(pptx, slide, MX + 0.12, sy, 0.6, C.primary);
    slide.addText(s.title, {
      x: MX + 0.25, y: sy + 0.02, w: colW - 0.4, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((s.description || "").substring(0, 100), {
      x: MX + 0.25, y: sy + 0.24, w: colW - 0.4, h: 0.32,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  // Right: CEO/Board Priorities
  const rx = MX + colW + 0.15;
  addCard(pptx, slide, rx, topY, colW, 3.9);
  slide.addText("CEO/Board Priorities", {
    x: rx + 0.12, y: topY + 0.1, w: colW - 0.24, h: 0.28,
    fontSize: HEADING_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
  });

  data.strategy.ceoBoardPriorities.slice(0, 4).forEach((p, i) => {
    const py = topY + 0.5 + i * 0.8;
    addLeftBorder(pptx, slide, rx + 0.12, py, 0.65, C.accent);
    slide.addText(p.title, {
      x: rx + 0.25, y: py + 0.02, w: colW - 0.4, h: 0.2,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((p.description || "").substring(0, 110), {
      x: rx + 0.25, y: py + 0.24, w: colW - 0.4, h: 0.38,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 4: BUSINESS MODEL CANVAS
// =============================================================================
const createBusinessModelSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Business Model Canvas", data.basics.accountName);

  const bmc = data.businessModel;
  const topY = 0.95;

  const colWidth = 1.75;
  const rowHeight1 = 1.5;
  const rowHeight2 = 1.0;
  const gap = 0.08;

  const blocks = [
    { title: "Key Partners", items: bmc.keyPartners, col: 0, row: 0, rowSpan: 2, color: C.accent },
    { title: "Key Activities", items: bmc.keyActivities, col: 1, row: 0, rowSpan: 1, color: C.accent },
    { title: "Key Resources", items: bmc.keyResources, col: 1, row: 1, rowSpan: 1, color: C.accent },
    { title: "Value Proposition", items: bmc.valueProposition, col: 2, row: 0, rowSpan: 2, color: C.primary },
    { title: "Customer Relationships", items: bmc.customerRelationships, col: 3, row: 0, rowSpan: 1, color: C.accent },
    { title: "Channels", items: bmc.channels, col: 3, row: 1, rowSpan: 1, color: C.accent },
    { title: "Customer Segments", items: bmc.customerSegments, col: 4, row: 0, rowSpan: 2, color: C.accent },
  ];

  blocks.forEach((b) => {
    const x = MX + b.col * (colWidth + gap);
    const y = topY + (b.row === 0 ? 0 : rowHeight1 / 2 + gap);
    const h = b.rowSpan === 2 ? rowHeight1 : rowHeight1 / 2 - gap;
    addCard(pptx, slide, x, y, colWidth, h, { accentBorder: b.color });
    slide.addText(b.title, {
      x: x + 0.08, y: y + 0.06, w: colWidth - 0.16, h: 0.18,
      fontSize: TINY_SIZE, bold: true, color: b.color, fontFace: FONT_BODY,
    });
    b.items.slice(0, 3).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 30)}`, {
        x: x + 0.08, y: y + 0.26 + i * 0.16, w: colWidth - 0.16, h: 0.16,
        fontSize: 6, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  // Cost Structure & Revenue Streams
  const bottomY = topY + rowHeight1 + 0.12;
  const halfW = (CONTENT_W - 0.1) / 2;
  [
    { title: "Cost Structure", items: bmc.costStructure, x: MX },
    { title: "Revenue Streams", items: bmc.revenueStreams, x: MX + halfW + 0.1 },
  ].forEach((section) => {
    addCard(pptx, slide, section.x, bottomY, halfW, rowHeight2);
    slide.addText(section.title, {
      x: section.x + 0.1, y: bottomY + 0.06, w: halfW - 0.2, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.accent, fontFace: FONT_BODY,
    });
    section.items.slice(0, 3).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 50)}`, {
        x: section.x + 0.1, y: bottomY + 0.28 + i * 0.18, w: halfW - 0.2, h: 0.18,
        fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  // Competitors row
  const compY = bottomY + rowHeight2 + 0.1;
  addCard(pptx, slide, MX, compY, CONTENT_W, 0.45);
  slide.addText("Key Competitors", {
    x: MX + 0.1, y: compY + 0.04, w: 1.5, h: 0.18,
    fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText(bmc.competitors.slice(0, 6).join("  •  "), {
    x: MX + 1.7, y: compY + 0.04, w: CONTENT_W - 1.9, h: 0.36,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "middle",
  });

  return slide;
};

// =============================================================================
// SLIDE 5: STRATEGIC ALIGNMENT
// =============================================================================
const createStrategicAlignmentSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Strategic Alignment", "Connecting corporate priorities to ServiceNow value");

  const topY = 1.0;
  const colW = (CONTENT_W - 0.12) / 2;

  // Digital Strategies
  addCard(pptx, slide, MX, topY, colW, 1.65);
  slide.addText("Digital Strategies", {
    x: MX + 0.1, y: topY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  data.strategy.digitalStrategies.slice(0, 3).forEach((ds, i) => {
    const dy = topY + 0.35 + i * 0.42;
    slide.addText(ds.title, {
      x: MX + 0.15, y: dy, w: colW - 0.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((ds.description || "").substring(0, 90), {
      x: MX + 0.15, y: dy + 0.18, w: colW - 0.3, h: 0.22,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Transformation Themes
  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 1.65);
  slide.addText("Transformation Themes", {
    x: rx + 0.1, y: topY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  data.strategy.transformationThemes.slice(0, 3).forEach((t, i) => {
    const ty = topY + 0.35 + i * 0.42;
    slide.addText(t.title, {
      x: rx + 0.15, y: ty, w: colW - 0.3, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((t.description || "").substring(0, 90), {
      x: rx + 0.15, y: ty + 0.18, w: colW - 0.3, h: 0.22,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
  });

  // Vision
  const visY = topY + 1.75;
  addCard(pptx, slide, MX, visY, CONTENT_W, 0.75, { accentBorder: C.primary });
  slide.addText(`ServiceNow Vision for ${data.basics.accountName}`, {
    x: MX + 0.12, y: visY + 0.08, w: CONTENT_W - 0.24, h: 0.2,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_HEADING,
  });
  slide.addText(data.basics.visionStatement || "", {
    x: MX + 0.12, y: visY + 0.3, w: CONTENT_W - 0.24, h: 0.4,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  // Financial / Account Position row
  const finY = visY + 0.85;
  addCard(pptx, slide, MX, finY, colW, 0.85);
  slide.addText("Financial Context", {
    x: MX + 0.1, y: finY + 0.06, w: colW - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText(`Revenue: ${data.financial.customerRevenue}  |  Growth: ${data.financial.growthRate}  |  EBIT: ${data.financial.marginEBIT}`, {
    x: MX + 0.1, y: finY + 0.28, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(`Investments: ${(data.financial.strategicInvestmentAreas || "").substring(0, 60)}`, {
    x: MX + 0.1, y: finY + 0.48, w: colW - 0.2, h: 0.18,
    fontSize: 6, color: C.muted, fontFace: FONT_BODY,
  });

  addCard(pptx, slide, rx, finY, colW, 0.85);
  slide.addText("Account Position", {
    x: rx + 0.1, y: finY + 0.06, w: colW - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  slide.addText(`Current: ${data.basics.currentContractValue} → FY: ${data.basics.nextFYAmbition} → 3Y: ${data.basics.threeYearAmbition}`, {
    x: rx + 0.1, y: finY + 0.28, w: colW - 0.2, h: 0.18,
    fontSize: TINY_SIZE, color: C.primary, fontFace: FONT_BODY,
  });
  slide.addText(`Renewal: ${data.basics.renewalDates}`, {
    x: rx + 0.1, y: finY + 0.48, w: colW - 0.2, h: 0.18,
    fontSize: 6, color: C.muted, fontFace: FONT_BODY,
  });

  return slide;
};

// =============================================================================
// SLIDE 6: FY-1 RETROSPECTIVE
// =============================================================================
const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "FY-1 Retrospective", "What happened, what didn't work, and lessons learned");

  const topY = 1.0;
  const colW = (CONTENT_W - 0.12) / 2;

  // Prior Plan
  addCard(pptx, slide, MX, topY, colW, 2.0);
  slide.addText("Prior Plan Summary", {
    x: MX + 0.1, y: topY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  slide.addText(`Last plan: ${data.history.lastPlanDate} by ${data.history.plannerName}`, {
    x: MX + 0.1, y: topY + 0.32, w: colW - 0.2, h: 0.16,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
  });
  slide.addText(data.history.lastPlanSummary || "", {
    x: MX + 0.1, y: topY + 0.52, w: colW - 0.2, h: 0.55,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });
  slide.addText("What Didn't Work", {
    x: MX + 0.1, y: topY + 1.15, w: colW - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.danger, fontFace: FONT_BODY,
  });
  slide.addText(data.history.whatDidNotWork || "", {
    x: MX + 0.1, y: topY + 1.35, w: colW - 0.2, h: 0.55,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
  });

  // SWOT
  const rx = MX + colW + 0.12;
  addCard(pptx, slide, rx, topY, colW, 2.0);
  slide.addText("SWOT Analysis", {
    x: rx + 0.1, y: topY + 0.08, w: colW - 0.2, h: 0.22,
    fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
  });
  const swotData = [
    { label: "S", items: data.swot.strengths, color: C.primary },
    { label: "W", items: data.swot.weaknesses, color: C.danger },
    { label: "O", items: data.swot.opportunities, color: C.accent },
    { label: "T", items: data.swot.threats, color: C.warning },
  ];
  const quadW = (colW - 0.3) / 2;
  const quadH = 0.75;
  swotData.forEach((q, i) => {
    const qx = rx + 0.1 + (i % 2) * (quadW + 0.08);
    const qy = topY + 0.35 + Math.floor(i / 2) * (quadH + 0.08);
    slide.addText(q.label, {
      x: qx, y: qy, w: 0.2, h: 0.18,
      fontSize: SMALL_SIZE, bold: true, color: q.color, fontFace: FONT_BODY,
    });
    q.items.slice(0, 2).forEach((item, j) => {
      slide.addText(`• ${item.substring(0, 35)}`, {
        x: qx + 0.22, y: qy + j * 0.16, w: quadW - 0.3, h: 0.16,
        fontSize: 6, color: C.muted, fontFace: FONT_BODY,
      });
    });
  });

  // Lessons Learned
  const lessonY = topY + 2.15;
  addCard(pptx, slide, MX, lessonY, CONTENT_W, 0.65, { accentBorder: C.primary });
  slide.addText("Key Lessons Learned", {
    x: MX + 0.1, y: lessonY + 0.06, w: 2.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
  });
  slide.addText("Focus on value demonstration, not just capability expansion.", {
    x: MX + 2.4, y: lessonY + 0.06, w: CONTENT_W - 2.6, h: 0.5,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "top",
  });

  return slide;
};

// =============================================================================
// SLIDE 7: CURRENT STATE (Pain Points)
// =============================================================================
const createCurrentStateSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Current State Assessment", "Where value is leaking and complexity exists");

  const topY = 1.0;
  const painPoints = data.painPoints.painPoints || [];
  const cols = 2;
  const cardW = (CONTENT_W - 0.12) / cols;
  const cardH = 1.15;

  painPoints.slice(0, 4).forEach((pp, i) => {
    const cx = MX + (i % cols) * (cardW + 0.12);
    const cy = topY + Math.floor(i / cols) * (cardH + 0.1);
    addCard(pptx, slide, cx, cy, cardW, cardH);

    slide.addText(`Pain Point ${i + 1}`, {
      x: cx + 0.1, y: cy + 0.08, w: cardW - 0.2, h: 0.16,
      fontSize: TINY_SIZE, bold: true, color: C.danger, fontFace: FONT_BODY,
    });
    slide.addText(pp.title || "", {
      x: cx + 0.1, y: cy + 0.28, w: cardW - 0.2, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText((pp.description || "").substring(0, 120), {
      x: cx + 0.1, y: cy + 0.52, w: cardW - 0.2, h: 0.55,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  // Adoption Constraints
  const conY = topY + 2 * (cardH + 0.1) + 0.05;
  addCard(pptx, slide, MX, conY, CONTENT_W, 0.65, { accentBorder: C.primary });
  slide.addText("Why Adoption Is Constrained", {
    x: MX + 0.1, y: conY + 0.06, w: CONTENT_W - 0.2, h: 0.18,
    fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
  });
  const constraints = ["Change Fatigue", "Training Gaps", "Value Not Demonstrated"];
  constraints.forEach((c, i) => {
    const cx2 = MX + 0.1 + i * 3.0;
    slide.addText(c, {
      x: cx2, y: conY + 0.28, w: 2.8, h: 0.14,
      fontSize: SMALL_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
    });
    slide.addText("Users resistant after prior failures", {
      x: cx2, y: conY + 0.44, w: 2.8, h: 0.16,
      fontSize: 6, color: C.muted, fontFace: FONT_BODY,
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 8-11: STRATEGIC ANALYSIS (Observation, Implication, Tension, Insight)
// =============================================================================
const createStrategicAnalysisSlide = (
  pptx: pptxgen,
  title: string,
  points: { heading: string; detail: string }[],
  summary?: string
) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, title);

  const topY = 1.0;
  const cardH = 0.95;
  const cardW = (CONTENT_W - 0.12) / 2;

  points.slice(0, 4).forEach((p, i) => {
    const cx = MX + (i % 2) * (cardW + 0.12);
    const cy = topY + Math.floor(i / 2) * (cardH + 0.1);
    addCard(pptx, slide, cx, cy, cardW, cardH);
    slide.addText(p.heading, {
      x: cx + 0.1, y: cy + 0.08, w: cardW - 0.2, h: 0.2,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(p.detail, {
      x: cx + 0.1, y: cy + 0.32, w: cardW - 0.2, h: 0.55,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  if (summary) {
    const sumY = topY + 2 * (cardH + 0.1) + 0.05;
    addCard(pptx, slide, MX, sumY, CONTENT_W, 0.5, { accentBorder: C.primary });
    slide.addText(summary, {
      x: MX + 0.12, y: sumY + 0.08, w: CONTENT_W - 0.24, h: 0.34,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
  }

  return slide;
};

// =============================================================================
// SLIDE 12: VALUE HYPOTHESIS
// =============================================================================
const createValueHypothesisSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Value Hypothesis", "How ServiceNow delivers measurable impact");

  const topY = 1.0;
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.5;

  const hypotheses = [
    { title: "Cost Optimisation", metric: "5-7%", sub: "annual productivity improvement", description: "Platform consolidation reduces total cost of ownership while improving service delivery efficiency." },
    { title: "Experience Excellence", metric: "25%", sub: "improvement in CSAT", description: "Unified customer engagement platform delivers consistent, proactive service across all channels." },
    { title: "AI Operationalisation", metric: "40%", sub: "faster case resolution", description: "Workflow-embedded AI transforms fragmented experiments into measurable business outcomes." },
  ];

  hypotheses.forEach((h, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: i === 1 ? C.primary : C.accent });
    slide.addText(h.title, {
      x: cx + 0.1, y: topY + 0.1, w: cardW - 0.2, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(h.metric, {
      x: cx + 0.1, y: topY + 0.4, w: cardW - 0.2, h: 0.5,
      fontSize: 32, bold: true, color: i === 1 ? C.primary : C.accent, fontFace: FONT_HEADING,
    });
    slide.addText(h.sub, {
      x: cx + 0.1, y: topY + 0.95, w: cardW - 0.2, h: 0.18,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(h.description, {
      x: cx + 0.1, y: topY + 1.2, w: cardW - 0.2, h: 1.0,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 13: STRATEGIC PRIORITIES
// =============================================================================
const createStrategicPrioritiesSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Strategic Priorities FY26", "Must-Win Battles");

  const priorities = [
    { title: "CRM Modernisation", why: "Salesforce contract expires; customer experience is priority #1 for C-suite.", risk: "Competitor lock-in; continued fragmentation; executive confidence erodes." },
    { title: "AI Operationalisation", why: "Maersk has AI-first ambition but lacks execution backbone.", risk: "AI initiatives remain fragmented; value delayed 12-18 months." },
    { title: "Platform Consolidation", why: "700+ apps create friction; cost discipline imperative requires efficiency.", risk: "Continued complexity; failure to demonstrate platform ROI." },
  ];

  const topY = 1.0;
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.8;

  priorities.forEach((p, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: i === 0 ? C.primary : C.border });
    if (i === 0) addBadge(slide, cx + 0.08, topY + 0.08, "Priority #1", C.primary);
    slide.addText(p.title, {
      x: cx + 0.1, y: topY + (i === 0 ? 0.35 : 0.1), w: cardW - 0.2, h: 0.25,
      fontSize: HEADING_SIZE - 2, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText("Why Now", {
      x: cx + 0.1, y: topY + 0.7, w: cardW - 0.2, h: 0.18,
      fontSize: TINY_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
    });
    slide.addText(p.why, {
      x: cx + 0.1, y: topY + 0.9, w: cardW - 0.2, h: 0.7,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
    slide.addText("If We Lose", {
      x: cx + 0.1, y: topY + 1.65, w: cardW - 0.2, h: 0.18,
      fontSize: TINY_SIZE, bold: true, color: C.danger, fontFace: FONT_BODY,
    });
    slide.addText(p.risk, {
      x: cx + 0.1, y: topY + 1.85, w: cardW - 0.2, h: 0.8,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "top",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 14: BIG BETS / WORKSTREAMS
// =============================================================================
const createBigBetsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Key Transformation Workstreams", "Aligning stakeholders to accelerate impact");
  addBadge(slide, W - MX - 1.1, MY + 0.05, "FY26 Big Bets", C.primary);

  const streams = [
    { title: "CRM Modernisation", status: "Active Pursuit", close: "Q1 2026", acv: "$5M", color: C.primary },
    { title: "AI Use Cases", status: "Strategic Initiative", close: "Q2 2026", acv: "$2M", color: C.accent },
    { title: "IT & SecOps Expansion", status: "Foundation Growth", close: "Q3 2026", acv: "$3M", color: C.blue },
  ];

  const topY = 1.0;
  const cardW = (CONTENT_W - 0.24) / 3;
  const cardH = 2.5;

  streams.forEach((s, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: s.color });
    addBadge(slide, cx + 0.08, topY + 0.08, s.status, s.color);
    slide.addText(s.title, {
      x: cx + 0.1, y: topY + 0.38, w: cardW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_HEADING,
    });
    slide.addText(`Close: ${s.close}`, {
      x: cx + 0.1, y: topY + 0.68, w: cardW - 0.2, h: 0.16,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText("Net New ACV", {
      x: cx + 0.1, y: topY + 1.0, w: cardW - 0.2, h: 0.16,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY,
    });
    slide.addText(s.acv, {
      x: cx + 0.1, y: topY + 1.18, w: cardW - 0.2, h: 0.4,
      fontSize: 28, bold: true, color: s.color, fontFace: FONT_HEADING,
    });
  });

  // Callout
  const callY = topY + cardH + 0.15;
  addCard(pptx, slide, MX, callY, CONTENT_W, 0.55, { accentBorder: C.primary });
  slide.addText("CRM Modernisation is the Primary Commercial Wedge — Q1 priority. Success unlocks multi-workflow expansion.", {
    x: MX + 0.12, y: callY + 0.08, w: CONTENT_W - 1.8, h: 0.38,
    fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "middle",
  });
  slide.addText("$10M+", {
    x: W - MX - 1.4, y: callY + 0.06, w: 1.2, h: 0.28,
    fontSize: 22, bold: true, color: C.primary, fontFace: FONT_HEADING, align: "right",
  });
  slide.addText("Total ACV Opportunity", {
    x: W - MX - 1.4, y: callY + 0.34, w: 1.2, h: 0.16,
    fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "right",
  });

  return slide;
};

// =============================================================================
// SLIDE 15: PLATFORM
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
// SLIDE 16: ROADMAP
// =============================================================================
const createRoadmapSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Transformation Roadmap", "FY26 phased execution plan");

  const phases = [
    { quarter: "Q1 FY26", title: "Foundation", items: ["CRM decision forum", "EBC execution", "Pilot scoping"] },
    { quarter: "Q2 FY26", title: "Commercialisation", items: ["Contract finalisation", "SOW development", "Kick-off planning"] },
    { quarter: "Q3-Q4", title: "Expansion", items: ["AI use case deployment", "SecOps integration", "Platform scaling"] },
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
// SLIDE 17: GOVERNANCE
// =============================================================================
const createGovernanceSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Governance & Cadence", "Ensuring sustained momentum and accountability");

  const topY = 1.0;
  const rows = [
    { label: "Executive Steering", freq: "Quarterly", purpose: "Strategic alignment, investment decisions, executive sponsorship", color: C.primary },
    { label: "Delivery Review", freq: "Monthly", purpose: "Progress tracking, risk mitigation, resource allocation", color: C.accent },
    { label: "Working Sessions", freq: "Weekly", purpose: "Technical coordination, issue resolution, sprint planning", color: C.blue },
  ];

  const rowH = 0.9;
  rows.forEach((r, i) => {
    const ry = topY + i * (rowH + 0.1);
    addCard(pptx, slide, MX, ry, CONTENT_W, rowH, { accentBorder: r.color });
    slide.addText(r.label, {
      x: MX + 0.12, y: ry + 0.1, w: 2.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: r.color, fontFace: FONT_HEADING,
    });
    slide.addText(r.freq, {
      x: MX + 2.5, y: ry + 0.1, w: 1.2, h: 0.25,
      fontSize: BODY_SIZE, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(r.purpose, {
      x: MX + 3.8, y: ry + 0.1, w: CONTENT_W - 4.0, h: rowH - 0.2,
      fontSize: SMALL_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "middle",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 18: EXECUTIVE ENGAGEMENT
// =============================================================================
const createEngagementSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Executive Engagement Plan", "Building relationships at every level");

  const topY = 1.0;
  const engagements = [
    { exec: "CEO", sn: "Bill McDermott", objective: "Strategic partnership narrative; AI-first alignment", format: "Executive Briefing Center" },
    { exec: "CIO/CTIO", sn: "Regional VP", objective: "Platform consolidation; IT modernisation roadmap", format: "Technical Deep Dive" },
    { exec: "CPO", sn: "Industry GM", objective: "Supply chain innovation; workflow automation", format: "Innovation Workshop" },
    { exec: "CCO", sn: "Account Team", objective: "Customer experience transformation; CRM strategy", format: "Working Session" },
  ];

  const rowH = 0.7;
  engagements.forEach((e, i) => {
    const ry = topY + i * (rowH + 0.08);
    addCard(pptx, slide, MX, ry, CONTENT_W, rowH);
    slide.addText(e.exec, {
      x: MX + 0.1, y: ry + 0.08, w: 0.8, h: 0.22,
      fontSize: BODY_SIZE, bold: true, color: C.primary, fontFace: FONT_BODY,
    });
    slide.addText(`↔ ${e.sn}`, {
      x: MX + 0.95, y: ry + 0.08, w: 1.5, h: 0.22,
      fontSize: SMALL_SIZE, color: C.accent, fontFace: FONT_BODY,
    });
    slide.addText(e.objective, {
      x: MX + 2.5, y: ry + 0.08, w: 4.5, h: rowH - 0.16,
      fontSize: SMALL_SIZE, color: C.white, fontFace: FONT_BODY, valign: "middle",
    });
    slide.addText(e.format, {
      x: MX + 7.2, y: ry + 0.08, w: 2.0, h: rowH - 0.16,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, valign: "middle", align: "right",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 19: CLOSE PLAN
// =============================================================================
const createClosePlanSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Close Plan", "Path to commercial success");

  const topY = 1.0;
  const steps = [
    { step: "1", title: "EBC Execution", date: "Jan 2026", status: "In Progress" },
    { step: "2", title: "Commercial Proposal", date: "Feb 2026", status: "Planned" },
    { step: "3", title: "Contract Negotiation", date: "Mar 2026", status: "Planned" },
    { step: "4", title: "Deal Close", date: "Q1 End", status: "Target" },
  ];

  const stepW = (CONTENT_W - 0.36) / 4;
  const stepH = 1.8;
  steps.forEach((s, i) => {
    const sx = MX + i * (stepW + 0.12);
    addCard(pptx, slide, sx, topY, stepW, stepH, { accentBorder: i === 3 ? C.primary : C.border });
    slide.addText(s.step, {
      x: sx + 0.1, y: topY + 0.1, w: 0.4, h: 0.4,
      fontSize: 24, bold: true, color: C.primary, fontFace: FONT_HEADING,
    });
    slide.addText(s.title, {
      x: sx + 0.1, y: topY + 0.55, w: stepW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY,
    });
    slide.addText(s.date, {
      x: sx + 0.1, y: topY + 0.85, w: stepW - 0.2, h: 0.18,
      fontSize: SMALL_SIZE, color: C.accent, fontFace: FONT_BODY,
    });
    addBadge(slide, sx + 0.1, topY + 1.15, s.status, i === 0 ? C.primary : C.muted);
  });

  return slide;
};

// =============================================================================
// SLIDE 20: SUCCESS METRICS
// =============================================================================
const createSuccessMetricsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  setBackground(slide);
  addTitle(slide, "Success Metrics", "How we measure impact and value delivery");

  const metrics = [
    { metric: "$10M+", label: "Total ACV", sub: "FY26 Target" },
    { metric: "3", label: "Strategic Workstreams", sub: "Active pursuits" },
    { metric: "40%", label: "Efficiency Gain", sub: "Case resolution" },
    { metric: "25%", label: "CSAT Improvement", sub: "Customer experience" },
  ];

  const topY = 1.0;
  const cardW = (CONTENT_W - 0.36) / 4;
  const cardH = 2.2;

  metrics.forEach((m, i) => {
    const cx = MX + i * (cardW + 0.12);
    addCard(pptx, slide, cx, topY, cardW, cardH, { accentBorder: i === 0 ? C.primary : C.accent });
    slide.addText(m.metric, {
      x: cx + 0.1, y: topY + 0.2, w: cardW - 0.2, h: 0.6,
      fontSize: 36, bold: true, color: i === 0 ? C.primary : C.accent, fontFace: FONT_HEADING, align: "center",
    });
    slide.addText(m.label, {
      x: cx + 0.1, y: topY + 0.9, w: cardW - 0.2, h: 0.25,
      fontSize: BODY_SIZE, bold: true, color: C.white, fontFace: FONT_BODY, align: "center",
    });
    slide.addText(m.sub, {
      x: cx + 0.1, y: topY + 1.18, w: cardW - 0.2, h: 0.2,
      fontSize: TINY_SIZE, color: C.muted, fontFace: FONT_BODY, align: "center",
    });
  });

  return slide;
};

// =============================================================================
// SLIDE 21: CLOSING / THANK YOU
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
// MAIN EXPORT FUNCTION
// =============================================================================
export const exportToPowerPoint = async (data: AccountData) => {
  const pptx = new pptxgen();

  pptx.author = "ServiceNow";
  pptx.title = `${data.basics.accountName} Account Plan`;
  pptx.subject = "Global Account Plan";
  pptx.layout = "LAYOUT_16x9";

  const slides: pptxgen.Slide[] = [];

  // 1. Cover
  slides.push(createCoverSlide(pptx, data));

  // 2. Executive Summary
  slides.push(createExecutiveSummarySlide(pptx, data));

  // 3. Customer Overview
  slides.push(createCustomerOverviewSlide(pptx, data));

  // 4. Business Model Canvas
  slides.push(createBusinessModelSlide(pptx, data));

  // 5. Strategic Alignment
  slides.push(createStrategicAlignmentSlide(pptx, data));

  // 6. FY-1 Retrospective
  slides.push(createRetrospectiveSlide(pptx, data));

  // 7. Current State (Pain Points)
  slides.push(createCurrentStateSlide(pptx, data));

  // 8. Strategic Observation
  slides.push(
    createStrategicAnalysisSlide(pptx, "Strategic Observation", [
      { heading: "AI-First Ambition", detail: "Maersk has declared AI-first strategy but execution infrastructure lags behind ambition." },
      { heading: "Platform Opportunity", detail: "700+ applications create friction. Unified platform reduces complexity and accelerates delivery." },
      { heading: "Cost Discipline Imperative", detail: "Every initiative must demonstrate clear ROI. ServiceNow enables productivity gains of 5-7% annually." },
      { heading: "Customer Experience Gap", detail: "Inconsistent service levels impact NPS. Unified platform enables proactive customer engagement." },
    ], "ServiceNow uniquely bridges the gap between AI ambition and operational execution.")
  );

  // 9. Strategic Implication
  slides.push(
    createStrategicAnalysisSlide(pptx, "Strategic Implication", [
      { heading: "AI Operationalisation Gap", detail: "Without unified workflow orchestration, AI initiatives remain fragmented and value realisation is delayed." },
      { heading: "Platform Consolidation", detail: "Fragmented tooling drives cost inefficiency and slows time-to-value on strategic initiatives." },
      { heading: "Cost-to-Serve Pressure", detail: "Manual processes and disconnected systems drive cost inefficiency across operations." },
      { heading: "Customer Experience", detail: "Inconsistent service levels impact customer satisfaction and long-term revenue retention." },
    ])
  );

  // 10. Strategic Tension
  slides.push(
    createStrategicAnalysisSlide(pptx, "Strategic Tension", [
      { heading: "Cost Discipline vs Investment", detail: "Need for digital investment creates tension with cost discipline imperative." },
      { heading: "Speed vs Stability", detail: "Pressure to accelerate transformation balanced against operational stability requirements." },
      { heading: "Innovation vs Risk", detail: "AI-first ambition requires experimentation while compliance demands governance." },
      { heading: "Global vs Local", detail: "Standardisation benefits conflict with regional customisation needs." },
    ])
  );

  // 11. Strategic Insight
  slides.push(
    createStrategicAnalysisSlide(pptx, "Strategic Insight", [
      { heading: "Platform Positioning", detail: "The opportunity is positioning ServiceNow as the digital execution backbone for AI-first strategy." },
      { heading: "Value Narrative", detail: "Cost consolidation pays for transformation. Platform investment delivers productivity improvement." },
      { heading: "Executive Alignment", detail: "CIO, CPO, and CCO priorities converge on unified customer experience and operational efficiency." },
      { heading: "Competitive Advantage", detail: "ServiceNow's workflow orchestration uniquely bridges enterprise IT and business process automation." },
    ], "Platform consolidation drives cost discipline while improving customer experience.")
  );

  // 12. Value Hypothesis
  slides.push(createValueHypothesisSlide(pptx, data));

  // 13. Strategic Priorities
  slides.push(createStrategicPrioritiesSlide(pptx, data));

  // 14. Big Bets
  slides.push(createBigBetsSlide(pptx, data));

  // 15. Platform
  slides.push(createPlatformSlide(pptx, data));

  // 16. Roadmap
  slides.push(createRoadmapSlide(pptx, data));

  // 17. Governance
  slides.push(createGovernanceSlide(pptx, data));

  // 18. Executive Engagement
  slides.push(createEngagementSlide(pptx, data));

  // 19. Close Plan
  slides.push(createClosePlanSlide(pptx, data));

  // 20. Success Metrics
  slides.push(createSuccessMetricsSlide(pptx, data));

  // 21. Closing
  slides.push(createClosingSlide(pptx, data));

  // Add footers to all slides except cover (0) and closing (last)
  slides.forEach((slide, i) => {
    if (i > 0 && i < slides.length - 1) {
      addFooter(slide, i + 1, slides.length, data.basics.accountName);
    }
  });

  await pptx.writeFile({
    fileName: `${data.basics.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_FY26.pptx`,
  });
};
