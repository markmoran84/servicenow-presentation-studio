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
  
  // === GTM Wheel Configuration (matching SVG exactly) ===
  // Original SVG: viewBox 440x440, center at 220,220
  // PDF scale: we want the wheel to fit in ~65mm width, so scale = 65/440 ≈ 0.148
  const scale = 0.148;
  const wheelCenterX = 75;
  const wheelCenterY = 78;
  
  // Original SVG radii
  const outerRadius = 200 * scale;    // ~29.6mm
  const middleRadius = 145 * scale;   // ~21.5mm
  const innerRadius = 80 * scale;     // ~11.8mm
  
  const activeSegments = [0, 2, 5]; // Highlight some segments
  
  // 8 outer ring roles (matching original)
  const outerRoles = [
    { name: "BU Sale", lines: ["BU", "Sale"] },
    { name: "Inspire Value", lines: ["Inspire", "Value"] },
    { name: "Impact", lines: ["Impact"] },
    { name: "Sales Mgmt.", lines: ["Sales", "Mgmt."] },
    { name: "Elevate", lines: ["Elevate"] },
    { name: "Prod. Mgmt.", lines: ["Prod.", "Mgmt."] },
    { name: "Marketing", lines: ["Marketing"] },
    { name: "Exec Sponsor", lines: ["Exec", "Sponsor"] },
  ];
  
  const segmentAngle = (2 * Math.PI) / 8;
  const gap = 0.02; // Small gap between segments
  
  // Draw outer ring background
  setFillColor(pdf, [10, 21, 37]); // #0a1525
  pdf.circle(wheelCenterX, wheelCenterY, outerRadius, "F");
  
  // Draw each segment as an arc (pie slice)
  outerRoles.forEach((role, index) => {
    const startAngle = index * segmentAngle - Math.PI / 2 - segmentAngle / 2;
    const endAngle = startAngle + segmentAngle;
    const isActive = activeSegments.includes(index);
    
    // Calculate segment points (arc from middleRadius to outerRadius)
    const innerR = middleRadius + 1;
    const outerR = outerRadius - 1;
    
    // Four corners of the arc segment
    const x1 = wheelCenterX + innerR * Math.cos(startAngle + gap);
    const y1 = wheelCenterY + innerR * Math.sin(startAngle + gap);
    const x2 = wheelCenterX + outerR * Math.cos(startAngle + gap);
    const y2 = wheelCenterY + outerR * Math.sin(startAngle + gap);
    const x3 = wheelCenterX + outerR * Math.cos(endAngle - gap);
    const y3 = wheelCenterY + outerR * Math.sin(endAngle - gap);
    const x4 = wheelCenterX + innerR * Math.cos(endAngle - gap);
    const y4 = wheelCenterY + innerR * Math.sin(endAngle - gap);
    
    // Set colors based on active state
    if (isActive) {
      setFillColor(pdf, [52, 211, 153]); // #34d399 emerald
      setDrawColor(pdf, [110, 231, 183]); // #6ee7b7 lighter emerald border
    } else {
      setFillColor(pdf, [30, 58, 95]); // #1e3a5f
      setDrawColor(pdf, [30, 58, 95]);
    }
    
    pdf.setGState(pdf.GState({ opacity: isActive ? 1 : 0.6 }));
    
    // Draw segment as a filled polygon (approximation of arc)
    // For better accuracy, we'll draw multiple points along the arc
    const numPoints = 8;
    const outerPoints: [number, number][] = [];
    const innerPoints: [number, number][] = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const angle = startAngle + gap + t * (segmentAngle - 2 * gap);
      outerPoints.push([
        wheelCenterX + outerR * Math.cos(angle),
        wheelCenterY + outerR * Math.sin(angle)
      ]);
      innerPoints.push([
        wheelCenterX + innerR * Math.cos(angle),
        wheelCenterY + innerR * Math.sin(angle)
      ]);
    }
    
    // Build path: outer arc forward, then inner arc backward
    const allPoints = [...outerPoints, ...innerPoints.reverse()];
    
    // Draw filled polygon
    pdf.setLineWidth(0.3);
    const firstPoint = allPoints[0];
    pdf.moveTo(firstPoint[0], firstPoint[1]);
    for (let i = 1; i < allPoints.length; i++) {
      pdf.lineTo(allPoints[i][0], allPoints[i][1]);
    }
    pdf.lineTo(firstPoint[0], firstPoint[1]);
    pdf.fillStroke();
    
    pdf.setGState(pdf.GState({ opacity: 1 }));
  });
  
  // Draw middle ring (dark circle)
  setFillColor(pdf, [10, 21, 37]); // #0a1525
  pdf.circle(wheelCenterX, wheelCenterY, middleRadius, "F");
  setDrawColor(pdf, [30, 58, 95]); // #1e3a5f
  pdf.setLineWidth(0.4);
  pdf.circle(wheelCenterX, wheelCenterY, middleRadius, "S");
  
  // Draw arrows from core to each segment
  outerRoles.forEach((_, index) => {
    const angle = index * segmentAngle - Math.PI / 2;
    const isActive = activeSegments.includes(index);
    
    const startR = innerRadius + 2;
    const endR = middleRadius - 2;
    
    const startX = wheelCenterX + startR * Math.cos(angle);
    const startY = wheelCenterY + startR * Math.sin(angle);
    const endX = wheelCenterX + endR * Math.cos(angle);
    const endY = wheelCenterY + endR * Math.sin(angle);
    
    // Arrow line
    if (isActive) {
      setDrawColor(pdf, [52, 211, 153]); // emerald
      pdf.setLineWidth(0.6);
    } else {
      setDrawColor(pdf, [55, 65, 81]); // gray-700
      pdf.setLineWidth(0.4);
    }
    
    pdf.setGState(pdf.GState({ opacity: isActive ? 1 : 0.4 }));
    pdf.line(startX, startY, endX, endY);
    
    // Arrow head
    const arrowSize = 1.5;
    const headX = endX;
    const headY = endY;
    const backAngle = angle + Math.PI;
    
    const tip1X = headX + arrowSize * Math.cos(backAngle + 0.4);
    const tip1Y = headY + arrowSize * Math.sin(backAngle + 0.4);
    const tip2X = headX + arrowSize * Math.cos(backAngle - 0.4);
    const tip2Y = headY + arrowSize * Math.sin(backAngle - 0.4);
    
    if (isActive) {
      setFillColor(pdf, [52, 211, 153]);
    } else {
      setFillColor(pdf, [15, 38, 68]); // #0f1628 dark
    }
    
    pdf.moveTo(headX, headY);
    pdf.lineTo(tip1X, tip1Y);
    pdf.lineTo(tip2X, tip2Y);
    pdf.fill();
    
    pdf.setGState(pdf.GState({ opacity: 1 }));
  });
  
  // Draw Core Team circle (with gradient-like effect)
  // Light emerald outer glow
  setFillColor(pdf, [110, 231, 183]); // #6ee7b7
  pdf.circle(wheelCenterX, wheelCenterY, innerRadius, "F");
  // Slightly darker inner
  setFillColor(pdf, [52, 211, 153]); // #34d399
  pdf.circle(wheelCenterX, wheelCenterY, innerRadius * 0.85, "F");
  
  // Core team text
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  setColor(pdf, [6, 78, 59]); // emerald-900
  pdf.text("Core", wheelCenterX, wheelCenterY - 1.5, { align: "center" });
  pdf.text("Team", wheelCenterX, wheelCenterY + 4, { align: "center" });
  
  // Draw role labels
  outerRoles.forEach((role, index) => {
    const angle = index * segmentAngle - Math.PI / 2;
    const isActive = activeSegments.includes(index);
    const labelRadius = (middleRadius + outerRadius) / 2 + 1;
    
    const labelX = wheelCenterX + labelRadius * Math.cos(angle);
    const labelY = wheelCenterY + labelRadius * Math.sin(angle);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(4.5);
    setColor(pdf, isActive ? C.white : C.gray400);
    
    // Multi-line labels
    const lineHeight = 2;
    const offsetY = -((role.lines.length - 1) * lineHeight) / 2;
    
    role.lines.forEach((line, lineIndex) => {
      pdf.text(line, labelX, labelY + offsetY + lineIndex * lineHeight, { align: "center" });
    });
  });
  
  // GTM Wheel label below
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  setColor(pdf, C.emerald);
  pdf.text("The GTM Wheel of Fire", wheelCenterX, wheelCenterY + outerRadius + 8, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6);
  setColor(pdf, C.gray400);
  pdf.text("Active resources illuminate based on current pursuit", wheelCenterX, wheelCenterY + outerRadius + 13, { align: "center" });
  
  // === Right side - Supporting content ===
  const rightX = 135;
  const rightY = 32;
  const cardWidth = 108;
  
  // Agile Operating Model card background
  pdf.setGState(pdf.GState({ opacity: 0.05 }));
  setFillColor(pdf, C.white);
  pdf.roundedRect(rightX, rightY, cardWidth, 75, 3, 3, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  // Card border
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  setDrawColor(pdf, C.white);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(rightX, rightY, cardWidth, 75, 3, 3, "S");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  // Card header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setColor(pdf, C.emerald);
  
  // Pulsing dot (static in PDF)
  setFillColor(pdf, C.emerald);
  pdf.circle(rightX + 6, rightY + 8, 1.2, "F");
  
  pdf.text("Agile Operating Model", rightX + 11, rightY + 10);
  
  // Bullet points
  const bullets = [
    { title: "Dynamic Resource Activation", desc: "Core team activates specific resources based on current pursuit phase and customer needs" },
    { title: "Scenario-Based Engagement", desc: "Different workstreams engage different combinations of expertise" },
    { title: "Flexible Scale", desc: "Resources scale up or down based on deal complexity and strategic importance" },
    { title: "Rapid Mobilization", desc: "Quick activation of specialized expertise when opportunities arise" },
  ];
  
  let bulletY = rightY + 18;
  bullets.forEach((bullet, index) => {
    // Numbered circle background
    setFillColor(pdf, [52, 211, 153]);
    pdf.setGState(pdf.GState({ opacity: 0.2 }));
    pdf.circle(rightX + 8, bulletY + 3, 3.5, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));
    
    // Numbered circle border
    setDrawColor(pdf, C.emerald);
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.setLineWidth(0.2);
    pdf.circle(rightX + 8, bulletY + 3, 3.5, "S");
    pdf.setGState(pdf.GState({ opacity: 1 }));
    
    // Number
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6);
    setColor(pdf, C.emerald);
    pdf.text(String(index + 1), rightX + 8, bulletY + 4.5, { align: "center" });
    
    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    setColor(pdf, C.white);
    pdf.text(bullet.title, rightX + 15, bulletY + 2);
    
    // Description
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5.5);
    setColor(pdf, C.gray400);
    const descLines = pdf.splitTextToSize(bullet.desc, cardWidth - 20);
    pdf.text(descLines, rightX + 15, bulletY + 6.5);
    
    bulletY += 14;
  });
  
  // Quote card at bottom right
  const quoteY = rightY + 78;
  
  // Quote background
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  setFillColor(pdf, C.emerald);
  pdf.roundedRect(rightX, quoteY, cardWidth, 20, 2, 2, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  // Quote border
  setDrawColor(pdf, C.emerald);
  pdf.setGState(pdf.GState({ opacity: 0.2 }));
  pdf.setLineWidth(0.3);
  pdf.roundedRect(rightX, quoteY, cardWidth, 20, 2, 2, "S");
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(6);
  setColor(pdf, [110, 231, 183]); // emerald-300
  const quoteText = '"We operate in an agile fashion — the core team dynamically activates specialized resources as opportunities emerge and evolve."';
  const quoteLines = pdf.splitTextToSize(quoteText, cardWidth - 10);
  pdf.text(quoteLines, rightX + 5, quoteY + 6);
  
  // Legend at bottom
  const legendY = quoteY + 24;
  
  // Active resource legend
  setFillColor(pdf, C.emerald);
  pdf.circle(rightX + 5, legendY, 2, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6);
  setColor(pdf, [209, 213, 219]); // gray-300
  pdf.text("Active Resource", rightX + 10, legendY + 1.5);
  
  // Available resource legend
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
