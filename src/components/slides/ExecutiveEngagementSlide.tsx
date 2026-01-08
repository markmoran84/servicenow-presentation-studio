import { useAccountData } from "@/context/AccountDataContext";
import { Users, Target, Calendar, MessageSquare } from "lucide-react";

export const ExecutiveEngagementSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Executive Engagement Model</h1>
            <p className="text-muted-foreground text-lg">Tiered engagement structure and key forums</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Executive Sponsors
            </h3>
            <ul className="space-y-3">
              {data.engagement.knownExecutiveSponsors.map((sponsor, i) => (
                <li key={i} className="p-3 rounded-lg bg-secondary/30 text-foreground">{sponsor}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Planned Executive Events
            </h3>
            <ul className="space-y-3">
              {data.engagement.plannedExecutiveEvents.map((event, i) => (
                <li key={i} className="p-3 rounded-lg bg-accent/10 text-foreground">{event}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
