import { useAccountData } from "@/context/AccountDataContext";

export const ClosePlanSlide = () => {
  const { data } = useAccountData();

  return (
    <div className="min-h-screen p-8 pb-32 relative">
      {/* Draft Badge */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
        <div className="absolute top-6 -right-8 w-40 bg-primary text-background text-sm font-bold py-1.5 text-center rotate-45 shadow-lg">
          Draft
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <h1 className="text-5xl font-bold text-primary mb-2">Close Plan</h1>
        <p className="text-xl text-muted-foreground">TBC</p>
      </div>

      {/* Placeholder Content */}
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-primary/50">📋</span>
          </div>
          <p className="text-lg text-muted-foreground">Close plan content to be confirmed</p>
        </div>
      </div>
    </div>
  );
};
