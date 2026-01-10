import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";
import { AccountData } from "@/context/AccountDataContext";

/**
 * Captures a DOM element as an image
 */
export async function captureElementAsImage(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    width: 1920,
    height: 1080,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#0B1D26",
    logging: false,
  });
  
  return canvas.toDataURL("image/png", 1.0);
}

/**
 * Creates a PowerPoint from captured slide images
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

  // Add captured images as slides
  for (let i = 0; i < images.length; i++) {
    const slide = pptx.addSlide();
    const imageData = images[i];

    if (imageData) {
      slide.addImage({
        data: imageData,
        x: 0,
        y: 0,
        w: 10,
        h: 5.625,
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
    }
  }

  // Generate filename
  const accountName = data.basics.accountName || "Account";
  const date = new Date().toISOString().split("T")[0];
  const filename = `${accountName.replace(/[^a-zA-Z0-9]/g, "_")}_Account_Plan_${date}.pptx`;

  await pptx.writeFile({ fileName: filename });
}
