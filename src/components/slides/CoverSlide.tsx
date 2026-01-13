import { useAccountData } from "@/context/AccountDataContext";

export const CoverSlide = () => {
  const { data } = useAccountData();
  
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Premium background with depth */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(155deg, hsl(175 25% 7%) 0%, hsl(210 35% 5%) 40%, hsl(235 30% 7%) 100%)' 
        }}
      />
      
      {/* Ambient glow orbs */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full blur-[180px] translate-x-1/3 -translate-y-1/3"
        style={{ background: 'radial-gradient(circle, hsl(82 85% 55% / 0.08) 0%, transparent 70%)' }} 
      />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-[150px] -translate-x-1/4 translate-y-1/4"
        style={{ background: 'radial-gradient(circle, hsl(200 90% 50% / 0.06) 0%, transparent 70%)' }} 
      />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, hsl(82 85% 55% / 0.04) 0%, transparent 70%)' }} 
      />
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-16 lg:px-24 relative z-10">
        {/* ServiceNow badge */}
        <div className="mb-10 opacity-0 animate-fade-in">
          <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-white/70 tracking-wide">ServiceNow Global Account Plan</span>
          </span>
        </div>
        
        {/* Customer Name - Premium Typography */}
        <h1 
          className="text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-[-0.03em] mb-4 opacity-0 animate-fade-in leading-none"
          style={{ color: 'hsl(82 85% 55%)', animationDelay: '100ms' }}
        >
          {data.basics.accountName || "Customer Name"}
        </h1>
        
        {/* Global Account Plan */}
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white/90 tracking-tight mb-10 opacity-0 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          Global Account Plan
        </h2>
        
        {/* Date and FY */}
        <div 
          className="flex items-center gap-5 opacity-0 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <p className="text-lg text-white/50 font-medium tracking-wide">
            {monthYear}
          </p>
          <div className="w-px h-5 bg-white/20" />
          <span className="tier-badge">
            FY26
          </span>
        </div>
      </div>

      {/* Team Members Footer */}
      <div className="px-16 lg:px-24 pb-16 relative z-10">
        <div className="pt-8 border-t border-white/[0.08]">
          <p 
            className="metric-label mb-5 opacity-0 animate-fade-in" 
            style={{ animationDelay: '400ms' }}
          >
            Account Team
          </p>
          <div className="flex flex-wrap gap-x-16 gap-y-5">
            {data.basics.coreTeamMembers && data.basics.coreTeamMembers.length > 0 ? (
              data.basics.coreTeamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="flex flex-col opacity-0 animate-fade-in group"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <span className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                    {member.firstName} {member.lastName}
                  </span>
                  <span className="text-sm text-white/50 font-medium">
                    {member.title}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <span className="text-lg font-semibold text-primary">First Name Last Name</span>
                  <span className="text-sm text-white/50 font-medium">Client Director</span>
                </div>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <span className="text-lg font-semibold text-primary">First Name Last Name</span>
                  <span className="text-sm text-white/50 font-medium">Sr Solution Consultant</span>
                </div>
                <div className="flex flex-col opacity-0 animate-fade-in" style={{ animationDelay: '700ms' }}>
                  <span className="text-lg font-semibold text-primary">First Name Last Name</span>
                  <span className="text-sm text-white/50 font-medium">Sr Advisory Enterprise Architect</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
