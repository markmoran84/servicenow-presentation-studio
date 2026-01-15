import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Mic, 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronRight,
  Clock,
  MessageCircle,
  TrendingUp,
  Quote,
  Globe,
  X,
  Lightbulb
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccountData } from "@/context/AccountDataContext";
import { toast } from "sonner";

interface SlideNote {
  slideId: string;
  slideLabel: string;
  openingHook: string;
  keyPoints: string[];
  dataToMention?: string[];
  anticipatedQuestions?: { question: string; suggestedResponse: string }[];
  transitionToNext?: string;
  speakingDuration?: string;
}

interface TalkingNotes {
  overallNarrative: string;
  keyThemes: string[];
  slideNotes: SlideNote[];
  closingRecommendations?: string[];
}

interface TalkingNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlideIndex: number;
  slideLabels: string[];
  documentContent?: string;
}

export const TalkingNotesPanel = ({
  isOpen,
  onClose,
  currentSlideIndex,
  slideLabels,
  documentContent
}: TalkingNotesPanelProps) => {
  const { data } = useAccountData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [talkingNotes, setTalkingNotes] = useState<TalkingNotes | null>(null);
  const [webSearchUsed, setWebSearchUsed] = useState(false);
  const [expandedSlides, setExpandedSlides] = useState<Set<number>>(new Set([currentSlideIndex]));

  const handleGenerateNotes = async () => {
    if (!data.basics.accountName) {
      toast.error("Please enter an account name first");
      return;
    }

    setIsGenerating(true);
    try {
      const slideInfo = slideLabels.map((label, index) => ({
        label,
        index,
        description: getSlideDescription(label)
      }));

      const { data: responseData, error } = await supabase.functions.invoke("generate-talking-notes", {
        body: { 
          accountData: data,
          documentContent,
          slideInfo
        }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Failed to generate notes");

      setTalkingNotes(responseData.data);
      setWebSearchUsed(responseData.webSearchUsed || false);
      toast.success("Talking notes generated!");
    } catch (error) {
      console.error("Error generating talking notes:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate talking notes");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSlideDescription = (label: string): string => {
    const descriptions: Record<string, string> = {
      "Cover": "Introduction slide with account name and team",
      "1. Executive Summary": "High-level strategic overview and key pillars",
      "2. Customer Snapshot": "Company profile, financials, and market position",
      "3. Customer Strategy": "Customer's corporate and digital strategy",
      "4. Account Strategy": "Our approach and winning moves",
      "5. FY-1 Retrospective": "Previous year performance review",
      "6. Strategic Alignment": "How we align to customer objectives",
      "7. Account Team": "Team structure and responsibilities",
      "8. Agile Team Model": "Operating model and collaboration",
      "9. SWOT Analysis": "Strengths, weaknesses, opportunities, threats",
      "9. Value Drivers": "Core value propositions",
      "10. Key Workstreams": "Major initiatives and big bets",
      "11. Workstream Detail": "Detailed workstream breakdown",
      "12. AI Portfolio": "AI use cases and opportunities",
      "13. Platform Vision": "Long-term platform strategy",
      "14. Roadmap": "Implementation timeline",
      "15. Risk & Mitigation": "Risk assessment and mitigation",
      "16. Governance": "Governance structure",
      "17. Weekly Update": "Status and progress",
      "18. Engagement": "Executive engagement plan",
      "18. Pursuit Plan": "Sales pursuit strategy",
      "19. Key Asks": "Critical asks and support needed",
      "20. Execution Timeline": "Detailed execution plan",
      "21. Success Metrics": "KPIs and success criteria"
    };
    return descriptions[label] || "Presentation slide";
  };

  const toggleSlide = (index: number) => {
    setExpandedSlides(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getCurrentSlideNotes = (): SlideNote | undefined => {
    if (!talkingNotes) return undefined;
    const currentLabel = slideLabels[currentSlideIndex];
    return talkingNotes.slideNotes.find(note => 
      note.slideLabel.toLowerCase().includes(currentLabel.toLowerCase().split('.')[1]?.trim() || currentLabel.toLowerCase())
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Talking Notes</h2>
          {webSearchUsed && (
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Web Enhanced
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {!talkingNotes ? (
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generate Talking Notes</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[280px] mx-auto">
              AI will analyze your account data and web research to create natural, conversational presenter notes.
            </p>
            <Button 
              onClick={handleGenerateNotes} 
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Researching & Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Notes
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Narrative */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Story Arc
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-sm text-foreground/90">{talkingNotes.overallNarrative}</p>
              </CardContent>
            </Card>

            {/* Key Themes */}
            <div className="flex flex-wrap gap-2">
              {talkingNotes.keyThemes.map((theme, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {theme}
                </Badge>
              ))}
            </div>

            {/* Current Slide Notes - Highlighted */}
            {getCurrentSlideNotes() && (
              <Card className="bg-accent/10 border-accent/30">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground">Current</Badge>
                    {slideLabels[currentSlideIndex]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-3">
                  <SlideNoteContent note={getCurrentSlideNotes()!} />
                </CardContent>
              </Card>
            )}

            {/* All Slide Notes */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                All Slides
              </h4>
              {talkingNotes.slideNotes.map((note, index) => (
                <Collapsible 
                  key={index} 
                  open={expandedSlides.has(index)}
                  onOpenChange={() => toggleSlide(index)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-3 h-auto"
                    >
                      <span className="text-sm font-medium text-left">{note.slideLabel}</span>
                      <div className="flex items-center gap-2">
                        {note.speakingDuration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {note.speakingDuration}
                          </span>
                        )}
                        {expandedSlides.has(index) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Card className="border-l-2 border-l-primary/50 ml-2">
                      <CardContent className="py-3 px-4">
                        <SlideNoteContent note={note} />
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            {/* Closing Recommendations */}
            {talkingNotes.closingRecommendations && talkingNotes.closingRecommendations.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Delivery Tips</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <ul className="space-y-2">
                    {talkingNotes.closingRecommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Regenerate Button */}
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleGenerateNotes} 
                disabled={isGenerating}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Regenerate Notes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Sub-component for slide note content
const SlideNoteContent = ({ note }: { note: SlideNote }) => (
  <div className="space-y-4">
    {/* Opening Hook */}
    <div>
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        Opening Hook
      </h5>
      <p className="text-sm italic text-foreground/90">"{note.openingHook}"</p>
    </div>

    {/* Key Points */}
    <div>
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        Key Points
      </h5>
      <ul className="space-y-2">
        {note.keyPoints.map((point, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <TrendingUp className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Data to Mention */}
    {note.dataToMention && note.dataToMention.length > 0 && (
      <div>
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Data Points
        </h5>
        <div className="space-y-1">
          {note.dataToMention.map((data, idx) => (
            <div key={idx} className="text-sm flex items-start gap-2 bg-muted/30 rounded px-2 py-1">
              <Quote className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
              <span className="font-medium">{data}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Anticipated Questions */}
    {note.anticipatedQuestions && note.anticipatedQuestions.length > 0 && (
      <div>
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Anticipated Questions
        </h5>
        <div className="space-y-3">
          {note.anticipatedQuestions.map((qa, idx) => (
            <div key={idx} className="bg-muted/20 rounded-lg p-2">
              <p className="text-sm font-medium flex items-start gap-2">
                <MessageCircle className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
                {qa.question}
              </p>
              <p className="text-sm text-muted-foreground mt-1 ml-5">
                → {qa.suggestedResponse}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Transition */}
    {note.transitionToNext && (
      <div className="border-t border-border/50 pt-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Transition:</span> {note.transitionToNext}
        </p>
      </div>
    )}
  </div>
);
