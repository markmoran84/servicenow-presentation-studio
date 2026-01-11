import { useAccountData } from "@/context/AccountDataContext";
import { useState, useEffect } from "react";

const AgileTeamModelSlide = () => {
  const { data } = useAccountData();
  const companyName = data.basics.accountName || "Company";
  const [activeSegments, setActiveSegments] = useState<number[]>([0, 2, 5]);

  // Cycle through different "active" configurations to show dynamic resource allocation
  useEffect(() => {
    const scenarios = [
      [0, 2, 5],      // CRM Sale, Impact, Prod Mgmt
      [1, 3, 6, 7],   // Inspire Value, Sales Mgmt, Marketing, Exec Sponsor
      [0, 1, 4, 5],   // BU Sale, Inspire Value, Elevate, Prod Mgmt
      [2, 3, 6],      // Impact, Sales Mgmt, Marketing
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % scenarios.length;
      setActiveSegments(scenarios[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // 8 outer ring roles positioned around the wheel
  const outerRoles = [
    { name: "BU Sale", shortName: "BU\nSale" },
    { name: "Inspire Value", shortName: "Inspire\nValue" },
    { name: "Impact", shortName: "Impact" },
    { name: "Sales Mgmt.", shortName: "Sales\nMgmt." },
    { name: "Elevate", shortName: "Elevate" },
    { name: "Prod. Mgmt.", shortName: "Prod.\nMgmt." },
    { name: "Marketing", shortName: "Marketing" },
    { name: "Exec Sponsor", shortName: "Exec\nSponsor" },
  ];

  const supportingBullets = [
    {
      title: "Dynamic Resource Activation",
      description: "Core team activates specific resources based on current pursuit phase and customer needs"
    },
    {
      title: "Scenario-Based Engagement",
      description: "Different workstreams engage different combinations of expertise — the wheel illuminates who's active"
    },
    {
      title: "Flexible Scale",
      description: "Resources scale up or down based on deal complexity and strategic importance"
    },
    {
      title: "Rapid Mobilization",
      description: "Quick activation of specialized expertise when opportunities arise"
    }
  ];

  const centerX = 200;
  const centerY = 200;
  const outerRadius = 180;
  const middleRadius = 130;
  const innerRadius = 70;

  // Generate segment paths for the outer ring
  const generateSegmentPath = (index: number, startR: number, endR: number) => {
    const segmentAngle = (2 * Math.PI) / 8;
    const startAngle = index * segmentAngle - Math.PI / 2 - segmentAngle / 2;
    const endAngle = startAngle + segmentAngle;
    const gap = 0.02; // Small gap between segments
    
    const x1 = centerX + startR * Math.cos(startAngle + gap);
    const y1 = centerY + startR * Math.sin(startAngle + gap);
    const x2 = centerX + endR * Math.cos(startAngle + gap);
    const y2 = centerY + endR * Math.sin(startAngle + gap);
    const x3 = centerX + endR * Math.cos(endAngle - gap);
    const y3 = centerY + endR * Math.sin(endAngle - gap);
    const x4 = centerX + startR * Math.cos(endAngle - gap);
    const y4 = centerY + startR * Math.sin(endAngle - gap);
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${endR} ${endR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${startR} ${startR} 0 0 0 ${x1} ${y1}`;
  };

  // Generate arrow path from core to segment
  const generateArrowPath = (index: number) => {
    const segmentAngle = (2 * Math.PI) / 8;
    const angle = index * segmentAngle - Math.PI / 2;
    
    const startX = centerX + (innerRadius + 15) * Math.cos(angle);
    const startY = centerY + (innerRadius + 15) * Math.sin(angle);
    const endX = centerX + (middleRadius - 10) * Math.cos(angle);
    const endY = centerY + (middleRadius - 10) * Math.sin(angle);
    
    return { startX, startY, endX, endY, angle };
  };

  // Get label position
  const getLabelPosition = (index: number) => {
    const segmentAngle = (2 * Math.PI) / 8;
    const angle = index * segmentAngle - Math.PI / 2;
    const radius = (middleRadius + outerRadius) / 2 + 5;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <div className="h-full flex flex-col p-8 bg-gradient-to-br from-[#0f1628] via-[#162033] to-[#1a2744]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">
          The Task-Based Agile AM Model
        </h1>
        <p className="text-emerald-400 text-lg">
          {companyName} Account Team — Dynamic Resource Activation
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-10 items-center">
        {/* Left Side - GTM Wheel Graphic */}
        <div className="flex flex-col items-center justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
            <defs>
              {/* Gradients for active/inactive segments */}
              <radialGradient id="activeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </radialGradient>
              <radialGradient id="inactiveGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#0f2744" />
              </radialGradient>
              <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#34d399" />
              </radialGradient>
              {/* Glow filter for active segments */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {/* Arrow marker */}
              <marker
                id="arrowMarker"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f1628" />
              </marker>
              <marker
                id="arrowMarkerActive"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
              </marker>
            </defs>

            {/* Outer ring background */}
            <circle cx={centerX} cy={centerY} r={outerRadius} fill="#0a1525" />

            {/* Outer ring segments */}
            {outerRoles.map((_, index) => {
              const isActive = activeSegments.includes(index);
              return (
                <path
                  key={`outer-${index}`}
                  d={generateSegmentPath(index, middleRadius + 2, outerRadius - 2)}
                  fill={isActive ? "url(#activeGradient)" : "url(#inactiveGradient)"}
                  stroke={isActive ? "#6ee7b7" : "#1e3a5f"}
                  strokeWidth="1"
                  filter={isActive ? "url(#glow)" : undefined}
                  className="transition-all duration-700"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                />
              );
            })}

            {/* Middle ring (darker) */}
            <circle 
              cx={centerX} 
              cy={centerY} 
              r={middleRadius} 
              fill="#0a1525"
              stroke="#1e3a5f"
              strokeWidth="2"
            />

            {/* Arrows from core outward */}
            {outerRoles.map((_, index) => {
              const arrow = generateArrowPath(index);
              const isActive = activeSegments.includes(index);
              return (
                <g key={`arrow-${index}`} className="transition-all duration-700">
                  <line
                    x1={arrow.startX}
                    y1={arrow.startY}
                    x2={arrow.endX}
                    y2={arrow.endY}
                    stroke={isActive ? "#34d399" : "#374151"}
                    strokeWidth={isActive ? "3" : "2"}
                    markerEnd={isActive ? "url(#arrowMarkerActive)" : "url(#arrowMarker)"}
                    style={{ opacity: isActive ? 1 : 0.4 }}
                  />
                </g>
              );
            })}

            {/* Core Team Circle */}
            <circle 
              cx={centerX} 
              cy={centerY} 
              r={innerRadius} 
              fill="url(#coreGradient)"
              filter="url(#glow)"
            />
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              className="fill-emerald-900 font-bold text-lg"
            >
              Core
            </text>
            <text
              x={centerX}
              y={centerY + 14}
              textAnchor="middle"
              className="fill-emerald-900 font-bold text-lg"
            >
              Team
            </text>

            {/* Role Labels */}
            {outerRoles.map((role, index) => {
              const pos = getLabelPosition(index);
              const isActive = activeSegments.includes(index);
              const lines = role.shortName.split('\n');
              
              return (
                <g key={`label-${index}`}>
                  {lines.map((line, lineIndex) => (
                    <text
                      key={lineIndex}
                      x={pos.x}
                      y={pos.y + (lineIndex - (lines.length - 1) / 2) * 14}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-xs font-semibold transition-all duration-700 ${
                        isActive ? 'fill-white' : 'fill-gray-400'
                      }`}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Label below graphic */}
          <div className="text-center mt-4">
            <p className="text-emerald-400 font-bold text-lg">
              The GTM Wheel of Fire
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Active resources illuminate based on current pursuit
            </p>
          </div>
        </div>

        {/* Right Side - Supporting Bullets */}
        <div className="flex-1 flex flex-col justify-center space-y-5 max-w-md">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-emerald-400 font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Agile Operating Model
            </h3>
            <div className="space-y-4">
              {supportingBullets.map((bullet, index) => (
                <div key={index} className="flex gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {bullet.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-5">
            <p className="text-emerald-300 text-sm italic leading-relaxed">
              "We operate in an agile fashion — the core team dynamically activates specialized resources as opportunities emerge and evolve."
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              <span className="text-gray-300">Active Resource</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-gray-400">Available Resource</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgileTeamModelSlide;
