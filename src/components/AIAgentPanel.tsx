import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Loader2, Sparkles, X, Maximize2, Minimize2, Trash2, ChevronDown, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAccountData, ImprovedPresentation, ImprovedSlide } from "@/context/AccountDataContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  timestamp: Date;
}

interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  applied?: boolean;
}

const SUGGESTIONS = [
  "Create a 5-slide executive presentation",
  "Add 3 strategic priorities based on our pain points",
  "Generate a complete account plan deck with 8 slides",
  "Create a SWOT analysis for this account",
  "Add a new Big Bet for AI transformation",
  "Create a 4-quarter roadmap",
  "Generate slides about our value proposition",
  "Add a slide about competitive positioning",
];

export function AIAgentPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { data, updateData, patchGeneratedPlan, setImprovedPresentation } = useAccountData();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const applyToolCalls = useCallback((toolCalls: ToolCall[]) => {
    for (const call of toolCalls) {
      try {
        if (call.name === "update_account_data" && call.arguments.updates) {
          const updates = call.arguments.updates as Array<{ section: string; data: Record<string, unknown> }>;
          for (const update of updates) {
            if (update.section === "generatedPlan") {
              patchGeneratedPlan(update.data as Parameters<typeof patchGeneratedPlan>[0]);
            } else {
              updateData(update.section as keyof typeof data, update.data);
            }
          }
          call.applied = true;
        } else if (call.name === "add_team_member" && call.arguments.member) {
          const { teamType, member } = call.arguments as { teamType: string; member: unknown };
          if (teamType === "core") {
            updateData("basics", {
              coreTeamMembers: [...(data.basics.coreTeamMembers || []), member as unknown as typeof data.basics.coreTeamMembers[0]]
            });
          } else {
            updateData("basics", {
              extendedTeam: [...(data.basics.extendedTeam || []), member as unknown as typeof data.basics.extendedTeam[0]]
            });
          }
          call.applied = true;
        } else if (call.name === "add_big_bet" && call.arguments.bigBet) {
          const bigBet = call.arguments.bigBet as unknown as typeof data.accountStrategy.bigBets[0];
          updateData("accountStrategy", {
            bigBets: [...(data.accountStrategy.bigBets || []), bigBet]
          });
          call.applied = true;
        } else if (call.name === "generate_content") {
          call.applied = true;
        } else if (call.name === "generate_slides") {
          // Generate a complete presentation
          const args = call.arguments as {
            title: string;
            overallNarrative: string;
            keyThemes: string[];
            slides: Array<{
              slideNumber?: number;
              title: string;
              keyPoints: string[];
              visualSuggestion?: string;
              dataHighlight?: string;
              speakerNotes: {
                openingHook: string;
                talkingPoints: string[];
                dataToMention?: string[];
                transitionToNext?: string;
                estimatedDuration: string;
              };
            }>;
            closingTips?: string[];
          };
          
          const presentation: ImprovedPresentation = {
            title: args.title,
            companyName: data.basics.accountName || "Company",
            totalSlides: args.slides.length,
            overallNarrative: args.overallNarrative,
            keyThemes: args.keyThemes,
            slides: args.slides.map((s, i) => ({
              slideNumber: s.slideNumber || i + 1,
              title: s.title,
              keyPoints: s.keyPoints,
              visualSuggestion: s.visualSuggestion,
              dataHighlight: s.dataHighlight,
              speakerNotes: s.speakerNotes,
            })),
            closingTips: args.closingTips,
          };
          
          setImprovedPresentation(presentation);
          call.applied = true;
        } else if (call.name === "add_slide") {
          // Add a single slide
          const args = call.arguments as {
            position?: number;
            slide: {
              title: string;
              keyPoints: string[];
              visualSuggestion?: string;
              dataHighlight?: string;
              speakerNotes: {
                openingHook: string;
                talkingPoints: string[];
                dataToMention?: string[];
                transitionToNext?: string;
                estimatedDuration: string;
              };
            };
          };
          
          const existingSlides = data.improvedPresentation?.slides || [];
          const position = args.position ? args.position - 1 : existingSlides.length;
          
          const newSlide: ImprovedSlide = {
            slideNumber: position + 1,
            title: args.slide.title,
            keyPoints: args.slide.keyPoints,
            visualSuggestion: args.slide.visualSuggestion,
            dataHighlight: args.slide.dataHighlight,
            speakerNotes: args.slide.speakerNotes,
          };
          
          const newSlides = [...existingSlides];
          newSlides.splice(position, 0, newSlide);
          // Renumber slides
          newSlides.forEach((s, i) => { s.slideNumber = i + 1; });
          
          if (data.improvedPresentation) {
            setImprovedPresentation({
              ...data.improvedPresentation,
              slides: newSlides,
              totalSlides: newSlides.length,
            });
          } else {
            setImprovedPresentation({
              title: `${data.basics.accountName || "Account"} Presentation`,
              companyName: data.basics.accountName || "Company",
              totalSlides: newSlides.length,
              overallNarrative: "",
              keyThemes: [],
              slides: newSlides,
            });
          }
          call.applied = true;
        } else if (call.name === "update_slide") {
          const args = call.arguments as {
            slideNumber: number;
            updates: Partial<ImprovedSlide>;
          };
          
          if (data.improvedPresentation?.slides) {
            const slides = [...data.improvedPresentation.slides];
            const idx = args.slideNumber - 1;
            if (idx >= 0 && idx < slides.length) {
              slides[idx] = { ...slides[idx], ...args.updates };
              setImprovedPresentation({
                ...data.improvedPresentation,
                slides,
              });
            }
          }
          call.applied = true;
        } else if (call.name === "remove_slide") {
          const args = call.arguments as { slideNumber: number };
          
          if (data.improvedPresentation?.slides) {
            const slides = data.improvedPresentation.slides.filter(
              (_, i) => i !== args.slideNumber - 1
            );
            // Renumber
            slides.forEach((s, i) => { s.slideNumber = i + 1; });
            setImprovedPresentation({
              ...data.improvedPresentation,
              slides,
              totalSlides: slides.length,
            });
          }
          call.applied = true;
        }
      } catch (error) {
        console.error("Error applying tool call:", call.name, error);
      }
    }
  }, [data, updateData, patchGeneratedPlan, setImprovedPresentation]);

  const parseSSEResponse = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = "";
    let fullContent = "";
    const toolCalls: ToolCall[] = [];
    let currentToolCall: { name?: string; arguments: string } | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta;
          
          if (delta?.content) {
            fullContent += delta.content;
            setStreamingContent(fullContent);
          }
          
          if (delta?.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (tc.function?.name) {
                if (currentToolCall && currentToolCall.name) {
                  try {
                    const args = JSON.parse(currentToolCall.arguments);
                    toolCalls.push({ name: currentToolCall.name, arguments: args });
                  } catch {}
                }
                currentToolCall = { name: tc.function.name, arguments: "" };
              }
              if (tc.function?.arguments && currentToolCall) {
                currentToolCall.arguments += tc.function.arguments;
              }
            }
          }
          
          // Check for finish_reason
          if (parsed.choices?.[0]?.finish_reason === "tool_calls" && currentToolCall?.name) {
            try {
              const args = JSON.parse(currentToolCall.arguments);
              toolCalls.push({ name: currentToolCall.name, arguments: args });
            } catch {}
          }
        } catch {
          // Continue on parse error
        }
      }
    }

    // Final flush
    if (currentToolCall?.name && currentToolCall.arguments) {
      try {
        const args = JSON.parse(currentToolCall.arguments);
        toolCalls.push({ name: currentToolCall.name, arguments: args });
      } catch {}
    }

    return { content: fullContent, toolCalls };
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/account-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          accountData: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const { content, toolCalls } = await parseSSEResponse(reader);

      // Apply tool calls
      if (toolCalls.length > 0) {
        applyToolCalls(toolCalls);
        toast.success(`Applied ${toolCalls.length} change${toolCalls.length > 1 ? "s" : ""} to account plan`);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: content || (toolCalls.length > 0 ? "I've made the requested changes to your account plan." : "I'm not sure how to help with that."),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent("");

    } catch (error) {
      console.error("Agent error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process request");
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingContent("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingContent("");
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 bg-background border rounded-xl shadow-2xl flex flex-col transition-all duration-300",
        isExpanded
          ? "inset-4 md:inset-8"
          : "bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-600/10 to-indigo-600/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              AI Agent
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Full Access
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">I can create and modify your account plan</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 && !streamingContent && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-violet-600" />
              </div>
              <h4 className="font-medium mb-2">How can I help?</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                I have full authority to create and modify your account plan. Just tell me what you need.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium px-1">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 4).map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-xl px-4 py-3 max-w-[85%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Changes applied:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.toolCalls.map((tc, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tc.name.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-xl px-4 py-3 max-w-[85%] bg-muted">
                <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
              </div>
            </div>
          )}

          {isLoading && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-xl px-4 py-3 bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* More suggestions */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <details className="group">
            <summary className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
              More suggestions
            </summary>
            <div className="flex flex-wrap gap-1 mt-2">
              {SUGGESTIONS.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1 px-2"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what to create or change..."
            className="min-h-[44px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[44px] w-[44px] flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
