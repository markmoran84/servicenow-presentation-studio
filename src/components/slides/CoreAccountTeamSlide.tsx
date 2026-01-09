import { TeamMemberCard } from "@/components/TeamMemberCard";
import { ElevateTeamCard } from "@/components/ElevateTeamCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, Star } from "lucide-react";

const coreTeamMembers = [
  {
    name: "Jakob Hjortso",
    email: "jakob.hjortso@servicenow.com",
    phone: "+45 2889 0604",
    role: "Global Client Director",
    responsibilities: [
      "Governance and relationship",
      "Vision and Strategy",
      "Global team orchestration",
      "Global commercial oversight",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Manfred Birkhoff",
    email: "manfred.birkhoff@servicenow.com",
    phone: "+49 173 2328903",
    role: "Global Solution Consultant",
    responsibilities: [
      "Technology Strategy and Solutions",
      "Discovery and technical fit",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@servicenow.com",
    phone: "+44 7700 900123",
    role: "Strategic Account Manager",
    responsibilities: [
      "Commercial strategy execution",
      "Stakeholder alignment",
      "Pipeline development",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Kim",
    email: "david.kim@servicenow.com",
    phone: "+1 415 555 0199",
    role: "Technical Account Manager",
    responsibilities: [
      "Platform health & optimization",
      "Technical escalation management",
      "Roadmap alignment",
    ],
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
  },
];

const elevateTeam = [
  {
    name: "Matthias Gruen",
    email: "matthias.gruen@servicenow.com",
    role: "Value Advisory",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Manoj Patel",
    email: "manoj.patel@servicenow.com",
    role: "Enterprise Architecture",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  },
];

export const CoreAccountTeamSlide = () => {
  return (
    <div className="px-8 pt-6 pb-40">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in">
        <div className="p-2 rounded-xl bg-primary/10">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Global Core Account Team
          </h1>
          <p className="text-muted-foreground mt-1">
            Dedicated leadership driving strategic outcomes
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader
              title="Core Leadership"
              description="Fully dedicated team of senior resources assigned to support Maersk as part of ServiceNow's Marquee program"
              delay={100}
            />

            <div className="grid grid-cols-2 gap-4 mt-6">
              {coreTeamMembers.map((member, index) => (
                <div
                  key={member.email}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="group relative p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-primary/20">
                          <Star className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                          {member.role}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="text-sm text-muted-foreground">
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        Key Responsibilities
                      </p>
                      <ul className="space-y-1">
                        {member.responsibilities.map((resp, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/80 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-72 flex-shrink-0">
          <div className="glass-card rounded-2xl p-5 h-full">
            <SectionHeader
              title="Elevate Team"
              description="Extended experts who engage on building roadmaps and business cases"
              delay={150}
            />

            <div className="mt-6 space-y-6">
              {elevateTeam.map((member, index) => (
                <ElevateTeamCard
                  key={member.email}
                  {...member}
                  delay={300 + index * 150}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
