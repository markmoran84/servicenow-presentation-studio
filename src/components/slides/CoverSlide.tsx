import { useAccountData } from "@/context/AccountDataContext";

export const CoverSlide = () => {
  const { data } = useAccountData();
  
  // Get current month and year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-16 pb-24" 
         style={{ 
           background: 'linear-gradient(135deg, hsl(180 45% 20%) 0%, hsl(220 50% 18%) 50%, hsl(260 40% 22%) 100%)' 
         }}>
      
      {/* Main Content - Centered vertically */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Customer Name - Large Wasabi Green */}
        <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-4"
            style={{ color: 'hsl(82 85% 55%)' }}>
          {data.basics.accountName || "Customer Name"}
        </h1>
        
        {/* Global Account Plan - Large White */}
        <h2 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-6">
          Global Account Plan
        </h2>
        
        {/* Date - Smaller White */}
        <p className="text-xl md:text-2xl text-white font-medium">
          {monthYear}
        </p>
      </div>

      {/* Team Members - Bottom of slide */}
      <div className="flex flex-wrap gap-x-16 gap-y-4">
        {data.basics.coreTeamMembers && data.basics.coreTeamMembers.length > 0 ? (
          data.basics.coreTeamMembers.map((member, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-lg font-medium" style={{ color: 'hsl(82 85% 55%)' }}>
                {member.firstName} {member.lastName}
              </span>
              <span className="text-base text-white">
                {member.title}
              </span>
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col">
              <span className="text-lg font-medium" style={{ color: 'hsl(82 85% 55%)' }}>
                First Name Last Name
              </span>
              <span className="text-base text-white">
                Client Director
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium" style={{ color: 'hsl(82 85% 55%)' }}>
                First Name Last Name
              </span>
              <span className="text-base text-white">
                Sr Solution Consultant
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium" style={{ color: 'hsl(82 85% 55%)' }}>
                First Name Last Name
              </span>
              <span className="text-base text-white">
                Sr Advisory Enterprise Architect
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
