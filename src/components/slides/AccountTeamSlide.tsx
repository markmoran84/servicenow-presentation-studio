import { TeamMemberCard } from "@/components/TeamMemberCard";
import { ElevateTeamCard } from "@/components/ElevateTeamCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SubTeamBadge } from "@/components/SubTeamBadge";
import { ArrowLeft, ArrowRight } from "lucide-react";

const accountTeamMembers = {
  leadership: [
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
  ],
  regional: [
    {
      name: "Ciara Breslin",
      email: "ciara.breslin@servicenow.com",
      role: "Account Executive NA",
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
      role: "Customer Success Executive EMEA",
      responsibilities: [
        "Interlock to Post-Sales",
        "Drives Business Value for customer",
        "Delivery operating model governance",
      ],
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Fikret Uenlue",
      email: "fikret.uenlue@servicenow.com",
      role: "Services Account Executive EMEA",
      responsibilities: [
        "Point of contact for Expert Services and Success offerings",
      ],
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
      subTeams: ["Expert services, training", "Impact"],
    },
  ],
  consultants: [
    {
      name: "Greg Pope",
      email: "greg.pope@servicenow.com",
      role: "Solution Consultant NA",
      responsibilities: [
        "Presales and value engineering",
        "Leverages global synergies",
      ],
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Brian Murchison",
      email: "brian.murchison@servicenow.com",
      role: "Customer Success Executive NA",
      responsibilities: [
        "Interlock to Post-Sales",
        "Drives Business Value for customer",
        "Delivery operating model governance",
      ],
      avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
      subTeams: ["Product success teams", "Product management"],
    },
    {
      name: "John Duker",
      email: "john.duker@servicenow.com",
      role: "Services Account Executive NA",
      responsibilities: [
        "Point of contact for Expert Services and Success offerings",
      ],
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face",
    },
  ],
};

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

export const AccountTeamSlide = () => {
  return (
    <div className="px-8 pt-6 pb-40">
      <h1 className="text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in">
        Global Account Team
      </h1>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="glass-card rounded-2xl p-5">
            <SectionHeader
              title="Account Team"
              description="Fully dedicated team of resources assigned to support Maersk as part of ServiceNow's Marquee program"
              delay={100}
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
              {accountTeamMembers.leadership.map((member, index) => (
                <TeamMemberCard
                  key={member.email}
                  {...member}
                  delay={200 + index * 100}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 my-4 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 connector-line" />
              <span className="text-muted-foreground text-sm font-medium px-4">
                Regional point of contacts
              </span>
              <div className="flex-1 connector-line" />
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {accountTeamMembers.regional.map((member, index) => (
                <div key={member.email} className="flex flex-col">
                  <TeamMemberCard
                    {...member}
                    delay={500 + index * 100}
                  />
                  {member.subTeams && (
                    <div className="mt-2 space-y-1.5">
                      {member.subTeams.map((team, teamIndex) => (
                        <SubTeamBadge
                          key={team}
                          label={team}
                          delay={700 + index * 100 + teamIndex * 50}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {accountTeamMembers.consultants.map((member, index) => (
                <div key={member.email} className="flex flex-col">
                  <TeamMemberCard
                    {...member}
                    delay={800 + index * 100}
                  />
                  {member.subTeams && (
                    <div className="mt-2 space-y-1.5">
                      {member.subTeams.map((team, teamIndex) => (
                        <SubTeamBadge
                          key={team}
                          label={team}
                          delay={1000 + index * 100 + teamIndex * 50}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-5 h-full">
            <SectionHeader
              title="Elevate Team"
              description="Extended team of resources who engage with Marquee customers on building roadmaps and business cases."
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
