import { useAccountData, Stakeholder } from "@/context/AccountDataContext";
import { Users, MoreHorizontal, CheckCircle2, AlertCircle, Linkedin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Role badge colors matching the reference
const roleBadgeStyles: Record<Stakeholder["role"], { bg: string; text: string; border: string }> = {
  "Decision maker": { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/50" },
  "Champion": { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  "Influencer": { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/50" },
  "Procurement": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/50" },
  "No role": { bg: "bg-muted/30", text: "text-muted-foreground", border: "border-muted/50" },
};

// Stakeholder Card Component
const StakeholderCard = ({ stakeholder, isTopLevel = false }: { stakeholder: Stakeholder; isTopLevel?: boolean }) => {
  const style = roleBadgeStyles[stakeholder.role];
  const initials = stakeholder.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className={cn(
      "relative rounded-xl border bg-card/60 backdrop-blur-sm p-4 transition-all hover:shadow-lg hover:scale-[1.02]",
      isTopLevel ? "border-cyan-500/50 shadow-cyan-500/10 shadow-lg" : "border-border/50"
    )}>
      {/* Role Badge Header */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
          style.bg, style.text, style.border
        )}>
          {stakeholder.role}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 border-2 border-background">
          <AvatarImage src={stakeholder.avatarUrl} alt={stakeholder.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-foreground text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-primary truncate">{stakeholder.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{stakeholder.title}</p>
        </div>
      </div>

      {/* CRM Status */}
      <div className="mt-3 flex items-center gap-2">
        {stakeholder.crmStatus === "synced" ? (
          <div className="flex items-center gap-1 text-emerald-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CRM</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : stakeholder.crmStatus === "update" ? (
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Update CRM</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CRM</span>
          </div>
        )}
      </div>

      {/* Highlight */}
      {stakeholder.highlight && (
        <div className="mt-2 text-xs text-primary/80 flex items-center gap-1">
          {stakeholder.highlight.toLowerCase().includes("linkedin") && <Linkedin className="w-3 h-3" />}
          {stakeholder.highlight}
        </div>
      )}
    </div>
  );
};

// Placeholder sample data for demo
const sampleStakeholders: Stakeholder[] = [
  { name: "Vincent Clerc", title: "Chief Executive Officer", role: "Decision maker", crmStatus: "synced", highlight: "Recently posted on LinkedIn" },
  { name: "Katharina Poehlmann", title: "SVP, Head of Strategy", role: "No role", crmStatus: "synced", highlight: "New executive teamlink connections" },
  { name: "Johan Sigsgaard", title: "EVP, Chief Product Officer", role: "No role", crmStatus: "update" },
  { name: "Narin Phol", title: "Executive Vice President, C...", role: "No role", crmStatus: "synced" },
  { name: "Karsten Kildahl", title: "EVP, CCO", role: "Decision maker", crmStatus: "synced", highlight: "New executive teamlink connections" },
  { name: "Navneet Kapoor", title: "Executive Vice President an...", role: "Decision maker", crmStatus: "synced", highlight: "New executive teamlink connections" },
  { name: "Nishith Sahu", title: "Global Head - CRM Platform", role: "No role", crmStatus: "update" },
  { name: "Dominic Gates", title: "Global Head of Contract Lo...", role: "No role", crmStatus: "synced" },
  { name: "Thomas Lassen", title: "Vice President, Global Proc...", role: "Champion", crmStatus: "update" },
  { name: "Krishnan Srinivasan", title: "SVP Technology Infrastruct...", role: "No role", crmStatus: "synced", highlight: "Recently posted on LinkedIn" },
  { name: "Resham Sahi", title: "Senior Vice President", role: "No role", crmStatus: "synced" },
  { name: "Scott J Horn", title: "Senior Vice President, Fulfilli...", role: "No role", crmStatus: "synced" },
  { name: "Mark Graham", title: "Director, Product – Head of ...", role: "Champion", crmStatus: "synced", highlight: "New executive teamlink connections" },
  { name: "Chris Gregory", title: "Vice President - Global Hea...", role: "No role", crmStatus: "update" },
  { name: "Bich Nguyen", title: "Head of Product Excellence ...", role: "No role", crmStatus: "update" },
  { name: "Jacob Skovsgaard", title: "Head of Customer Experien...", role: "Influencer", crmStatus: "update" },
  { name: "Arjun Ghattaura", title: "Technology Procurement & ...", role: "Procurement", crmStatus: "update" },
  { name: "Tan Gill", title: "Director, Global Head of CR...", role: "Champion", crmStatus: "synced", highlight: "New executive teamlink connections" },
  { name: "Geoffrey Breed", title: "Director, Product, FbM Plat...", role: "Champion", crmStatus: "synced" },
  { name: "Shyam Sundar", title: "FPO ( functional product ow...", role: "Influencer", crmStatus: "synced" },
  { name: "Nitin More", title: "Process Expert", role: "Influencer", crmStatus: "synced" },
];

export const ExecutiveEngagementSlide = () => {
  const { data } = useAccountData();
  
  // Use stakeholders from data or fall back to sample
  const stakeholders = data.engagement.stakeholders.length > 0 
    ? data.engagement.stakeholders 
    : sampleStakeholders;

  // Find the top-level decision maker (CEO)
  const topExecutive = stakeholders.find(s => 
    s.role === "Decision maker" && s.title.toLowerCase().includes("chief executive")
  ) || stakeholders.find(s => s.role === "Decision maker");

  // Rest of stakeholders (excluding top)
  const otherStakeholders = stakeholders.filter(s => s !== topExecutive);

  // Group into rows (6 per row for cleaner layout)
  const rows: Stakeholder[][] = [];
  for (let i = 0; i < otherStakeholders.length; i += 6) {
    rows.push(otherStakeholders.slice(i, i + 6));
  }

  return (
    <div className="min-h-screen p-6 md:p-8 pb-32 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stakeholder Map</h1>
            <p className="text-muted-foreground">Executive engagement and relationship overview</p>
          </div>
        </div>

        {/* Org Chart Layout */}
        <div className="space-y-6">
          {/* Top Level - CEO */}
          {topExecutive && (
            <div className="flex justify-center mb-2">
              <div className="w-64">
                <StakeholderCard stakeholder={topExecutive} isTopLevel />
              </div>
            </div>
          )}

          {/* Connecting Lines Container */}
          <div className="relative">
            {/* Vertical line from CEO */}
            <div className="absolute top-0 left-1/2 w-px h-6 bg-border/50 -translate-x-1/2 -translate-y-6" />
            
            {/* Horizontal connector */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-border/40 border-dashed border-t" />
            
            {/* Grid of stakeholder cards */}
            <div className="space-y-4 pt-2">
              {rows.map((row, rowIndex) => (
                <div 
                  key={rowIndex} 
                  className="grid gap-4"
                  style={{ 
                    gridTemplateColumns: `repeat(${Math.min(row.length, 6)}, minmax(0, 1fr))`,
                  }}
                >
                  {row.map((stakeholder, idx) => (
                    <div key={idx} className="relative">
                      {/* Vertical connector line */}
                      {rowIndex === 0 && (
                        <div className="absolute -top-2 left-1/2 w-px h-2 bg-border/40 -translate-x-1/2" />
                      )}
                      <StakeholderCard stakeholder={stakeholder} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {Object.entries(roleBadgeStyles).map(([role, style]) => (
            <div key={role} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", style.bg, "border", style.border)} />
              <span className="text-xs text-muted-foreground">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
