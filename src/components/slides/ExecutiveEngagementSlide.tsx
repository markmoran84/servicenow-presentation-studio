import { useAccountData } from "@/context/AccountDataContext";
import { Users, Target, Calendar } from "lucide-react";

export const ExecutiveEngagementSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header - Two-tone style */}
        <div className="slide-header flex items-center gap-4">
          <div className="sn-icon-box">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="slide-header-title">
              <span className="text-primary">Executive</span>{" "}
              <span className="text-foreground">Engagement Model</span>
            </h1>
            <p className="slide-header-subtitle">Tiered engagement structure and key forums</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Executive Sponsors */}
          <div className="sn-glass-emphasis p-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="column-header">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Executive Sponsors</h3>
            </div>
            <ul className="space-y-3">
              {data.engagement.knownExecutiveSponsors.map((sponsor, i) => (
                <li 
                  key={i} 
                  className="data-item text-foreground text-sm"
                >
                  {sponsor}
                </li>
              ))}
            </ul>
          </div>

          {/* Planned Events */}
          <div className="sn-glass-emphasis p-6 opacity-0 animate-fade-in animation-delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="column-header-accent">
              <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Planned Executive Events</h3>
            </div>
            <ul className="space-y-3">
              {data.engagement.plannedExecutiveEvents.map((event, i) => (
                <li 
                  key={i} 
                  className="data-item text-foreground text-sm"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
