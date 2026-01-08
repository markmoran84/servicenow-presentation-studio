import pptxgen from "pptxgenjs";

export const exportToPowerPoint = () => {
  const pptx = new pptxgen();
  
  pptx.author = "ServiceNow";
  pptx.title = "Maersk Account Plan FY26";
  pptx.subject = "Strategic Account Plan";
  pptx.layout = "LAYOUT_16x9";
  
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
  
  const addSlideBackground = (slide: pptxgen.Slide) => {
    slide.background = { color: colors.background };
    slide.addShape(pptx.ShapeType.ellipse, { x: -2, y: -2, w: 5, h: 5, fill: { color: colors.snGreen, transparency: 92 }, line: { color: colors.snGreen, transparency: 100 } });
    slide.addShape(pptx.ShapeType.ellipse, { x: 8, y: 3, w: 4, h: 4, fill: { color: colors.navy, transparency: 70 }, line: { color: colors.navy, transparency: 100 } });
  };
  
  const addFooter = (slide: pptxgen.Slide, slideNum: number, totalSlides: number) => {
    slide.addText("ServiceNow | Maersk Account Plan FY26", { x: 0.5, y: 5.1, w: 5, h: 0.3, fontSize: 9, color: colors.muted, fontFace: "Arial" });
    slide.addText(`${slideNum} / ${totalSlides}`, { x: 8.5, y: 5.1, w: 1, h: 0.3, fontSize: 9, color: colors.muted, align: "right", fontFace: "Arial" });
  };
  
  const addGlassCard = (slide: pptxgen.Slide, x: number, y: number, w: number, h: number) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: colors.cardBg, transparency: 30 }, line: { color: colors.border, width: 1, transparency: 50 }, rectRadius: 0.15 });
  };

  // =====================
  // SLIDE 1: Account Team
  // =====================
  const slide1 = pptx.addSlide();
  addSlideBackground(slide1);
  
  slide1.addText("Global Account Team", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Main card
  addGlassCard(slide1, 0.5, 0.9, 7.2, 4);
  slide1.addText("Account Team", { x: 0.7, y: 1.05, w: 4, h: 0.3, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
  slide1.addText("Fully dedicated team of resources assigned to support Maersk as part of ServiceNow's Marquee program", { x: 0.7, y: 1.35, w: 6.8, h: 0.25, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  // Core team - exact data from AccountTeamSlide
  const coreTeam = [
    { name: "Jakob Hjortso", role: "Global Client Director", email: "jakob.hjortso@servicenow.com", phone: "+45 2889 0604", responsibilities: ["Governance and relationship", "Vision and Strategy", "Global team orchestration"] },
    { name: "Manfred Birkhoff", role: "Global Solution Consultant", email: "manfred.birkhoff@servicenow.com", phone: "+49 173 2328903", responsibilities: ["Technology Strategy and Solutions", "Discovery and technical fit"] },
    { name: "Sarah Mitchell", role: "Strategic Account Manager", email: "sarah.mitchell@servicenow.com", phone: "+44 7700 900123", responsibilities: ["Commercial strategy execution", "Stakeholder alignment", "Pipeline development"] },
  ];
  
  coreTeam.forEach((member, i) => {
    const x = 0.7 + (i * 2.2);
    // Role badge (green border)
    slide1.addShape(pptx.ShapeType.roundRect, { x: x + 0.15, y: 1.7, w: 1.7, h: 0.3, fill: { color: colors.background }, line: { color: colors.snGreen, width: 1.5 }, rectRadius: 0.05 });
    slide1.addText(member.role, { x: x + 0.15, y: 1.72, w: 1.7, h: 0.26, fontSize: 6, color: colors.snGreen, align: "center", fontFace: "Arial" });
    // Avatar circle
    slide1.addShape(pptx.ShapeType.ellipse, { x: x + 0.05, y: 2.1, w: 0.55, h: 0.55, fill: { color: colors.snGreen, transparency: 70 }, line: { color: colors.snGreen, width: 1.5 } });
    // Name
    slide1.addText(member.name, { x: x + 0.65, y: 2.15, w: 1.4, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    // Email
    slide1.addText(member.email, { x: x + 0.65, y: 2.35, w: 1.4, h: 0.15, fontSize: 5, color: colors.snGreen, fontFace: "Arial" });
    // Phone
    slide1.addText(member.phone, { x: x + 0.65, y: 2.5, w: 1.4, h: 0.15, fontSize: 5, color: colors.muted, fontFace: "Arial" });
    // Responsibilities
    member.responsibilities.forEach((resp, ri) => {
      slide1.addShape(pptx.ShapeType.ellipse, { x: x + 0.1, y: 2.78 + (ri * 0.18), w: 0.06, h: 0.06, fill: { color: colors.snGreen } });
      slide1.addText(resp, { x: x + 0.2, y: 2.73 + (ri * 0.18), w: 1.8, h: 0.18, fontSize: 5, color: colors.muted, fontFace: "Arial" });
    });
  });
  
  // Connector line for extended team
  slide1.addShape(pptx.ShapeType.line, { x: 0.7, y: 3.55, w: 6.8, h: 0, line: { color: colors.muted, dashType: "dash", width: 0.75, transparency: 60 } });
  slide1.addText("Extended Account Team", { x: 2.5, y: 3.4, w: 2.5, h: 0.3, fontSize: 8, color: colors.muted, align: "center", fontFace: "Arial", fill: { color: colors.background } });
  
  // Extended team - exact data
  const extendedTeam = [
    { name: "Ciara Breslin", role: "Account Executive NA", email: "ciara.breslin@servicenow.com", subTeams: ["Solution sales teams", "Commercial and legal support"] },
    { name: "Markus Maurer", role: "Customer Success Executive EMEA", email: "markus.maurer@servicenow.com" },
    { name: "Fikret Uenlue", role: "Services Account Executive EMEA", email: "fikret.uenlue@servicenow.com", subTeams: ["Expert services, training", "Impact"] },
    { name: "Laura Chen", role: "Solution Consultant APAC", email: "laura.chen@servicenow.com" },
  ];
  
  extendedTeam.forEach((member, i) => {
    const x = 0.7 + (i * 1.7);
    slide1.addShape(pptx.ShapeType.roundRect, { x, y: 3.75, w: 1.6, h: 0.95, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide1.addText(member.role, { x, y: 3.8, w: 1.6, h: 0.2, fontSize: 5, color: colors.snGreen, align: "center", fontFace: "Arial" });
    slide1.addText(member.name, { x, y: 4, w: 1.6, h: 0.2, fontSize: 7, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide1.addText(member.email, { x, y: 4.2, w: 1.6, h: 0.15, fontSize: 4, color: colors.muted, align: "center", fontFace: "Arial" });
    if (member.subTeams) {
      member.subTeams.forEach((team, ti) => {
        slide1.addShape(pptx.ShapeType.roundRect, { x: x + 0.1, y: 4.75 + (ti * 0.22), w: 1.4, h: 0.18, fill: { color: colors.cardBg }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.03 });
        slide1.addText(team, { x: x + 0.1, y: 4.75 + (ti * 0.22), w: 1.4, h: 0.18, fontSize: 5, color: colors.muted, align: "center", fontFace: "Arial" });
      });
    }
  });
  
  // Elevate team sidebar
  addGlassCard(slide1, 7.9, 0.9, 1.8, 4);
  slide1.addText("Elevate Team", { x: 7.9, y: 1.05, w: 1.8, h: 0.25, fontSize: 12, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
  slide1.addText("Extended team of resources who engage with Marquee customers on building roadmaps and business cases.", { x: 8, y: 1.35, w: 1.6, h: 0.6, fontSize: 6, color: colors.muted, align: "center", fontFace: "Arial" });
  
  const elevateTeam = [
    { name: "Matthias Gruen", role: "Value Advisory", email: "matthias.gruen@servicenow.com" },
    { name: "Manoj Patel", role: "Enterprise Architecture", email: "manoj.patel@servicenow.com" },
  ];
  elevateTeam.forEach((member, i) => {
    const y = 2.1 + (i * 1.2);
    slide1.addShape(pptx.ShapeType.ellipse, { x: 8.5, y, w: 0.6, h: 0.6, fill: { color: colors.snGreen, transparency: 80 }, line: { color: colors.snGreen, width: 1.5 } });
    slide1.addText(member.name, { x: 7.9, y: y + 0.65, w: 1.8, h: 0.2, fontSize: 8, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide1.addText(member.role, { x: 7.9, y: y + 0.85, w: 1.8, h: 0.2, fontSize: 7, color: colors.snGreen, align: "center", fontFace: "Arial" });
  });

  // ===========================
  // SLIDE 2: Customer Overview
  // ===========================
  const slide2 = pptx.addSlide();
  addSlideBackground(slide2);
  
  slide2.addText("Customer Overview & Strategy", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Left card - Strategic Direction
  addGlassCard(slide2, 0.5, 0.9, 6.2, 4);
  slide2.addText("Maersk Strategic Direction", { x: 0.7, y: 1.05, w: 5, h: 0.3, fontSize: 14, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("A.P. Møller - Maersk: Global integrator of container logistics", { x: 0.7, y: 1.35, w: 5.8, h: 0.25, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  // Strategic pillars - exact data
  const strategicPillars = [
    { title: "Gemini Network", description: "Network reliability and schedule integrity as competitive differentiator", colorFrom: colors.blue, colorTo: colors.cyan },
    { title: "AI-First Ambition", description: "AI is central to operations, customer experience, and decision-making", colorFrom: colors.snGreen, colorTo: colors.snGreen },
    { title: "Cost Discipline & ROIC", description: "Rigorous cost management with focus on return on invested capital", colorFrom: colors.amber, colorTo: colors.orange },
    { title: "Digital Transformation", description: "Standardisation and modernisation across technology landscape", colorFrom: colors.purple, colorTo: colors.pink },
  ];
  
  strategicPillars.forEach((pillar, i) => {
    const x = 0.7 + ((i % 2) * 3);
    const y = 1.75 + (Math.floor(i / 2) * 1.1);
    slide2.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.9, h: 0.95, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide2.addShape(pptx.ShapeType.roundRect, { x: x + 0.1, y: y + 0.1, w: 0.45, h: 0.45, fill: { color: pillar.colorFrom }, rectRadius: 0.08 });
    slide2.addText(pillar.title, { x: x + 0.65, y: y + 0.1, w: 2.1, h: 0.25, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide2.addText(pillar.description, { x: x + 0.65, y: y + 0.4, w: 2.15, h: 0.45, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // FY25 Context box
  slide2.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 4, w: 5.8, h: 0.75, fill: { color: colors.snGreen, transparency: 90 }, line: { color: colors.snGreen, width: 0.5, transparency: 70 }, rectRadius: 0.1 });
  slide2.addText("FY25 Context", { x: 0.9, y: 4.08, w: 2, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("FY25 focused on stabilisation, trust rebuilding, and platform health. Over-customisation constrained perceived value. CRM modernisation is the primary commercial wedge for FY26.", { x: 0.9, y: 4.32, w: 5.4, h: 0.4, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Right card - Enterprise Priorities
  addGlassCard(slide2, 6.9, 0.9, 2.8, 4);
  slide2.addText("Enterprise Priorities", { x: 7.05, y: 1.05, w: 2.5, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("Operating context aligned to 'All the Way' framework", { x: 7.05, y: 1.32, w: 2.5, h: 0.35, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const keyPriorities = [
    { label: "All the Way", description: "End-to-end integrated logistics from factory to final destination" },
    { label: "Customer Centricity", description: "Commercial agility and superior customer experience" },
    { label: "Operational Excellence", description: "Standardised processes and technology backbone" },
  ];
  
  keyPriorities.forEach((priority, i) => {
    const y = 1.8 + (i * 0.75);
    slide2.addShape(pptx.ShapeType.rect, { x: 7.05, y, w: 0.08, h: 0.6, fill: { color: colors.snGreen } });
    slide2.addShape(pptx.ShapeType.roundRect, { x: 7.18, y, w: 2.35, h: 0.6, fill: { color: colors.navy, transparency: 50 }, line: { color: "transparent" }, rectRadius: 0.08 });
    slide2.addText(priority.label, { x: 7.25, y: y + 0.05, w: 2.2, h: 0.22, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide2.addText(priority.description, { x: 7.25, y: y + 0.28, w: 2.2, h: 0.3, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // ServiceNow Position box
  slide2.addShape(pptx.ShapeType.roundRect, { x: 7.05, y: 4.1, w: 2.5, h: 0.7, fill: { color: colors.snGreen, transparency: 85 }, line: { color: colors.snGreen, width: 0.5, transparency: 60 }, rectRadius: 0.08 });
  slide2.addText("ServiceNow Position", { x: 7.15, y: 4.15, w: 2.3, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
  slide2.addText("Digital execution backbone — not a point solution. Platform to operationalise AI-first strategy.", { x: 7.15, y: 4.38, w: 2.3, h: 0.4, fontSize: 6, color: colors.muted, fontFace: "Arial" });

  // ==============================
  // SLIDE 3: Business Performance
  // ==============================
  const slide3 = pptx.addSlide();
  addSlideBackground(slide3);
  
  slide3.addText("Business Performance", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Left card - Market Context & Financial Position
  addGlassCard(slide3, 0.5, 0.9, 4.7, 4);
  slide3.addText("Market Context & Financial Position", { x: 0.7, y: 1.05, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide3.addText("Maersk operating in a normalising freight environment", { x: 0.7, y: 1.35, w: 4.3, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Market metrics - exact data
  const marketMetrics = [
    { label: "Revenue FY24", value: "$51.1B", change: "-14%", trend: "down", context: "Market normalisation post-pandemic" },
    { label: "EBITDA", value: "$6.8B", change: "-37%", trend: "down", context: "Freight rate compression" },
    { label: "ROIC", value: "8.4%", change: "-12pp", trend: "down", context: "Focus on capital efficiency" },
    { label: "Net Debt", value: "$4.2B", change: "+$2.8B", trend: "neutral", context: "Strategic investments" },
  ];
  
  marketMetrics.forEach((metric, i) => {
    const x = 0.7 + ((i % 2) * 2.2);
    const y = 1.65 + (Math.floor(i / 2) * 1);
    slide3.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.1, h: 0.9, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide3.addText(metric.label, { x: x + 0.1, y: y + 0.08, w: 1.3, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
    slide3.addText(metric.change, { x: x + 1.5, y: y + 0.08, w: 0.5, h: 0.18, fontSize: 7, color: metric.trend === "down" ? colors.red : colors.muted, align: "right", fontFace: "Arial" });
    slide3.addText(metric.value, { x: x + 0.1, y: y + 0.3, w: 1.9, h: 0.3, fontSize: 16, bold: true, color: colors.white, fontFace: "Arial" });
    slide3.addText(metric.context, { x: x + 0.1, y: y + 0.62, w: 1.9, h: 0.2, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Investment Implications box
  slide3.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 3.75, w: 4.3, h: 0.9, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.1 });
  slide3.addText("Investment Implications", { x: 0.9, y: 3.85, w: 3, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
  slide3.addText("Cost discipline drives technology decisions. Every initiative must demonstrate clear ROI and alignment to strategic priorities. Value realisation is non-negotiable.", { x: 0.9, y: 4.1, w: 3.9, h: 0.5, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Right card - Pressures & Growth Levers
  addGlassCard(slide3, 5.4, 0.9, 4.3, 4);
  slide3.addText("Cost, Growth & Efficiency Pressures", { x: 5.6, y: 1.05, w: 4, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide3.addText("Key forces shaping Maersk's technology investment priorities", { x: 5.6, y: 1.35, w: 4, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const pressures = [
    { title: "Cost Pressure", items: ["Fuel cost volatility", "Labour cost increases", "Regulatory compliance costs"], color: colors.amber },
    { title: "Market Challenges", items: ["Freight rate normalisation", "Overcapacity in shipping", "Geopolitical disruption"], color: colors.red },
    { title: "Growth Levers", items: ["Logistics & Services expansion", "Digital product offerings", "Customer experience differentiation"], color: colors.snGreen },
  ];
  
  pressures.forEach((pressure, i) => {
    const y = 1.65 + (i * 1.05);
    slide3.addShape(pptx.ShapeType.roundRect, { x: 5.6, y, w: 3.9, h: 0.95, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide3.addShape(pptx.ShapeType.ellipse, { x: 5.7, y: y + 0.1, w: 0.3, h: 0.3, fill: { color: pressure.color, transparency: 70 } });
    slide3.addText(pressure.title, { x: 6.1, y: y + 0.1, w: 3.2, h: 0.25, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    pressure.items.forEach((item, ii) => {
      slide3.addShape(pptx.ShapeType.ellipse, { x: 5.85, y: y + 0.45 + (ii * 0.18), w: 0.08, h: 0.08, fill: { color: colors.snGreen, transparency: 50 } });
      slide3.addText(item, { x: 6, y: y + 0.42 + (ii * 0.18), w: 3.3, h: 0.18, fontSize: 7, color: colors.muted, fontFace: "Arial" });
    });
  });

  // ==============================
  // SLIDE 4: Strategic Priorities
  // ==============================
  const slide4 = pptx.addSlide();
  addSlideBackground(slide4);
  
  slide4.addText("Strategic Priorities FY26", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Quote banner
  addGlassCard(slide4, 0.5, 0.85, 9.2, 0.55);
  slide4.addText("\"AI-first, with an underlying platform to operationalise it.\" — Each bet is economically meaningful and aligned to Maersk enterprise priorities.", { x: 0.7, y: 0.95, w: 8.8, h: 0.35, fontSize: 8, color: colors.muted, fontFace: "Arial" });
  
  // Big Bets - exact data from StrategicPrioritiesSlide
  const bigBets = [
    { 
      title: "CRM & Customer Service Modernisation", 
      whyNow: "Primary commercial wedge identified. Direct alignment to Maersk's customer experience priority.",
      ifWeLose: "Competitor platforms embed. ServiceNow becomes marginalised to IT operations only.",
      winningLooks: "Production deployment. Measurable CSAT improvement. Executive sponsorship for expansion.",
      alignment: "Customer Centricity • Digital Transformation",
      color: colors.snGreen
    },
    { 
      title: "AI-Led Workflow Operationalisation", 
      whyNow: "Maersk is AI-first. Opportunity to position ServiceNow as the AI operationalisation layer.",
      ifWeLose: "AI initiatives scattered. No enterprise workflow backbone. Value fragmented.",
      winningLooks: "2+ AI use cases live. Workflow automation demonstrably reducing manual effort.",
      alignment: "AI-First Ambition • Operational Excellence",
      color: colors.purple
    },
    { 
      title: "Platform Adoption Beyond CRM", 
      whyNow: "CRM success creates expansion opportunity. IT, HR, and risk workflows are natural adjacencies.",
      ifWeLose: "ServiceNow remains point solution. ACV stagnates. Strategic relevance diminishes.",
      winningLooks: "Expansion pipeline identified. Executive roadmap endorsed. Multi-workflow commitment.",
      alignment: "Cost Discipline • All the Way",
      color: colors.amber
    },
  ];
  
  bigBets.forEach((bet, i) => {
    const y = 1.5 + (i * 1.15);
    addGlassCard(slide4, 0.5, y, 9.2, 1.05);
    
    // Icon box
    slide4.addShape(pptx.ShapeType.roundRect, { x: 0.65, y: y + 0.15, w: 0.55, h: 0.55, fill: { color: bet.color }, rectRadius: 0.1 });
    slide4.addText(`${i + 1}`, { x: 0.65, y: y + 0.2, w: 0.55, h: 0.45, fontSize: 18, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    
    slide4.addText(bet.title, { x: 1.35, y: y + 0.12, w: 5, h: 0.3, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
    slide4.addText(bet.alignment, { x: 6.5, y: y + 0.15, w: 3, h: 0.22, fontSize: 7, color: colors.muted, align: "right", fontFace: "Arial" });
    
    // Three columns: Why Now, If We Lose, Winning in FY26
    const colY = y + 0.45;
    
    // Why Now
    slide4.addShape(pptx.ShapeType.roundRect, { x: 1.35, y: colY, w: 2.65, h: 0.52, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.05 });
    slide4.addText("Why Now", { x: 1.45, y: colY + 0.05, w: 1.5, h: 0.15, fontSize: 7, bold: true, color: colors.snGreen, fontFace: "Arial" });
    slide4.addText(bet.whyNow, { x: 1.45, y: colY + 0.22, w: 2.45, h: 0.28, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    
    // If We Lose
    slide4.addShape(pptx.ShapeType.roundRect, { x: 4.1, y: colY, w: 2.65, h: 0.52, fill: { color: colors.red, transparency: 90 }, line: { color: colors.red, width: 0.5, transparency: 70 }, rectRadius: 0.05 });
    slide4.addText("If We Lose", { x: 4.2, y: colY + 0.05, w: 1.5, h: 0.15, fontSize: 7, bold: true, color: colors.red, fontFace: "Arial" });
    slide4.addText(bet.ifWeLose, { x: 4.2, y: colY + 0.22, w: 2.45, h: 0.28, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    
    // Winning in FY26
    slide4.addShape(pptx.ShapeType.roundRect, { x: 6.85, y: colY, w: 2.65, h: 0.52, fill: { color: colors.snGreen, transparency: 90 }, line: { color: colors.snGreen, width: 0.5, transparency: 70 }, rectRadius: 0.05 });
    slide4.addText("Winning in FY26", { x: 6.95, y: colY + 0.05, w: 1.5, h: 0.15, fontSize: 7, bold: true, color: colors.snGreen, fontFace: "Arial" });
    slide4.addText(bet.winningLooks, { x: 6.95, y: colY + 0.22, w: 2.45, h: 0.28, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });

  // ===================
  // SLIDE 5: Governance
  // ===================
  const slide5 = pptx.addSlide();
  addSlideBackground(slide5);
  
  slide5.addText("Governance Model", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Left card - Execution Governance
  addGlassCard(slide5, 0.5, 0.9, 4.7, 4);
  slide5.addText("Execution Governance", { x: 0.7, y: 1.05, w: 4.3, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide5.addText("How we ensure alignment, accountability, and value realisation", { x: 0.7, y: 1.32, w: 4.3, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  // Governance items - exact data
  const governanceItems = [
    { title: "Executive Steering Committee", frequency: "Quarterly", description: "SVP-level alignment on strategy, investment priorities, and value realisation", participants: ["Maersk CIO/CDO", "ServiceNow GVP", "Account Leadership"] },
    { title: "Operational Cadence", frequency: "Bi-weekly", description: "Execution tracking, blocker resolution, and delivery progress", participants: ["Account Team", "Delivery Leads", "Customer Success"] },
    { title: "Value Tracking", frequency: "Monthly", description: "KPI review, ROI measurement, and business outcome reporting", participants: ["Value Advisory", "Business Stakeholders"] },
  ];
  
  governanceItems.forEach((item, i) => {
    const y = 1.6 + (i * 1.05);
    slide5.addShape(pptx.ShapeType.roundRect, { x: 0.7, y, w: 4.3, h: 0.95, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide5.addShape(pptx.ShapeType.roundRect, { x: 0.85, y: y + 0.1, w: 0.45, h: 0.45, fill: { color: colors.snGreen, transparency: 80 }, rectRadius: 0.08 });
    slide5.addText(item.title, { x: 1.4, y: y + 0.08, w: 2.5, h: 0.22, fontSize: 9, bold: true, color: colors.white, fontFace: "Arial" });
    slide5.addShape(pptx.ShapeType.roundRect, { x: 4, y: y + 0.08, w: 0.85, h: 0.22, fill: { color: colors.snGreen, transparency: 80 }, rectRadius: 0.1 });
    slide5.addText(item.frequency, { x: 4, y: y + 0.08, w: 0.85, h: 0.22, fontSize: 6, color: colors.snGreen, align: "center", fontFace: "Arial" });
    slide5.addText(item.description, { x: 1.4, y: y + 0.33, w: 3.4, h: 0.25, fontSize: 7, color: colors.muted, fontFace: "Arial" });
    const participantText = item.participants.join(" • ");
    slide5.addText(participantText, { x: 1.4, y: y + 0.6, w: 3.4, h: 0.2, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Right card - Prioritisation Framework
  addGlassCard(slide5, 5.4, 0.9, 4.3, 4);
  slide5.addText("Prioritisation Framework", { x: 5.6, y: 1.05, w: 4, h: 0.25, fontSize: 12, bold: true, color: colors.white, fontFace: "Arial" });
  slide5.addText("Decision criteria for initiative selection and resource allocation", { x: 5.6, y: 1.32, w: 4, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const prioritisationFramework = [
    { step: "1", label: "Strategic Alignment", description: "Does it map to Maersk priorities?" },
    { step: "2", label: "Economic Impact", description: "Is the ROI measurable and significant?" },
    { step: "3", label: "Execution Readiness", description: "Can we deliver in the timeframe?" },
    { step: "4", label: "Stakeholder Commitment", description: "Is executive sponsorship secured?" },
  ];
  
  prioritisationFramework.forEach((item, i) => {
    const y = 1.6 + (i * 0.65);
    slide5.addShape(pptx.ShapeType.ellipse, { x: 5.7, y, w: 0.45, h: 0.45, fill: { color: colors.snGreen }, rectRadius: 0.5 });
    slide5.addText(item.step, { x: 5.7, y: y + 0.05, w: 0.45, h: 0.35, fontSize: 14, bold: true, color: colors.white, align: "center", fontFace: "Arial" });
    slide5.addShape(pptx.ShapeType.roundRect, { x: 6.25, y, w: 3.25, h: 0.5, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide5.addText(item.label, { x: 6.35, y: y + 0.05, w: 3, h: 0.2, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide5.addText(item.description, { x: 6.35, y: y + 0.27, w: 3, h: 0.2, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  });
  
  // Governance Principle box
  slide5.addShape(pptx.ShapeType.roundRect, { x: 5.6, y: 4.25, w: 3.9, h: 0.55, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
  slide5.addText("Governance Principle", { x: 5.75, y: 4.3, w: 3, h: 0.18, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
  slide5.addText("All initiatives must pass this framework. No investment without clear strategic alignment and measurable business outcome. Value over activity.", { x: 5.75, y: 4.5, w: 3.6, h: 0.28, fontSize: 6, color: colors.muted, fontFace: "Arial" });

  // ======================
  // SLIDE 6: Marketing Plan
  // ======================
  const slide6 = pptx.addSlide();
  addSlideBackground(slide6);
  
  slide6.addText("Marketing Plan", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 28, bold: true, color: colors.white, fontFace: "Arial" });
  
  // Three column layout
  // Column 1: Executive Engagement
  addGlassCard(slide6, 0.5, 0.9, 3, 4);
  slide6.addText("Executive Engagement", { x: 0.65, y: 1.05, w: 2.7, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  slide6.addText("Structured touchpoints with Maersk leadership", { x: 0.65, y: 1.3, w: 2.7, h: 0.25, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const executiveEngagements = [
    { title: "CIO/CDO Strategic Sessions", frequency: "Quarterly", objective: "Reinforce ServiceNow as digital execution backbone", format: "1:1 executive dialogue" },
    { title: "Innovation Showcase", frequency: "Bi-annual", objective: "Demonstrate AI and workflow capabilities", format: "Technical deep-dive with demos" },
    { title: "Peer Benchmarking", frequency: "Annual", objective: "Connect Maersk with ServiceNow marquee customers", format: "Executive roundtable" },
  ];
  
  executiveEngagements.forEach((eng, i) => {
    const y = 1.65 + (i * 0.85);
    slide6.addShape(pptx.ShapeType.roundRect, { x: 0.65, y, w: 2.7, h: 0.75, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide6.addText(eng.title, { x: 0.75, y: y + 0.05, w: 1.8, h: 0.18, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide6.addShape(pptx.ShapeType.roundRect, { x: 2.55, y: y + 0.05, w: 0.7, h: 0.18, fill: { color: colors.snGreen, transparency: 80 }, rectRadius: 0.08 });
    slide6.addText(eng.frequency, { x: 2.55, y: y + 0.05, w: 0.7, h: 0.18, fontSize: 5, color: colors.snGreen, align: "center", fontFace: "Arial" });
    slide6.addText(eng.objective, { x: 0.75, y: y + 0.28, w: 2.5, h: 0.22, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    slide6.addText(eng.format, { x: 0.75, y: y + 0.52, w: 2.5, h: 0.18, fontSize: 6, color: colors.muted, fontFace: "Arial" });
  });
  
  // Column 2: Thought Leadership
  addGlassCard(slide6, 3.65, 0.9, 3, 4);
  slide6.addText("Thought Leadership", { x: 3.8, y: 1.05, w: 2.7, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  slide6.addText("Content and assets to reinforce positioning", { x: 3.8, y: 1.3, w: 2.7, h: 0.25, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const thoughtLeadership = [
    { title: "AI in Logistics Operations", narrative: "How workflow automation operationalises AI strategy", deliverable: "Executive brief + use case library" },
    { title: "CRM Modernisation Playbook", narrative: "Customer service transformation in global logistics", deliverable: "Reference architecture + ROI framework" },
    { title: "Platform Value Realisation", narrative: "From point solution to enterprise backbone", deliverable: "Value story + expansion roadmap" },
  ];
  
  thoughtLeadership.forEach((item, i) => {
    const y = 1.65 + (i * 0.85);
    slide6.addShape(pptx.ShapeType.roundRect, { x: 3.8, y, w: 2.7, h: 0.75, fill: { color: colors.cardBg, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
    slide6.addShape(pptx.ShapeType.roundRect, { x: 3.9, y: y + 0.1, w: 0.35, h: 0.35, fill: { color: colors.snGreen, transparency: 80 }, rectRadius: 0.06 });
    slide6.addText(item.title, { x: 4.35, y: y + 0.08, w: 2, h: 0.18, fontSize: 8, bold: true, color: colors.white, fontFace: "Arial" });
    slide6.addText(item.narrative, { x: 4.35, y: y + 0.28, w: 2, h: 0.22, fontSize: 6, color: colors.muted, fontFace: "Arial" });
    slide6.addText(item.deliverable, { x: 4.35, y: y + 0.52, w: 2, h: 0.18, fontSize: 6, color: colors.snGreen, fontFace: "Arial" });
  });
  
  // Column 3: Strategic Narratives
  addGlassCard(slide6, 6.8, 0.9, 2.9, 4);
  slide6.addText("Strategic Narratives", { x: 6.95, y: 1.05, w: 2.6, h: 0.25, fontSize: 11, bold: true, color: colors.white, fontFace: "Arial" });
  slide6.addText("Core messages for all Maersk communications", { x: 6.95, y: 1.3, w: 2.6, h: 0.25, fontSize: 7, color: colors.muted, fontFace: "Arial" });
  
  const strategicNarratives = [
    "ServiceNow enables Maersk's AI-first ambition by providing the workflow layer to operationalise intelligence",
    "CRM modernisation is the entry point to enterprise-wide digital transformation",
    "Platform consolidation drives cost discipline while improving customer experience",
  ];
  
  strategicNarratives.forEach((narrative, i) => {
    const y = 1.65 + (i * 0.8);
    slide6.addShape(pptx.ShapeType.rect, { x: 6.95, y, w: 0.08, h: 0.7, fill: { color: colors.snGreen } });
    slide6.addShape(pptx.ShapeType.roundRect, { x: 7.08, y, w: 2.45, h: 0.7, fill: { color: colors.snGreen, transparency: 90 }, line: { color: "transparent" }, rectRadius: 0.08 });
    slide6.addText(narrative, { x: 7.15, y: y + 0.08, w: 2.3, h: 0.55, fontSize: 7, color: colors.white, fontFace: "Arial" });
  });
  
  // Tone & Voice box
  slide6.addShape(pptx.ShapeType.roundRect, { x: 6.95, y: 4.15, w: 2.55, h: 0.6, fill: { color: colors.navy, transparency: 50 }, line: { color: colors.border, width: 0.5 }, rectRadius: 0.08 });
  slide6.addText("Tone & Voice", { x: 7.05, y: 4.2, w: 2.3, h: 0.18, fontSize: 7, bold: true, color: colors.white, fontFace: "Arial" });
  slide6.addText("SVP / Board-ready. Clear, calm, confident. Outcomes over activities. Value over features.", { x: 7.05, y: 4.4, w: 2.35, h: 0.32, fontSize: 6, color: colors.muted, fontFace: "Arial" });

  // Add footers to all slides
  const allSlides = [slide1, slide2, slide3, slide4, slide5, slide6];
  allSlides.forEach((slide, i) => addFooter(slide, i + 1, allSlides.length));

  // Save the file
  pptx.writeFile({ fileName: "Maersk_Account_Plan_FY26.pptx" });
};
