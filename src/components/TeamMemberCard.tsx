import { Mail, Phone } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  email: string;
  phone?: string;
  role: string;
  responsibilities: string[];
  avatarUrl: string;
  delay?: number;
  compact?: boolean;
}

export const TeamMemberCard = ({
  name,
  email,
  phone,
  role,
  responsibilities,
  avatarUrl,
  delay = 0,
}: TeamMemberCardProps) => {
  return (
    <div
      className="team-card opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="role-badge text-center mb-3 text-xs py-1.5">{role}</div>
      
      <div className="flex items-start gap-2">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 flex-shrink-0">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-xs">{name}</h4>
          <a
            href={`mailto:${email}`}
            className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-1 truncate transition-colors"
          >
            <Mail className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </a>
          {phone && (
            <p className="text-muted-foreground text-[10px] flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5 flex-shrink-0" />
              {phone}
            </p>
          )}
        </div>
      </div>
      
      <ul className="mt-2 space-y-0.5">
        {responsibilities.map((item, index) => (
          <li
            key={index}
            className="text-[10px] text-muted-foreground flex items-start gap-1.5"
          >
            <span className="w-1 h-1 rounded-full bg-primary mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
