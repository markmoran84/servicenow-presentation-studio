import { FileText, Users, BarChart3, Target, Shield, Megaphone } from "lucide-react";

const contents = [
  { number: "01", title: "Global Account Team", icon: Users },
  { number: "02", title: "Summary of Last Account Plan", icon: FileText },
  { number: "03", title: "Customer Snapshot", icon: BarChart3 },
  { number: "04", title: "Strategic Priorities 2026", icon: Target },
  { number: "05", title: "Governance Model", icon: Shield },
  { number: "06", title: "Marketing Plan", icon: Megaphone },
];

export const ContentsSlide = () => {
  return (
    <div className="min-h-screen px-12 py-10">
      <h1 className="text-5xl font-bold mb-12 opacity-0 animate-fade-in">
        <span className="text-primary">Contents</span>
      </h1>
      
      <div className="grid grid-cols-2 gap-6 max-w-5xl">
        {contents.map((item, index) => (
          <div
            key={item.number}
            className="flex items-center gap-6 p-6 rounded-xl border border-primary/30 bg-card/30 hover:bg-card/50 hover:border-primary/50 transition-all cursor-pointer opacity-0 animate-fade-in"
            style={{ animationDelay: `${100 + index * 80}ms` }}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 border border-primary/30">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-primary font-bold text-lg mr-4">{item.number}</span>
              <span className="text-foreground font-semibold text-xl">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
