export const SlideFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 px-8 py-3 flex items-center justify-between border-t border-border/20 bg-background/90 backdrop-blur-md z-50">
      <div className="flex items-center gap-6">
        {/* ServiceNow Logo - matching corporate template style */}
        <span className="sn-logo text-lg text-foreground">
          servicen<span className="o">o</span>w
        </span>
        
      </div>
      
      <div className="flex items-center gap-6">
        <span className="text-muted-foreground text-xs">
          FY26 Account Plan • Confidential
        </span>
        <span className="text-muted-foreground/50 text-xs">
          © 2026 ServiceNow, Inc. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
