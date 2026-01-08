import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AnnualReportAnalyzer } from "@/components/AnnualReportAnalyzer";
import { 
  Building2, History, DollarSign, Target, AlertTriangle, 
  Lightbulb, Users, Shield, Save, RotateCcw, ArrowRight, FileText, Sparkles, LayoutGrid, Loader2, Globe, RefreshCw, Eye 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InputFormSlideProps {
  onGenerate?: () => void;
}

export const InputFormSlide = ({ onGenerate }: InputFormSlideProps) => {
  const { data, updateData, resetToDefaults } = useAccountData();
  const [activeTab, setActiveTab] = useState("aiAnalyzer");
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);

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

  const handleGenerateVision = async () => {
    setIsGeneratingVision(true);
    try {
      const accountContext = {
        basics: data.basics,
        strategy: data.strategy,
        financial: data.financial,
        painPoints: data.painPoints,
        opportunities: data.opportunities,
        annualReport: data.annualReport,
      };

      const { data: responseData, error } = await supabase.functions.invoke("generate-vision", {
        body: { accountContext }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Failed to generate vision");

      updateData("basics", { visionStatement: responseData.visionStatement });
      toast.success("Vision statement generated!");
    } catch (error) {
      console.error("Vision generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate vision");
    } finally {
      setIsGeneratingVision(false);
    }
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
          <TabsList className="grid grid-cols-6 lg:grid-cols-11 gap-1 h-auto p-1 bg-secondary/50">
            <TabsTrigger value="aiAnalyzer" className="gap-2 text-xs">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">AI Import</span>
            </TabsTrigger>
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
            <TabsTrigger value="swot" className="gap-2 text-xs">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">SWOT</span>
            </TabsTrigger>
            <TabsTrigger value="businessModel" className="gap-2 text-xs">
              <LayoutGrid className="w-3 h-3" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Annual Report Analyzer */}
          <TabsContent value="aiAnalyzer" className="space-y-4">
            <AnnualReportAnalyzer />
          </TabsContent>

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
                  <label className="text-sm text-muted-foreground mb-1 block">Number of Employees</label>
                  <Input
                    value={data.basics.numberOfEmployees}
                    onChange={(e) => updateData("basics", { numberOfEmployees: e.target.value })}
                    placeholder="e.g., 100,000+"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Current ACV</label>
                  <Input
                    value={data.basics.currentContractValue}
                    onChange={(e) => updateData("basics", { currentContractValue: e.target.value })}
                    placeholder="e.g., $8.5M ARR"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Next FY Ambition</label>
                  <Input
                    value={data.basics.nextFYAmbition}
                    onChange={(e) => updateData("basics", { nextFYAmbition: e.target.value })}
                    placeholder="e.g., $12M ARR"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">3 Year Ambition</label>
                  <Input
                    value={data.basics.threeYearAmbition}
                    onChange={(e) => updateData("basics", { threeYearAmbition: e.target.value })}
                    placeholder="e.g., $25M ARR"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Renewal Dates</label>
                  <Input
                    value={data.basics.renewalDates}
                    onChange={(e) => updateData("basics", { renewalDates: e.target.value })}
                  />
                </div>

                {/* Vision Statement - Full Width with AI Generation */}
                <div className="col-span-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      Account Team Vision for ServiceNow at {data.basics.accountName || "Customer"}
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateVision}
                      disabled={isGeneratingVision}
                      className="gap-2"
                    >
                      {isGeneratingVision ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          {data.basics.visionStatement ? "Regenerate Vision" : "Generate Vision"}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    AI-generated strategic vision statement based on all account context. Click to regenerate for alternatives.
                  </p>
                  <Textarea
                    value={data.basics.visionStatement}
                    onChange={(e) => updateData("basics", { visionStatement: e.target.value })}
                    placeholder="Click 'Generate Vision' to create an AI-powered strategic vision statement, or type your own..."
                    rows={4}
                    className="bg-background"
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
                  Prior Account Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Date of Last Account Plan</label>
                  <Input
                    value={data.history.lastPlanDate}
                    onChange={(e) => updateData("history", { lastPlanDate: e.target.value })}
                    placeholder="e.g., March 2025"
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
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Planner Name</label>
                  <Input
                    value={data.history.plannerName}
                    onChange={(e) => updateData("history", { plannerName: e.target.value })}
                    placeholder="e.g., Sarah Mitchell"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Planner Role</label>
                  <Input
                    value={data.history.plannerRole}
                    onChange={(e) => updateData("history", { plannerRole: e.target.value })}
                    placeholder="e.g., Strategic Account Executive"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Summary of Last Account Plan</label>
                  <Textarea
                    value={data.history.lastPlanSummary}
                    onChange={(e) => updateData("history", { lastPlanSummary: e.target.value })}
                    rows={3}
                    placeholder="Brief summary of the previous account plan focus and outcomes..."
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
                {/* AI / Digital Ambition - Full Width */}
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">AI / Digital Ambition</label>
                  <Textarea
                    value={data.strategy.aiDigitalAmbition}
                    onChange={(e) => updateData("strategy", { aiDigitalAmbition: e.target.value })}
                    rows={3}
                    placeholder="e.g., AI-first: Deploy AI across operations, customer service, and decision-making..."
                  />
                </div>

                {/* Published Transformation Themes */}
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block font-medium">Published Transformation Themes</label>
                  <div className="space-y-3">
                    {data.strategy.transformationThemes.map((theme, index) => (
                      <div key={index} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Theme {index + 1}</label>
                            <Input
                              value={theme.title}
                              onChange={(e) => {
                                const updated = [...data.strategy.transformationThemes];
                                updated[index] = { ...updated[index], title: e.target.value };
                                updateData("strategy", { transformationThemes: updated });
                              }}
                              placeholder="Theme name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                            <Input
                              value={theme.description}
                              onChange={(e) => {
                                const updated = [...data.strategy.transformationThemes];
                                updated[index] = { ...updated[index], description: e.target.value };
                                updateData("strategy", { transformationThemes: updated });
                              }}
                              placeholder="Brief description of this theme"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateData("strategy", {
                          transformationThemes: [...data.strategy.transformationThemes, { title: "", description: "" }]
                        });
                      }}
                    >
                      + Add Transformation Theme
                    </Button>
                  </div>
                </div>

                {/* Published Digital Strategies */}
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block font-medium">Published Digital Strategies</label>
                  <div className="space-y-3">
                    {data.strategy.digitalStrategies.map((strategy, index) => (
                      <div key={index} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Strategy {index + 1}</label>
                            <Input
                              value={strategy.title}
                              onChange={(e) => {
                                const updated = [...data.strategy.digitalStrategies];
                                updated[index] = { ...updated[index], title: e.target.value };
                                updateData("strategy", { digitalStrategies: updated });
                              }}
                              placeholder="Strategy name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                            <Input
                              value={strategy.description}
                              onChange={(e) => {
                                const updated = [...data.strategy.digitalStrategies];
                                updated[index] = { ...updated[index], description: e.target.value };
                                updateData("strategy", { digitalStrategies: updated });
                              }}
                              placeholder="Brief description of this strategy"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateData("strategy", {
                          digitalStrategies: [...data.strategy.digitalStrategies, { title: "", description: "" }]
                        });
                      }}
                    >
                      + Add Digital Strategy
                    </Button>
                  </div>
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
              <CardContent className="space-y-4">
                {data.painPoints.painPoints.map((painPoint, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-destructive">Pain Point {index + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={painPoint.title}
                          onChange={(e) => {
                            const updated = [...data.painPoints.painPoints];
                            updated[index] = { ...updated[index], title: e.target.value };
                            updateData("painPoints", { painPoints: updated });
                          }}
                          placeholder="e.g., Fragmented CRM Landscape"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                        <Textarea
                          value={painPoint.description}
                          onChange={(e) => {
                            const updated = [...data.painPoints.painPoints];
                            updated[index] = { ...updated[index], description: e.target.value };
                            updateData("painPoints", { painPoints: updated });
                          }}
                          placeholder="Describe the business impact and quantify where possible..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateData("painPoints", {
                      painPoints: [...data.painPoints.painPoints, { title: "", description: "" }]
                    });
                  }}
                >
                  + Add Pain Point
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section F - Opportunities */}
          <TabsContent value="opportunities" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Strategic Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.opportunities.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-primary">Opportunity {index + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={opportunity.title}
                          onChange={(e) => {
                            const updated = [...data.opportunities.opportunities];
                            updated[index] = { ...updated[index], title: e.target.value };
                            updateData("opportunities", { opportunities: updated });
                          }}
                          placeholder="e.g., Unified Service Excellence Platform"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Description (exec-ready, outcome-focused)</label>
                        <Textarea
                          value={opportunity.description}
                          onChange={(e) => {
                            const updated = [...data.opportunities.opportunities];
                            updated[index] = { ...updated[index], description: e.target.value };
                            updateData("opportunities", { opportunities: updated });
                          }}
                          placeholder="e.g., Transform customer experience with AI-powered self-service, driving NPS improvement of 15+ points..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateData("opportunities", {
                      opportunities: [...data.opportunities.opportunities, { title: "", description: "" }]
                    });
                  }}
                >
                  + Add Opportunity
                </Button>
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

          {/* Section H - SWOT Analysis */}
          <TabsContent value="swot" className="space-y-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block font-medium text-green-400">Strengths (one per line)</label>
                  <Textarea
                    value={data.swot.strengths.join("\n")}
                    onChange={(e) => handleArrayInput("swot", "strengths", e.target.value)}
                    rows={5}
                    placeholder="Internal positive attributes..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block font-medium text-red-400">Weaknesses (one per line)</label>
                  <Textarea
                    value={data.swot.weaknesses.join("\n")}
                    onChange={(e) => handleArrayInput("swot", "weaknesses", e.target.value)}
                    rows={5}
                    placeholder="Internal areas for improvement..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block font-medium text-blue-400">Opportunities (one per line)</label>
                  <Textarea
                    value={data.swot.opportunities.join("\n")}
                    onChange={(e) => handleArrayInput("swot", "opportunities", e.target.value)}
                    rows={5}
                    placeholder="External factors to capitalize on..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block font-medium text-orange-400">Threats (one per line)</label>
                  <Textarea
                    value={data.swot.threats.join("\n")}
                    onChange={(e) => handleArrayInput("swot", "threats", e.target.value)}
                    rows={5}
                    placeholder="External risks and challenges..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Model Canvas */}
          <TabsContent value="businessModel" className="space-y-4">
            <BusinessModelTab 
              data={data} 
              updateData={updateData}
              handleArrayInput={handleArrayInput}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Business Model Tab Component
interface BusinessModelTabProps {
  data: typeof import("@/context/AccountDataContext").AccountDataProvider extends React.FC<{children: React.ReactNode}> ? any : any;
  updateData: (section: any, value: any) => void;
  handleArrayInput: (section: any, field: string, value: string) => void;
}

const BusinessModelTab = ({ data, updateData, handleArrayInput }: BusinessModelTabProps) => {
  const [isResearching, setIsResearching] = useState(false);

  const handleResearchBusinessModel = async () => {
    if (!data.basics.accountName) {
      toast.error("Please enter an account name first");
      return;
    }

    setIsResearching(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke("research-business-model", {
        body: { 
          companyName: data.basics.accountName,
          annualReportContent: data.annualReport.executiveSummaryNarrative,
          existingData: data.businessModel
        }
      });

      if (error) throw error;
      if (!responseData.success) throw new Error(responseData.error || "Research failed");

      const bm = responseData.data;
      updateData("businessModel", {
        keyPartners: bm.keyPartners || [],
        keyActivities: bm.keyActivities || [],
        keyResources: bm.keyResources || [],
        valueProposition: bm.valueProposition || [],
        customerRelationships: bm.customerRelationships || [],
        channels: bm.channels || [],
        customerSegments: bm.customerSegments || [],
        costStructure: bm.costStructure || [],
        revenueStreams: bm.revenueStreams || [],
        competitors: bm.competitors || [],
      });

      toast.success("Business model canvas populated from research!");
    } catch (error) {
      console.error("Research error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to research business model");
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <>
      {/* AI Research Button */}
      <Card className="glass-card border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Business Model Research
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Research {data.basics.accountName || "the company"}'s business model from annual reports, web sources, and investor data
              </p>
            </div>
            <Button
              onClick={handleResearchBusinessModel}
              disabled={isResearching || !data.basics.accountName}
              className="gap-2"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Research & Populate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Business Model Canvas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Key Partners (one per line)</label>
            <Textarea
              value={data.businessModel.keyPartners.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "keyPartners", e.target.value)}
              rows={4}
              placeholder="Strategic alliances, suppliers..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Key Activities (one per line)</label>
            <Textarea
              value={data.businessModel.keyActivities.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "keyActivities", e.target.value)}
              rows={4}
              placeholder="Core operations..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Key Resources (one per line)</label>
            <Textarea
              value={data.businessModel.keyResources.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "keyResources", e.target.value)}
              rows={4}
              placeholder="Physical, intellectual, human..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Value Proposition (one per line)</label>
            <Textarea
              value={data.businessModel.valueProposition.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "valueProposition", e.target.value)}
              rows={4}
              placeholder="What value do they deliver..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Customer Relationships (one per line)</label>
            <Textarea
              value={data.businessModel.customerRelationships.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "customerRelationships", e.target.value)}
              rows={4}
              placeholder="How they interact with customers..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Channels (one per line)</label>
            <Textarea
              value={data.businessModel.channels.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "channels", e.target.value)}
              rows={4}
              placeholder="How they reach customers..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Customer Segments (one per line)</label>
            <Textarea
              value={data.businessModel.customerSegments.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "customerSegments", e.target.value)}
              rows={4}
              placeholder="Target customers..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Cost Structure (one per line)</label>
            <Textarea
              value={data.businessModel.costStructure.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "costStructure", e.target.value)}
              rows={4}
              placeholder="Major cost drivers..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Revenue Streams (one per line)</label>
            <Textarea
              value={data.businessModel.revenueStreams.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "revenueStreams", e.target.value)}
              rows={4}
              placeholder="How they make money..."
            />
          </div>
          <div className="lg:col-span-3">
            <label className="text-sm text-muted-foreground mb-1 block font-medium text-orange-400">Key Competitors (one per line)</label>
            <Textarea
              value={data.businessModel.competitors.join("\n")}
              onChange={(e) => handleArrayInput("businessModel", "competitors", e.target.value)}
              rows={3}
              placeholder="Direct and indirect competitors..."
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
