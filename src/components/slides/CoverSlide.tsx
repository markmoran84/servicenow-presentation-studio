import { useAccountData } from "@/context/AccountDataContext";

export const CoverSlide = () => {
  const { data } = useAccountData();
  
  // Get current month and year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background gradient with subtle pattern */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, hsl(165 40% 12%) 0%, hsl(195 45% 10%) 40%, hsl(220 45% 12%) 100%)' 
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
        {/* Small ServiceNow badge */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
            ServiceNow Global Account Plan
          </span>
        </div>
        
        {/* Customer Name - Large Wasabi Green */}
        <h1 
          className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in"
          style={{ color: 'hsl(82 85% 55%)', animationDelay: '100ms' }}
        >
          {data.basics.accountName || "Customer Name"}
        </h1>
        
        {/* Global Account Plan - Large White with subtle gradient */}
        <h2 
          className="text-5xl md:text-6xl font-bold text-white/90 tracking-tight mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          Global Account Plan
        </h2>
        
        {/* Date and FY */}
        <div 
          className="flex items-center gap-4 opacity-0 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <p className="text-xl text-white/60 font-medium">
            {monthYear}
          </p>
          <div className="w-px h-6 bg-white/20" />
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30">
            FY26
          </span>
        </div>
      </div>

      {/* Team Members - Bottom of slide */}
      <div className="px-16 pb-20 relative z-10">
        <div className="border-t border-white/10 pt-8">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
            Account Team
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {data.basics.coreTeamMembers && data.basics.coreTeamMembers.length > 0 ? (
              data.basics.coreTeamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="flex flex-col opacity-0 animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <span className="text-lg font-semibold" style={{ color: 'hsl(82 85% 55%)' }}>
                    {member.firstName} {member.lastName}
                  </span>
                  <span className="text-sm text-white/60">
                    {member.title}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <span className="text-lg font-semibold" style={{ color: 'hsl(82 85% 55%)' }}>
                    First Name Last Name
                  </span>
                  <span className="text-sm text-white/60">
                    Client Director
                  </span>
                </div>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <span className="text-lg font-semibold" style={{ color: 'hsl(82 85% 55%)' }}>
                    First Name Last Name
                  </span>
                  <span className="text-sm text-white/60">
                    Sr Solution Consultant
                  </span>
                </div>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '700ms' }}>
                  <span className="text-lg font-semibold" style={{ color: 'hsl(82 85% 55%)' }}>
                    First Name Last Name
                  </span>
                  <span className="text-sm text-white/60">
                    Sr Advisory Enterprise Architect
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
