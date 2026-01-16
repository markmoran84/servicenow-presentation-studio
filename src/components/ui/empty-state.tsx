import { LucideIcon, FileQuestion, Inbox, Search, Sparkles } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  variant?: "default" | "compact" | "card";
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const ActionIcon = action?.icon;

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <Icon className="w-10 h-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">{title}</p>
        {action && (
          <Button
            onClick={action.onClick}
            variant="ghost"
            size="sm"
            className="mt-3 gap-2"
          >
            {ActionIcon && <ActionIcon className="w-4 h-4" />}
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("glass-card p-8 text-center", className)}>
        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            variant="outline"
            className="mt-6 gap-2"
          >
            {ActionIcon && <ActionIcon className="w-4 h-4" />}
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-8 text-center",
      className
    )}>
      <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6 animate-pulse">
        <Icon className="w-10 h-10 text-muted-foreground/60" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function NoDataEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="No Data Available"
      description="Add account information to see generated content here."
      action={onAction ? {
        label: "Go to Input Form",
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoSearchResultsEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={query ? `No results found for "${query}". Try a different search term.` : "Try adjusting your search criteria."}
      variant="compact"
    />
  );
}

export function GenerateContentEmptyState({ 
  sectionName,
  onGenerate 
}: { 
  sectionName: string;
  onGenerate: () => void;
}) {
  return (
    <EmptyState
      icon={Sparkles}
      title={`No ${sectionName} Generated`}
      description={`Complete the Input Form with account details and click Generate with AI to create ${sectionName.toLowerCase()}.`}
      action={{
        label: "Generate with AI",
        onClick: onGenerate,
        icon: Sparkles,
      }}
      variant="card"
    />
  );
}
