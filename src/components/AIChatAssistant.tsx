import { useState, useRef, useEffect } from "react";
import { useAccountData, AccountData } from "@/context/AccountDataContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Send, Loader2, Copy, Check, Sparkles, X, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FieldUpdateCommand {
  section: keyof AccountData;
  field: string;
  value: unknown;
  action: "set" | "append" | "replace";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/account-chat`;

export const AIChatAssistant = () => {
  const { data, updateData } = useAccountData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedCommands, setAppliedCommands] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          accountData: data,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const updateAssistant = (content: string) => {
        assistantContent = content;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              updateAssistant(assistantContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setMessages(prev => prev.filter(m => m !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      toast.success("Copied to clipboard - paste into any form field");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const extractSuggestedContent = (content: string): string | null => {
    const match = content.match(/\*\*Suggested Content:\*\*\s*([\s\S]*?)(?=\n\n|$)/i);
    return match ? match[1].trim() : null;
  };

  // Extract field update commands from AI response
  const extractFieldUpdates = (content: string): FieldUpdateCommand[] => {
    const commands: FieldUpdateCommand[] = [];
    const regex = /```fieldupdate\s*([\s\S]*?)```/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        if (parsed.section && parsed.field && parsed.value !== undefined) {
          commands.push({
            section: parsed.section as keyof AccountData,
            field: parsed.field,
            value: parsed.value,
            action: parsed.action || "set"
          });
        }
      } catch (e) {
        console.error("Failed to parse field update command:", e);
      }
    }
    return commands;
  };

  // Apply field update to account data
  const applyFieldUpdate = (command: FieldUpdateCommand, messageIndex: number) => {
    const commandKey = `${messageIndex}-${command.section}-${command.field}`;
    
    try {
      const currentSection = data[command.section];
      if (!currentSection) {
        toast.error(`Section "${command.section}" not found`);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentValue = (currentSection as any)[command.field];
      let newValue: unknown;

      if (command.action === "append" && Array.isArray(currentValue)) {
        // Append to existing array
        const appendValue = Array.isArray(command.value) ? command.value : [command.value];
        newValue = [...currentValue, ...appendValue];
      } else {
        // Set/replace the value
        newValue = command.value;
      }

      updateData(command.section, { [command.field]: newValue });
      setAppliedCommands(prev => new Set([...prev, commandKey]));
      toast.success(`Updated ${command.section}.${command.field}`);
    } catch (e) {
      console.error("Failed to apply field update:", e);
      toast.error("Failed to apply update");
    }
  };

  // Render message content with field update buttons
  const renderMessageContent = (content: string, messageIndex: number) => {
    const commands = extractFieldUpdates(content);
    
    // Remove the fieldupdate code blocks from display
    const cleanContent = content.replace(/```fieldupdate[\s\S]*?```/gi, '').trim();
    
    return (
      <>
        <div className="text-sm whitespace-pre-wrap">{cleanContent}</div>
        {commands.length > 0 && (
          <div className="mt-3 space-y-2">
            {commands.map((cmd, cmdIndex) => {
              const commandKey = `${messageIndex}-${cmd.section}-${cmd.field}`;
              const isApplied = appliedCommands.has(commandKey);
              const valuePreview = typeof cmd.value === 'string' 
                ? cmd.value.slice(0, 50) + (cmd.value.length > 50 ? '...' : '')
                : Array.isArray(cmd.value) 
                  ? `${cmd.value.length} item(s)`
                  : JSON.stringify(cmd.value).slice(0, 50);
              
              return (
                <div 
                  key={cmdIndex}
                  className="bg-background/60 rounded-lg p-3 border border-border/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-primary flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {cmd.action === "append" ? "Add to" : "Set"} {cmd.section}.{cmd.field}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {valuePreview}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isApplied ? "secondary" : "default"}
                      className="h-7 text-xs shrink-0"
                      onClick={() => applyFieldUpdate(cmd, messageIndex)}
                      disabled={isApplied}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const clearChat = () => {
    setMessages([]);
    setAppliedCommands(new Set());
    toast.success("Chat cleared");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-lg gap-0"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Account Assistant
            </SheetTitle>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about your account data or request content suggestions
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">Start a conversation</p>
                <p className="text-sm">Try asking:</p>
                <div className="mt-3 space-y-2">
                  {[
                    "What are the key pain points?",
                    "Summarize the corporate strategy",
                    "Draft a vision statement",
                    "Suggest 3 opportunities based on their strategy",
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/70 text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    renderMessageContent(message.content, index)
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  )}
                  {message.role === "assistant" && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-border/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => copyToClipboard(message.content, index)}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy All
                          </>
                        )}
                      </Button>
                      {extractSuggestedContent(message.content) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary"
                          onClick={() => {
                            const suggested = extractSuggestedContent(message.content);
                            if (suggested) copyToClipboard(suggested, index);
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Copy Suggestion
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-secondary/70 rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your account or request content..."
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ask to populate fields directly — click "Apply" to update forms
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
