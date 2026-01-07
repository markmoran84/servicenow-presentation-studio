export const SlideFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 px-8 py-3 flex items-center justify-between border-t border-border/30 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex items-center gap-4">
        <span className="text-foreground font-bold text-lg tracking-tight">
          service<span className="font-normal">now</span>
        </span>
        <div className="w-px h-5 bg-border/50" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-foreground font-semibold text-sm">MAERSK</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-muted-foreground text-xs">
          © 2026 ServiceNow, Inc. All Rights Reserved. Confidential.
        </span>
        <span className="text-muted-foreground text-sm font-medium">3</span>
      </div>
    </footer>
  );
};
