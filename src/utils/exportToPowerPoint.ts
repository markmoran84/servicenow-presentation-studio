import pptxgen from "pptxgenjs";

export const exportToPowerPoint = () => {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = "ServiceNow";
  pptx.title = "Maersk Account Plan FY26";
  pptx.subject = "Strategic Account Plan";
  pptx.layout = "LAYOUT_16x9";
  
  // ServiceNow Brand Colors (matching index.css)
  const colors = {
    background: "0D2235", // Dark teal (hsl 198 60% 12%)
    cardBg: "143A4F", // Card background (hsl 198 50% 18%)
    snGreen: "81B847", // ServiceNow Green (hsl 86 52% 47%)
    snGreenLight: "93C35C", // Lighter green
    white: "FFFFFF",
    muted: "8BA3B5", // Muted foreground
    border: "2A4A5E", // Border color
    navy: "1A3246", // Navy accent
    red: "EF4444",
    amber: "F59E0B",
    purple: "A855F7",
  };
  
  // Master slide background style
  const addSlideBackground = (slide: pptxgen.Slide) => {
    slide.background = { color: colors.background };
    // Add decorative gradient overlay effect
    slide.addShape(pptx.ShapeType.ellipse, {
      x: -2, y: -2, w: 5, h: 5,
      fill: { color: colors.snGreen, transparency: 92 },
      line: { color: colors.snGreen, transparency: 100 }
    });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 8, y: 3, w: 4, h: 4,
      fill: { color: colors.navy, transparency: 70 },
      line: { color: colors.navy, transparency: 100 }
    });
  };
  
  // Add footer to a slide
  const addFooter = (slide: pptxgen.Slide, slideNum: number, totalSlides: number) => {
    slide.addText("ServiceNow | Maersk Account Plan FY26", { 
      x: 0.5, y: 5.1, w: 5, h: 0.3, 
      fontSize: 9, color: colors.muted, fontFace: "Arial"
    });
    slide.addText(`${slideNum} / ${totalSlides}`, { 
      x: 8.5, y: 5.1, w: 1, h: 0.3, 
      fontSize: 9, color: colors.muted, align: "right", fontFace: "Arial"
    });
  };
  
  // Glass card style helper
  const addGlassCard = (slide: pptxgen.Slide, x: number, y: number, w: number, h: number) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: colors.cardBg, transparency: 30 },
      line: { color: colors.border, width: 1, transparency: 50 },
      rectRadius: 0.15
    });
  };
  
  // Team member card helper
  const addTeamCard = (slide: pptxgen.Slide, x: number, y: number, w: number, name: string, role: string, details: string[]) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h: 1.4,
      fill: { color: colors.cardBg, transparency: 50 },
      line: { color: colors.border, width: 0.5, transparency: 50 },
      rectRadius: 0.1
    });
    // Avatar circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + (w/2) - 0.25, y: y + 0.1, w: 0.5, h: 0.5,
      fill: { color: colors.snGreen, transparency: 70 },
      line: { color: colors.snGreen, width: 1 }
    });
    slide.addText(name, { x, y: y + 0.65, w, h: 0.25, fontSize: 10, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide.addText(role, { x, y: y + 0.9, w, h: 0.2, fontSize: 8, color: colors.snGreen, align: "center", fontFace: "Arial" });
    if (details.length > 0) {
      slide.addText(details[0], { x, y: y + 1.1, w, h: 0.2, fontSize: 7, color: colors.muted, align: "center", fontFace: "Arial" });
    }
  };

  // =====================
  // SLIDE 1: Account Team
  // =====================
  const slide1 = pptx.addSlide();
  addSlideBackground(slide1);
  
  slide1.addText("Global Account Team", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Main card area
  addGlassCard(slide1, 0.5, 1, 7.2, 4);
  
  slide1.addText("Account Team", { x: 0.7, y: 1.15, w: 4, h: 0.35, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
  slide1.addText("Fully dedicated team assigned to support Maersk as part of ServiceNow's Marquee program", { 
    x: 0.7, y: 1.5, w: 6.5, h: 0.3, fontSize: 9, color: colors.muted, fontFace: "Arial" 
  });
  
  // Core team members
  const coreTeam = [
    { name: "Jakob Hjortso", role: "Global Client Director", detail: "Governance & Strategy" },
    { name: "Manfred Birkhoff", role: "Global Solution Consultant", detail: "Tech Strategy & Solutions" },
    { name: "Sarah Mitchell", role: "Strategic Account Manager", detail: "Commercial Execution" },
  ];
  coreTeam.forEach((member, i) => {
    addTeamCard(slide1, 0.7 + (i * 2.25), 1.9, 2.1, member.name, member.role, [member.detail]);
  });
  
  // Connector line
  slide1.addShape(pptx.ShapeType.line, { x: 0.7, y: 3.5, w: 6.8, h: 0, line: { color: colors.muted, dashType: "dash", width: 1, transparency: 60 } });
  slide1.addText("Extended Account Team", { x: 2.5, y: 3.35, w: 2.5, h: 0.3, fontSize: 9, color: colors.muted, align: "center", fontFace: "Arial", fill: { color: colors.background } });
  
  // Extended team
  const extendedTeam = [
    { name: "Ciara Breslin", role: "Account Executive NA" },
    { name: "Markus Maurer", role: "Customer Success EMEA" },
    { name: "Fikret Uenlue", role: "Services Account Exec" },
    { name: "Laura Chen", role: "Solution Consultant APAC" },
  ];
  extendedTeam.forEach((member, i) => {
    const x = 0.7 + (i * 1.7);
    slide1.addShape(pptx.ShapeType.roundRect, { x, y: 3.7, w: 1.6, h: 1, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide1.addText(member.name, { x, y: 3.8, w: 1.6, h: 0.3, fontSize: 8, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide1.addText(member.role, { x, y: 4.1, w: 1.6, h: 0.25, fontSize: 7, color: colors.muted, align: "center", fontFace: "Arial" });
  });
  
  // Elevate team sidebar
  addGlassCard(slide1, 7.9, 1, 1.8, 4);
  slide1.addText("Elevate Team", { x: 7.9, y: 1.15, w: 1.8, h: 0.3, fontSize: 12, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
  slide1.addText("Extended resources for roadmaps & business cases", { x: 8, y: 1.45, w: 1.6, h: 0.5, fontSize: 7, color: colors.muted, align: "center", fontFace: "Arial" });
  
  const elevateTeam = [{ name: "Matthias Gruen", role: "Value Advisory" }, { name: "Manoj Patel", role: "Enterprise Architecture" }];
  elevateTeam.forEach((member, i) => {
    const y = 2.1 + (i * 1);
    slide1.addShape(pptx.ShapeType.ellipse, { x: 8.5, y, w: 0.6, h: 0.6, fill: { color: colors.snGreen, transparency: 80 }, line: { color: colors.snGreen, width: 1 } });
    slide1.addText(member.name, { x: 7.9, y: y + 0.65, w: 1.8, h: 0.2, fontSize: 8, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide1.addText(member.role, { x: 7.9, y: y + 0.85, w: 1.8, h: 0.2, fontSize: 7, color: colors.snGreen, align: "center", fontFace: "Arial" });
  });

  // ===========================
  // SLIDE 2: Customer Overview
  // ===========================
  const slide2 = pptx.addSlide();
  addSlideBackground(slide2);
  
  slide2.addText("Customer Overview & Strategy", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("Maersk strategic direction and enterprise priorities", { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 12, color: colors.muted, fontFace: "Arial" });
  
  // Strategic Direction Card
  addGlassCard(slide2, 0.5, 1.3, 4.5, 3.6);
  slide2.addText("Strategic Direction", { x: 0.7, y: 1.45, w: 4, h: 0.35, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("Maersk's \"All the Way\" strategy positions them as an integrated logistics provider, moving beyond container shipping to end-to-end supply chain solutions.", { 
    x: 0.7, y: 1.85, w: 4.1, h: 0.7, fontSize: 10, color: colors.muted, fontFace: "Arial" 
  });
  
  slide2.addText("Enterprise Priorities", { x: 0.7, y: 2.6, w: 4, h: 0.3, fontSize: 12, bold: true, color: colors.snGreen, fontFace: "Arial" });
  const priorities = ["AI-First Ambition", "Cost Discipline & ROIC Focus", "Network Reliability (Gemini)", "Digital Standardisation"];
  priorities.forEach((p, i) => {
    slide2.addShape(pptx.ShapeType.ellipse, { x: 0.8, y: 2.95 + (i * 0.4), w: 0.15, h: 0.15, fill: { color: colors.snGreen } });
    slide2.addText(p, { x: 1.05, y: 2.9 + (i * 0.4), w: 3.8, h: 0.3, fontSize: 10, color: colors.white, fontFace: "Arial" });
  });

  // FY25 Context Card
  addGlassCard(slide2, 5.2, 1.3, 4.3, 3.6);
  slide2.addText("FY25 Context", { x: 5.4, y: 1.45, w: 4, h: 0.35, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
  
  const fy25Points = [
    { title: "Stabilisation Phase", desc: "Trust rebuilding and platform health improvements" },
    { title: "Over-Customisation", desc: "Constrained perceived platform value" },
    { title: "CRM as Wedge", desc: "Primary commercial opportunity identified" },
    { title: "AI-First Mandate", desc: "Central to strategy, not additive" },
  ];
  fy25Points.forEach((point, i) => {
    const y = 1.9 + (i * 0.75);
    slide2.addText(point.title, { x: 5.4, y, w: 4, h: 0.25, fontSize: 10, bold: true, color: colors.white, fontFace: "Arial" });
    slide2.addText(point.desc, { x: 5.4, y: y + 0.25, w: 4, h: 0.25, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });

  // ==============================
  // SLIDE 3: Business Performance
  // ==============================
  const slide3 = pptx.addSlide();
  addSlideBackground(slide3);
  
  slide3.addText("Business Performance", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  slide3.addText("Market context and financial position", { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 12, color: colors.muted, fontFace: "Arial" });
  
  // Market Context
  addGlassCard(slide3, 0.5, 1.3, 4.5, 2.2);
  slide3.addText("Market Context", { x: 0.7, y: 1.45, w: 4, h: 0.35, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
  const marketPoints = ["Global supply chain volatility", "Container shipping overcapacity pressures", "Digital disruption across logistics", "Intensifying sustainability requirements"];
  marketPoints.forEach((p, i) => {
    slide3.addShape(pptx.ShapeType.ellipse, { x: 0.8, y: 1.95 + (i * 0.35), w: 0.12, h: 0.12, fill: { color: colors.snGreen } });
    slide3.addText(p, { x: 1.0, y: 1.9 + (i * 0.35), w: 3.8, h: 0.3, fontSize: 10, color: colors.white, fontFace: "Arial" });
  });
  
  // Financial Position
  addGlassCard(slide3, 5.2, 1.3, 4.3, 2.2);
  slide3.addText("Financial Position", { x: 5.4, y: 1.45, w: 4, h: 0.35, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
  const financialPoints = ["Cost efficiency imperative", "ROIC improvement targets", "Technology debt reduction", "Operational standardisation focus"];
  financialPoints.forEach((p, i) => {
    slide3.addShape(pptx.ShapeType.ellipse, { x: 5.5, y: 1.95 + (i * 0.35), w: 0.12, h: 0.12, fill: { color: colors.snGreen } });
    slide3.addText(p, { x: 5.7, y: 1.9 + (i * 0.35), w: 3.8, h: 0.3, fontSize: 10, color: colors.white, fontFace: "Arial" });
  });
  
  // Opportunities
  addGlassCard(slide3, 0.5, 3.7, 9, 1.2);
  slide3.addText("Key Opportunities", { x: 0.7, y: 3.85, w: 4, h: 0.3, fontSize: 14, bold: true, color: colors.snGreen, fontFace: "Arial" });
  const opportunities = [
    "Platform consolidation driving efficiency",
    "AI automation reducing manual workloads", 
    "Customer experience differentiation"
  ];
  opportunities.forEach((p, i) => {
    slide3.addText(`${i + 1}. ${p}`, { x: 0.7 + (i * 2.9), y: 4.25, w: 2.8, h: 0.4, fontSize: 9, color: colors.white, fontFace: "Arial" });
  });

  // ==============================
  // SLIDE 4: Strategic Priorities
  // ==============================
  const slide4 = pptx.addSlide();
  addSlideBackground(slide4);
  
  slide4.addText("Strategic Priorities FY26", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Quote banner
  addGlassCard(slide4, 0.5, 0.95, 9, 0.6);
  slide4.addText("\"AI-first, with an underlying platform to operationalise it.\"", { 
    x: 0.7, y: 1.05, w: 8.5, h: 0.4, fontSize: 11, italic: true, color: colors.muted, fontFace: "Arial" 
  });
  
  const bigBets = [
    { title: "CRM & Customer Service Modernisation", why: "Primary commercial wedge. Direct alignment to customer experience priority.", lose: "Competitor platforms embed. ServiceNow marginalised to IT ops.", win: "Production deployment. Measurable CSAT improvement.", color: colors.snGreen },
    { title: "AI-Led Workflow Operationalisation", why: "Maersk is AI-first. Opportunity to be the AI operationalisation layer.", lose: "AI initiatives scattered. No enterprise workflow backbone.", win: "2+ AI use cases live. Workflow automation reducing effort.", color: colors.purple },
    { title: "Platform Adoption Beyond CRM", why: "CRM success creates expansion. IT, HR, risk are adjacencies.", lose: "ServiceNow remains point solution. ACV stagnates.", win: "Expansion pipeline identified. Multi-workflow commitment.", color: colors.amber },
  ];
  
  bigBets.forEach((bet, i) => {
    const y = 1.7 + (i * 1.1);
    addGlassCard(slide4, 0.5, y, 9, 1);
    
    // Number badge
    slide4.addShape(pptx.ShapeType.roundRect, { x: 0.65, y: y + 0.15, w: 0.5, h: 0.5, fill: { color: bet.color }, rectRadius: 0.1 });
    slide4.addText(`${i + 1}`, { x: 0.65, y: y + 0.2, w: 0.5, h: 0.4, fontSize: 16, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    
    slide4.addText(bet.title, { x: 1.3, y: y + 0.15, w: 5, h: 0.35, fontSize: 13, bold: true, color: colors.white, fontFace: "Arial" });
    
    // Three columns
    const colY = y + 0.55;
    slide4.addText("Why Now", { x: 1.3, y: colY, w: 2.5, h: 0.2, fontSize: 8, bold: true, color: colors.snGreen, fontFace: "Arial" });
    slide4.addText(bet.why, { x: 1.3, y: colY + 0.2, w: 2.5, h: 0.3, fontSize: 7, color: colors.muted, fontFace: "Arial" });
    
    slide4.addText("If We Lose", { x: 4, y: colY, w: 2.5, h: 0.2, fontSize: 8, bold: true, color: colors.red, fontFace: "Arial" });
    slide4.addText(bet.lose, { x: 4, y: colY + 0.2, w: 2.5, h: 0.3, fontSize: 7, color: colors.muted, fontFace: "Arial" });
    
    slide4.addText("Winning in FY26", { x: 6.7, y: colY, w: 2.6, h: 0.2, fontSize: 8, bold: true, color: colors.snGreen, fontFace: "Arial" });
    slide4.addText(bet.win, { x: 6.7, y: colY + 0.2, w: 2.6, h: 0.3, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });

  // ===================
  // SLIDE 5: Governance
  // ===================
  const slide5 = pptx.addSlide();
  addSlideBackground(slide5);
  
  slide5.addText("Governance Model", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  slide5.addText("Execution, prioritisation, and value tracking", { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 12, color: colors.muted, fontFace: "Arial" });
  
  // Governance framework
  addGlassCard(slide5, 0.5, 1.3, 9, 2.5);
  slide5.addText("Governance Framework", { x: 0.7, y: 1.45, w: 4, h: 0.35, fontSize: 14, bold: true, color: colors.snGreen, fontFace: "Arial" });
  
  const governance = [
    { title: "Executive Steering", freq: "Quarterly", desc: "Strategic alignment, investment decisions, executive sponsorship", icon: "Q" },
    { title: "Delivery Review", freq: "Monthly", desc: "Implementation progress, blocker resolution, milestone tracking", icon: "M" },
    { title: "Value Tracking", freq: "Ongoing", desc: "Business outcome measurement, ROI validation, success metrics", icon: "O" },
  ];
  
  governance.forEach((item, i) => {
    const x = 0.7 + (i * 2.9);
    slide5.addShape(pptx.ShapeType.roundRect, { x, y: 1.95, w: 2.7, h: 1.6, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.1 });
    slide5.addShape(pptx.ShapeType.roundRect, { x: x + 1, y: 2.05, w: 0.6, h: 0.6, fill: { color: colors.snGreen }, rectRadius: 0.3 });
    slide5.addText(item.icon, { x: x + 1, y: 2.1, w: 0.6, h: 0.5, fontSize: 18, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide5.addText(item.title, { x, y: 2.7, w: 2.7, h: 0.3, fontSize: 11, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide5.addText(item.freq, { x, y: 2.95, w: 2.7, h: 0.25, fontSize: 9, color: colors.snGreen, align: "center", fontFace: "Arial" });
    slide5.addText(item.desc, { x: x + 0.1, y: 3.2, w: 2.5, h: 0.4, fontSize: 8, color: colors.muted, align: "center", fontFace: "Arial" });
  });
  
  // Prioritisation
  addGlassCard(slide5, 0.5, 4, 9, 0.9);
  slide5.addText("Prioritisation Principles", { x: 0.7, y: 4.15, w: 4, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  const principles = ["Value-driven sequencing", "Executive-endorsed roadmap", "Measurable outcomes focus"];
  principles.forEach((p, i) => {
    slide5.addShape(pptx.ShapeType.rect, { x: 0.8 + (i * 2.9), y: 4.5, w: 0.1, h: 0.1, fill: { color: colors.snGreen } });
    slide5.addText(p, { x: 1 + (i * 2.9), y: 4.45, w: 2.6, h: 0.3, fontSize: 9, color: colors.muted, fontFace: "Arial" });
  });

  // ======================
  // SLIDE 6: Marketing Plan
  // ======================
  const slide6 = pptx.addSlide();
  addSlideBackground(slide6);
  
  slide6.addText("Marketing Plan", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, fontFace: "Arial" });
  slide6.addText("Executive engagement and thought leadership", { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 12, color: colors.muted, fontFace: "Arial" });
  
  // Executive Engagement
  addGlassCard(slide6, 0.5, 1.3, 4.5, 2.2);
  slide6.addText("Executive Engagement", { x: 0.7, y: 1.45, w: 4, h: 0.35, fontSize: 14, bold: true, color: colors.snGreen, fontFace: "Arial" });
  const engagement = ["C-Suite relationship building", "Innovation workshops", "Peer networking events", "Executive briefing visits"];
  engagement.forEach((p, i) => {
    slide6.addShape(pptx.ShapeType.ellipse, { x: 0.8, y: 1.95 + (i * 0.35), w: 0.12, h: 0.12, fill: { color: colors.snGreen } });
    slide6.addText(p, { x: 1.0, y: 1.9 + (i * 0.35), w: 3.8, h: 0.3, fontSize: 10, color: colors.white, fontFace: "Arial" });
  });
  
  // Strategic Narratives
  addGlassCard(slide6, 5.2, 1.3, 4.3, 2.2);
  slide6.addText("Strategic Narratives", { x: 5.4, y: 1.45, w: 4, h: 0.35, fontSize: 14, bold: true, color: colors.snGreen, fontFace: "Arial" });
  const narratives = ["AI as operational backbone", "Platform consolidation value", "Customer experience transformation", "Cost-to-serve optimisation"];
  narratives.forEach((p, i) => {
    slide6.addShape(pptx.ShapeType.ellipse, { x: 5.5, y: 1.95 + (i * 0.35), w: 0.12, h: 0.12, fill: { color: colors.snGreen } });
    slide6.addText(p, { x: 5.7, y: 1.9 + (i * 0.35), w: 3.8, h: 0.3, fontSize: 10, color: colors.white, fontFace: "Arial" });
  });
  
  // Thought Leadership
  addGlassCard(slide6, 0.5, 3.7, 9, 1.2);
  slide6.addText("Thought Leadership", { x: 0.7, y: 3.85, w: 4, h: 0.3, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
  const thought = [
    { title: "Industry Events", desc: "Speaking opportunities at logistics conferences" },
    { title: "Content Strategy", desc: "Case studies and success stories" },
    { title: "Knowledge Exchange", desc: "Best practice sharing with peer accounts" },
  ];
  thought.forEach((item, i) => {
    const x = 0.7 + (i * 2.9);
    slide6.addText(item.title, { x, y: 4.2, w: 2.7, h: 0.25, fontSize: 10, bold: true, color: colors.snGreen, fontFace: "Arial" });
    slide6.addText(item.desc, { x, y: 4.45, w: 2.7, h: 0.35, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  });

  // Add footers to all slides
  const allSlides = [slide1, slide2, slide3, slide4, slide5, slide6];
  allSlides.forEach((slide, i) => addFooter(slide, i + 1, allSlides.length));

  // Save the file
  pptx.writeFile({ fileName: "Maersk_Account_Plan_FY26.pptx" });
};
