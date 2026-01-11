import { jsPDF } from "jspdf";
import { AccountData } from "@/context/AccountDataContext";

// =============================================================================
// COLOR PALETTE (matching index.css HSL → RGB conversion for PDF)
// =============================================================================
const C = {
  bg: [11, 29, 38] as [number, number, number],          // #0B1D26
  bgLight: [18, 31, 40] as [number, number, number],     // #121F28
  card: [22, 41, 55] as [number, number, number],        // #162937
  primary: [94, 201, 63] as [number, number, number],    // #5EC93F (green)
  primaryDark: [74, 174, 46] as [number, number, number], // #4AAE2E
  accent: [41, 169, 225] as [number, number, number],    // #29A9E1 (blue)
  white: [255, 255, 255] as [number, number, number],
  muted: [139, 163, 176] as [number, number, number],    // #8BA3B0
  border: [45, 67, 81] as [number, number, number],      // #2D4351
  danger: [239, 68, 68] as [number, number, number],     // #EF4444
  warning: [245, 158, 11] as [number, number, number],   // #F59E0B
  purple: [168, 85, 247] as [number, number, number],    // #A855F7
  blue: [59, 130, 246] as [number, number, number],      // #3B82F6
  emerald: [52, 211, 153] as [number, number, number],   // #34D399
  emeraldDark: [5, 150, 105] as [number, number, number], // #059669
  gray400: [156, 163, 175] as [number, number, number],  // #9CA3AF
  gray600: [75, 85, 99] as [number, number, number],     // #4B5563
};

// 16:9 Slide dimensions in mm (10" × 5.625")
const W = 254;
const H = 142.875;

// Margins in mm
const MX = 12.7;  // ~0.5"
const MY = 8.9;   // ~0.35"
const CONTENT_W = W - 2 * MX;

// Font sizes (points)
const TITLE_SIZE = 28;
const SUBTITLE_SIZE = 12;
const HEADING_SIZE = 14;
const BODY_SIZE = 10;
const SMALL_SIZE = 8;
const TINY_SIZE = 7;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const setColor = (pdf: jsPDF, color: [number, number, number]) => {
  pdf.setTextColor(color[0], color[1], color[2]);
};

const setFillColor = (pdf: jsPDF, color: [number, number, number]) => {
  pdf.setFillColor(color[0], color[1], color[2]);
};

const setDrawColor = (pdf: jsPDF, color: [number, number, number]) => {
  pdf.setDrawColor(color[0], color[1], color[2]);
};

const drawBackground = (pdf: jsPDF) => {
  // Dark gradient background
  setFillColor(pdf, [15, 22, 40]); // #0f1628
  pdf.rect(0, 0, W, H, "F");
  
  // Add subtle gradient effect with circles
  pdf.setGState(pdf.GState({ opacity: 0.3 }));
  setFillColor(pdf, [22, 32, 51]); // #162033
  pdf.ellipse(W * 0.3, H * 0.4, 80, 60, "F");
  setFillColor(pdf, [26, 39, 68]); // #1a2744
  pdf.ellipse(W * 0.8, H * 0.7, 90, 70, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));
};

const addTitle = (pdf: jsPDF, title: string, subtitle?: string) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(TITLE_SIZE);
  setColor(pdf, C.white);
  pdf.text(title, MX, MY + 10);
  
  if (subtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(SUBTITLE_SIZE);
    setColor(pdf, C.emerald);
    pdf.text(subtitle, MX, MY + 20);
  }
};

const drawCard = (
  pdf: jsPDF, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  options?: { borderColor?: [number, number, number]; fillOpacity?: number }
) => {
  const borderColor = options?.borderColor || C.border;
  const fillOpacity = options?.fillOpacity ?? 0.5;
  
  // Card fill with transparency
  pdf.setGState(pdf.GState({ opacity: fillOpacity }));
  setFillColor(pdf, [255, 255, 255]);
  pdf.roundedRect(x, y, w, h, 3, 3, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  // Card border
  pdf.setLineWidth(0.3);
  setDrawColor(pdf, borderColor);
  pdf.setGState(pdf.GState({ opacity: 0.3 }));
  pdf.roundedRect(x, y, w, h, 3, 3, "S");
  pdf.setGState(pdf.GState({ opacity: 1 }));
};

const truncate = (str: string | undefined, len: number) => {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "…" : str;
};

// =============================================================================
// SLIDE: AGILE TEAM MODEL (The GTM Wheel)
// =============================================================================
const createAgileTeamModelSlide = (pdf: jsPDF, data: AccountData) => {
  const companyName = data.basics.accountName || "Company";
  
  drawBackground(pdf);
  
  // Header
  addTitle(pdf, "The Task-Based Agile AM Model", `${companyName} Account Team — Dynamic Resource Activation`);
  
  // Left side - GTM Wheel visualization
  const wheelCenterX = 75;
  const wheelCenterY = 80;
  const outerRadius = 40;
  const middleRadius = 29;
  const innerRadius = 16;
  
  // Outer ring roles
  const outerRoles = [
    "BU Sale", "Inspire Value", "Impact", "Sales Mgmt.",
    "Elevate", "Prod. Mgmt.", "Marketing", "Exec Sponsor"
  ];
  
  // Draw outer ring background
  setFillColor(pdf, [10, 21, 37]); // #0a1525
  pdf.circle(wheelCenterX, wheelCenterY, outerRadius, "F");
  
  // Draw segments (8 pie segments)
  const segmentAngle = (2 * Math.PI) / 8;
  const activeSegments = [0, 2, 5]; // Highlight some segments
  
  outerRoles.forEach((role, index) => {
    const startAngle = index * segmentAngle - Math.PI / 2 - segmentAngle / 2;
    const endAngle = startAngle + segmentAngle;
    const isActive = activeSegments.includes(index);
    
    // Draw segment arc
    const midAngle = (startAngle + endAngle) / 2;
    const segmentMidRadius = (middleRadius + outerRadius) / 2;
    
    // Segment fill
    if (isActive) {
      setFillColor(pdf, C.emerald);
      pdf.setGState(pdf.GState({ opacity: 0.8 }));
    } else {
      setFillColor(pdf, [30, 58, 95]); // #1e3a5f
      pdf.setGState(pdf.GState({ opacity: 0.6 }));
    }
    
    // Draw segment as arc
    const innerX1 = wheelCenterX + middleRadius * Math.cos(startAngle + 0.05);
    const innerY1 = wheelCenterY + middleRadius * Math.sin(startAngle + 0.05);
    const outerX1 = wheelCenterX + (outerRadius - 2) * Math.cos(startAngle + 0.05);
    const outerY1 = wheelCenterY + (outerRadius - 2) * Math.sin(startAngle + 0.05);
    const outerX2 = wheelCenterX + (outerRadius - 2) * Math.cos(endAngle - 0.05);
    const outerY2 = wheelCenterY + (outerRadius - 2) * Math.sin(endAngle - 0.05);
    const innerX2 = wheelCenterX + middleRadius * Math.cos(endAngle - 0.05);
    const innerY2 = wheelCenterY + middleRadius * Math.sin(endAngle - 0.05);
    
    // Simplified segment drawing
    pdf.setGState(pdf.GState({ opacity: 1 }));
    
    // Role labels
    const labelRadius = (middleRadius + outerRadius) / 2 + 2;
    const labelX = wheelCenterX + labelRadius * Math.cos(midAngle);
    const labelY = wheelCenterY + labelRadius * Math.sin(midAngle);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6);
    setColor(pdf, isActive ? C.white : C.gray400);
    pdf.text(role, labelX, labelY, { align: "center" });
  });
  
  // Middle ring
  setFillColor(pdf, [10, 21, 37]); // #0a1525
  pdf.circle(wheelCenterX, wheelCenterY, middleRadius, "F");
  setDrawColor(pdf, [30, 58, 95]);
  pdf.setLineWidth(0.5);
  pdf.circle(wheelCenterX, wheelCenterY, middleRadius, "S");
  
  // Core team circle (center)
  // Gradient effect with multiple circles
  setFillColor(pdf, C.emerald);
  pdf.circle(wheelCenterX, wheelCenterY, innerRadius, "F");
  
  // Core team text
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  setColor(pdf, [6, 95, 70]); // dark emerald
  pdf.text("Core", wheelCenterX, wheelCenterY - 2, { align: "center" });
  pdf.text("Team", wheelCenterX, wheelCenterY + 5, { align: "center" });
  
  // GTM Wheel label below
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setColor(pdf, C.emerald);
  pdf.text("The GTM Wheel of Fire", wheelCenterX, wheelCenterY + outerRadius + 10, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  setColor(pdf, C.gray400);
  pdf.text("Active resources illuminate based on current pursuit", wheelCenterX, wheelCenterY + outerRadius + 16, { align: "center" });
  
  // Right side - Supporting content
  const rightX = 135;
  const rightY = 35;
  const cardWidth = 105;
  
  // Agile Operating Model card
  drawCard(pdf, rightX, rightY, cardWidth, 70, { borderColor: C.border, fillOpacity: 0.05 });
  
  // Card header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setColor(pdf, C.emerald);
  
  // Pulsing dot (static in PDF)
  setFillColor(pdf, C.emerald);
  pdf.circle(rightX + 5, rightY + 8, 1.5, "F");
  
  pdf.text("Agile Operating Model", rightX + 10, rightY + 10);
  
  // Bullet points
  const bullets = [
    { title: "Dynamic Resource Activation", desc: "Core team activates specific resources based on current pursuit phase and customer needs" },
    { title: "Scenario-Based Engagement", desc: "Different workstreams engage different combinations of expertise" },
    { title: "Flexible Scale", desc: "Resources scale up or down based on deal complexity and strategic importance" },
    { title: "Rapid Mobilization", desc: "Quick activation of specialized expertise when opportunities arise" },
  ];
  
  let bulletY = rightY + 20;
  bullets.forEach((bullet, index) => {
    // Numbered circle
    setFillColor(pdf, [52, 211, 153]); // emerald with transparency
    pdf.setGState(pdf.GState({ opacity: 0.2 }));
    pdf.circle(rightX + 8, bulletY + 3, 4, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));
    
    setDrawColor(pdf, C.emerald);
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.circle(rightX + 8, bulletY + 3, 4, "S");
    pdf.setGState(pdf.GState({ opacity: 1 }));
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setColor(pdf, C.emerald);
    pdf.text(String(index + 1), rightX + 8, bulletY + 4.5, { align: "center" });
    
    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    setColor(pdf, C.white);
    pdf.text(bullet.title, rightX + 16, bulletY + 2);
    
    // Description
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    setColor(pdf, C.gray400);
    const descLines = pdf.splitTextToSize(bullet.desc, cardWidth - 20);
    pdf.text(descLines, rightX + 16, bulletY + 7);
    
    bulletY += 14;
  });
  
  // Quote card at bottom right
  const quoteY = rightY + 75;
  
  // Gradient background effect for quote
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  setFillColor(pdf, C.emerald);
  pdf.roundedRect(rightX, quoteY, cardWidth, 18, 2, 2, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  setDrawColor(pdf, C.emerald);
  pdf.setGState(pdf.GState({ opacity: 0.2 }));
  pdf.roundedRect(rightX, quoteY, cardWidth, 18, 2, 2, "S");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(7);
  setColor(pdf, [110, 231, 183]); // emerald-300
  const quoteText = '"We operate in an agile fashion — the core team dynamically activates specialized resources as opportunities emerge and evolve."';
  const quoteLines = pdf.splitTextToSize(quoteText, cardWidth - 10);
  pdf.text(quoteLines, rightX + 5, quoteY + 6);
  
  // Legend at bottom
  const legendY = quoteY + 22;
  
  // Active resource
  setFillColor(pdf, C.emerald);
  pdf.circle(rightX + 5, legendY, 2, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  setColor(pdf, C.muted);
  pdf.text("Active Resource", rightX + 10, legendY + 1.5);
  
  // Available resource
  setFillColor(pdf, C.gray600);
  pdf.circle(rightX + 55, legendY, 2, "F");
  setColor(pdf, C.gray400);
  pdf.text("Available Resource", rightX + 60, legendY + 1.5);
};

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================
export const exportToVectorPDF = async (data: AccountData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [W, H],
  });
  
  // Set document properties
  pdf.setProperties({
    title: `${data.basics.accountName || "Account"} - Account Plan`,
    subject: "Global Account Plan",
    author: "ServiceNow",
    creator: "Account Planning Tool",
  });
  
  // Create slides
  createAgileTeamModelSlide(pdf, data);
  
  // Add more slides as we expand...
  // pdf.addPage([W, H], "landscape");
  // createNextSlide(pdf, data);
  
  // Save the PDF
  const accountName = data.basics.accountName || "Account";
  pdf.save(`${accountName}_Account_Plan_Vector.pdf`);
};
