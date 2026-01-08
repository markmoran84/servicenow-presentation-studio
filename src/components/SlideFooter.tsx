export const SlideFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 px-8 py-3 flex items-center justify-between border-t border-border/20 bg-background/90 backdrop-blur-md z-50">
      <div className="flex items-center gap-6">
        {/* ServiceNow Logo */}
        <span className="text-foreground font-bold text-lg tracking-tight">
          service<span className="font-light text-primary">now</span>
        </span>
        
        <div className="w-px h-5 bg-border/30" />
        
        {/* Maersk Logo */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-foreground font-semibold text-sm tracking-wide">MAERSK</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-muted-foreground text-xs">
          FY26 Account Plan • Confidential
        </span>
        <span className="text-muted-foreground/50 text-xs">
          © 2026 ServiceNow, Inc.
        </span>
      </div>
    </footer>
  );
};
