import { useAccountData } from "@/context/AccountDataContext";

export const ThankYouSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "Customer";
  const coreTeam = data.basics.coreTeamMembers || [];
  
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get team member names for display
  const teamNames = coreTeam.length > 0 
    ? coreTeam.map(m => `${m.firstName} ${m.lastName}`).join(' • ')
    : "Account Team";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-32">
      {/* Thank You */}
      <div className="text-center opacity-0 animate-fade-in">
        <h1 className="text-8xl md:text-9xl font-bold text-primary mb-8">
          Thank You
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          {companyName} Global Account Plan
        </h2>
        
        <p className="text-xl text-muted-foreground mb-12">
          {monthYear}
        </p>
        
        {/* Team Names */}
        <p className="text-lg text-primary font-medium opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {teamNames}
        </p>
      </div>
    </div>
  );
};
