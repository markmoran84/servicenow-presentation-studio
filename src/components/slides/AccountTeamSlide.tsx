import { useAccountData, ExtendedTeamMember } from "@/context/AccountDataContext";
import { Users, GripVertical } from "lucide-react";
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

type RoleType = "Guiding the Team" | "Building the PoV" | "Supporting the Team" | "Mapping the Value";

const getRoleTypeColor = (roleType: RoleType) => {
  const colors: Record<RoleType, { border: string; text: string; bg: string; accent: string }> = {
    "Guiding the Team": { border: "border-cyan-500/40", text: "text-cyan-400", bg: "bg-cyan-500/10", accent: "bg-cyan-500" },
    "Building the PoV": { border: "border-blue-500/40", text: "text-blue-400", bg: "bg-blue-500/10", accent: "bg-blue-500" },
    "Supporting the Team": { border: "border-emerald-500/40", text: "text-emerald-400", bg: "bg-emerald-500/10", accent: "bg-emerald-500" },
    "Mapping the Value": { border: "border-amber-500/40", text: "text-amber-400", bg: "bg-amber-500/10", accent: "bg-amber-500" },
  };
  return colors[roleType] || colors["Building the PoV"];
};

const getRoleTypeLabel = (roleType: RoleType) => {
  const labels: Record<RoleType, string> = {
    "Guiding the Team": "Guide",
    "Building the PoV": "PoV",
    "Supporting the Team": "Support",
    "Mapping the Value": "Value",
  };
  return labels[roleType] || "PoV";
};

interface SortableTeamCardProps {
  member: ExtendedTeamMember;
  index: number;
  id: string;
}

const SortableTeamCard = ({ member, index, id }: SortableTeamCardProps) => {
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

  const roleType = (member.roleType || "Building the PoV") as RoleType;
  const colors = getRoleTypeColor(roleType);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border ${colors.border} bg-white/[0.03] backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in hover:bg-white/[0.06] transition-colors relative group ${
        isDragging ? "z-50 shadow-2xl scale-105 opacity-100" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Role badge */}
      <div className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider mb-2 ${colors.bg} ${colors.text}`}>
        {getRoleTypeLabel(roleType)}
      </div>
      
      {/* Avatar Circle */}
      <div className={`w-12 h-12 rounded-full ${colors.border} border-2 flex items-center justify-center mb-2 ${colors.bg}`}>
        <span className={`text-sm font-bold ${colors.text}`}>
          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
        </span>
      </div>
      
      {/* Name */}
      <h4 className="font-semibold text-xs text-foreground leading-tight">
        {member.firstName} {member.lastName}
      </h4>
      
      {/* Title */}
      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
        {member.title}
      </p>
    </div>
  );
};

export const AccountTeamSlide = () => {
  const { data, reorderExtendedTeam } = useAccountData();
  const extendedTeam = data.basics.extendedTeam || [];
  const totalMembers = extendedTeam.length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Dynamic grid configuration based on member count
  const getGridConfig = () => {
    if (totalMembers <= 6) return { cols: 6, rows: 1 };
    if (totalMembers <= 10) return { cols: 5, rows: 2 };
    if (totalMembers <= 12) return { cols: 6, rows: 2 };
    if (totalMembers <= 15) return { cols: 5, rows: 3 };
    if (totalMembers <= 18) return { cols: 6, rows: 3 };
    return { cols: 5, rows: 4 }; // Up to 20
  };

  const { cols } = getGridConfig();
  
  const getGridColsClass = () => {
    switch (cols) {
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      case 6: return "grid-cols-6";
      default: return "grid-cols-6";
    }
  };

  // Generate unique IDs for sortable items
  const itemIds = extendedTeam.slice(0, 20).map((member, index) => 
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
    <div className="px-8 pt-6 pb-40 h-full flex flex-col">
      {extendedTeam.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <div className="glass-card rounded-2xl p-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Team Members Added</h3>
            <p className="text-sm text-muted-foreground/70">
              Add extended team members in the Input Form to populate this slide.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Main container with rounded border */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* Grid of member cards with drag-and-drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                <div className={`grid ${getGridColsClass()} gap-4 h-full auto-rows-fr`}>
                  {extendedTeam.slice(0, 20).map((member, index) => (
                    <SortableTeamCard
                      key={member.email || `member-${index}`}
                      id={member.email || `member-${index}`}
                      member={member}
                      index={index}
                    />
                  ))}
                  
                  {/* Empty placeholder cards to fill the grid */}
                  {Array.from({ length: Math.max(0, Math.ceil(totalMembers / cols) * cols - totalMembers) }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="rounded-xl border border-white/5 bg-white/[0.01] opacity-0 animate-fade-in"
                      style={{ animationDelay: `${150 + (totalMembers + index) * 30}ms` }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
};
