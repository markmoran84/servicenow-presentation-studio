import { useAccountData } from "@/context/AccountDataContext";

export const FY1RetrospectiveSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a3d3d] via-[#0d4a4a] to-[#1a5a5a] p-12 pb-32 flex flex-col">
      {/* Title */}
      <h1 className="text-5xl font-bold text-[#81c784] mb-8 italic">
        FY-1 Retrospective
      </h1>

      {/* Top Row - Date and Planner */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Previous Account Plan Date */}
        <div className="border border-[#81c784]/50 p-4 flex justify-between items-center">
          <span className="text-white text-sm">Previous Account Plan Date:</span>
          <span className="text-white text-sm">{data.history.lastPlanDate || "MM/DD/YYY"}</span>
        </div>

        {/* Previous Account Planner */}
        <div className="border border-[#81c784]/50 p-4 flex justify-between items-center">
          <span className="text-white text-sm">Previous Account Planner:</span>
          <div className="text-right">
            <div className="text-white text-sm font-medium">{data.history.plannerName}</div>
            <div className="text-white/80 text-xs">{data.history.plannerRole}</div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Left - What FY-1 Focused On */}
        <div className="border border-[#81c784]/50 p-6">
          <p className="text-white text-sm leading-relaxed mb-4">
            {data.history.lastPlanSummary}
          </p>
          <p className="text-white text-sm leading-relaxed">
            {data.history.whatDidNotWork}
          </p>
        </div>

        {/* Right - Empty Frame */}
        <div className="border border-[#81c784]/50 p-6">
          {/* Empty frame as per template */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border border-[#81c784]/50 p-4 mt-6 flex justify-between items-center">
        <a href="#" className="text-[#81c784] text-sm underline hover:text-[#a5d6a7]">
          Link of Last Account Plan Summary
        </a>
        <span className="text-[#81c784] text-sm">Approved</span>
      </div>
    </div>
  );
};
