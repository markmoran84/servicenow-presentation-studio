import { useAccountData, ExtendedTeamMember } from "@/context/AccountDataContext";
import { Users, Mail, Phone } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type RoleType = "Core Team" | "Sales Team";

const getRoleTypeColor = (roleType: RoleType) => {
  const colors: Record<RoleType, { border: string; text: string; bg: string }> = {
    "Core Team": { border: "border-primary/40", text: "text-primary", bg: "bg-primary/10" },
    "Sales Team": { border: "border-cyan-500/40", text: "text-cyan-400", bg: "bg-cyan-500/10" },
  };
  return colors[roleType] || colors["Core Team"];
};

interface TeamMemberCardProps {
  member: ExtendedTeamMember;
  index: number;
  id: string;
}

const TeamMemberCard = ({ member, index, id }: TeamMemberCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${150 + index * 30}ms`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass-card p-4 opacity-0 animate-fade-in cursor-grab active:cursor-grabbing ${
        isDragging ? "z-50 shadow-2xl scale-105 opacity-100" : ""
      }`}
    >
      {/* Role Badge */}
      <div className="flex justify-center mb-3">
        <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-medium">
          {member.title || "Team Member"}
        </span>
      </div>

      {/* Avatar and Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-foreground truncate">
            {member.firstName} {member.lastName}
          </h4>
          {member.email && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-[10px] text-primary truncate">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-[10px] text-muted-foreground">{member.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Responsibilities */}
      {member.responsibilities && member.responsibilities.length > 0 && (
        <ul className="mt-3 space-y-1">
          {member.responsibilities.slice(0, 4).map((resp, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AccountTeamSlide = () => {
  const { data, reorderExtendedTeam } = useAccountData();
  const extendedTeam = data.basics.extendedTeam || [];
  const accountName = data.basics.accountName || "Account";

  // Split into Core Team (first 3) and Sales Team (next 4)
  const coreTeam = extendedTeam.slice(0, 3);
  const salesTeam = extendedTeam.slice(3, 7);

  // Executives from engagement
  const executives = data.engagement.knownExecutiveSponsors?.slice(0, 5) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = extendedTeam.slice(0, 7).map((member, index) => 
    member.email || `member-${index}`
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over.id as string);
      reorderExtendedTeam(oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-10 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Global Core Account Team
          </h1>
        </div>

        {extendedTeam.length === 0 ? (
          <div className="glass-card p-12 text-center opacity-0 animate-fade-in">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Team Members Added</h3>
            <p className="text-sm text-muted-foreground/70">
              Add extended team members in the Input Form to populate this slide.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-12 gap-5">
                {/* Main Team Area */}
                <div className="col-span-9 space-y-6">
                  {/* Core Team Section */}
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-primary font-bold text-sm uppercase tracking-wider">Core Team</h2>
                      <div className="flex-1 h-px bg-primary/30" />
                    </div>
                    <p className="text-muted-foreground text-xs mb-5">
                      Fully dedicated team of resources assigned to support {accountName} as part of ServiceNow's Marquee program
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {coreTeam.map((member, index) => (
                        <TeamMemberCard
                          key={member.email || `core-${index}`}
                          id={member.email || `member-${index}`}
                          member={member}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sales Team Section */}
                  {salesTeam.length > 0 && (
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-primary font-bold text-sm uppercase tracking-wider">Sales Team</h2>
                        <div className="flex-1 h-px bg-primary/30" />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {salesTeam.map((member, index) => (
                          <TeamMemberCard
                            key={member.email || `sales-${index}`}
                            id={member.email || `member-${index + 3}`}
                            member={member}
                            index={index + 3}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Executives Sidebar */}
                <div className="col-span-3">
                  <div className="glass-card p-5 h-full">
                    <h2 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">Executives</h2>
                    <p className="text-muted-foreground text-[10px] mb-4 leading-relaxed">
                      Senior leaders who provide executive-level engagement, strategic guidance, and air cover to support customer transformation and critical decisions
                    </p>
                    <div className="space-y-4">
                      {executives.length > 0 ? (
                        executives.map((exec, index) => {
                          const parts = exec.split("(");
                          const name = parts[0].trim();
                          const role = parts[1]?.replace(")", "") || "Executive";
                          return (
                            <div key={index} className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                              <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                  {name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{name}</p>
                                <p className="text-[10px] text-primary">{role}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-muted-foreground text-xs italic">Add executive sponsors in the Input Form</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
