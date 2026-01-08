export const CoverSlide = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-12 py-10 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-sn-navy opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-extrabold mb-2 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <span className="text-primary">Maersk</span>
          </h1>
          <h2 className="text-6xl font-bold text-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Global Account Plan
          </h2>
          <p className="text-2xl text-muted-foreground font-medium opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            January 2026
          </p>
        </div>
      </div>
      
      {/* Bottom team credits */}
      <div className="relative z-10 flex items-end gap-16 pb-8 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div>
          <p className="text-primary font-semibold text-lg">Jakob Hjortsø</p>
          <p className="text-muted-foreground text-sm">Client Director</p>
        </div>
        <div>
          <p className="text-primary font-semibold text-lg">Morten Kristensen</p>
          <p className="text-muted-foreground text-sm">Sr Solution Consultant</p>
        </div>
        <div>
          <p className="text-primary font-semibold text-lg">Mark Moran</p>
          <p className="text-muted-foreground text-sm">Sr Advisory Enterprise Architect</p>
        </div>
      </div>
    </div>
  );
};
