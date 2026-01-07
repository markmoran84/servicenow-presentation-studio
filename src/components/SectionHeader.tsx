interface SectionHeaderProps {
  title: string;
  description?: string;
  delay?: number;
}

export const SectionHeader = ({ title, description, delay = 0 }: SectionHeaderProps) => {
  return (
    <div
      className="opacity-0 animate-slide-in-left"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-primary font-bold text-lg tracking-wide uppercase">
          {title}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
      </div>
      {description && (
        <p className="text-muted-foreground text-sm max-w-xl">{description}</p>
      )}
    </div>
  );
};
