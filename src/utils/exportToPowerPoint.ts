import pptxgen from "pptxgenjs";
import { AccountData } from "@/context/AccountDataContext";

// ServiceNow Brand Colors (HSL converted to hex, matching index.css)
const colors = {
  // Background: hsl(195 45% 8%) → #0D2235
  background: "0D2235",
  // Card: hsl(195 40% 12%) → #143A4F  
  card: "143A4F",
  // Navy mid: hsl(195 35% 16%) → #1A3246
  navy: "1A3246",
  // Primary (Wasabi Green): hsl(82 85% 55%) → #93D43B (brighter green)
  primary: "93D43B",
  // Primary darker for gradients
  primaryDark: "81B847",
  // Accent (Blue): hsl(200 85% 55%) → #29AAE1
  accent: "29AAE1",
  // White
  white: "FFFFFF",
  // Muted foreground: hsl(195 20% 65%) → #8BA3B5
  muted: "8BA3B5",
  // Border: hsl(195 25% 22%) → #2A4A5E
  border: "2A4A5E",
  // Status colors
  red: "EF4444",
  amber: "F59E0B",
  purple: "A855F7",
  pink: "EC4899",
  blue: "3B82F6",
  cyan: "06B6D4",
  orange: "F97316",
};

// Slide dimensions for LAYOUT_16x9
const SLIDE_W = 10;
const SLIDE_H = 5.625;

// Helper: Add dark background
const addBackground = (slide: pptxgen.Slide) => {
  slide.background = { color: colors.background };
};

// Helper: Add slide footer
const addFooter = (slide: pptxgen.Slide, slideNum: number, totalSlides: number, accountName: string) => {
  slide.addText(`ServiceNow | ${accountName} Account Plan`, { 
    x: 0.4, y: 5.25, w: 5, h: 0.25, 
    fontSize: 7, color: colors.muted, fontFace: "Arial" 
  });
  slide.addText(`${slideNum} / ${totalSlides}`, { 
    x: 8.6, y: 5.25, w: 1, h: 0.25, 
    fontSize: 7, color: colors.muted, align: "right", fontFace: "Arial" 
  });
};

// Helper: Add glass card (rounded rectangle with semi-transparent fill)
const addCard = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, w: number, h: number, opts?: { borderColor?: string }) => {
  slide.addShape(pptx.ShapeType.roundRect, { 
    x, y, w, h, 
    fill: { color: colors.card, transparency: 25 }, 
    line: { color: opts?.borderColor || colors.border, width: 0.5, transparency: 50 }, 
    rectRadius: 0.08 
  });
};

// Helper: Add section with colored left border
const addBorderedSection = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, w: number, h: number, borderColor: string) => {
  slide.addShape(pptx.ShapeType.roundRect, { 
    x, y, w, h, 
    fill: { color: colors.navy, transparency: 50 }, 
    line: { color: colors.border, width: 0.5, transparency: 70 }, 
    rectRadius: 0.05 
  });
  slide.addShape(pptx.ShapeType.rect, { 
    x, y, w: 0.05, h, 
    fill: { color: borderColor }
  });
};

// Helper: Add slide title with optional subtitle
const addTitle = (slide: pptxgen.Slide, title: string, subtitle?: string) => {
  slide.addText(title, { 
    x: 0.4, y: 0.25, w: 8.5, h: 0.45, 
    fontSize: 24, bold: true, color: colors.white, fontFace: "Arial" 
  });
  if (subtitle) {
    slide.addText(subtitle, { 
      x: 0.4, y: 0.65, w: 8.5, h: 0.25, 
      fontSize: 10, color: colors.muted, fontFace: "Arial" 
    });
  }
};

// Helper: Add icon placeholder (colored circle/square)
const addIconBox = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, size: number, color: string, isRound = true) => {
  const shape = isRound ? pptx.ShapeType.ellipse : pptx.ShapeType.roundRect;
  slide.addShape(shape, { 
    x, y, w: size, h: size, 
    fill: { color, transparency: 80 },
    line: { color, width: 0.5, transparency: 50 },
    rectRadius: isRound ? undefined : 0.05
  });
};

// Helper: Add a pill badge
const addPillBadge = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, text: string, color: string) => {
  const w = text.length * 0.08 + 0.3;
  slide.addShape(pptx.ShapeType.roundRect, { 
    x, y, w, h: 0.22, 
    fill: { color, transparency: 85 },
    line: { color, width: 0.5, transparency: 60 },
    rectRadius: 0.11
  });
  slide.addText(text, { 
    x, y, w, h: 0.22, 
    fontSize: 7, color, align: "center", valign: "middle", fontFace: "Arial" 
  });
};

// ==========================================
// SLIDE 1: COVER
// ==========================================
const createCoverSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  
  // Gradient-like background using overlapping shapes
  slide.background = { color: "142533" };
  slide.addShape(pptx.ShapeType.ellipse, { 
    x: -2, y: -1, w: 6, h: 4, 
    fill: { color: "1F3B4D", transparency: 70 }
  });
  slide.addShape(pptx.ShapeType.ellipse, { 
    x: 6, y: 2, w: 6, h: 5, 
    fill: { color: "2A2F4D", transparency: 70 }
  });
  
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Customer Name - Large Green
  slide.addText(data.basics.accountName || "Customer Name", { 
    x: 0.6, y: 1.6, w: 9, h: 0.9, 
    fontSize: 44, bold: true, color: colors.primary, fontFace: "Arial" 
  });
  
  // Global Account Plan - Large White
  slide.addText("Global Account Plan", { 
    x: 0.6, y: 2.5, w: 9, h: 0.8, 
    fontSize: 36, bold: true, color: colors.white, fontFace: "Arial" 
  });
  
  // Date
  slide.addText(monthYear, { 
    x: 0.6, y: 3.3, w: 4, h: 0.35, 
    fontSize: 14, color: colors.white, fontFace: "Arial" 
  });
  
  // Team Members at bottom
  const teamMembers = data.basics.coreTeamMembers || [];
  teamMembers.forEach((member, i) => {
    const x = 0.6 + (i * 2.6);
    slide.addText(`${member.firstName} ${member.lastName}`, { 
      x, y: 4.7, w: 2.4, h: 0.22, 
      fontSize: 10, bold: true, color: colors.primary, fontFace: "Arial" 
    });
    slide.addText(member.title, { 
      x, y: 4.92, w: 2.4, h: 0.2, 
      fontSize: 8, color: colors.white, fontFace: "Arial" 
    });
  });
  
  return slide;
};

// ==========================================
// SLIDE 2: EXECUTIVE SUMMARY
// ==========================================
const createExecutiveSummarySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Executive Summary");
  
  // Left Column - Narrative
  addCard(pptx, slide, 0.4, 0.9, 4.6, 4.1);
  
  const lastName = data.basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER";
  slide.addText(`Powering A STRONGER ${lastName}`, { 
    x: 0.55, y: 1, w: 4.3, h: 0.35, 
    fontSize: 14, bold: true, color: colors.primary, fontFace: "Arial" 
  });
  
  slide.addText(data.annualReport.executiveSummaryNarrative, { 
    x: 0.55, y: 1.4, w: 4.3, h: 0.9, 
    fontSize: 8, color: colors.muted, fontFace: "Arial" 
  });
  
  // Strategic Pillars
  slide.addText("Strategic Pillars", { 
    x: 0.55, y: 2.35, w: 4.3, h: 0.25, 
    fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" 
  });
  
  data.strategy.corporateStrategy.slice(0, 4).forEach((pillar, i) => {
    const y = 2.65 + (i * 0.52);
    slide.addShape(pptx.ShapeType.rect, { x: 0.55, y, w: 0.06, h: 0.42, fill: { color: colors.primary } });
    slide.addText(pillar.title, { x: 0.7, y, w: 4.1, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(pillar.description.substring(0, 80) + "...", { x: 0.7, y: y + 0.2, w: 4.1, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right Column - Financial Highlights
  addCard(pptx, slide, 5.1, 0.9, 4.5, 1.3);
  slide.addText("FY Revenue", { x: 5.25, y: 1, w: 2, h: 0.18, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.annualReport.revenue, { x: 5.25, y: 1.2, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.primary, fontFace: "Arial" });
  slide.addText(`(${data.annualReport.revenueComparison})`, { x: 5.25, y: 1.72, w: 2, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  slide.addText("EBIT Improvement", { x: 7.4, y: 1, w: 2, h: 0.18, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.annualReport.ebitImprovement, { x: 7.4, y: 1.2, w: 2, h: 0.5, fontSize: 28, bold: true, color: colors.primary, fontFace: "Arial" });
  slide.addText("YoY", { x: 7.4, y: 1.72, w: 2, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Key Milestones
  addCard(pptx, slide, 5.1, 2.3, 4.5, 1.3);
  slide.addText("Key Milestones", { x: 5.25, y: 2.4, w: 4.2, h: 0.22, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
  data.annualReport.keyMilestones.slice(0, 4).forEach((milestone, i) => {
    slide.addText(`• ${milestone}`, { x: 5.25, y: 2.65 + (i * 0.22), w: 4.2, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Strategic Achievements
  addCard(pptx, slide, 5.1, 3.7, 4.5, 1.3);
  slide.addText("Strategic Achievements", { x: 5.25, y: 3.8, w: 4.2, h: 0.22, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
  data.annualReport.strategicAchievements.slice(0, 4).forEach((achievement, i) => {
    slide.addText(`• ${achievement}`, { x: 5.25, y: 4.05 + (i * 0.22), w: 4.2, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

// ==========================================
// SLIDE 3: CUSTOMER OVERVIEW
// ==========================================
const createCustomerOverviewSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Customer Overview & Strategy", "Strategic direction and enterprise priorities");
  
  // Left: Strategic Direction
  addCard(pptx, slide, 0.4, 0.95, 4.8, 4);
  slide.addText("Strategic Direction", { x: 0.55, y: 1.05, w: 4.5, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(data.basics.accountName, { x: 0.55, y: 1.35, w: 4.5, h: 0.22, fontSize: 9, color: colors.primary, fontFace: "Arial" });
  
  data.strategy.corporateStrategy.slice(0, 4).forEach((item, i) => {
    const y = 1.65 + (i * 0.58);
    addBorderedSection(pptx, slide, 0.55, y, 4.5, 0.5, colors.primary);
    slide.addText(item.title, { x: 0.7, y: y + 0.05, w: 4.2, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(item.description.substring(0, 90), { x: 0.7, y: y + 0.26, w: 4.2, h: 0.22, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right: CEO/Board Priorities
  addCard(pptx, slide, 5.35, 0.95, 4.25, 4);
  slide.addText("CEO/Board Priorities", { x: 5.5, y: 1.05, w: 4, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  data.strategy.ceoBoardPriorities.slice(0, 4).forEach((priority, i) => {
    const y = 1.45 + (i * 0.72);
    slide.addShape(pptx.ShapeType.rect, { x: 5.5, y, w: 0.05, h: 0.6, fill: { color: colors.accent } });
    slide.addText(priority.title, { x: 5.65, y, w: 3.8, h: 0.22, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(priority.description.substring(0, 100), { x: 5.65, y: y + 0.24, w: 3.8, h: 0.35, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

// ==========================================
// SLIDE 4: BUSINESS MODEL CANVAS
// ==========================================
const createBusinessModelSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Business Model Canvas", data.basics.accountName);
  
  const canvas = data.businessModel;
  const blocks = [
    { title: "Key Partners", items: canvas.keyPartners, x: 0.4, y: 0.9, w: 1.82, h: 1.7 },
    { title: "Key Activities", items: canvas.keyActivities, x: 2.3, y: 0.9, w: 1.82, h: 0.8 },
    { title: "Key Resources", items: canvas.keyResources, x: 2.3, y: 1.75, w: 1.82, h: 0.85 },
    { title: "Value Proposition", items: canvas.valueProposition, x: 4.2, y: 0.9, w: 1.7, h: 1.7, accent: true },
    { title: "Customer Rel.", items: canvas.customerRelationships, x: 6, y: 0.9, w: 1.82, h: 0.8 },
    { title: "Channels", items: canvas.channels, x: 6, y: 1.75, w: 1.82, h: 0.85 },
    { title: "Customer Segments", items: canvas.customerSegments, x: 7.9, y: 0.9, w: 1.7, h: 1.7 },
    { title: "Cost Structure", items: canvas.costStructure, x: 0.4, y: 2.7, w: 4.5, h: 1.1 },
    { title: "Revenue Streams", items: canvas.revenueStreams, x: 5, y: 2.7, w: 4.6, h: 1.1 },
  ];
  
  blocks.forEach((block) => {
    const accent = (block as any).accent;
    addCard(pptx, slide, block.x, block.y, block.w, block.h, accent ? { borderColor: colors.primary } : undefined);
    slide.addText(block.title, { 
      x: block.x + 0.08, y: block.y + 0.05, w: block.w - 0.16, h: 0.2, 
      fontSize: 7, bold: true, color: accent ? colors.primary : colors.accent, fontFace: "Arial" 
    });
    const maxItems = block.h > 1.2 ? 4 : 2;
    block.items.slice(0, maxItems).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 35)}`, { 
        x: block.x + 0.08, y: block.y + 0.28 + (i * 0.18), w: block.w - 0.16, h: 0.18, 
        fontSize: 5.5, color: colors.muted, fontFace: "Arial" 
      });
    });
  });
  
  // Competitors
  addCard(pptx, slide, 0.4, 3.9, 9.2, 0.55);
  slide.addText("Key Competitors", { x: 0.55, y: 3.98, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(canvas.competitors.slice(0, 6).join("  •  "), { x: 0.55, y: 4.18, w: 8.9, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// SLIDE 5: STRATEGIC ALIGNMENT
// ==========================================
const createStrategicAlignmentSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Strategic Alignment", "Connecting corporate priorities to ServiceNow value");
  
  // Digital Strategies
  addCard(pptx, slide, 0.4, 0.95, 4.6, 1.8);
  slide.addText("Digital Strategies", { x: 0.55, y: 1.05, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  data.strategy.digitalStrategies.slice(0, 3).forEach((strat, i) => {
    const y = 1.35 + (i * 0.45);
    addIconBox(pptx, slide, 0.6, y + 0.02, 0.15, colors.primary);
    slide.addText(strat.title, { x: 0.85, y, w: 3.9, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(strat.description.substring(0, 85), { x: 0.85, y: y + 0.2, w: 3.9, h: 0.22, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Transformation Themes
  addCard(pptx, slide, 5.1, 0.95, 4.5, 1.8);
  slide.addText("Transformation Themes", { x: 5.25, y: 1.05, w: 4.2, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  data.strategy.transformationThemes.slice(0, 3).forEach((theme, i) => {
    const y = 1.35 + (i * 0.45);
    addIconBox(pptx, slide, 5.3, y + 0.02, 0.15, colors.purple);
    slide.addText(theme.title, { x: 5.55, y, w: 3.8, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(theme.description.substring(0, 85), { x: 5.55, y: y + 0.2, w: 3.8, h: 0.22, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Vision Statement
  addCard(pptx, slide, 0.4, 2.85, 9.2, 0.95, { borderColor: colors.primary });
  slide.addText(`ServiceNow Vision for ${data.basics.accountName}`, { x: 0.55, y: 2.95, w: 8.9, h: 0.22, fontSize: 10, bold: true, color: colors.primary, fontFace: "Arial" });
  slide.addText(data.basics.visionStatement, { x: 0.55, y: 3.2, w: 8.9, h: 0.55, fontSize: 8, color: colors.white, fontFace: "Arial" });
  
  // Financial & Account Position
  addCard(pptx, slide, 0.4, 3.9, 4.6, 0.9);
  slide.addText("Financial Context", { x: 0.55, y: 4, w: 4.3, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Revenue: ${data.financial.customerRevenue}  |  Growth: ${data.financial.growthRate}  |  EBIT: ${data.financial.marginEBIT}`, { x: 0.55, y: 4.22, w: 4.3, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  slide.addText(`Investments: ${data.financial.strategicInvestmentAreas.substring(0, 60)}`, { x: 0.55, y: 4.42, w: 4.3, h: 0.2, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  
  addCard(pptx, slide, 5.1, 3.9, 4.5, 0.9);
  slide.addText("Account Position", { x: 5.25, y: 4, w: 4.2, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Current: ${data.basics.currentContractValue}  →  FY: ${data.basics.nextFYAmbition}  →  3Y: ${data.basics.threeYearAmbition}`, { x: 5.25, y: 4.22, w: 4.2, h: 0.2, fontSize: 7, color: colors.primary, fontFace: "Arial" });
  slide.addText(`Renewal: ${data.basics.renewalDates}`, { x: 5.25, y: 4.42, w: 4.2, h: 0.2, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// SLIDE 6: FY-1 RETROSPECTIVE
// ==========================================
const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "FY-1 Retrospective", "What happened, what didn't work, and lessons learned");
  
  // Left: Prior Plan Summary
  addCard(pptx, slide, 0.4, 0.95, 4.6, 2.2);
  slide.addText("Prior Plan Summary", { x: 0.55, y: 1.05, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Last plan: ${data.history.lastPlanDate} by ${data.history.plannerName}`, { x: 0.55, y: 1.35, w: 4.3, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.history.lastPlanSummary, { x: 0.55, y: 1.6, w: 4.3, h: 0.65, fontSize: 8, color: colors.white, fontFace: "Arial" });
  
  slide.addText("What Didn't Work", { x: 0.55, y: 2.35, w: 4.3, h: 0.2, fontSize: 9, bold: true, color: colors.red, fontFace: "Arial" });
  slide.addText(data.history.whatDidNotWork, { x: 0.55, y: 2.58, w: 4.3, h: 0.45, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Right: SWOT
  addCard(pptx, slide, 5.1, 0.95, 4.5, 2.2);
  slide.addText("SWOT Analysis", { x: 5.25, y: 1.05, w: 4.2, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  
  // 2x2 SWOT grid
  const swotItems = [
    { title: "Strengths", items: data.swot.strengths, color: colors.primary, x: 5.25, y: 1.4 },
    { title: "Weaknesses", items: data.swot.weaknesses, color: colors.red, x: 7.4, y: 1.4 },
    { title: "Opportunities", items: data.swot.opportunities, color: colors.accent, x: 5.25, y: 2.15 },
    { title: "Threats", items: data.swot.threats, color: colors.amber, x: 7.4, y: 2.15 },
  ];
  
  swotItems.forEach(({ title, items, color, x, y }) => {
    slide.addText(title, { x, y, w: 2, h: 0.18, fontSize: 7, bold: true, color, fontFace: "Arial" });
    items.slice(0, 2).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 40)}`, { x, y: y + 0.2 + (i * 0.16), w: 2.1, h: 0.16, fontSize: 5.5, color: colors.muted, fontFace: "Arial" });
    });
  });
  
  // Perception & Prior Attempts
  addCard(pptx, slide, 0.4, 3.25, 4.6, 0.9);
  slide.addText("Current ServiceNow Perception", { x: 0.55, y: 3.35, w: 3, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  const perceptionColor = data.history.currentPerception === "High" ? colors.primary : data.history.currentPerception === "Medium" ? colors.amber : colors.red;
  slide.addText(data.history.currentPerception, { x: 3.6, y: 3.3, w: 1.2, h: 0.4, fontSize: 22, bold: true, color: perceptionColor, fontFace: "Arial" });
  slide.addText("Prior Transformation Attempts", { x: 0.55, y: 3.72, w: 4.3, h: 0.18, fontSize: 8, bold: true, color: colors.amber, fontFace: "Arial" });
  slide.addText(data.history.priorTransformationAttempts, { x: 0.55, y: 3.92, w: 4.3, h: 0.2, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  
  // Account Context
  addCard(pptx, slide, 5.1, 3.25, 4.5, 0.9);
  slide.addText("Account Context", { x: 5.25, y: 3.35, w: 4.2, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Tier: ${data.basics.tier}  |  Industry: ${data.basics.industry}`, { x: 5.25, y: 3.58, w: 4.2, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  slide.addText(`Region: ${data.basics.region}  |  Employees: ${data.basics.numberOfEmployees}`, { x: 5.25, y: 3.78, w: 4.2, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  slide.addText(`Renewal: ${data.basics.renewalDates}`, { x: 5.25, y: 3.98, w: 4.2, h: 0.18, fontSize: 7, color: colors.primary, fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// SLIDE 7: CURRENT STATE (PAIN POINTS)
// ==========================================
const createCurrentStateSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Current State Assessment", "Key pain points and adoption constraints");
  
  // Pain Points Grid (2x2)
  data.painPoints.painPoints.slice(0, 4).forEach((pain, i) => {
    const x = 0.4 + ((i % 2) * 4.7);
    const y = 0.95 + (Math.floor(i / 2) * 1.75);
    
    addCard(pptx, slide, x, y, 4.55, 1.65);
    
    // Number badge
    slide.addShape(pptx.ShapeType.roundRect, { 
      x: x + 0.12, y: y + 0.12, w: 0.35, h: 0.35, 
      fill: { color: colors.red, transparency: 70 }, 
      rectRadius: 0.08 
    });
    slide.addText(`${i + 1}`, { 
      x: x + 0.12, y: y + 0.12, w: 0.35, h: 0.35, 
      fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" 
    });
    
    slide.addText(pain.title, { x: x + 0.55, y: y + 0.12, w: 3.8, h: 0.28, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(pain.description, { x: x + 0.15, y: y + 0.5, w: 4.25, h: 1, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

// ==========================================
// SLIDE 8: STRATEGIC OBSERVATION
// ==========================================
const createStrategicObservationSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Strategic Observation", "Market context and implications");
  
  // Main observation
  addCard(pptx, slide, 0.4, 0.95, 9.2, 1.4, { borderColor: colors.primary });
  slide.addText(`"${data.basics.accountName} is undergoing significant transformation with an AI-first mandate and platform consolidation imperative."`, { 
    x: 0.55, y: 1.15, w: 8.9, h: 0.7, 
    fontSize: 14, color: colors.white, fontFace: "Arial", italic: true 
  });
  slide.addText("— Strategic Analysis", { x: 0.55, y: 1.9, w: 8.9, h: 0.25, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  
  // Key Metrics Row
  const metrics = [
    { label: "Revenue", value: data.financial.customerRevenue, color: colors.primary },
    { label: "Growth Rate", value: data.financial.growthRate, color: colors.accent },
    { label: "EBIT", value: data.financial.marginEBIT, color: colors.primary },
  ];
  
  metrics.forEach((metric, i) => {
    const x = 0.4 + (i * 3.1);
    addCard(pptx, slide, x, 2.5, 2.95, 0.85);
    slide.addText(metric.label, { x: x + 0.15, y: 2.58, w: 2.65, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
    slide.addText(metric.value, { x: x + 0.15, y: 2.8, w: 2.65, h: 0.4, fontSize: 20, bold: true, color: metric.color, fontFace: "Arial" });
  });
  
  // Strategic Importance
  addCard(pptx, slide, 0.4, 3.45, 9.2, 1.4);
  slide.addText("Strategic Importance", { x: 0.55, y: 3.55, w: 8.9, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  
  const importance = [
    "AI-first strategy creates urgency for unified operationalisation layer",
    "Platform consolidation (700+ apps) opens strategic opportunity",
    "Cost discipline requires clear ROI demonstration",
  ];
  importance.forEach((item, i) => {
    slide.addText(`• ${item}`, { x: 0.55, y: 3.85 + (i * 0.3), w: 8.9, h: 0.28, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

// ==========================================
// SLIDE 9-11: STRATEGIC ANALYSIS SLIDES
// ==========================================
const createStrategicAnalysisSlide = (pptx: pptxgen, title: string, points: Array<{heading: string, detail: string}>, callout?: string) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, title);
  
  points.slice(0, 4).forEach((point, i) => {
    const x = 0.4 + ((i % 2) * 4.7);
    const y = 0.95 + (Math.floor(i / 2) * 1.55);
    
    addCard(pptx, slide, x, y, 4.55, 1.45);
    addIconBox(pptx, slide, x + 0.15, y + 0.15, 0.4, i < 2 ? colors.primary : colors.accent, false);
    slide.addText(`${i + 1}`, { x: x + 0.15, y: y + 0.15, w: 0.4, h: 0.4, fontSize: 16, bold: true, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" });
    slide.addText(point.heading, { x: x + 0.65, y: y + 0.18, w: 3.7, h: 0.28, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(point.detail, { x: x + 0.15, y: y + 0.55, w: 4.25, h: 0.8, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  });
  
  if (callout) {
    addCard(pptx, slide, 0.4, 4.15, 9.2, 0.65, { borderColor: colors.primary });
    slide.addText(callout, { x: 0.55, y: 4.3, w: 8.9, h: 0.4, fontSize: 9, color: colors.white, fontFace: "Arial", align: "center" });
  }
  
  return slide;
};

// ==========================================
// SLIDE 12: VALUE HYPOTHESIS
// ==========================================
const createValueHypothesisSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Value Hypothesis", "Strategic opportunities and outcomes");
  
  data.opportunities.opportunities.slice(0, 4).forEach((opp, i) => {
    const x = 0.4 + ((i % 2) * 4.7);
    const y = 0.95 + (Math.floor(i / 2) * 1.75);
    
    addCard(pptx, slide, x, y, 4.55, 1.65, { borderColor: colors.primary });
    
    // Number badge
    slide.addShape(pptx.ShapeType.roundRect, { 
      x: x + 0.12, y: y + 0.12, w: 0.35, h: 0.35, 
      fill: { color: colors.primary, transparency: 70 }, 
      rectRadius: 0.08 
    });
    slide.addText(`${i + 1}`, { 
      x: x + 0.12, y: y + 0.12, w: 0.35, h: 0.35, 
      fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" 
    });
    
    slide.addText(opp.title, { x: x + 0.55, y: y + 0.12, w: 3.8, h: 0.28, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(opp.description, { x: x + 0.15, y: y + 0.5, w: 4.25, h: 1, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

// ==========================================
// SLIDE 13: STRATEGIC PRIORITIES (BIG BETS)
// ==========================================
const createStrategicPrioritiesSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Strategic Priorities FY26", "Must-Win Battles");
  
  const bigBets = [
    { title: "CRM & Customer Service Modernisation", whyNow: "Primary commercial wedge. Direct alignment to customer experience priority.", ifWeLose: "Competitor platforms embed. ServiceNow marginalised to IT operations only.", winning: "Production deployment. Measurable CSAT improvement. Executive sponsorship.", color: colors.primary },
    { title: "AI-Led Workflow Operationalisation", whyNow: "AI-first strategy. Opportunity to position ServiceNow as operationalisation layer.", ifWeLose: "AI initiatives scattered. No enterprise workflow backbone. Value fragmented.", winning: "2+ AI use cases live. Workflow automation reducing manual effort.", color: colors.purple },
    { title: "Platform Adoption Beyond CRM", whyNow: "CRM success creates expansion opportunity. IT, HR, risk workflows are adjacencies.", ifWeLose: "ServiceNow remains point solution. ACV stagnates. Strategic relevance diminishes.", winning: "Expansion pipeline identified. Executive roadmap endorsed.", color: colors.orange },
  ];
  
  bigBets.forEach((bet, i) => {
    const y = 0.95 + (i * 1.45);
    addCard(pptx, slide, 0.4, y, 9.2, 1.35);
    
    // Icon
    slide.addShape(pptx.ShapeType.roundRect, { 
      x: 0.55, y: y + 0.15, w: 0.45, h: 0.45, 
      fill: { color: bet.color }, 
      rectRadius: 0.08 
    });
    slide.addText(`${i + 1}`, { 
      x: 0.55, y: y + 0.15, w: 0.45, h: 0.45, 
      fontSize: 18, bold: true, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" 
    });
    
    slide.addText(bet.title, { x: 1.1, y: y + 0.15, w: 6, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
    
    // Three columns: Why Now, If We Lose, Winning
    const cols = [
      { label: "Why Now", text: bet.whyNow, color: colors.primary },
      { label: "If We Lose", text: bet.ifWeLose, color: colors.red },
      { label: "Winning in FY26", text: bet.winning, color: colors.primary },
    ];
    
    cols.forEach((col, j) => {
      const colX = 0.55 + (j * 3);
      slide.addText(col.label, { x: colX, y: y + 0.55, w: 2.8, h: 0.18, fontSize: 7, bold: true, color: col.color, fontFace: "Arial" });
      slide.addText(col.text, { x: colX, y: y + 0.75, w: 2.8, h: 0.5, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    });
  });
  
  return slide;
};

// ==========================================
// SLIDE 14: BIG BETS / WORKSTREAMS
// ==========================================
const createBigBetsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Key Transformation Workstreams", "Aligning stakeholders to accelerate impact");
  
  addPillBadge(pptx, slide, 8.5, 0.3, "FY26 Big Bets", colors.primary);
  
  const workstreams = [
    { title: "Maersk Line Ocean – SFDC Takeout", subtitle: "CRM Modernisation", close: "Q1 2026", status: "Active Pursuit", acv: "$5M", color: colors.primary },
    { title: "AI Use Cases & Workflow Automation", subtitle: "Operationalising AI-First", close: "Q2 2026", status: "Strategic Initiative", acv: "$2M", color: colors.accent },
    { title: "IT & Security Operations", subtitle: "SecOps & ITOM Expansion", close: "Q3 2026", status: "Foundation Growth", acv: "$3M", color: colors.blue },
  ];
  
  workstreams.forEach((ws, i) => {
    const x = 0.4 + (i * 3.1);
    addCard(pptx, slide, x, 0.95, 2.95, 3.5);
    
    // Status badge
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.1, y: 1.05, w: 1.4, h: 0.22, fill: { color: ws.color }, rectRadius: 0.11 });
    slide.addText(ws.status, { x: x + 0.1, y: 1.05, w: 1.4, h: 0.22, fontSize: 6, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" });
    
    slide.addText(`Close: ${ws.close}`, { x: x + 1.6, y: 1.05, w: 1.2, h: 0.22, fontSize: 6, color: colors.muted, align: "right", fontFace: "Arial" });
    
    slide.addText(ws.title, { x: x + 0.1, y: 1.35, w: 2.75, h: 0.35, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(ws.subtitle, { x: x + 0.1, y: 1.7, w: 2.75, h: 0.2, fontSize: 7, color: ws.color, fontFace: "Arial" });
    
    // ACV
    slide.addText("Net New ACV", { x: x + 0.1, y: 3.4, w: 1.3, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    slide.addText(ws.acv, { x: x + 0.1, y: 3.6, w: 1.3, h: 0.35, fontSize: 18, bold: true, color: colors.primary, fontFace: "Arial" });
    
    // Progress bar
    const progress = i === 0 ? 75 : i === 1 ? 40 : 25;
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.1, y: 4.05, w: 2.75, h: 0.1, fill: { color: colors.border }, rectRadius: 0.05 });
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.1, y: 4.05, w: 2.75 * (progress / 100), h: 0.1, fill: { color: ws.color }, rectRadius: 0.05 });
  });
  
  // CRM Priority Callout
  addCard(pptx, slide, 0.4, 4.55, 9.2, 0.5, { borderColor: colors.primary });
  slide.addText("CRM Modernisation is the Primary Commercial Wedge — Q1 FY26 priority. Success unlocks multi-workflow expansion.", { 
    x: 0.55, y: 4.65, w: 7, h: 0.3, fontSize: 9, color: colors.white, fontFace: "Arial" 
  });
  slide.addText("$10M+", { x: 8, y: 4.6, w: 1.4, h: 0.35, fontSize: 20, bold: true, color: colors.primary, align: "right", fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// SLIDE 15-17: PLATFORM & ROADMAP SLIDES
// ==========================================
const createPlatformSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Platform as Execution Layer", "How ServiceNow enables enterprise transformation");
  
  const capabilities = [
    { title: "Orchestration", desc: "Unified workflow engine connecting all enterprise processes", color: colors.primary },
    { title: "Governance", desc: "Enterprise-grade security, compliance, and audit controls", color: colors.accent },
    { title: "Scale", desc: "Cloud-native architecture that scales with business growth", color: colors.purple },
    { title: "Control", desc: "Real-time visibility and analytics across all workflows", color: colors.orange },
  ];
  
  capabilities.forEach((cap, i) => {
    const x = 0.4 + ((i % 2) * 4.7);
    const y = 0.95 + (Math.floor(i / 2) * 1.7);
    
    addCard(pptx, slide, x, y, 4.55, 1.55);
    addIconBox(pptx, slide, x + 0.15, y + 0.15, 0.5, cap.color, false);
    slide.addText(cap.title, { x: x + 0.75, y: y + 0.2, w: 3.6, h: 0.35, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(cap.desc, { x: x + 0.15, y: y + 0.75, w: 4.25, h: 0.65, fontSize: 10, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createRoadmapSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Transformation Roadmap", "FY26 phased execution plan");
  
  const phases = [
    { quarter: "Q1 FY26", title: "Foundation", items: ["CRM decision forum", "EBC execution", "Pilot scoping"], color: colors.primary },
    { quarter: "Q2 FY26", title: "Commercialisation", items: ["Contract finalisation", "SOW development", "Kick-off planning"], color: colors.accent },
    { quarter: "Q3-Q4", title: "Expansion", items: ["AI use case deployment", "SecOps integration", "Platform scaling"], color: colors.purple },
  ];
  
  phases.forEach((phase, i) => {
    const x = 0.4 + (i * 3.1);
    addCard(pptx, slide, x, 0.95, 2.95, 3.5);
    
    slide.addText(phase.quarter, { x: x + 0.15, y: 1.1, w: 2.65, h: 0.4, fontSize: 18, bold: true, color: phase.color, fontFace: "Arial" });
    slide.addText(phase.title, { x: x + 0.15, y: 1.55, w: 2.65, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
    
    phase.items.forEach((item, j) => {
      slide.addText(`→ ${item}`, { x: x + 0.15, y: 2 + (j * 0.35), w: 2.65, h: 0.3, fontSize: 9, color: colors.muted, fontFace: "Arial" });
    });
  });
  
  // Timeline arrow
  slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 4.55, w: 9.2, h: 0.08, fill: { color: colors.primary, transparency: 70 } });
  
  return slide;
};

// ==========================================
// SLIDE 18: GOVERNANCE
// ==========================================
const createGovernanceSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Governance Model", "Execution governance and prioritisation");
  
  // Left: Execution Governance
  addCard(pptx, slide, 0.4, 0.95, 4.6, 3.2);
  slide.addText("Execution Governance", { x: 0.55, y: 1.05, w: 4.3, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  const meetings = [
    { name: "Executive Steering", freq: "Quarterly", desc: "Strategic alignment and investment decisions" },
    { name: "Operational Cadence", freq: "Bi-weekly", desc: "Delivery progress and issue resolution" },
    { name: "Value Tracking", freq: "Monthly", desc: "Outcomes measurement and course correction" },
  ];
  
  meetings.forEach((mtg, i) => {
    const y = 1.45 + (i * 0.7);
    addBorderedSection(pptx, slide, 0.55, y, 4.3, 0.6, colors.primary);
    slide.addText(mtg.name, { x: 0.7, y: y + 0.08, w: 2.5, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(mtg.freq, { x: 3.5, y: y + 0.08, w: 1.2, h: 0.22, fontSize: 8, color: colors.primary, align: "right", fontFace: "Arial" });
    slide.addText(mtg.desc, { x: 0.7, y: y + 0.32, w: 4, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right: Prioritisation Framework
  addCard(pptx, slide, 5.1, 0.95, 4.5, 3.2);
  slide.addText("Prioritisation Framework", { x: 5.25, y: 1.05, w: 4.2, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  const criteria = [
    "Strategic alignment to corporate priorities",
    "Economic impact and ROI potential",
    "Technical feasibility and timeline",
    "Executive sponsorship strength",
  ];
  
  criteria.forEach((item, i) => {
    slide.addText(`${i + 1}. ${item}`, { x: 5.25, y: 1.45 + (i * 0.4), w: 4.2, h: 0.35, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });
  
  // Core principle
  addCard(pptx, slide, 5.25, 3.1, 4.2, 0.7, { borderColor: colors.primary });
  slide.addText("Core Governance Principle", { x: 5.35, y: 3.2, w: 4, h: 0.2, fontSize: 8, bold: true, color: colors.primary, fontFace: "Arial" });
  slide.addText("Every initiative must demonstrate clear ROI and alignment to strategic priorities", { x: 5.35, y: 3.42, w: 4, h: 0.3, fontSize: 7, color: colors.white, fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// SLIDE 19: EXECUTIVE ENGAGEMENT
// ==========================================
const createEngagementSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Executive Engagement Model", "Tiered engagement structure and key forums");
  
  // Sponsors
  addCard(pptx, slide, 0.4, 0.95, 4.6, 2);
  slide.addText("Executive Sponsors", { x: 0.55, y: 1.05, w: 4.3, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  data.engagement.knownExecutiveSponsors.slice(0, 4).forEach((sponsor, i) => {
    const y = 1.4 + (i * 0.35);
    addIconBox(pptx, slide, 0.6, y + 0.02, 0.18, colors.primary);
    slide.addText(sponsor, { x: 0.85, y, w: 4, h: 0.3, fontSize: 9, color: colors.white, fontFace: "Arial" });
  });
  
  // Events
  addCard(pptx, slide, 5.1, 0.95, 4.5, 2);
  slide.addText("Planned Executive Events", { x: 5.25, y: 1.05, w: 4.2, h: 0.28, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  data.engagement.plannedExecutiveEvents.slice(0, 3).forEach((event, i) => {
    const y = 1.4 + (i * 0.45);
    addIconBox(pptx, slide, 5.3, y + 0.02, 0.18, colors.accent);
    slide.addText(event, { x: 5.55, y, w: 3.9, h: 0.4, fontSize: 9, color: colors.white, fontFace: "Arial" });
  });
  
  // Critical Timelines
  addCard(pptx, slide, 0.4, 3.05, 9.2, 1.2);
  slide.addText("Critical Timelines", { x: 0.55, y: 3.15, w: 8.9, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  
  slide.addText("Decision Deadlines", { x: 0.55, y: 3.48, w: 2, h: 0.2, fontSize: 8, bold: true, color: colors.primary, fontFace: "Arial" });
  slide.addText(data.engagement.decisionDeadlines, { x: 2.6, y: 3.48, w: 3, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  slide.addText("Renewal/RFP Timing", { x: 5.6, y: 3.48, w: 2, h: 0.2, fontSize: 8, bold: true, color: colors.amber, fontFace: "Arial" });
  slide.addText(data.engagement.renewalRFPTiming, { x: 7.65, y: 3.48, w: 2, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  slide.addText(`Account Tier: ${data.basics.tier}  |  Industry: ${data.basics.industry}  |  Region: ${data.basics.region}`, { 
    x: 0.55, y: 3.85, w: 8.9, h: 0.25, fontSize: 8, color: colors.muted, fontFace: "Arial" 
  });
  
  return slide;
};

// ==========================================
// SLIDE 20: CLOSE PLAN
// ==========================================
const createClosePlanSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "Executive Close Plan", "Path to commercial success");
  
  const stages = [
    { stage: "Discovery & Alignment", owner: "Account Team", due: "Q1", status: "complete", color: colors.primary },
    { stage: "Value Demonstration", owner: "Solution Team", due: "Q1-Q2", status: "ongoing", color: colors.accent },
    { stage: "Commercial Negotiation", owner: "Account Executive", due: "Q2", status: "planned", color: colors.purple },
    { stage: "Contract Execution", owner: "Legal & Procurement", due: "Q2-Q3", status: "planned", color: colors.orange },
  ];
  
  stages.forEach((s, i) => {
    const y = 0.95 + (i * 0.85);
    addCard(pptx, slide, 0.4, y, 9.2, 0.75);
    
    // Stage number
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.55, y: y + 0.15, w: 0.4, h: 0.4, fill: { color: s.color } });
    slide.addText(`${i + 1}`, { x: 0.55, y: y + 0.15, w: 0.4, h: 0.4, fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle", fontFace: "Arial" });
    
    slide.addText(s.stage, { x: 1.1, y: y + 0.15, w: 3, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(`Owner: ${s.owner}`, { x: 1.1, y: y + 0.42, w: 3, h: 0.22, fontSize: 8, color: colors.muted, fontFace: "Arial" });
    
    slide.addText(`Due: ${s.due}`, { x: 6, y: y + 0.25, w: 1.5, h: 0.22, fontSize: 9, color: colors.muted, fontFace: "Arial" });
    
    const statusColor = s.status === "complete" ? colors.primary : s.status === "ongoing" ? colors.accent : colors.muted;
    addPillBadge(pptx, slide, 7.8, y + 0.25, s.status.toUpperCase(), statusColor);
  });
  
  // Key milestones
  addCard(pptx, slide, 0.4, 4.35, 9.2, 0.7, { borderColor: colors.primary });
  slide.addText(`Target: ${data.basics.nextFYAmbition} in FY26  →  ${data.basics.threeYearAmbition} by FY28`, { 
    x: 0.55, y: 4.55, w: 8.9, h: 0.35, fontSize: 12, bold: true, color: colors.primary, align: "center", fontFace: "Arial" 
  });
  
  return slide;
};

// ==========================================
// SLIDE 21: SUCCESS METRICS
// ==========================================
const createSuccessMetricsSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, "What Success Looks Like", "Measurable outcomes and strategic positioning");
  
  const outcomes = [
    { metric: "$15-20M", label: "Annual cost savings", desc: "Platform consolidation and automation", color: colors.primary },
    { metric: "+15pts", label: "CSAT improvement", desc: "AI-augmented customer experience", color: colors.accent },
    { metric: "5x", label: "Faster AI deployment", desc: "Unified operationalisation layer", color: colors.purple },
    { metric: "50%", label: "Reduced resolution time", desc: "Intelligent automation and routing", color: colors.orange },
  ];
  
  outcomes.forEach((outcome, i) => {
    const x = 0.4 + ((i % 2) * 4.7);
    const y = 0.95 + (Math.floor(i / 2) * 1.55);
    
    addCard(pptx, slide, x, y, 4.55, 1.45);
    slide.addText(outcome.metric, { x: x + 0.15, y: y + 0.2, w: 4.25, h: 0.5, fontSize: 32, bold: true, color: outcome.color, align: "center", fontFace: "Arial" });
    slide.addText(outcome.label, { x: x + 0.15, y: y + 0.75, w: 4.25, h: 0.25, fontSize: 11, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide.addText(outcome.desc, { x: x + 0.15, y: y + 1.02, w: 4.25, h: 0.25, fontSize: 8, color: colors.muted, align: "center", fontFace: "Arial" });
  });
  
  // Strategic Vision
  addCard(pptx, slide, 0.4, 4.15, 9.2, 0.85, { borderColor: colors.primary });
  slide.addText("Strategic Vision", { x: 0.55, y: 4.25, w: 8.9, h: 0.25, fontSize: 11, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
  slide.addText(`ServiceNow becomes ${data.basics.accountName}'s enterprise workflow backbone — enabling AI operationalisation, customer experience excellence, and cost efficiency at global scale.`, { 
    x: 0.55, y: 4.52, w: 8.9, h: 0.4, fontSize: 9, color: colors.muted, align: "center", fontFace: "Arial" 
  });
  
  return slide;
};

// ==========================================
// SLIDE 22: THANK YOU / CLOSING
// ==========================================
const createClosingSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  
  // Similar gradient background to cover
  slide.background = { color: "142533" };
  slide.addShape(pptx.ShapeType.ellipse, { x: -2, y: -1, w: 6, h: 4, fill: { color: "1F3B4D", transparency: 70 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 6, y: 2, w: 6, h: 5, fill: { color: "2A2F4D", transparency: 70 } });
  
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  slide.addText("Thank You", { x: 0.5, y: 1.6, w: 9, h: 0.7, fontSize: 44, bold: true, color: colors.primary, align: "center", fontFace: "Arial" });
  slide.addText(`${data.basics.accountName} Global Account Plan`, { x: 0.5, y: 2.4, w: 9, h: 0.5, fontSize: 20, color: colors.white, align: "center", fontFace: "Arial" });
  slide.addText(monthYear, { x: 0.5, y: 3, w: 9, h: 0.35, fontSize: 14, color: colors.muted, align: "center", fontFace: "Arial" });
  
  // Team members
  const teamMembers = data.basics.coreTeamMembers || [];
  const teamText = teamMembers.map(m => `${m.firstName} ${m.lastName}`).join("  •  ");
  slide.addText(teamText, { x: 0.5, y: 4, w: 9, h: 0.3, fontSize: 11, color: colors.primary, align: "center", fontFace: "Arial" });
  
  // Contact
  slide.addText("servicenow.com", { x: 0.5, y: 4.6, w: 9, h: 0.25, fontSize: 10, color: colors.accent, align: "center", fontFace: "Arial" });
  
  return slide;
};

// ==========================================
// MAIN EXPORT FUNCTION
// ==========================================
export const exportToPowerPoint = async (data: AccountData) => {
  const pptx = new pptxgen();
  
  pptx.author = "ServiceNow";
  pptx.title = `${data.basics.accountName} Account Plan`;
  pptx.subject = "Global Account Plan";
  pptx.layout = "LAYOUT_16x9";
  
  const allSlides: pptxgen.Slide[] = [];
  
  // 1. Cover
  allSlides.push(createCoverSlide(pptx, data));
  
  // 2. Executive Summary
  allSlides.push(createExecutiveSummarySlide(pptx, data));
  
  // 3. Customer Overview
  allSlides.push(createCustomerOverviewSlide(pptx, data));
  
  // 4. Business Model Canvas
  allSlides.push(createBusinessModelSlide(pptx, data));
  
  // 5. Strategic Alignment
  allSlides.push(createStrategicAlignmentSlide(pptx, data));
  
  // 6. FY-1 Retrospective
  allSlides.push(createRetrospectiveSlide(pptx, data));
  
  // 7. Current State (Pain Points)
  allSlides.push(createCurrentStateSlide(pptx, data));
  
  // 8. Strategic Observation
  allSlides.push(createStrategicObservationSlide(pptx, data));
  
  // 9. Strategic Implication
  allSlides.push(createStrategicAnalysisSlide(pptx, "Strategic Implication", [
    { heading: "AI Operationalisation Gap", detail: "Without unified workflow orchestration, AI initiatives remain fragmented and value realisation is delayed by 12-18 months." },
    { heading: "Platform Consolidation", detail: "700+ applications create friction in delivering on strategic priorities. Unified platform reduces complexity and accelerates delivery." },
    { heading: "Cost-to-Serve Pressure", detail: "Manual processes and fragmented systems drive cost inefficiency. Automation unlocks 5-7% annual productivity improvement." },
    { heading: "Customer Experience", detail: "Inconsistent service levels impact NPS. Unified platform enables consistent, proactive customer engagement." },
  ], "ServiceNow is uniquely positioned to bridge the gap between AI ambition and operational execution."));
  
  // 10. Strategic Tension
  allSlides.push(createStrategicAnalysisSlide(pptx, "Strategic Tension", [
    { heading: "Cost Discipline vs Investment", detail: "Need for continued digital investment creates tension with cost discipline imperative. Every initiative must demonstrate clear ROI." },
    { heading: "Speed vs Stability", detail: "Pressure to accelerate transformation balanced against operational stability requirements and change fatigue." },
    { heading: "Innovation vs Risk", detail: "AI-first ambition requires experimentation while enterprise compliance demands governance and control." },
    { heading: "Global vs Local", detail: "Standardisation benefits conflict with regional customisation needs and local market requirements." },
  ]));
  
  // 11. Strategic Insight
  allSlides.push(createStrategicAnalysisSlide(pptx, "Strategic Insight", [
    { heading: "Platform Positioning", detail: "The opportunity is not point solutions — it's positioning ServiceNow as the digital execution backbone for AI-first strategy." },
    { heading: "Value Narrative", detail: "Cost consolidation pays for transformation. Platform investment delivers productivity improvement that funds innovation." },
    { heading: "Executive Alignment", detail: "CIO, CPO, and CCO priorities converge on unified customer experience and operational efficiency." },
    { heading: "Competitive Advantage", detail: "ServiceNow's workflow orchestration uniquely bridges enterprise IT and business process automation." },
  ], "Platform consolidation drives cost discipline while improving customer experience."));
  
  // 12. Value Hypothesis
  allSlides.push(createValueHypothesisSlide(pptx, data));
  
  // 13. Strategic Priorities
  allSlides.push(createStrategicPrioritiesSlide(pptx, data));
  
  // 14. Big Bets / Workstreams
  allSlides.push(createBigBetsSlide(pptx, data));
  
  // 15. Platform
  allSlides.push(createPlatformSlide(pptx, data));
  
  // 16. Roadmap
  allSlides.push(createRoadmapSlide(pptx, data));
  
  // 17. Governance
  allSlides.push(createGovernanceSlide(pptx, data));
  
  // 18. Executive Engagement
  allSlides.push(createEngagementSlide(pptx, data));
  
  // 19. Close Plan
  allSlides.push(createClosePlanSlide(pptx, data));
  
  // 20. Success Metrics
  allSlides.push(createSuccessMetricsSlide(pptx, data));
  
  // 21. Closing/Thank You
  allSlides.push(createClosingSlide(pptx, data));
  
  // Add footers to all slides except cover and closing
  allSlides.forEach((slide, i) => {
    if (i > 0 && i < allSlides.length - 1) {
      addFooter(slide, i + 1, allSlides.length, data.basics.accountName);
    }
  });
  
  // Save the file
  await pptx.writeFile({ fileName: `${data.basics.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_FY26.pptx` });
};
