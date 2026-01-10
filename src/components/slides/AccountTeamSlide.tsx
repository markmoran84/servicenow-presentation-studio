import { useAccountData } from "@/context/AccountDataContext";
import { SectionHeader } from "@/components/SectionHeader";
import { Mail, Phone, Users, Globe, Building2 } from "lucide-react";

export const AccountTeamSlide = () => {
  const { data } = useAccountData();
  const extendedTeam = data.basics.extendedTeam || [];

  // Group team members by region
  const teamByRegion = extendedTeam.reduce((acc, member) => {
    const region = member.region || "Global";
    if (!acc[region]) acc[region] = [];
    acc[region].push(member);
    return acc;
  }, {} as Record<string, typeof extendedTeam>);

  const regionOrder = ["Global", "EMEA", "NA", "APAC", "LATAM"];
  const sortedRegions = Object.keys(teamByRegion).sort(
    (a, b) => regionOrder.indexOf(a) - regionOrder.indexOf(b)
  );

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      Global: "from-primary/20 to-primary/5 border-primary/30",
      EMEA: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
      NA: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
      APAC: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
      LATAM: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    };
    return colors[region] || colors.Global;
  };

  const getRegionBadgeColor = (region: string) => {
    const colors: Record<string, string> = {
      Global: "bg-primary/20 text-primary",
      EMEA: "bg-blue-500/20 text-blue-400",
      NA: "bg-emerald-500/20 text-emerald-400",
      APAC: "bg-amber-500/20 text-amber-400",
      LATAM: "bg-purple-500/20 text-purple-400",
    };
    return colors[region] || colors.Global;
  };

  return (
    <div className="px-8 pt-6 pb-40">
      <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-in">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Global Extended Account Team
          </h1>
          <p className="text-muted-foreground mt-1">
            Dedicated team of {extendedTeam.length} resources supporting {data.basics.accountName}
          </p>
        </div>
      </div>

      {extendedTeam.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Team Members Added</h3>
          <p className="text-sm text-muted-foreground/70">
            Add extended team members in the Input Form to populate this slide.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* All team members in a responsive grid */}
          <div className="glass-card rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {extendedTeam.map((member, index) => (
                <div
                  key={member.email || index}
                  className={`relative p-3 rounded-lg bg-gradient-to-br ${getRegionColor(member.region || "Global")} border backdrop-blur-sm opacity-0 animate-fade-in transition-all hover:scale-[1.02] hover:shadow-lg`}
                  style={{ animationDelay: `${150 + index * 30}ms` }}
                >
                  {/* Region Badge */}
                  <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${getRegionBadgeColor(member.region || "Global")}`}>
                    {member.region || "Global"}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/40 flex items-center justify-center mb-2">
                    <span className="text-sm font-bold text-primary">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </span>
                  </div>

                  {/* Name & Title */}
                  <h4 className="font-semibold text-foreground text-xs leading-tight">
                    {member.firstName} {member.lastName}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {member.title}
                  </p>

                  {/* Contact Info */}
                  <div className="mt-2 space-y-0.5">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-primary hover:text-primary/80 text-[9px] flex items-center gap-1 truncate transition-colors"
                    >
                      <Mail className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{member.email.split("@")[0]}</span>
                    </a>
                  </div>

                  {/* Sub Teams - compact display */}
                  {member.subTeams && member.subTeams.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-0.5">
                      {member.subTeams.slice(0, 1).map((team, idx) => (
                        <span
                          key={idx}
                          className="px-1 py-0.5 rounded bg-secondary/50 text-[7px] text-muted-foreground truncate max-w-full"
                        >
                          {team}
                        </span>
                      ))}
                      {member.subTeams.length > 1 && (
                        <span className="text-[7px] text-muted-foreground/60">+{member.subTeams.length - 1}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Region Summary */}
          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{ animationDelay: `${200 + extendedTeam.length * 50}ms` }}>
            {sortedRegions.map((region) => (
              <div
                key={region}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getRegionColor(region)} border`}
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{region}</span>
                <span className="text-xs text-muted-foreground">({teamByRegion[region].length})</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/30 border border-border/30">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-xs text-muted-foreground">({extendedTeam.length} members)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
