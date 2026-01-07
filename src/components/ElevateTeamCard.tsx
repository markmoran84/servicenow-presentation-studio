import { Mail } from "lucide-react";

interface ElevateTeamCardProps {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  delay?: number;
}

export const ElevateTeamCard = ({
  name,
  email,
  role,
  avatarUrl,
  delay = 0,
}: ElevateTeamCardProps) => {
  return (
    <div
      className="flex flex-col items-center opacity-0 animate-slide-in-right"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="role-badge text-center mb-3 text-xs">{role}</div>
      
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 mb-2">
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h4 className="font-semibold text-foreground text-sm text-center">{name}</h4>
      <a
        href={`mailto:${email}`}
        className="text-primary hover:text-primary/80 text-xs flex items-center gap-1 transition-colors"
      >
        <Mail className="w-3 h-3" />
        <span className="truncate max-w-[140px]">{email}</span>
      </a>
    </div>
  );
};
