import { SectionHeader } from "@/components/SectionHeader";
import { SubTeamBadge } from "@/components/SubTeamBadge";
import { UsersRound, Globe, MapPin } from "lucide-react";

const extendedTeamMembers = [
  {
    name: "Ciara Breslin",
    email: "ciara.breslin@servicenow.com",
    role: "Account Executive",
    region: "North America",
    responsibilities: [
      "Regional commercial administration and execution",
      "Drives global strategy in local territory",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    subTeams: ["Solution sales teams", "Commercial and legal support"],
  },
  {
    name: "Markus Maurer",
    email: "markus.maurer@servicenow.com",
    role: "Customer Success Executive",
    region: "EMEA",
    responsibilities: [
      "Interlock to Post-Sales",
      "Drives Business Value for customer",
      "Delivery operating model governance",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    subTeams: ["Customer success managers", "Implementation partners"],
  },
  {
    name: "Fikret Uenlue",
    email: "fikret.uenlue@servicenow.com",
    role: "Services Account Executive",
    region: "EMEA",
    responsibilities: [
      "Point of contact for Expert Services and Success offerings",
      "Training and enablement coordination",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    subTeams: ["Expert services, training", "Impact"],
  },
  {
    name: "Laura Chen",
    email: "laura.chen@servicenow.com",
    role: "Solution Consultant",
    region: "APAC",
    responsibilities: [
      "Technical solutions for APAC region",
      "Cross-regional alignment",
      "Demo and PoC delivery",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    subTeams: ["Regional presales", "Partner ecosystem"],
  },
  {
    name: "Thomas Weber",
    email: "thomas.weber@servicenow.com",
    role: "Platform Architect",
    region: "EMEA",
    responsibilities: [
      "Platform governance and standards",
      "Integration architecture",
      "Technical debt management",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    subTeams: ["Architecture review board"],
  },
  {
    name: "Maria Santos",
    email: "maria.santos@servicenow.com",
    role: "Partner Success Manager",
    region: "LATAM",
    responsibilities: [
      "Partner ecosystem coordination",
      "Regional expansion support",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    subTeams: ["SI partners", "Regional resellers"],
  },
];

const regionColors: Record<string, string> = {
  "North America": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "EMEA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "APAC": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "LATAM": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const ExtendedAccountTeamSlide = () => {
  return (
    <div className="px-8 pt-6 pb-40">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <div className="p-2 rounded-xl bg-accent/20">
          <UsersRound className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Global Extended Account Team
          </h1>
          <p className="text-muted-foreground mt-1">
            Regional specialists ensuring worldwide coverage and execution
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader
            title="Regional Coverage"
            description="Extended team members providing local expertise and support across all regions"
            delay={100}
          />
          <div className="flex gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
            {Object.entries(regionColors).map(([region, colorClass]) => (
              <div
                key={region}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
              >
                {region}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {extendedTeamMembers.map((member, index) => (
            <div
              key={member.email}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${200 + index * 80}ms` }}
            >
              <div className="group relative p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 h-full">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-border/50 group-hover:ring-primary/40 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          regionColors[member.region] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        <MapPin className="w-2.5 h-2.5 inline mr-1" />
                        {member.region}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-primary truncate">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <ul className="space-y-1">
                    {member.responsibilities.slice(0, 2).map((resp, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                        <span className="line-clamp-1">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {member.subTeams && member.subTeams.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.subTeams.map((team, teamIndex) => (
                      <SubTeamBadge
                        key={team}
                        label={team}
                        delay={400 + index * 80 + teamIndex * 50}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
