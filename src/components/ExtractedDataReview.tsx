import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Check, 
  X, 
  Building2, 
  DollarSign, 
  Target, 
  AlertTriangle,
  TrendingUp,
  Users,
  Leaf,
  FileText
} from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
}

const EditableField = ({ label, value, onSave, multiline = false }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex gap-2">
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-sm"
              rows={3}
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-sm"
            />
          )}
          <div className="flex flex-col gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start justify-between gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">
          {value || <span className="text-muted-foreground italic">Not set</span>}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

interface EditableListProps {
  label: string;
  items: string[];
  onSave: (items: string[]) => void;
}

const EditableList = ({ label, items, onSave }: EditableListProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(items.join("\n"));

  const handleSave = () => {
    const newItems = editValue.split("\n").map(s => s.trim()).filter(Boolean);
    onSave(newItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(items.join("\n"));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex gap-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 text-sm"
            rows={4}
            placeholder="One item per line"
          />
          <div className="flex flex-col gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-foreground flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">No items</p>
      )}
    </div>
  );
};

export const ExtractedDataReview = () => {
  const { data, updateData } = useAccountData();
  const [activeTab, setActiveTab] = useState("basics");

  const hasData = data.basics.accountName || data.financial.customerRevenue || 
                  data.strategy.corporateStrategy.length > 0 || 
                  data.swot.strengths.length > 0;

  if (!hasData) return null;

  return (
    <Card className="glass-card border-accent/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4 text-accent" />
          Extracted Data Review
          <Badge variant="outline" className="ml-2 text-xs">Click any field to edit</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="basics" className="text-xs gap-1">
              <Building2 className="w-3 h-3" />
              Basics
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs gap-1">
              <DollarSign className="w-3 h-3" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs gap-1">
              <Target className="w-3 h-3" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="swot" className="text-xs gap-1">
              <TrendingUp className="w-3 h-3" />
              SWOT
            </TabsTrigger>
            <TabsTrigger value="annual" className="text-xs gap-1">
              <Leaf className="w-3 h-3" />
              Annual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-3 space-y-1">
            <EditableField
              label="Company Name"
              value={data.basics.accountName}
              onSave={(v) => updateData("basics", { accountName: v })}
            />
            <EditableField
              label="Industry"
              value={data.basics.industry}
              onSave={(v) => updateData("basics", { industry: v })}
            />
            <EditableField
              label="Region"
              value={data.basics.region}
              onSave={(v) => updateData("basics", { region: v })}
            />
          </TabsContent>

          <TabsContent value="financial" className="mt-3 space-y-1">
            <EditableField
              label="Revenue"
              value={data.financial.customerRevenue}
              onSave={(v) => updateData("financial", { customerRevenue: v })}
            />
            <EditableField
              label="Growth Rate"
              value={data.financial.growthRate}
              onSave={(v) => updateData("financial", { growthRate: v })}
            />
            <EditableField
              label="Margin/EBIT"
              value={data.financial.marginEBIT}
              onSave={(v) => updateData("financial", { marginEBIT: v })}
            />
            <EditableField
              label="Strategic Investment Areas"
              value={data.financial.strategicInvestmentAreas}
              onSave={(v) => updateData("financial", { strategicInvestmentAreas: v })}
              multiline
            />
            <EditableField
              label="Cost Pressure Areas"
              value={data.financial.costPressureAreas}
              onSave={(v) => updateData("financial", { costPressureAreas: v })}
              multiline
            />
          </TabsContent>

          <TabsContent value="strategy" className="mt-3 space-y-1">
            <EditableList
              label="Corporate Strategy"
              items={data.strategy.corporateStrategy.map(s => `${s.title}: ${s.description}`)}
              onSave={(items) => updateData("strategy", { 
                corporateStrategy: items.map(item => {
                  const [title, ...rest] = item.split(":");
                  return { title: title.trim(), description: rest.join(":").trim() };
                })
              })}
            />
            <EditableList
              label="Digital Strategies"
              items={data.strategy.digitalStrategies.map(s => `${s.title}: ${s.description}`)}
              onSave={(items) => updateData("strategy", { 
                digitalStrategies: items.map(item => {
                  const [title, ...rest] = item.split(":");
                  return { title: title.trim(), description: rest.join(":").trim() };
                })
              })}
            />
            <EditableList
              label="CEO/Board Priorities"
              items={data.strategy.ceoBoardPriorities.map(s => `${s.title}: ${s.description}`)}
              onSave={(items) => updateData("strategy", { 
                ceoBoardPriorities: items.map(item => {
                  const [title, ...rest] = item.split(":");
                  return { title: title.trim(), description: rest.join(":").trim() };
                })
              })}
            />
          </TabsContent>

          <TabsContent value="swot" className="mt-3 space-y-1">
            <EditableList
              label="Strengths"
              items={data.swot.strengths}
              onSave={(items) => updateData("swot", { strengths: items })}
            />
            <EditableList
              label="Weaknesses"
              items={data.swot.weaknesses}
              onSave={(items) => updateData("swot", { weaknesses: items })}
            />
            <EditableList
              label="Opportunities"
              items={data.swot.opportunities}
              onSave={(items) => updateData("swot", { opportunities: items })}
            />
            <EditableList
              label="Threats"
              items={data.swot.threats}
              onSave={(items) => updateData("swot", { threats: items })}
            />
          </TabsContent>

          <TabsContent value="annual" className="mt-3 space-y-1">
            <EditableField
              label="Revenue"
              value={data.annualReport.revenue}
              onSave={(v) => updateData("annualReport", { revenue: v })}
            />
            <EditableField
              label="Revenue Comparison"
              value={data.annualReport.revenueComparison}
              onSave={(v) => updateData("annualReport", { revenueComparison: v })}
            />
            <EditableField
              label="EBIT Improvement"
              value={data.annualReport.ebitImprovement}
              onSave={(v) => updateData("annualReport", { ebitImprovement: v })}
            />
            <EditableField
              label="Net Zero Target"
              value={data.annualReport.netZeroTarget}
              onSave={(v) => updateData("annualReport", { netZeroTarget: v })}
            />
            <EditableField
              label="Executive Summary"
              value={data.annualReport.executiveSummaryNarrative}
              onSave={(v) => updateData("annualReport", { executiveSummaryNarrative: v })}
              multiline
            />
            <EditableList
              label="Key Milestones"
              items={data.annualReport.keyMilestones}
              onSave={(items) => updateData("annualReport", { keyMilestones: items })}
            />
            <EditableList
              label="Strategic Achievements"
              items={data.annualReport.strategicAchievements}
              onSave={(items) => updateData("annualReport", { strategicAchievements: items })}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
