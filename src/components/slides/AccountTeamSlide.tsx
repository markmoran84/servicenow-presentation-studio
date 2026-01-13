import { useAccountData } from "@/context/AccountDataContext";
import { Users } from "lucide-react";

type RoleType = "Guiding the Team" | "Building the PoV" | "Supporting the Team" | "Mapping the Value";

const ROLE_TYPE_ORDER: RoleType[] = [
  "Guiding the Team",
  "Building the PoV", 
  "Supporting the Team",
  "Mapping the Value"
];

const getRoleTypeColor = (roleType: RoleType) => {
  const colors: Record<RoleType, { border: string; text: string; bg: string }> = {
    "Guiding the Team": { border: "border-cyan-500/50", text: "text-cyan-400", bg: "bg-cyan-500/10" },
    "Building the PoV": { border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-500/10" },
    "Supporting the Team": { border: "border-emerald-500/50", text: "text-emerald-400", bg: "bg-emerald-500/10" },
    "Mapping the Value": { border: "border-amber-500/50", text: "text-amber-400", bg: "bg-amber-500/10" },
  };
  return colors[roleType] || colors["Building the PoV"];
};

export const AccountTeamSlide = () => {
  const { data } = useAccountData();
  const extendedTeam = data.basics.extendedTeam || [];

  // Group team members by role type
  const teamByRoleType = extendedTeam.reduce((acc, member) => {
    const roleType = (member.roleType || "Building the PoV") as RoleType;
    if (!acc[roleType]) acc[roleType] = [];
    acc[roleType].push(member);
    return acc;
  }, {} as Record<RoleType, typeof extendedTeam>);

  // Filter to only show role types that have members
  const activeRoleTypes = ROLE_TYPE_ORDER.filter(rt => teamByRoleType[rt]?.length > 0);

  // Calculate grid layout based on number of members
  const totalMembers = extendedTeam.length;
  const getGridCols = () => {
    if (totalMembers <= 6) return "grid-cols-3";
    if (totalMembers <= 9) return "grid-cols-3";
    if (totalMembers <= 12) return "grid-cols-4";
    if (totalMembers <= 16) return "grid-cols-4";
    return "grid-cols-5"; // Up to 18
  };

  // Determine if we should use a condensed layout
  const isCondensed = totalMembers > 12;

  return (
    <div className="px-8 pt-6 pb-40 h-full">
      {extendedTeam.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Team Members Added</h3>
            <p className="text-sm text-muted-foreground/70">
              Add extended team members in the Input Form to populate this slide.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Main content area - grid with role type columns */}
          <div className="flex-1 flex gap-4 min-h-0">
            {activeRoleTypes.map((roleType, roleIndex) => {
              const members = teamByRoleType[roleType] || [];
              const colors = getRoleTypeColor(roleType);
              
              // For "Mapping the Value" - render as a horizontal bar at bottom
              if (roleType === "Mapping the Value") return null;
              
              return (
                <div 
                  key={roleType}
                  className="flex-1 flex flex-col opacity-0 animate-fade-in"
                  style={{ animationDelay: `${roleIndex * 100}ms` }}
                >
                  {/* Role Type Header */}
                  <div className={`mb-4 px-4 py-2 rounded-lg ${colors.bg} ${colors.border} border text-center`}>
                    <h3 className={`text-sm font-semibold ${colors.text}`}>{roleType}</h3>
                  </div>
                  
                  {/* Members Grid */}
                  <div className={`flex-1 grid ${isCondensed ? 'grid-cols-2' : 'grid-cols-2'} gap-3 auto-rows-max content-start`}>
                    {members.map((member, memberIndex) => (
                      <div
                        key={member.email || memberIndex}
                        className="flex flex-col items-center text-center opacity-0 animate-fade-in"
                        style={{ animationDelay: `${(roleIndex * 100) + (memberIndex * 50)}ms` }}
                      >
                        {/* Avatar Circle */}
                        <div className={`w-12 h-12 rounded-full ${colors.border} border-2 flex items-center justify-center mb-2 ${colors.bg}`}>
                          <span className={`text-sm font-bold ${colors.text}`}>
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                        
                        {/* Name */}
                        <h4 className={`font-semibold text-xs ${colors.text} leading-tight`}>
                          {member.firstName} {member.lastName}
                        </h4>
                        
                        {/* Title */}
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 max-w-[120px]">
                          {member.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mapping the Value - Bottom Section */}
          {teamByRoleType["Mapping the Value"]?.length > 0 && (
            <div className="mt-4 opacity-0 animate-fade-in" style={{ animationDelay: `${activeRoleTypes.length * 100}ms` }}>
              <div className="relative">
                {/* Header Bar */}
                <div className={`mb-3 px-4 py-2 rounded-lg ${getRoleTypeColor("Mapping the Value").bg} ${getRoleTypeColor("Mapping the Value").border} border text-center inline-block`}>
                  <h3 className={`text-sm font-semibold ${getRoleTypeColor("Mapping the Value").text}`}>Mapping the Value</h3>
                </div>
                
                {/* Members in a horizontal row */}
                <div className="flex flex-wrap gap-4 justify-start">
                  {teamByRoleType["Mapping the Value"].map((member, memberIndex) => (
                    <div
                      key={member.email || memberIndex}
                      className="flex flex-col items-center text-center opacity-0 animate-fade-in"
                      style={{ animationDelay: `${(activeRoleTypes.length * 100) + (memberIndex * 50)}ms` }}
                    >
                      {/* Avatar Circle */}
                      <div className={`w-12 h-12 rounded-full ${getRoleTypeColor("Mapping the Value").border} border-2 flex items-center justify-center mb-2 ${getRoleTypeColor("Mapping the Value").bg}`}>
                        <span className={`text-sm font-bold ${getRoleTypeColor("Mapping the Value").text}`}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Name */}
                      <h4 className={`font-semibold text-xs ${getRoleTypeColor("Mapping the Value").text} leading-tight`}>
                        {member.firstName} {member.lastName}
                      </h4>
                      
                      {/* Title */}
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 max-w-[120px]">
                        {member.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
