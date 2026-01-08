import pptxgen from "pptxgenjs";
import { AccountData } from "@/context/AccountDataContext";

// ServiceNow Brand Colors (matching index.css exactly)
const colors = {
  background: "0D2235",
  cardBg: "143A4F",
  snGreen: "81B847",
  white: "FFFFFF",
  muted: "8BA3B5",
  border: "2A4A5E",
  navy: "1A3246",
  red: "EF4444",
  amber: "F59E0B",
  purple: "A855F7",
  pink: "EC4899",
  blue: "3B82F6",
  cyan: "06B6D4",
  orange: "F97316",
};

// Slide dimensions for LAYOUT_16x9: 10in x 5.625in
const SLIDE_W = 10;
const SLIDE_H = 5.625;

const addSlideBackground = (pptx: pptxgen, slide: pptxgen.Slide) => {
  slide.background = { color: colors.background };
};

const addFooter = (slide: pptxgen.Slide, slideNum: number, totalSlides: number, accountName: string) => {
  slide.addText(`ServiceNow | ${accountName} Account Plan`, { 
    x: 0.5, y: 5.2, w: 5, h: 0.3, 
    fontSize: 8, color: colors.muted, fontFace: "Arial" 
  });
  slide.addText(`${slideNum} / ${totalSlides}`, { 
    x: 8.5, y: 5.2, w: 1, h: 0.3, 
    fontSize: 8, color: colors.muted, align: "right", fontFace: "Arial" 
  });
};

const addGlassCard = (pptx: pptxgen, slide: pptxgen.Slide, x: number, y: number, w: number, h: number) => {
  slide.addShape(pptx.ShapeType.roundRect, { 
    x, y, w, h, 
    fill: { color: colors.cardBg, transparency: 30 }, 
    line: { color: colors.border, width: 1, transparency: 50 }, 
    rectRadius: 0.1 
  });
};

const addSlideTitle = (slide: pptxgen.Slide, title: string) => {
  slide.addText(title, { 
    x: 0.5, y: 0.3, w: 9, h: 0.5, 
    fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" 
  });
};

// ==========================================
// SLIDE GENERATORS
// ==========================================

const createCoverSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  slide.background = { color: colors.background };
  
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Customer Name - Large Green
  slide.addText(data.basics.accountName || "Customer Name", { 
    x: 0.8, y: 1.5, w: 8.5, h: 1, 
    fontSize: 48, bold: true, color: colors.snGreen, fontFace: "Arial" 
  });
  
  // Global Account Plan - Large White
  slide.addText("Global Account Plan", { 
    x: 0.8, y: 2.4, w: 8.5, h: 0.9, 
    fontSize: 40, bold: true, color: colors.white, fontFace: "Arial" 
  });
  
  // Date
  slide.addText(monthYear, { 
    x: 0.8, y: 3.3, w: 4, h: 0.4, 
    fontSize: 18, color: colors.white, fontFace: "Arial" 
  });
  
  // Team Members at bottom
  const teamMembers = data.basics.coreTeamMembers || [];
  teamMembers.forEach((member, i) => {
    const x = 0.8 + (i * 2.8);
    slide.addText(`${member.firstName} ${member.lastName}`, { 
      x, y: 4.6, w: 2.6, h: 0.25, 
      fontSize: 12, bold: true, color: colors.snGreen, fontFace: "Arial" 
    });
    slide.addText(member.title, { 
      x, y: 4.85, w: 2.6, h: 0.2, 
      fontSize: 10, color: colors.white, fontFace: "Arial" 
    });
  });
  
  return slide;
};

const createExecutiveSummarySlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "Executive Summary");
  
  // Left side - Narrative
  slide.addText(`Powering A STRONGER ${data.basics.accountName.split(" ").pop()?.toUpperCase() || "PARTNER"}`, { 
    x: 0.5, y: 0.9, w: 4.5, h: 0.6, 
    fontSize: 20, bold: true, color: colors.snGreen, fontFace: "Arial" 
  });
  
  slide.addText(data.annualReport.executiveSummaryNarrative, { 
    x: 0.5, y: 1.55, w: 4.5, h: 1, 
    fontSize: 9, color: colors.muted, fontFace: "Arial" 
  });
  
  // Strategic pillars
  const pillars = data.strategy.corporateStrategy.slice(0, 4);
  pillars.forEach((pillar, i) => {
    const y = 2.6 + (i * 0.55);
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 0.08, h: 0.45, fill: { color: colors.snGreen } });
    slide.addText(pillar.title, { x: 0.7, y, w: 4.2, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(pillar.description.substring(0, 80) + "...", { x: 0.7, y: y + 0.22, w: 4.2, h: 0.22, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right side - Annual Report highlights
  addGlassCard(pptx, slide, 5.2, 0.9, 4.5, 1);
  slide.addText("FY Revenue", { x: 5.4, y: 1, w: 2, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.annualReport.revenue, { x: 5.4, y: 1.25, w: 2, h: 0.4, fontSize: 28, bold: true, color: colors.snGreen, fontFace: "Arial" });
  slide.addText(`(${data.annualReport.revenueComparison})`, { x: 5.4, y: 1.65, w: 2, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText("EBIT", { x: 7.5, y: 1, w: 2, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.annualReport.ebitImprovement, { x: 7.5, y: 1.25, w: 2, h: 0.4, fontSize: 24, bold: true, color: colors.snGreen, fontFace: "Arial" });
  
  // Milestones
  addGlassCard(pptx, slide, 5.2, 2, 4.5, 1.5);
  slide.addText("Key Milestones", { x: 5.4, y: 2.1, w: 4, h: 0.25, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
  data.annualReport.keyMilestones.slice(0, 4).forEach((milestone, i) => {
    slide.addText(`• ${milestone}`, { x: 5.4, y: 2.4 + (i * 0.28), w: 4.1, h: 0.28, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Achievements
  addGlassCard(pptx, slide, 5.2, 3.6, 4.5, 1.4);
  slide.addText("Strategic Achievements", { x: 5.4, y: 3.7, w: 4, h: 0.25, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
  data.annualReport.strategicAchievements.slice(0, 4).forEach((achievement, i) => {
    slide.addText(`• ${achievement}`, { x: 5.4, y: 3.98 + (i * 0.28), w: 4.1, h: 0.28, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createCustomerOverviewSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "Customer Overview");
  
  // Left card - Strategic Direction
  addGlassCard(pptx, slide, 0.5, 0.9, 5, 4.2);
  slide.addText("Strategic Direction", { x: 0.7, y: 1, w: 4.5, h: 0.3, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(data.basics.accountName, { x: 0.7, y: 1.3, w: 4.5, h: 0.25, fontSize: 10, color: colors.snGreen, fontFace: "Arial" });
  
  // Corporate strategy items
  data.strategy.corporateStrategy.slice(0, 4).forEach((item, i) => {
    const y = 1.7 + (i * 0.7);
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.7, y, w: 4.5, h: 0.6, fill: { color: colors.navy, transparency: 50 }, rectRadius: 0.05 });
    slide.addText(item.title, { x: 0.85, y: y + 0.08, w: 4.2, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(item.description.substring(0, 100), { x: 0.85, y: y + 0.3, w: 4.2, h: 0.25, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right card - Key Priorities
  addGlassCard(pptx, slide, 5.7, 0.9, 4, 4.2);
  slide.addText("CEO/Board Priorities", { x: 5.9, y: 1, w: 3.6, h: 0.3, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
  
  data.strategy.ceoBoardPriorities.slice(0, 4).forEach((priority, i) => {
    const y = 1.45 + (i * 0.9);
    slide.addShape(pptx.ShapeType.rect, { x: 5.9, y, w: 0.06, h: 0.75, fill: { color: colors.snGreen } });
    slide.addText(priority.title, { x: 6.05, y, w: 3.4, h: 0.25, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(priority.description.substring(0, 120), { x: 6.05, y: y + 0.28, w: 3.4, h: 0.45, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createBusinessModelSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "Business Model Canvas");
  
  const canvas = data.businessModel;
  const blocks = [
    { title: "Key Partners", items: canvas.keyPartners, x: 0.5, y: 0.9, w: 1.8, h: 2 },
    { title: "Key Activities", items: canvas.keyActivities, x: 2.4, y: 0.9, w: 1.8, h: 1 },
    { title: "Key Resources", items: canvas.keyResources, x: 2.4, y: 1.95, w: 1.8, h: 0.95 },
    { title: "Value Prop", items: canvas.valueProposition, x: 4.3, y: 0.9, w: 1.7, h: 2 },
    { title: "Customer Rel.", items: canvas.customerRelationships, x: 6.1, y: 0.9, w: 1.8, h: 1 },
    { title: "Channels", items: canvas.channels, x: 6.1, y: 1.95, w: 1.8, h: 0.95 },
    { title: "Customers", items: canvas.customerSegments, x: 8, y: 0.9, w: 1.7, h: 2 },
    { title: "Cost Structure", items: canvas.costStructure, x: 0.5, y: 3, w: 4.5, h: 1.1 },
    { title: "Revenue Streams", items: canvas.revenueStreams, x: 5.1, y: 3, w: 4.6, h: 1.1 },
  ];
  
  blocks.forEach((block) => {
    addGlassCard(pptx, slide, block.x, block.y, block.w, block.h);
    slide.addText(block.title, { x: block.x + 0.1, y: block.y + 0.05, w: block.w - 0.2, h: 0.2, fontSize: 8, bold: true, color: colors.snGreen, fontFace: "Arial" });
    const maxItems = block.h > 1.5 ? 4 : 2;
    block.items.slice(0, maxItems).forEach((item, i) => {
      slide.addText(`• ${item.substring(0, 40)}`, { x: block.x + 0.1, y: block.y + 0.28 + (i * 0.18), w: block.w - 0.2, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    });
  });
  
  // Competitors section
  addGlassCard(pptx, slide, 0.5, 4.2, 9.2, 0.7);
  slide.addText("Key Competitors:", { x: 0.7, y: 4.3, w: 2, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(canvas.competitors.slice(0, 5).join("  •  "), { x: 0.7, y: 4.52, w: 8.8, h: 0.3, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  return slide;
};

const createStrategicAlignmentSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "Strategic Alignment");
  
  // Digital Strategies
  addGlassCard(pptx, slide, 0.5, 0.9, 4.5, 2);
  slide.addText("Digital Strategies", { x: 0.7, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  data.strategy.digitalStrategies.slice(0, 3).forEach((strat, i) => {
    const y = 1.35 + (i * 0.5);
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.75, y: y + 0.05, w: 0.12, h: 0.12, fill: { color: colors.snGreen } });
    slide.addText(strat.title, { x: 0.95, y, w: 3.8, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(strat.description.substring(0, 100), { x: 0.95, y: y + 0.22, w: 3.8, h: 0.28, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Transformation Themes
  addGlassCard(pptx, slide, 5.2, 0.9, 4.5, 2);
  slide.addText("Transformation Themes", { x: 5.4, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  data.strategy.transformationThemes.slice(0, 3).forEach((theme, i) => {
    const y = 1.35 + (i * 0.5);
    slide.addShape(pptx.ShapeType.ellipse, { x: 5.45, y: y + 0.05, w: 0.12, h: 0.12, fill: { color: colors.purple } });
    slide.addText(theme.title, { x: 5.65, y, w: 3.8, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(theme.description.substring(0, 100), { x: 5.65, y: y + 0.22, w: 3.8, h: 0.28, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Vision Statement
  addGlassCard(pptx, slide, 0.5, 3, 9.2, 1.2);
  slide.addText("ServiceNow Vision for " + data.basics.accountName, { x: 0.7, y: 3.1, w: 8.8, h: 0.25, fontSize: 11, bold: true, color: colors.snGreen, fontFace: "Arial" });
  slide.addText(data.basics.visionStatement, { x: 0.7, y: 3.4, w: 8.8, h: 0.7, fontSize: 9, color: colors.white, fontFace: "Arial" });
  
  // Financial context
  addGlassCard(pptx, slide, 0.5, 4.3, 4.5, 0.8);
  slide.addText("Financial Context", { x: 0.7, y: 4.4, w: 2, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Revenue: ${data.financial.customerRevenue}  |  Growth: ${data.financial.growthRate}  |  EBIT: ${data.financial.marginEBIT}`, { x: 0.7, y: 4.62, w: 4.1, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(`Strategic Investments: ${data.financial.strategicInvestmentAreas}`, { x: 0.7, y: 4.82, w: 4.1, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Contract info
  addGlassCard(pptx, slide, 5.2, 4.3, 4.5, 0.8);
  slide.addText("Account Position", { x: 5.4, y: 4.4, w: 2, h: 0.2, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Current: ${data.basics.currentContractValue}  →  FY Target: ${data.basics.nextFYAmbition}  →  3Y: ${data.basics.threeYearAmbition}`, { x: 5.4, y: 4.62, w: 4.1, h: 0.2, fontSize: 8, color: colors.snGreen, fontFace: "Arial" });
  slide.addText(`Renewal: ${data.basics.renewalDates}`, { x: 5.4, y: 4.82, w: 4.1, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  return slide;
};

const createRetrospectiveSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "FY-1 Retrospective");
  
  // History card
  addGlassCard(pptx, slide, 0.5, 0.9, 4.5, 3);
  slide.addText("Prior Plan Summary", { x: 0.7, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Last plan: ${data.history.lastPlanDate} by ${data.history.plannerName} (${data.history.plannerRole})`, { x: 0.7, y: 1.3, w: 4, h: 0.2, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  slide.addText(data.history.lastPlanSummary, { x: 0.7, y: 1.6, w: 4, h: 0.8, fontSize: 9, color: colors.white, fontFace: "Arial" });
  
  slide.addText("What Didn't Work", { x: 0.7, y: 2.5, w: 4, h: 0.25, fontSize: 10, bold: true, color: colors.red, fontFace: "Arial" });
  slide.addText(data.history.whatDidNotWork, { x: 0.7, y: 2.78, w: 4, h: 0.5, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  slide.addText("Prior Transformation Attempts", { x: 0.7, y: 3.35, w: 4, h: 0.2, fontSize: 9, bold: true, color: colors.amber, fontFace: "Arial" });
  slide.addText(data.history.priorTransformationAttempts, { x: 0.7, y: 3.55, w: 4, h: 0.3, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Current perception
  addGlassCard(pptx, slide, 5.2, 0.9, 4.5, 1.2);
  slide.addText("Current ServiceNow Perception", { x: 5.4, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  const perceptionColor = data.history.currentPerception === "High" ? colors.snGreen : data.history.currentPerception === "Medium" ? colors.amber : colors.red;
  slide.addText(data.history.currentPerception, { x: 5.4, y: 1.35, w: 2, h: 0.5, fontSize: 28, bold: true, color: perceptionColor, fontFace: "Arial" });
  
  // SWOT
  addGlassCard(pptx, slide, 5.2, 2.2, 4.5, 2.7);
  slide.addText("SWOT Analysis", { x: 5.4, y: 2.3, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  
  // S & W
  slide.addText("Strengths", { x: 5.4, y: 2.6, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.snGreen, fontFace: "Arial" });
  data.swot.strengths.slice(0, 2).forEach((s, i) => {
    slide.addText(`• ${s.substring(0, 45)}`, { x: 5.4, y: 2.8 + (i * 0.18), w: 2.1, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  slide.addText("Weaknesses", { x: 7.6, y: 2.6, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.red, fontFace: "Arial" });
  data.swot.weaknesses.slice(0, 2).forEach((w, i) => {
    slide.addText(`• ${w.substring(0, 45)}`, { x: 7.6, y: 2.8 + (i * 0.18), w: 2.1, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // O & T
  slide.addText("Opportunities", { x: 5.4, y: 3.25, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.blue, fontFace: "Arial" });
  data.swot.opportunities.slice(0, 2).forEach((o, i) => {
    slide.addText(`• ${o.substring(0, 45)}`, { x: 5.4, y: 3.45 + (i * 0.18), w: 2.1, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  slide.addText("Threats", { x: 7.6, y: 3.25, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.amber, fontFace: "Arial" });
  data.swot.threats.slice(0, 2).forEach((t, i) => {
    slide.addText(`• ${t.substring(0, 45)}`, { x: 7.6, y: 3.45 + (i * 0.18), w: 2.1, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createPainPointsSlide = (pptx: pptxgen, data: AccountData, title: string) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, title);
  
  data.painPoints.painPoints.slice(0, 4).forEach((pain, i) => {
    const x = 0.5 + ((i % 2) * 4.8);
    const y = 0.95 + (Math.floor(i / 2) * 2.2);
    addGlassCard(pptx, slide, x, y, 4.5, 2);
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.15, y: y + 0.15, w: 0.4, h: 0.4, fill: { color: colors.red, transparency: 70 }, rectRadius: 0.08 });
    slide.addText(`${i + 1}`, { x: x + 0.15, y: y + 0.18, w: 0.4, h: 0.35, fontSize: 16, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide.addText(pain.title, { x: x + 0.65, y: y + 0.15, w: 3.6, h: 0.35, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(pain.description, { x: x + 0.2, y: y + 0.6, w: 4.1, h: 1.2, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createOpportunitiesSlide = (pptx: pptxgen, data: AccountData, title: string) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, title);
  
  data.opportunities.opportunities.slice(0, 4).forEach((opp, i) => {
    const x = 0.5 + ((i % 2) * 4.8);
    const y = 0.95 + (Math.floor(i / 2) * 2.2);
    addGlassCard(pptx, slide, x, y, 4.5, 2);
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.15, y: y + 0.15, w: 0.4, h: 0.4, fill: { color: colors.snGreen, transparency: 70 }, rectRadius: 0.08 });
    slide.addText(`${i + 1}`, { x: x + 0.15, y: y + 0.18, w: 0.4, h: 0.35, fontSize: 16, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide.addText(opp.title, { x: x + 0.65, y: y + 0.15, w: 3.6, h: 0.35, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
    slide.addText(opp.description, { x: x + 0.2, y: y + 0.6, w: 4.1, h: 1.2, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });
  
  return slide;
};

const createSimpleTextSlide = (pptx: pptxgen, title: string, content: string, subContent?: string) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, title);
  
  addGlassCard(pptx, slide, 0.5, 0.9, 9.2, 4.2);
  slide.addText(content, { x: 0.7, y: 1.5, w: 8.8, h: 2, fontSize: 16, color: colors.white, fontFace: "Arial" });
  
  if (subContent) {
    slide.addText(subContent, { x: 0.7, y: 3.5, w: 8.8, h: 1, fontSize: 10, color: colors.muted, fontFace: "Arial" });
  }
  
  return slide;
};

const createEngagementSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  addSlideBackground(pptx, slide);
  addSlideTitle(slide, "Executive Engagement");
  
  // Sponsors
  addGlassCard(pptx, slide, 0.5, 0.9, 4.5, 2);
  slide.addText("Executive Sponsors", { x: 0.7, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  data.engagement.knownExecutiveSponsors.slice(0, 4).forEach((sponsor, i) => {
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.75, y: 1.4 + (i * 0.35), w: 0.1, h: 0.1, fill: { color: colors.snGreen } });
    slide.addText(sponsor, { x: 0.95, y: 1.35 + (i * 0.35), w: 3.8, h: 0.3, fontSize: 9, color: colors.white, fontFace: "Arial" });
  });
  
  // Events
  addGlassCard(pptx, slide, 5.2, 0.9, 4.5, 2);
  slide.addText("Planned Events", { x: 5.4, y: 1, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  data.engagement.plannedExecutiveEvents.slice(0, 3).forEach((event, i) => {
    slide.addShape(pptx.ShapeType.ellipse, { x: 5.45, y: 1.4 + (i * 0.4), w: 0.1, h: 0.1, fill: { color: colors.purple } });
    slide.addText(event, { x: 5.65, y: 1.35 + (i * 0.4), w: 3.8, h: 0.35, fontSize: 9, color: colors.white, fontFace: "Arial" });
  });
  
  // Timelines
  addGlassCard(pptx, slide, 0.5, 3, 9.2, 1.1);
  slide.addText("Critical Timelines", { x: 0.7, y: 3.1, w: 4, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  slide.addText(`Decision Deadlines: ${data.engagement.decisionDeadlines}`, { x: 0.7, y: 3.4, w: 4.3, h: 0.25, fontSize: 9, color: colors.snGreen, fontFace: "Arial" });
  slide.addText(`Renewal/RFP Timing: ${data.engagement.renewalRFPTiming}`, { x: 5.2, y: 3.4, w: 4.3, h: 0.25, fontSize: 9, color: colors.amber, fontFace: "Arial" });
  slide.addText(`Account Tier: ${data.basics.tier}  |  Region: ${data.basics.region}  |  Industry: ${data.basics.industry}`, { x: 0.7, y: 3.7, w: 8.8, h: 0.25, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  return slide;
};

const createSuccessSlide = (pptx: pptxgen, data: AccountData) => {
  const slide = pptx.addSlide();
  slide.background = { color: colors.background };
  
  slide.addText("Thank You", { x: 0.5, y: 1.8, w: 9, h: 0.8, fontSize: 48, bold: true, color: colors.snGreen, align: "center", fontFace: "Arial" });
  slide.addText(`${data.basics.accountName} Global Account Plan`, { x: 0.5, y: 2.7, w: 9, h: 0.5, fontSize: 24, color: colors.white, align: "center", fontFace: "Arial" });
  
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  slide.addText(monthYear, { x: 0.5, y: 3.3, w: 9, h: 0.4, fontSize: 16, color: colors.muted, align: "center", fontFace: "Arial" });
  
  // Team members
  const teamMembers = data.basics.coreTeamMembers || [];
  const teamText = teamMembers.map(m => `${m.firstName} ${m.lastName}`).join("  •  ");
  slide.addText(teamText, { x: 0.5, y: 4.3, w: 9, h: 0.3, fontSize: 12, color: colors.snGreen, align: "center", fontFace: "Arial" });
  
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
  
  // Create all slides in order (matching web presentation)
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
  allSlides.push(createPainPointsSlide(pptx, data, "Current State – Pain Points"));
  
  // 8-11. Strategic Analysis slides (simplified)
  allSlides.push(createSimpleTextSlide(pptx, "Strategic Observation", 
    `${data.basics.accountName} is undergoing significant transformation with an AI-first mandate and platform consolidation imperative.`,
    `Current technology landscape of 700+ applications creates friction in delivering on strategic priorities.`
  ));
  
  allSlides.push(createSimpleTextSlide(pptx, "Strategic Implication", 
    `Without a unified workflow orchestration layer, AI initiatives will remain fragmented and value realization delayed.`,
    `ServiceNow is uniquely positioned to bridge the gap between AI ambition and operational execution.`
  ));
  
  allSlides.push(createSimpleTextSlide(pptx, "Strategic Tension", 
    `Cost discipline imperative vs. need for continued digital investment creates tension in technology decisions.`,
    `Every initiative must demonstrate clear ROI and alignment to strategic priorities.`
  ));
  
  allSlides.push(createSimpleTextSlide(pptx, "Strategic Insight", 
    `The opportunity is not point solutions – it's positioning ServiceNow as the digital execution backbone for ${data.basics.accountName}'s AI-first strategy.`,
    `Platform consolidation drives cost discipline while improving customer experience.`
  ));
  
  // 12. Value Hypothesis
  allSlides.push(createOpportunitiesSlide(pptx, data, "Value Hypothesis"));
  
  // 13. Core Value Drivers (reuse opportunities)
  allSlides.push(createSimpleTextSlide(pptx, "Core Value Drivers", 
    `CRM & Customer Service Modernisation | AI-Led Workflow Operationalisation | Platform Adoption Beyond CRM`,
    `Each value driver is economically meaningful and aligned to ${data.basics.accountName} enterprise priorities.`
  ));
  
  // 14. Big Bets
  allSlides.push(createSimpleTextSlide(pptx, "Big Bets FY26", 
    `1. CRM & Customer Service Modernisation\n2. AI-Led Workflow Operationalisation\n3. Platform Adoption Beyond CRM`,
    `Target: ${data.basics.nextFYAmbition} in FY26 → ${data.basics.threeYearAmbition} by FY28`
  ));
  
  // 15. AI Use Cases
  allSlides.push(createSimpleTextSlide(pptx, "AI Use Cases", 
    `Intelligent Case Routing | Predictive Analytics | Document Processing | Customer Self-Service`,
    `AI-first strategy with ServiceNow as the operationalisation layer.`
  ));
  
  // 16. Automation
  allSlides.push(createSimpleTextSlide(pptx, "Automation Opportunities", 
    `Workflow automation across customer service, IT operations, and employee experience domains.`,
    `Target 5-7% annual productivity improvement through intelligent automation.`
  ));
  
  // 17. Platform
  allSlides.push(createSimpleTextSlide(pptx, "Platform Strategy", 
    `ServiceNow as the unified platform for workflow orchestration across ITSM, CRM, HR, and GRC.`,
    `Platform consolidation reduces complexity and enables AI-first operations.`
  ));
  
  // 18. Roadmap
  allSlides.push(createSimpleTextSlide(pptx, "Roadmap Overview", 
    `Q1: CRM Discovery & Design | Q2: CRM Implementation | Q3: AI Use Cases | Q4: Platform Expansion`,
    `Phased approach aligned with decision deadlines and renewal timing.`
  ));
  
  // 19. Governance
  allSlides.push(createSimpleTextSlide(pptx, "Governance Model", 
    `Executive Steering Committee (Quarterly) | Operational Cadence (Bi-weekly) | Value Tracking (Monthly)`,
    `Clear governance ensures alignment, accountability, and value realisation.`
  ));
  
  // 20. Executive Engagement
  allSlides.push(createEngagementSlide(pptx, data));
  
  // 21. Close Plan
  allSlides.push(createSimpleTextSlide(pptx, "Close Plan", 
    `Decision Timeline: ${data.engagement.decisionDeadlines}\nRenewal: ${data.engagement.renewalRFPTiming}`,
    `Key Actions: Executive alignment, Value demonstration, Commercial negotiation, Contract execution`
  ));
  
  // 22. Success/Thank You
  allSlides.push(createSuccessSlide(pptx, data));
  
  // Add footers to all slides
  allSlides.forEach((slide, i) => {
    addFooter(slide, i + 1, allSlides.length, data.basics.accountName);
  });
  
  // Save the file
  await pptx.writeFile({ fileName: `${data.basics.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan.pptx` });
};
