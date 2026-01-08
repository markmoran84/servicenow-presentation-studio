import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Building2, History, DollarSign, Target, AlertTriangle, 
  Lightbulb, Users, Shield, Save, RotateCcw, ArrowRight, FileText 
} from "lucide-react";

interface InputFormSlideProps {
  onGenerate?: () => void;
}

export const InputFormSlide = ({ onGenerate }: InputFormSlideProps) => {
  const { data, updateData, resetToDefaults } = useAccountData();
  const [activeTab, setActiveTab] = useState("basics");

  const handleGenerate = () => {
    toast.success("Account plan generated! Navigating to slides...");
    onGenerate?.();
  };

  const handleArrayInput = (
    section: keyof typeof data,
    field: string,
    value: string
  ) => {
    const arrayValue = value.split("\n").filter((item) => item.trim() !== "");
    updateData(section, { [field]: arrayValue });
  };

  return (
    <div className="min-h-screen p-8 pb-32 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Plan Input</h1>
            <p className="text-muted-foreground">Configure your strategic account data to generate the 20-slide plan</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetToDefaults} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleGenerate} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Save & Generate
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 lg:grid-cols-9 gap-1 h-auto p-1 bg-secondary/50">
            <TabsTrigger value="basics" className="gap-2 text-xs">
              <Building2 className="w-3 h-3" />
              <span className="hidden sm:inline">Basics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 text-xs">
              <History className="w-3 h-3" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2 text-xs">
              <DollarSign className="w-3 h-3" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="annualReport" className="gap-2 text-xs">
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Annual</span>
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2 text-xs">
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="painPoints" className="gap-2 text-xs">
              <AlertTriangle className="w-3 h-3" />
              <span className="hidden sm:inline">Pain</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="gap-2 text-xs">
              <Lightbulb className="w-3 h-3" />
              <span className="hidden sm:inline">Opps</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-2 text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Execs</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-2 text-xs">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Risks</span>
            </TabsTrigger>
          </TabsList>

          {/* Section A - Account Basics */}
          <TabsContent value="basics" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Account Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Account Name</label>
                  <Input
                    value={data.basics.accountName}
                    onChange={(e) => updateData("basics", { accountName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Industry</label>
                  <Input
                    value={data.basics.industry}
                    onChange={(e) => updateData("basics", { industry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Region</label>
                  <Input
                    value={data.basics.region}
                    onChange={(e) => updateData("basics", { region: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tier</label>
                  <Select
                    value={data.basics.tier}
                    onValueChange={(value) => updateData("basics", { tier: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Current Contract Value</label>
                  <Input
                    value={data.basics.currentContractValue}
                    onChange={(e) => updateData("basics", { currentContractValue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Renewal Dates</label>
                  <Input
                    value={data.basics.renewalDates}
                    onChange={(e) => updateData("basics", { renewalDates: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Key Incumbents / Competitors</label>
                  <Input
                    value={data.basics.keyIncumbents}
                    onChange={(e) => updateData("basics", { keyIncumbents: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section B - Account History */}
          <TabsContent value="history" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Account History
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Relationship Start Year</label>
                  <Input
                    value={data.history.relationshipStartYear}
                    onChange={(e) => updateData("history", { relationshipStartYear: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Current Perception of Value</label>
                  <Select
                    value={data.history.currentPerception}
                    onValueChange={(value) => updateData("history", { currentPerception: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">What Has Worked Historically</label>
                  <Textarea
                    value={data.history.whatWorked}
                    onChange={(e) => updateData("history", { whatWorked: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">What Has Not Worked</label>
                  <Textarea
                    value={data.history.whatDidNotWork}
                    onChange={(e) => updateData("history", { whatDidNotWork: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Prior Transformation Attempts</label>
                  <Textarea
                    value={data.history.priorTransformationAttempts}
                    onChange={(e) => updateData("history", { priorTransformationAttempts: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section C - Financial */}
          <TabsContent value="financial" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Financial & Performance Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Customer Revenue</label>
                  <Input
                    value={data.financial.customerRevenue}
                    onChange={(e) => updateData("financial", { customerRevenue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Growth Rate</label>
                  <Input
                    value={data.financial.growthRate}
                    onChange={(e) => updateData("financial", { growthRate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Margin / EBIT</label>
                  <Input
                    value={data.financial.marginEBIT}
                    onChange={(e) => updateData("financial", { marginEBIT: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Strategic Investment Areas</label>
                  <Input
                    value={data.financial.strategicInvestmentAreas}
                    onChange={(e) => updateData("financial", { strategicInvestmentAreas: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Cost Pressure Areas</label>
                  <Textarea
                    value={data.financial.costPressureAreas}
                    onChange={(e) => updateData("financial", { costPressureAreas: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Annual Report Highlights */}
          <TabsContent value="annualReport" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Annual Report Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Revenue (e.g. $55.5B)</label>
                  <Input
                    value={data.annualReport.revenue}
                    onChange={(e) => updateData("annualReport", { revenue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Revenue Comparison (e.g. 2023: $51.1B)</label>
                  <Input
                    value={data.annualReport.revenueComparison}
                    onChange={(e) => updateData("annualReport", { revenueComparison: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">EBIT Improvement (e.g. +65%)</label>
                  <Input
                    value={data.annualReport.ebitImprovement}
                    onChange={(e) => updateData("annualReport", { ebitImprovement: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Net Zero Target Year</label>
                  <Input
                    value={data.annualReport.netZeroTarget}
                    onChange={(e) => updateData("annualReport", { netZeroTarget: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Key Milestones (one per line)</label>
                  <Textarea
                    value={data.annualReport.keyMilestones.join("\n")}
                    onChange={(e) => handleArrayInput("annualReport", "keyMilestones", e.target.value)}
                    rows={4}
                    placeholder="Gemini network launch with MSC&#10;Green methanol vessel fleet expansion"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Strategic Achievements (one per line)</label>
                  <Textarea
                    value={data.annualReport.strategicAchievements.join("\n")}
                    onChange={(e) => handleArrayInput("annualReport", "strategicAchievements", e.target.value)}
                    rows={4}
                    placeholder="Successfully navigated Red Sea disruption&#10;Completed Landside logistics integration"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Executive Summary Narrative</label>
                  <Textarea
                    value={data.annualReport.executiveSummaryNarrative}
                    onChange={(e) => updateData("annualReport", { executiveSummaryNarrative: e.target.value })}
                    rows={4}
                    placeholder="We are the world's leading integrated logistics company..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section D - Strategy */}
          <TabsContent value="strategy" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Customer Strategy Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Corporate Strategy Pillars (one per line)</label>
                  <Textarea
                    value={data.strategy.corporateStrategyPillars.join("\n")}
                    onChange={(e) => handleArrayInput("strategy", "corporateStrategyPillars", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">CEO / Board Priorities (one per line)</label>
                  <Textarea
                    value={data.strategy.ceoBoardPriorities.join("\n")}
                    onChange={(e) => handleArrayInput("strategy", "ceoBoardPriorities", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Published Transformation Themes (one per line)</label>
                  <Textarea
                    value={data.strategy.transformationThemes.join("\n")}
                    onChange={(e) => handleArrayInput("strategy", "transformationThemes", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">AI / Digital Ambition</label>
                  <Textarea
                    value={data.strategy.aiDigitalAmbition}
                    onChange={(e) => updateData("strategy", { aiDigitalAmbition: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Cost Discipline Targets</label>
                  <Textarea
                    value={data.strategy.costDisciplineTargets}
                    onChange={(e) => updateData("strategy", { costDisciplineTargets: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section E - Pain Points */}
          <TabsContent value="painPoints" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Strategic Pain Points
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Cost-to-Serve Drivers (one per line)</label>
                  <Textarea
                    value={data.painPoints.costToServeDrivers.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "costToServeDrivers", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Customer Experience Challenges (one per line)</label>
                  <Textarea
                    value={data.painPoints.customerExperienceChallenges.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "customerExperienceChallenges", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Commercial Inefficiencies (one per line)</label>
                  <Textarea
                    value={data.painPoints.commercialInefficiencies.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "commercialInefficiencies", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Technology Fragmentation (one per line)</label>
                  <Textarea
                    value={data.painPoints.technologyFragmentation.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "technologyFragmentation", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">AI Governance Gaps (one per line)</label>
                  <Textarea
                    value={data.painPoints.aiGovernanceGaps.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "aiGovernanceGaps", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Time-to-Value Issues (one per line)</label>
                  <Textarea
                    value={data.painPoints.timeToValueIssues.join("\n")}
                    onChange={(e) => handleArrayInput("painPoints", "timeToValueIssues", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section F - Opportunities */}
          <TabsContent value="opportunities" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Opportunity Hypotheses
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Where AI Could Move the Needle (one per line)</label>
                  <Textarea
                    value={data.opportunities.aiOpportunities.join("\n")}
                    onChange={(e) => handleArrayInput("opportunities", "aiOpportunities", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Where Automation Removes Friction (one per line)</label>
                  <Textarea
                    value={data.opportunities.automationOpportunities.join("\n")}
                    onChange={(e) => handleArrayInput("opportunities", "automationOpportunities", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Where Standardisation Enables Scale (one per line)</label>
                  <Textarea
                    value={data.opportunities.standardisationOpportunities.join("\n")}
                    onChange={(e) => handleArrayInput("opportunities", "standardisationOpportunities", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Where Governance Unlocks Trust (one per line)</label>
                  <Textarea
                    value={data.opportunities.governanceOpportunities.join("\n")}
                    onChange={(e) => handleArrayInput("opportunities", "governanceOpportunities", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section G - Executive Engagement */}
          <TabsContent value="engagement" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Executive Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Known Executive Sponsors (one per line)</label>
                  <Textarea
                    value={data.engagement.knownExecutiveSponsors.join("\n")}
                    onChange={(e) => handleArrayInput("engagement", "knownExecutiveSponsors", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Planned Executive Events (one per line)</label>
                  <Textarea
                    value={data.engagement.plannedExecutiveEvents.join("\n")}
                    onChange={(e) => handleArrayInput("engagement", "plannedExecutiveEvents", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Decision Deadlines</label>
                  <Input
                    value={data.engagement.decisionDeadlines}
                    onChange={(e) => updateData("engagement", { decisionDeadlines: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Renewal / RFP Timing</label>
                  <Input
                    value={data.engagement.renewalRFPTiming}
                    onChange={(e) => updateData("engagement", { renewalRFPTiming: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section H - Risks */}
          <TabsContent value="risks" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  Risk & Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(["politicalRisk", "incumbentRisk", "deliveryRisk", "adoptionRisk", "governanceMaturity"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-sm text-muted-foreground mb-1 block capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <Select
                      value={data.risks[field]}
                      onValueChange={(value) => updateData("risks", { [field]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
