interface SlideFooterProps {
  slideNumber?: number;
  source?: string;
}

export const SlideFooter = ({ slideNumber, source }: SlideFooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="slide-footer">
      <div className="flex items-center gap-6">
        {/* ServiceNow Logo - exact corporate template style */}
        <span className="sn-logo text-lg text-foreground">
          servicen<span className="o">o</span>w
        </span>
        
        <div className="w-px h-5 bg-white/10" />
        
        {/* Customer Logo */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-foreground font-semibold text-sm tracking-wide">MAERSK</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {source && (
          <span className="text-muted-foreground text-xs">
            Source: {source}
          </span>
        )}
        <span className="text-muted-foreground/60 text-xs">
          © {currentYear} ServiceNow, Inc. All Rights Reserved.
        </span>
        {slideNumber && (
          <span className="text-muted-foreground text-sm font-medium min-w-[24px] text-right">
            {slideNumber}
          </span>
        )}
      </div>
    </footer>
  );
};
