// Types for pixel-perfect PPTX layout extraction and rendering

export interface PPTXColor {
  type: 'solid' | 'gradient' | 'theme';
  value: string; // hex color or theme name
  gradient?: {
    stops: { color: string; position: number }[];
    angle: number;
  };
}

export interface PPTXFont {
  family: string;
  size: number; // in points
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: PPTXColor;
}

export interface PPTXPosition {
  x: number; // percentage of slide width (0-100)
  y: number; // percentage of slide height (0-100)
  width: number; // percentage
  height: number; // percentage
}

export interface PPTXTextRun {
  text: string;
  font?: Partial<PPTXFont>;
}

export interface PPTXParagraph {
  runs: PPTXTextRun[];
  alignment: 'left' | 'center' | 'right' | 'justify';
  bulletType?: 'none' | 'bullet' | 'number';
  level: number; // indentation level
}

export interface PPTXShape {
  id: string;
  type: 'textbox' | 'rectangle' | 'oval' | 'image' | 'chart' | 'table' | 'placeholder';
  position: PPTXPosition;
  rotation?: number;
  fill?: PPTXColor;
  stroke?: {
    color: PPTXColor;
    width: number;
  };
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  cornerRadius?: number;
  paragraphs?: PPTXParagraph[];
  imageData?: string; // base64 or URL
  placeholder?: {
    type: 'title' | 'subtitle' | 'body' | 'content' | 'footer' | 'slideNumber';
    index: number;
  };
}

export interface PPTXSlideLayout {
  slideNumber: number;
  layoutType: 'title' | 'titleContent' | 'twoColumn' | 'comparison' | 'blank' | 'custom';
  background: {
    type: 'solid' | 'gradient' | 'image';
    color?: PPTXColor;
    imageData?: string;
  };
  shapes: PPTXShape[];
  masterStyles: {
    titleFont?: Partial<PPTXFont>;
    bodyFont?: Partial<PPTXFont>;
    accentColor?: string;
    backgroundColor?: string;
  };
}

export interface PPTXExtractedSlide {
  slideNumber: number;
  layout: PPTXSlideLayout;
  originalText: string; // raw text for AI analysis
  title?: string;
  bodyContent?: string[];
}

export interface PPTXExtractedPresentation {
  title: string;
  slideWidth: number; // in EMUs or pixels
  slideHeight: number;
  slides: PPTXExtractedSlide[];
  theme: {
    name: string;
    colors: {
      accent1: string;
      accent2: string;
      accent3: string;
      background1: string;
      background2: string;
      text1: string;
      text2: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

// Enhanced improved slide that includes layout + AI improvements
export interface EnhancedImprovedSlide {
  slideNumber: number;
  title: string;
  originalLayout: PPTXSlideLayout;
  improvedContent: {
    title?: string;
    keyPoints: string[];
    dataPoints?: string[];
    visualSuggestion?: string;
  };
  speakerNotes: {
    openingHook: string;
    talkingPoints: string[];
    dataToMention?: string[];
    transitionToNext?: string;
    estimatedDuration: string;
  };
}

export interface EnhancedImprovedPresentation {
  title: string;
  companyName: string;
  totalSlides: number;
  overallNarrative: string;
  keyThemes: string[];
  extractedTheme: PPTXExtractedPresentation['theme'];
  slides: EnhancedImprovedSlide[];
  closingTips?: string[];
}
