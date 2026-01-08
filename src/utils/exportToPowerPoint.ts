import pptxgen from "pptxgenjs";

export const exportToPowerPoint = () => {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = "ServiceNow";
  pptx.title = "Maersk Account Plan FY26";
  pptx.subject = "Strategic Account Plan";
  
  // Define colors
  const navyBlue = "0A1628";
  const green = "2ECC71";
  const white = "FFFFFF";
  const lightGray = "E5E7EB";
  
  // Slide 1: Account Team
  const slide1 = pptx.addSlide();
  slide1.addText("Account Team", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide1.addText("Your dedicated ServiceNow partnership team", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  slide1.addText("Global Account Team", { x: 0.5, y: 1.5, w: 9, h: 0.4, fontSize: 18, bold: true, color: navyBlue });
  
  const coreTeam = [
    { name: "James Anderson", role: "Global Account Executive", focus: "Executive Relationships & Strategy" },
    { name: "Sarah Mitchell", role: "Strategic Account Manager", focus: "Account Growth & Partnerships" },
    { name: "Michael Chen", role: "Solution Consultant", focus: "Technical Architecture & Value" },
  ];
  
  coreTeam.forEach((member, i) => {
    const x = 0.5 + (i * 3.1);
    slide1.addShape(pptx.ShapeType.roundRect, { x, y: 2, w: 2.9, h: 1.2, fill: { color: "F3F4F6" }, line: { color: lightGray } });
    slide1.addText(member.name, { x, y: 2.1, w: 2.9, h: 0.3, fontSize: 11, bold: true, color: navyBlue, align: "center" });
    slide1.addText(member.role, { x, y: 2.4, w: 2.9, h: 0.25, fontSize: 9, color: green, align: "center" });
    slide1.addText(member.focus, { x, y: 2.7, w: 2.9, h: 0.3, fontSize: 8, color: "6B7280", align: "center" });
  });
  
  slide1.addText("Extended Account Team", { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 18, bold: true, color: navyBlue });
  
  const extendedTeam = [
    { name: "Emma Williams", role: "Customer Success", region: "EMEA" },
    { name: "David Lee", role: "Technical Architect", region: "APAC" },
    { name: "Anna Schmidt", role: "Partner Manager", region: "Americas" },
    { name: "Laura Chen", role: "Solutions Engineer", region: "Global" },
  ];
  
  extendedTeam.forEach((member, i) => {
    const x = 0.5 + (i * 2.35);
    slide1.addShape(pptx.ShapeType.roundRect, { x, y: 4, w: 2.2, h: 1, fill: { color: "F9FAFB" }, line: { color: lightGray } });
    slide1.addText(member.name, { x, y: 4.1, w: 2.2, h: 0.25, fontSize: 10, bold: true, color: navyBlue, align: "center" });
    slide1.addText(member.role, { x, y: 4.35, w: 2.2, h: 0.2, fontSize: 8, color: "6B7280", align: "center" });
    slide1.addText(member.region, { x, y: 4.55, w: 2.2, h: 0.2, fontSize: 8, color: green, align: "center" });
  });

  // Slide 2: Customer Overview
  const slide2 = pptx.addSlide();
  slide2.addText("Customer Overview & Strategy", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide2.addText("Maersk strategic direction and enterprise priorities", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  slide2.addText("Strategic Direction", { x: 0.5, y: 1.5, w: 4, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  slide2.addText("Maersk's \"All the Way\" strategy positions them as an integrated logistics provider.", { x: 0.5, y: 1.9, w: 4.3, h: 0.8, fontSize: 10, color: "374151" });
  
  const priorities = ["AI-First Ambition", "Cost Discipline & ROIC", "Network Reliability (Gemini)", "Digital Standardisation"];
  priorities.forEach((p, i) => {
    slide2.addText(`• ${p}`, { x: 0.5, y: 2.8 + (i * 0.35), w: 4, h: 0.3, fontSize: 10, color: "374151" });
  });

  slide2.addText("FY25 Context", { x: 5, y: 1.5, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  const fy25Points = [
    "Stabilisation and trust rebuilding",
    "Platform health improvements",
    "Over-customisation constrained value",
    "CRM modernisation as primary wedge",
  ];
  fy25Points.forEach((p, i) => {
    slide2.addText(`• ${p}`, { x: 5, y: 1.9 + (i * 0.35), w: 4.5, h: 0.3, fontSize: 10, color: "374151" });
  });

  // Slide 3: Business Performance
  const slide3 = pptx.addSlide();
  slide3.addText("Business Performance", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide3.addText("Market context and financial position", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  slide3.addText("Market Context", { x: 0.5, y: 1.5, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  const marketPoints = [
    "Global supply chain volatility",
    "Container shipping overcapacity",
    "Digital disruption pressure",
    "Sustainability requirements",
  ];
  marketPoints.forEach((p, i) => {
    slide3.addText(`• ${p}`, { x: 0.5, y: 1.9 + (i * 0.35), w: 4, h: 0.3, fontSize: 10, color: "374151" });
  });

  slide3.addText("Key Pressures", { x: 5, y: 1.5, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  const pressures = [
    "Cost efficiency imperative",
    "ROIC improvement targets",
    "Technology debt reduction",
    "Operational standardisation",
  ];
  pressures.forEach((p, i) => {
    slide3.addText(`• ${p}`, { x: 5, y: 1.9 + (i * 0.35), w: 4.5, h: 0.3, fontSize: 10, color: "374151" });
  });

  // Slide 4: Strategic Priorities
  const slide4 = pptx.addSlide();
  slide4.addText("Strategic Priorities 2026", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide4.addText("Must-Win Battles for FY26", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  const battles = [
    { title: "CRM & Customer Service Modernisation", why: "Foundation for commercial agility" },
    { title: "AI-Led Workflow Operationalisation", why: "AI-first with platform backbone" },
    { title: "Enterprise Platform Adoption", why: "Scale beyond CRM across operations" },
  ];
  
  battles.forEach((battle, i) => {
    const y = 1.5 + (i * 1.3);
    slide4.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 9, h: 1.1, fill: { color: "F9FAFB" }, line: { color: lightGray } });
    slide4.addText(`${i + 1}. ${battle.title}`, { x: 0.7, y: y + 0.15, w: 8.5, h: 0.4, fontSize: 14, bold: true, color: navyBlue });
    slide4.addText(battle.why, { x: 0.7, y: y + 0.55, w: 8.5, h: 0.4, fontSize: 10, color: "6B7280" });
  });

  // Slide 5: Governance
  const slide5 = pptx.addSlide();
  slide5.addText("Governance Model", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide5.addText("Execution, prioritisation, and value tracking", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  const governance = [
    { title: "Executive Steering", freq: "Quarterly", desc: "Strategic alignment and investment decisions" },
    { title: "Delivery Review", freq: "Monthly", desc: "Implementation progress and blockers" },
    { title: "Value Tracking", freq: "Ongoing", desc: "Business outcome measurement" },
  ];
  
  governance.forEach((item, i) => {
    const x = 0.5 + (i * 3.1);
    slide5.addShape(pptx.ShapeType.roundRect, { x, y: 1.5, w: 2.9, h: 1.5, fill: { color: "F3F4F6" }, line: { color: lightGray } });
    slide5.addText(item.title, { x, y: 1.6, w: 2.9, h: 0.35, fontSize: 12, bold: true, color: navyBlue, align: "center" });
    slide5.addText(item.freq, { x, y: 1.95, w: 2.9, h: 0.3, fontSize: 10, color: green, align: "center" });
    slide5.addText(item.desc, { x: x + 0.1, y: 2.3, w: 2.7, h: 0.5, fontSize: 9, color: "6B7280", align: "center" });
  });

  // Slide 6: Marketing Plan
  const slide6 = pptx.addSlide();
  slide6.addText("Marketing Plan", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: navyBlue });
  slide6.addText("Executive engagement and thought leadership", { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: "6B7280" });
  
  slide6.addText("Executive Engagement", { x: 0.5, y: 1.5, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  const engagement = [
    "C-Suite relationship building",
    "Innovation workshops",
    "Peer networking events",
    "Executive briefing centre visits",
  ];
  engagement.forEach((p, i) => {
    slide6.addText(`• ${p}`, { x: 0.5, y: 1.9 + (i * 0.35), w: 4, h: 0.3, fontSize: 10, color: "374151" });
  });

  slide6.addText("Strategic Narratives", { x: 5, y: 1.5, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: navyBlue });
  const narratives = [
    "AI as operational backbone",
    "Platform consolidation value",
    "Customer experience transformation",
    "Cost-to-serve optimisation",
  ];
  narratives.forEach((p, i) => {
    slide6.addText(`• ${p}`, { x: 5, y: 1.9 + (i * 0.35), w: 4.5, h: 0.3, fontSize: 10, color: "374151" });
  });

  // Add footers to each slide
  const allSlides = [slide1, slide2, slide3, slide4, slide5, slide6];
  allSlides.forEach((slide, i) => {
    slide.addText("ServiceNow | Maersk Account Plan FY26", { x: 0.5, y: 5.2, w: 5, h: 0.3, fontSize: 8, color: "9CA3AF" });
    slide.addText(`${i + 1} / ${allSlides.length}`, { x: 8.5, y: 5.2, w: 1, h: 0.3, fontSize: 8, color: "9CA3AF", align: "right" });
  });

  // Save the file
  pptx.writeFile({ fileName: "Maersk_Account_Plan_FY26.pptx" });
};
