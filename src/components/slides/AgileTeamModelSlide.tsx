import { useAccountData } from "@/context/AccountDataContext";

const AgileTeamModelSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "Company";

  // Outer ring roles with their positions (in degrees, starting from top)
  const outerRoles = [
    { name: "BU Sale", angle: -45 },
    { name: "Inspire Value", angle: 0 },
    { name: "Impact", angle: 45 },
    { name: "Sales Mgmt.", angle: 90 },
    { name: "Elevate", angle: 135 },
    { name: "Prod. Mgmt.", angle: 180 },
    { name: "Marketing", angle: 225 },
    { name: "Exec Sponsor", angle: 270 },
  ];

  const supportingBullets = [
    {
      title: "Agile Resource Allocation",
      description: "Core team dynamically pulls in specialized resources based on current account needs and priorities"
    },
    {
      title: "Flexible Engagement Model",
      description: "Resources scale up or down based on deal complexity, opportunity size, and strategic importance"
    },
    {
      title: "Cross-Functional Collaboration",
      description: "Seamless integration between sales, marketing, product, and executive functions"
    },
    {
      title: "Customer-Centric Focus",
      description: "All resources orient around delivering maximum value to the customer through coordinated efforts"
    },
    {
      title: "Rapid Response Capability",
      description: "Quick mobilization of specialized expertise when opportunities or challenges arise"
    }
  ];

  return (
    <div className="h-full flex flex-col p-8 bg-gradient-to-br from-[#1a1f35] via-[#1e2642] to-[#252d4a]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          The Task-Based Agile AM Model
        </h1>
        <p className="text-emerald-400 text-lg">
          {companyName} Account Team Structure
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-8">
        {/* Left Side - GTM Wheel Graphic */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-600 shadow-2xl" />
            
            {/* Middle Ring */}
            <div className="absolute inset-[60px] rounded-full bg-emerald-700/80" />
            
            {/* Core Team Circle */}
            <div className="absolute inset-[130px] rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-emerald-900 font-bold text-xl text-center">
                Core<br />Team
              </span>
            </div>

            {/* Arrows from core to outer ring */}
            {outerRoles.map((role, index) => {
              const angleRad = (role.angle - 90) * (Math.PI / 180);
              const startRadius = 75;
              const endRadius = 130;
              const startX = 210 + startRadius * Math.cos(angleRad);
              const startY = 210 + startRadius * Math.sin(angleRad);
              const endX = 210 + endRadius * Math.cos(angleRad);
              const endY = 210 + endRadius * Math.sin(angleRad);
              
              return (
                <svg
                  key={index}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${index}`}
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 8 3, 0 6" fill="#1a1f35" />
                    </marker>
                  </defs>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#1a1f35"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${index})`}
                  />
                </svg>
              );
            })}

            {/* Role Labels */}
            {outerRoles.map((role, index) => {
              const angleRad = (role.angle - 90) * (Math.PI / 180);
              const radius = 175;
              const x = 210 + radius * Math.cos(angleRad);
              const y = 210 + radius * Math.sin(angleRad);
              
              return (
                <div
                  key={index}
                  className="absolute text-white font-semibold text-sm text-center w-20 -ml-10 -mt-3"
                  style={{
                    left: x,
                    top: y,
                  }}
                >
                  {role.name}
                </div>
              );
            })}
          </div>

          {/* Label below graphic */}
          <p className="text-emerald-400 font-semibold text-lg mt-6">
            The GTM Wheel of Fire
          </p>
        </div>

        {/* Right Side - Supporting Bullets */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-emerald-400 font-semibold text-lg mb-4">
              Agile Operating Principles
            </h3>
            <div className="space-y-4">
              {supportingBullets.map((bullet, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {bullet.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-emerald-300 text-sm italic">
              "We work in an agile fashion — the core team pulls in resources as needed to maximize account value and respond to opportunities in real-time."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgileTeamModelSlide;
