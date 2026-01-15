// Utility to extract layout information from PPTX files
import JSZip from 'jszip';
import type {
  PPTXExtractedPresentation,
  PPTXExtractedSlide,
  PPTXSlideLayout,
  PPTXShape,
  PPTXParagraph,
  PPTXTextRun,
  PPTXColor,
  PPTXPosition,
} from '@/types/pptxLayout';

// EMU (English Metric Units) to percentage conversion
// Standard slide size: 9144000 x 6858000 EMUs (for 16:9)
const SLIDE_WIDTH_EMU = 9144000;
const SLIDE_HEIGHT_EMU = 6858000;

function emuToPercentX(emu: number): number {
  return (emu / SLIDE_WIDTH_EMU) * 100;
}

function emuToPercentY(emu: number): number {
  return (emu / SLIDE_HEIGHT_EMU) * 100;
}

function parseColor(colorNode: Element | null, defaultColor = '#000000'): PPTXColor {
  if (!colorNode) return { type: 'solid', value: defaultColor };
  
  // Check for solid fill
  const srgbClr = colorNode.querySelector('a\\:srgbClr, srgbClr');
  if (srgbClr) {
    return { type: 'solid', value: `#${srgbClr.getAttribute('val') || '000000'}` };
  }
  
  // Check for scheme color (theme reference)
  const schemeClr = colorNode.querySelector('a\\:schemeClr, schemeClr');
  if (schemeClr) {
    const val = schemeClr.getAttribute('val') || 'tx1';
    return { type: 'theme', value: val };
  }
  
  return { type: 'solid', value: defaultColor };
}

function parsePosition(spPr: Element | null): PPTXPosition {
  if (!spPr) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
  
  const xfrm = spPr.querySelector('a\\:xfrm, xfrm');
  if (!xfrm) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
  
  const off = xfrm.querySelector('a\\:off, off');
  const ext = xfrm.querySelector('a\\:ext, ext');
  
  const x = off ? parseInt(off.getAttribute('x') || '0', 10) : 0;
  const y = off ? parseInt(off.getAttribute('y') || '0', 10) : 0;
  const cx = ext ? parseInt(ext.getAttribute('cx') || '0', 10) : SLIDE_WIDTH_EMU;
  const cy = ext ? parseInt(ext.getAttribute('cy') || '0', 10) : SLIDE_HEIGHT_EMU;
  
  return {
    x: emuToPercentX(x),
    y: emuToPercentY(y),
    width: emuToPercentX(cx),
    height: emuToPercentY(cy),
  };
}

function parseTextRun(rNode: Element): PPTXTextRun {
  const tNode = rNode.querySelector('a\\:t, t');
  const text = tNode?.textContent || '';
  
  const rPr = rNode.querySelector('a\\:rPr, rPr');
  const font: Partial<PPTXTextRun['font']> = {};
  
  if (rPr) {
    const sz = rPr.getAttribute('sz');
    if (sz) font.size = parseInt(sz, 10) / 100; // centipoints to points
    
    font.bold = rPr.getAttribute('b') === '1';
    font.italic = rPr.getAttribute('i') === '1';
    font.underline = rPr.getAttribute('u') === 'sng';
    
    const solidFill = rPr.querySelector('a\\:solidFill, solidFill');
    if (solidFill) {
      font.color = parseColor(solidFill);
    }
  }
  
  return { text, font: Object.keys(font).length > 0 ? font : undefined };
}

function parseParagraph(pNode: Element): PPTXParagraph {
  const runs: PPTXTextRun[] = [];
  const rNodes = pNode.querySelectorAll('a\\:r, r');
  rNodes.forEach((r) => {
    runs.push(parseTextRun(r));
  });
  
  const pPr = pNode.querySelector('a\\:pPr, pPr');
  let alignment: PPTXParagraph['alignment'] = 'left';
  let bulletType: PPTXParagraph['bulletType'] = 'none';
  let level = 0;
  
  if (pPr) {
    const algn = pPr.getAttribute('algn');
    if (algn === 'ctr') alignment = 'center';
    else if (algn === 'r') alignment = 'right';
    else if (algn === 'just') alignment = 'justify';
    
    const lvl = pPr.getAttribute('lvl');
    if (lvl) level = parseInt(lvl, 10);
    
    // Check for bullets
    if (pPr.querySelector('a\\:buChar, buChar')) bulletType = 'bullet';
    else if (pPr.querySelector('a\\:buAutoNum, buAutoNum')) bulletType = 'number';
  }
  
  return { runs, alignment, bulletType, level };
}

function parseShape(spNode: Element, index: number): PPTXShape | null {
  const nvSpPr = spNode.querySelector('p\\:nvSpPr, nvSpPr');
  const spPr = spNode.querySelector('p\\:spPr, spPr');
  const txBody = spNode.querySelector('p\\:txBody, txBody');
  
  // Determine shape type
  let type: PPTXShape['type'] = 'textbox';
  let placeholderInfo: PPTXShape['placeholder'];
  
  const nvPr = nvSpPr?.querySelector('p\\:nvPr, nvPr');
  const ph = nvPr?.querySelector('p\\:ph, ph');
  if (ph) {
    type = 'placeholder';
    const phType = ph.getAttribute('type') || 'body';
    const phIdx = ph.getAttribute('idx') || '0';
    
    let mappedType: NonNullable<PPTXShape['placeholder']>['type'] = 'body';
    if (phType === 'title' || phType === 'ctrTitle') mappedType = 'title';
    else if (phType === 'subTitle') mappedType = 'subtitle';
    else if (phType === 'ftr') mappedType = 'footer';
    else if (phType === 'sldNum') mappedType = 'slideNumber';
    else mappedType = 'content';
    
    placeholderInfo = { type: mappedType, index: parseInt(phIdx, 10) };
  }
  
  // Parse position
  const position = parsePosition(spPr);
  
  // Parse fill
  let fill: PPTXColor | undefined;
  const solidFill = spPr?.querySelector('a\\:solidFill, solidFill');
  if (solidFill) {
    fill = parseColor(solidFill);
  }
  const gradFill = spPr?.querySelector('a\\:gradFill, gradFill');
  if (gradFill) {
    fill = { type: 'gradient', value: '#gradient', gradient: { stops: [], angle: 0 } };
  }
  
  // Parse text content
  const paragraphs: PPTXParagraph[] = [];
  if (txBody) {
    const pNodes = txBody.querySelectorAll('a\\:p, p');
    pNodes.forEach((p) => {
      const para = parseParagraph(p);
      if (para.runs.length > 0 && para.runs.some((r) => r.text.trim())) {
        paragraphs.push(para);
      }
    });
  }
  
  // Skip empty shapes
  if (paragraphs.length === 0 && type === 'textbox') {
    return null;
  }
  
  return {
    id: `shape-${index}`,
    type,
    position,
    fill,
    paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    placeholder: placeholderInfo,
  };
}

function detectLayoutType(shapes: PPTXShape[]): PPTXSlideLayout['layoutType'] {
  const hasTitle = shapes.some(
    (s) => s.placeholder?.type === 'title' || s.placeholder?.type === 'subtitle'
  );
  const contentShapes = shapes.filter(
    (s) => s.placeholder?.type === 'content' || s.placeholder?.type === 'body'
  );
  
  if (contentShapes.length === 0 && hasTitle) return 'title';
  if (contentShapes.length === 1) return 'titleContent';
  if (contentShapes.length >= 2) return 'twoColumn';
  if (shapes.length === 0) return 'blank';
  
  return 'custom';
}

async function parseSlide(
  zip: JSZip,
  slideFile: string,
  slideNumber: number
): Promise<PPTXExtractedSlide> {
  const xml = await zip.file(slideFile)?.async('string');
  if (!xml) {
    return {
      slideNumber,
      layout: {
        slideNumber,
        layoutType: 'blank',
        background: { type: 'solid', color: { type: 'solid', value: '#0B1D26' } },
        shapes: [],
        masterStyles: {},
      },
      originalText: '',
    };
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  
  // Parse shapes
  const spTree = doc.querySelector('p\\:spTree, spTree');
  const shapes: PPTXShape[] = [];
  let textParts: string[] = [];
  let title: string | undefined;
  const bodyContent: string[] = [];
  
  if (spTree) {
    const spNodes = spTree.querySelectorAll('p\\:sp, sp');
    let shapeIndex = 0;
    
    spNodes.forEach((sp) => {
      const shape = parseShape(sp, shapeIndex++);
      if (shape) {
        shapes.push(shape);
        
        // Extract text
        if (shape.paragraphs) {
          shape.paragraphs.forEach((para) => {
            const paraText = para.runs.map((r) => r.text).join('');
            if (paraText.trim()) {
              textParts.push(paraText);
              
              if (shape.placeholder?.type === 'title') {
                title = paraText;
              } else {
                bodyContent.push(paraText);
              }
            }
          });
        }
      }
    });
  }
  
  // Parse background
  let background: PPTXSlideLayout['background'] = {
    type: 'solid',
    color: { type: 'solid', value: '#0B1D26' },
  };
  
  const cSld = doc.querySelector('p\\:cSld, cSld');
  const bg = cSld?.querySelector('p\\:bg, bg');
  if (bg) {
    const bgFill = bg.querySelector('a\\:solidFill, solidFill');
    if (bgFill) {
      background = { type: 'solid', color: parseColor(bgFill, '#0B1D26') };
    }
    const bgGrad = bg.querySelector('a\\:gradFill, gradFill');
    if (bgGrad) {
      background = { type: 'gradient' };
    }
  }
  
  const layoutType = detectLayoutType(shapes);
  
  return {
    slideNumber,
    layout: {
      slideNumber,
      layoutType,
      background,
      shapes,
      masterStyles: {},
    },
    originalText: textParts.join('\n'),
    title,
    bodyContent,
  };
}

async function parseTheme(zip: JSZip): Promise<PPTXExtractedPresentation['theme']> {
  const defaultTheme: PPTXExtractedPresentation['theme'] = {
    name: 'Default',
    colors: {
      accent1: '#84CC16',
      accent2: '#22D3EE',
      accent3: '#A855F7',
      background1: '#0B1D26',
      background2: '#1a3a4a',
      text1: '#FFFFFF',
      text2: '#94A3B8',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  };
  
  // Try to find theme file
  const themeFiles = Object.keys(zip.files).filter((name) =>
    name.match(/ppt\/theme\/theme\d+\.xml$/)
  );
  
  if (themeFiles.length === 0) return defaultTheme;
  
  try {
    const themeXml = await zip.file(themeFiles[0])?.async('string');
    if (!themeXml) return defaultTheme;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(themeXml, 'application/xml');
    
    // Extract color scheme
    const clrScheme = doc.querySelector('a\\:clrScheme, clrScheme');
    if (clrScheme) {
      const getColor = (name: string): string => {
        const el = clrScheme.querySelector(`a\\:${name}, ${name}`);
        const srgb = el?.querySelector('a\\:srgbClr, srgbClr');
        if (srgb) return `#${srgb.getAttribute('val') || '000000'}`;
        return defaultTheme.colors.accent1;
      };
      
      defaultTheme.colors = {
        accent1: getColor('accent1'),
        accent2: getColor('accent2'),
        accent3: getColor('accent3'),
        background1: getColor('dk1'),
        background2: getColor('dk2'),
        text1: getColor('lt1'),
        text2: getColor('lt2'),
      };
    }
    
    // Extract fonts
    const fontScheme = doc.querySelector('a\\:fontScheme, fontScheme');
    if (fontScheme) {
      const majorFont = fontScheme.querySelector('a\\:majorFont a\\:latin, majorFont latin');
      const minorFont = fontScheme.querySelector('a\\:minorFont a\\:latin, minorFont latin');
      
      if (majorFont) defaultTheme.fonts.heading = majorFont.getAttribute('typeface') || 'Inter';
      if (minorFont) defaultTheme.fonts.body = minorFont.getAttribute('typeface') || 'Inter';
    }
  } catch (e) {
    console.warn('Failed to parse theme:', e);
  }
  
  return defaultTheme;
}

export async function extractPPTXLayout(file: File): Promise<PPTXExtractedPresentation> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  // Get slide files sorted by number
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
      return numA - numB;
    });
  
  // Parse theme
  const theme = await parseTheme(zip);
  
  // Parse all slides
  const slides: PPTXExtractedSlide[] = [];
  for (let i = 0; i < slideFiles.length; i++) {
    const slide = await parseSlide(zip, slideFiles[i], i + 1);
    slides.push(slide);
  }
  
  // Try to get presentation title
  let title = 'Presentation';
  if (slides.length > 0 && slides[0].title) {
    title = slides[0].title;
  }
  
  return {
    title,
    slideWidth: 1920,
    slideHeight: 1080,
    slides,
    theme,
  };
}
