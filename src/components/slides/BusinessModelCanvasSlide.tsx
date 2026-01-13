import { Card, CardContent } from "@/components/ui/card";
import { useAccountData } from "@/context/AccountDataContext";
import { SlideFooter } from "@/components/SlideFooter";
import { 
  Handshake, 
  Activity, 
  Key, 
  Heart, 
  Target, 
  Send, 
  Users, 
  Wallet, 
  TrendingUp,
  Swords
} from "lucide-react";

interface CanvasBlockProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  className?: string;
}

const CanvasBlock = ({ title, icon, items, className = "" }: CanvasBlockProps) => (
  <div className={`bg-sn-navy/90 rounded-lg p-3 h-full flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-2 text-white">
      {icon}
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <ul className="space-y-1 flex-1 overflow-auto">
      {items.map((item, index) => (
        <li key={index} className="text-xs text-white/80 leading-tight">
          • {item}
        </li>
      ))}
    </ul>
  </div>
);

export const BusinessModelCanvasSlide = () => {
  const { data } = useAccountData();
  const bm = data.businessModel;

  return (
    <div className="slide-container flex flex-col h-full overflow-auto">
      <div className="slide-header mb-4">
        <h1 className="slide-title">Business Model Canvas</h1>
        <p className="slide-subtitle">
          {data.basics.accountName} | How They Create, Deliver & Capture Value
        </p>
      </div>

      <div className="flex-1 min-h-0">
        {/* Main Canvas Grid - Classic 9-block layout */}
        <div className="grid grid-cols-10 gap-2 h-full">
          {/* Row 1: Key Partners | Key Activities + Key Resources | Value Prop | Customer Rel + Channels | Customer Segments */}
          
          {/* Key Partners - spans 2 cols, full height of top section */}
          <div className="col-span-2 row-span-2">
            <CanvasBlock
              title="Key Partners"
              icon={<Handshake className="w-4 h-4" />}
              items={bm.keyPartners}
              className="h-full"
            />
          </div>

          {/* Key Activities - spans 2 cols */}
          <div className="col-span-2">
            <CanvasBlock
              title="Key Activities"
              icon={<Activity className="w-4 h-4" />}
              items={bm.keyActivities}
            />
          </div>

          {/* Value Proposition - spans 2 cols, full height */}
          <div className="col-span-2 row-span-2">
            <CanvasBlock
              title="Value Proposition"
              icon={<Heart className="w-4 h-4" />}
              items={bm.valueProposition}
              className="h-full"
            />
          </div>

          {/* Customer Relationships - spans 2 cols */}
          <div className="col-span-2">
            <CanvasBlock
              title="Customer Relationships"
              icon={<Target className="w-4 h-4" />}
              items={bm.customerRelationships}
            />
          </div>

          {/* Customer Segments - spans 2 cols, full height */}
          <div className="col-span-2 row-span-2">
            <CanvasBlock
              title="Customer Segments"
              icon={<Users className="w-4 h-4" />}
              items={bm.customerSegments}
              className="h-full"
            />
          </div>

          {/* Key Resources - spans 2 cols */}
          <div className="col-span-2">
            <CanvasBlock
              title="Key Resources"
              icon={<Key className="w-4 h-4" />}
              items={bm.keyResources}
            />
          </div>

          {/* Channels - spans 2 cols */}
          <div className="col-span-2">
            <CanvasBlock
              title="Channels"
              icon={<Send className="w-4 h-4" />}
              items={bm.channels}
            />
          </div>

          {/* Bottom Row: Cost Structure | Revenue Streams | Competitors */}
          <div className="col-span-4">
            <CanvasBlock
              title="Cost Structure"
              icon={<Wallet className="w-4 h-4" />}
              items={bm.costStructure}
            />
          </div>

          <div className="col-span-4">
            <CanvasBlock
              title="Revenue Streams"
              icon={<TrendingUp className="w-4 h-4" />}
              items={bm.revenueStreams}
            />
          </div>

          <div className="col-span-2">
            <CanvasBlock
              title="Key Competitors"
              icon={<Swords className="w-4 h-4" />}
              items={bm.competitors}
            />
          </div>
        </div>
      </div>

      <SlideFooter />
    </div>
  );
};
