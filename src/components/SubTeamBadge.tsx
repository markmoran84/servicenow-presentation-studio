interface SubTeamBadgeProps {
  label: string;
  delay?: number;
}

export const SubTeamBadge = ({ label, delay = 0 }: SubTeamBadgeProps) => {
  return (
    <div
      className="role-badge-filled text-center text-xs py-1.5 px-3 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </div>
  );
};
