import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";
import { AccountData } from "@/context/AccountDataContext";

// PowerPoint slide dimensions (16:9 aspect ratio)
const SLIDE_WIDTH_INCHES = 10;
const SLIDE_HEIGHT_INCHES = 5.625; // 10 * (9/16)
const CAPTURE_WIDTH = 1920;
const CAPTURE_HEIGHT = 1080;

/**
 * Captures a DOM element as a high-resolution image for PowerPoint export.
 * Forces the element to 1920x1080 (16:9) dimensions.
 */
export async function captureElementAsImage(element: HTMLElement): Promise<string> {
  // html2canvas captures the element at specified dimensions
  const canvas = await html2canvas(element, {
    width: CAPTURE_WIDTH,
    height: CAPTURE_HEIGHT,
    scale: 2, // 2x for higher quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null, // Transparent - let the element's own background show
    logging: false,
    windowWidth: CAPTURE_WIDTH,
    windowHeight: CAPTURE_HEIGHT,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
  });
  
  return canvas.toDataURL("image/png", 1.0);
}

/**
 * Creates a PowerPoint presentation from captured slide images.
 * Each image is placed full-bleed on a 16:9 slide.
 */
export async function createPowerPointFromImages(
  images: string[],
  labels: string[],
  data: AccountData
): Promise<void> {
  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = "ServiceNow Account Planning";
  pptx.title = `${data.basics.accountName || "Account"} Global Account Plan`;
  pptx.subject = "Strategic Account Plan";
  pptx.company = "ServiceNow";
  pptx.layout = "LAYOUT_16x9";

  // Add captured images as full-bleed slides
  for (let i = 0; i < images.length; i++) {
    const slide = pptx.addSlide();
    const imageData = images[i];

    if (imageData && imageData.length > 100) {
      // Full-bleed image covering entire slide
      slide.addImage({
        data: imageData,
        x: 0,
        y: 0,
        w: SLIDE_WIDTH_INCHES,
        h: SLIDE_HEIGHT_INCHES,
      });
    } else {
      // Fallback for missing captures
      slide.background = { color: "0B1D26" };
      slide.addText(labels[i] || `Slide ${i + 1}`, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 0.5,
        fontSize: 32,
        color: "FFFFFF",
        align: "center",
      });
      slide.addText("(Slide capture failed)", {
        x: 0.5,
        y: 3.2,
        w: 9,
        h: 0.3,
        fontSize: 14,
        color: "999999",
        align: "center",
      });
    }
  }

  // Generate filename
  const accountName = data.basics.accountName || "Account";
  const date = new Date().toISOString().split("T")[0];
  const filename = `${accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_${date}.pptx`;

  await pptx.writeFile({ fileName: filename });
}
