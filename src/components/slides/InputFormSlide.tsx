import { useState } from "react";
import { useAccountData } from "@/context/AccountDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { AnnualReportAnalyzer } from "@/components/AnnualReportAnalyzer";
import { ExtractedDataReview } from "@/components/ExtractedDataReview";
import { 
  Building2, History, DollarSign, Target, AlertTriangle, 
  Lightbulb, Users, Shield, Save, RotateCcw, ArrowRight, FileText, Sparkles, LayoutGrid, Loader2, Globe, RefreshCw, Eye, Plus, X, Zap, Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InputFormSlideProps {
  onGenerate?: () => void;
}

export const InputFormSlide = ({ onGenerate }: InputFormSlideProps) => {
  const { data, updateData, resetToDefaults, setGeneratedPlan } = useAccountData();
  const [activeTab, setActiveTab] = useState("aiAnalyzer");
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGenerate = async () => {
    setIsGeneratingPlan(true);
    try {
      toast.loading("Generating enterprise account plan with AI...", { id: "plan-gen" });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-account-plan", {
        body: { accountData: data }
      });

      if (error) {
        console.error("Plan generation error:", error);
        throw error;
      }
      
      if (!responseData?.success) {
        throw new Error(responseData?.error || "Failed to generate plan");
      }

      // Store the AI-generated plan
      setGeneratedPlan(responseData.plan);
      
      toast.success("Enterprise account plan generated!", { id: "plan-gen" });
      onGenerate?.();
    } catch (error) {
      console.error("Plan generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate plan. Please try again.", { id: "plan-gen" });
    } finally {
      setIsGeneratingPlan(false);
    }
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Plan Input</h1>
            <p className="text-muted-foreground">Configure your strategic account data to generate the 20-slide plan</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetToDefaults} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleGenerate} className="gap-2" disabled={isGeneratingPlan}>
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Extracted Data Review - Always visible when data exists */}
        <div className="mb-6">
          <ExtractedDataReview />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 lg:grid-cols-11 gap-2 h-auto p-1 bg-secondary/50">
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
              <span className="hidden sm:inline">Cust. Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="gap-2 text-xs">
              <Lightbulb className="w-3 h-3" />
              <span className="hidden sm:inline">Acc. Strategies</span>
            </TabsTrigger>
            <TabsTrigger value="accountStrategy" className="gap-2 text-xs">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Big Bets</span>
            </TabsTrigger>
            <TabsTrigger value="painPoints" className="gap-2 text-xs">
              <AlertTriangle className="w-3 h-3" />
              <span className="hidden sm:inline">Pain</span>
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
            <AnnualReportAnalyzer onGeneratePlan={async () => {
              // Navigate to first slide after generation
              onGenerate?.();
            }} />
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

                {/* Core Team Members for Cover Slide */}
                <div className="col-span-2 p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Core Account Team (Cover Slide)
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMembers = [...(data.basics.coreTeamMembers || []), { firstName: "", lastName: "", title: "" }];
                        updateData("basics", { coreTeamMembers: newMembers });
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-3 h-3" />
                      Add Member
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {(data.basics.coreTeamMembers || []).map((member, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <Input
                            placeholder="First Name"
                            value={member.firstName}
                            onChange={(e) => {
                              const newMembers = [...data.basics.coreTeamMembers];
                              newMembers[index] = { ...newMembers[index], firstName: e.target.value };
                              updateData("basics", { coreTeamMembers: newMembers });
                            }}
                          />
                          <Input
                            placeholder="Last Name"
                            value={member.lastName}
                            onChange={(e) => {
                              const newMembers = [...data.basics.coreTeamMembers];
                              newMembers[index] = { ...newMembers[index], lastName: e.target.value };
                              updateData("basics", { coreTeamMembers: newMembers });
                            }}
                          />
                          <Input
                            placeholder="Title"
                            value={member.title}
                            onChange={(e) => {
                              const newMembers = [...data.basics.coreTeamMembers];
                              newMembers[index] = { ...newMembers[index], title: e.target.value };
                              updateData("basics", { coreTeamMembers: newMembers });
                            }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newMembers = data.basics.coreTeamMembers.filter((_, i) => i !== index);
                            updateData("basics", { coreTeamMembers: newMembers });
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!data.basics.coreTeamMembers || data.basics.coreTeamMembers.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No team members added. Click "Add Member" to add core account team members for the cover slide.
                      </p>
                    )}
                  </div>
                </div>

                {/* Extended Team Members for Account Team Slide */}
                <div className="col-span-2 p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Extended Account Team (Team Slide - supports up to 18 members)
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMembers = [...(data.basics.extendedTeam || []), { 
                          firstName: "", 
                          lastName: "", 
                          title: "", 
                          email: "", 
                          phone: "", 
                          responsibilities: [], 
                          subTeams: [],
                          region: "Global",
                          roleType: "Building the PoV" as const
                        }];
                        updateData("basics", { extendedTeam: newMembers });
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-3 h-3" />
                      Add Team Member
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(data.basics.extendedTeam || []).map((member, index) => (
                      <div key={index} className="p-3 rounded-lg bg-background/50 border border-border/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Team Member {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newMembers = data.basics.extendedTeam.filter((_, i) => i !== index);
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          <Input
                            placeholder="First Name"
                            value={member.firstName}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], firstName: e.target.value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          />
                          <Input
                            placeholder="Last Name"
                            value={member.lastName}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], lastName: e.target.value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          />
                          <Input
                            placeholder="Title/Role"
                            value={member.title}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], title: e.target.value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          />
                          <Select
                            value={member.roleType || "Building the PoV"}
                            onValueChange={(value) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], roleType: value as any };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Role Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Guiding the Team">Guiding the Team</SelectItem>
                              <SelectItem value="Building the PoV">Building the PoV</SelectItem>
                              <SelectItem value="Supporting the Team">Supporting the Team</SelectItem>
                              <SelectItem value="Mapping the Value">Mapping the Value</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={member.region || "Global"}
                            onValueChange={(value) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], region: value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Global">Global</SelectItem>
                              <SelectItem value="EMEA">EMEA</SelectItem>
                              <SelectItem value="NA">NA</SelectItem>
                              <SelectItem value="APAC">APAC</SelectItem>
                              <SelectItem value="LATAM">LATAM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Email"
                            type="email"
                            value={member.email}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], email: e.target.value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          />
                          <Input
                            placeholder="Phone (optional)"
                            value={member.phone || ""}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { ...newMembers[index], phone: e.target.value };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Responsibilities (one per line)</label>
                          <Textarea
                            placeholder="Enter responsibilities, one per line..."
                            value={(member.responsibilities || []).join("\n")}
                            onChange={(e) => {
                              const newMembers = [...data.basics.extendedTeam];
                              newMembers[index] = { 
                                ...newMembers[index], 
                                responsibilities: e.target.value.split("\n").filter(r => r.trim()) 
                              };
                              updateData("basics", { extendedTeam: newMembers });
                            }}
                            rows={2}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                    {(!data.basics.extendedTeam || data.basics.extendedTeam.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No extended team members added. Click "Add Team Member" to build your global account team.
                      </p>
                    )}
                  </div>
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
                {/* Corporate Strategy */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Corporate Strategy</span>
                  </div>
                  <div className="space-y-2">
                    {data.strategy.corporateStrategy.map((item, index) => (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...data.strategy.corporateStrategy];
                              updated[index] = { ...updated[index], title: e.target.value };
                              updateData("strategy", { corporateStrategy: updated });
                            }}
                            placeholder={`Strategy ${index + 1}`}
                            className="flex-1"
                          />
                          <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </CollapsibleTrigger>
                          {data.strategy.corporateStrategy.length > 1 && (
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                const updated = data.strategy.corporateStrategy.filter((_, i) => i !== index);
                                updateData("strategy", { corporateStrategy: updated });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <CollapsibleContent className="mt-2 pr-12">
                          <Textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...data.strategy.corporateStrategy];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateData("strategy", { corporateStrategy: updated });
                            }}
                            placeholder="Describe this strategy in detail..."
                            rows={2}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const updated = [...data.strategy.corporateStrategy, { title: "", description: "" }];
                      updateData("strategy", { corporateStrategy: updated });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Strategy
                  </Button>
                </div>

                {/* Digital Strategies / Ambition */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Digital Strategies / Ambition</span>
                  </div>
                  <div className="space-y-2">
                    {data.strategy.digitalStrategies.map((item, index) => (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...data.strategy.digitalStrategies];
                              updated[index] = { ...updated[index], title: e.target.value };
                              updateData("strategy", { digitalStrategies: updated });
                            }}
                            placeholder={`Strategy ${index + 1}`}
                            className="flex-1"
                          />
                          <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </CollapsibleTrigger>
                          {data.strategy.digitalStrategies.length > 1 && (
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                const updated = data.strategy.digitalStrategies.filter((_, i) => i !== index);
                                updateData("strategy", { digitalStrategies: updated });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <CollapsibleContent className="mt-2 pr-12">
                          <Textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...data.strategy.digitalStrategies];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateData("strategy", { digitalStrategies: updated });
                            }}
                            placeholder="Describe this strategy in detail..."
                            rows={2}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const updated = [...data.strategy.digitalStrategies, { title: "", description: "" }];
                      updateData("strategy", { digitalStrategies: updated });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Strategy
                  </Button>
                </div>

                {/* CEO / Board Priorities */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">CEO / Board Priorities</span>
                  </div>
                  <div className="space-y-2">
                    {data.strategy.ceoBoardPriorities.map((priority, index) => (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={priority.title}
                            onChange={(e) => {
                              const updated = [...data.strategy.ceoBoardPriorities];
                              updated[index] = { ...updated[index], title: e.target.value };
                              updateData("strategy", { ceoBoardPriorities: updated });
                            }}
                            placeholder={`Priority ${index + 1}`}
                            className="flex-1"
                          />
                          <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </CollapsibleTrigger>
                          {data.strategy.ceoBoardPriorities.length > 1 && (
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                const updated = data.strategy.ceoBoardPriorities.filter((_, i) => i !== index);
                                updateData("strategy", { ceoBoardPriorities: updated });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <CollapsibleContent className="mt-2 pr-12">
                          <Textarea
                            value={priority.description}
                            onChange={(e) => {
                              const updated = [...data.strategy.ceoBoardPriorities];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateData("strategy", { ceoBoardPriorities: updated });
                            }}
                            placeholder="Describe this priority in detail..."
                            rows={2}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const updated = [...data.strategy.ceoBoardPriorities, { title: "", description: "" }];
                      updateData("strategy", { ceoBoardPriorities: updated });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Priority
                  </Button>
                </div>

                {/* Published Transformation Themes */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Published Transformation Themes</span>
                  </div>
                  <div className="space-y-2">
                    {data.strategy.transformationThemes.map((item, index) => (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...data.strategy.transformationThemes];
                              updated[index] = { ...updated[index], title: e.target.value };
                              updateData("strategy", { transformationThemes: updated });
                            }}
                            placeholder={`Theme ${index + 1}`}
                            className="flex-1"
                          />
                          <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </CollapsibleTrigger>
                          {data.strategy.transformationThemes.length > 1 && (
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                const updated = data.strategy.transformationThemes.filter((_, i) => i !== index);
                                updateData("strategy", { transformationThemes: updated });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <CollapsibleContent className="mt-2 pr-12">
                          <Textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...data.strategy.transformationThemes];
                              updated[index] = { ...updated[index], description: e.target.value };
                              updateData("strategy", { transformationThemes: updated });
                            }}
                            placeholder="Describe this theme in detail..."
                            rows={2}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const updated = [...data.strategy.transformationThemes, { title: "", description: "" }];
                      updateData("strategy", { transformationThemes: updated });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Theme
                  </Button>
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
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-destructive">Pain Points</span>
                  </div>
                  <div className="space-y-2">
                    {data.painPoints.painPoints.map((painPoint, index) => (
                      <Collapsible key={index}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={painPoint.title}
                            onChange={(e) => {
                              const updated = [...data.painPoints.painPoints];
                              updated[index] = { ...updated[index], title: e.target.value };
                              updateData("painPoints", { painPoints: updated });
                            }}
                            placeholder={`Pain Point ${index + 1}`}
                            className="flex-1"
                          />
                          <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </CollapsibleTrigger>
                          {data.painPoints.painPoints.length > 1 && (
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                const updated = data.painPoints.painPoints.filter((_, i) => i !== index);
                                updateData("painPoints", { painPoints: updated });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <CollapsibleContent className="mt-2 pr-12">
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
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      updateData("painPoints", {
                        painPoints: [...data.painPoints.painPoints, { title: "", description: "" }]
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Pain Point
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section F - Account Team Priorities */}
          <TabsContent value="opportunities" className="space-y-4">
            <AccountPrioritiesTab data={data} updateData={updateData} />
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

          {/* Account Strategy & Big Bets */}
          <TabsContent value="accountStrategy" className="space-y-4">
            <AccountStrategyTab data={data} updateData={updateData} />
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

// Account Strategies Tab Component
interface AccountStrategiesTabProps {
  data: any;
  updateData: (section: any, value: any) => void;
}

const AccountPrioritiesTab = ({ data, updateData }: AccountStrategiesTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [generatingDescIndex, setGeneratingDescIndex] = useState<number | null>(null);

  const handleGeneratePriorities = async (mode: "generate" | "improve") => {
    const setLoading = mode === "generate" ? setIsGenerating : setIsImproving;
    setLoading(true);
    
    try {
      toast.loading(mode === "generate" ? "Generating strategies with AI..." : "Improving strategies with AI...", { id: "gen-priorities" });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-priorities", {
        body: { accountData: data, mode }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate strategies");

      updateData("opportunities", { opportunities: responseData.priorities });
      toast.success(mode === "generate" ? "Strategies generated!" : "Strategies improved!", { id: "gen-priorities" });
    } catch (error) {
      console.error("Strategy generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate strategies", { id: "gen-priorities" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async (index: number) => {
    const priority = data.opportunities?.opportunities?.[index];
    if (!priority?.title?.trim()) {
      toast.error("Please enter a strategy title first");
      return;
    }

    setGeneratingDescIndex(index);
    try {
      toast.loading("Generating description...", { id: `gen-desc-${index}` });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-priority-description", {
        body: { 
          accountData: data, 
          priorityTitle: priority.title,
          priorityIndex: index
        }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate description");

      const updated = [...data.opportunities.opportunities];
      updated[index] = { ...updated[index], description: responseData.description };
      updateData("opportunities", { opportunities: updated });
      
      toast.success("Description generated!", { id: `gen-desc-${index}` });
    } catch (error) {
      console.error("Description generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate description", { id: `gen-desc-${index}` });
    } finally {
      setGeneratingDescIndex(null);
    }
  };

  const hasStrategies = data.opportunities?.opportunities?.some((p: any) => p.title?.trim());

  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Account Strategies
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGeneratePriorities("generate")}
              disabled={isGenerating || isImproving}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Generate via AI
                </>
              )}
            </Button>
            {hasStrategies && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGeneratePriorities("improve")}
                disabled={isGenerating || isImproving}
                className="gap-2"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    Improve Content
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Strategic priorities for your account team - auto-populated from annual report or generate with AI
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary">Account Team Strategies</span>
          </div>
          <div className="space-y-3">
            {data.opportunities.opportunities.map((priority: any, index: number) => (
              <div key={index} className="p-3 rounded-lg bg-background/50 border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={priority.title}
                    onChange={(e) => {
                      const updated = [...data.opportunities.opportunities];
                      updated[index] = { ...updated[index], title: e.target.value };
                      updateData("opportunities", { opportunities: updated });
                    }}
                    placeholder={`Strategy ${index + 1}`}
                    className="flex-1 font-medium"
                  />
                  {data.opportunities.opportunities.length > 1 && (
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => {
                        const updated = data.opportunities.opportunities.filter((_: any, i: number) => i !== index);
                        updateData("opportunities", { opportunities: updated });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Textarea
                    value={priority.description}
                    onChange={(e) => {
                      const updated = [...data.opportunities.opportunities];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateData("opportunities", { opportunities: updated });
                    }}
                    placeholder="Exec-ready, outcome-focused description..."
                    rows={2}
                    className="pr-24"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateDescription(index)}
                    disabled={generatingDescIndex === index || !priority.title?.trim()}
                    className="absolute right-2 top-1 gap-1 h-7 text-xs"
                  >
                    {generatingDescIndex === index ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              updateData("opportunities", {
                opportunities: [...data.opportunities.opportunities, { title: "", description: "" }]
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Account Strategy Tab Component
interface AccountStrategyTabProps {
  data: any;
  updateData: (section: any, value: any) => void;
}

const AccountStrategyTab = ({ data, updateData }: AccountStrategyTabProps) => {
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [generatingBetIndex, setGeneratingBetIndex] = useState<number | null>(null);
  const [generatingInsightIndex, setGeneratingInsightIndex] = useState<number | null>(null);

  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true);
    try {
      toast.loading("Generating account strategy narrative...", { id: "gen-strategy" });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-account-strategy", {
        body: { accountData: data }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate strategy");

      updateData("accountStrategy", { 
        strategyNarrative: responseData.strategyNarrative 
      });
      
      toast.success("Account strategy generated!", { id: "gen-strategy" });
    } catch (error) {
      console.error("Strategy generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate strategy", { id: "gen-strategy" });
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const handleGenerateBigBet = async (betIndex: number) => {
    setGeneratingBetIndex(betIndex);
    try {
      toast.loading("Generating Big Bet with AI...", { id: `gen-bet-${betIndex}` });
      
      const { data: responseData, error } = await supabase.functions.invoke("generate-big-bet", {
        body: { 
          accountData: data,
          existingBets: data.accountStrategy?.bigBets || [],
          betIndex
        }
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate Big Bet");

      const generatedBet = responseData.bigBet;
      const newBets = [...(data.accountStrategy?.bigBets || [])];
      newBets[betIndex] = {
        ...newBets[betIndex],
        title: generatedBet.title || newBets[betIndex].title,
        subtitle: generatedBet.subtitle || newBets[betIndex].subtitle,
        dealStatus: generatedBet.dealStatus || newBets[betIndex].dealStatus,
        targetClose: generatedBet.targetClose || newBets[betIndex].targetClose,
        netNewACV: generatedBet.netNewACV || newBets[betIndex].netNewACV,
        steadyStateBenefit: generatedBet.steadyStateBenefit || newBets[betIndex].steadyStateBenefit,
        insight: generatedBet.insight || newBets[betIndex].insight,
        people: newBets[betIndex].people || [],
      };
      
      updateData("accountStrategy", { bigBets: newBets });
      toast.success("Big Bet generated!", { id: `gen-bet-${betIndex}` });
    } catch (error) {
      console.error("Big Bet generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate Big Bet", { id: `gen-bet-${betIndex}` });
    } finally {
      setGeneratingBetIndex(null);
    }
  };

  const handleGenerateInsight = async (betIndex: number) => {
    const bet = data.accountStrategy?.bigBets?.[betIndex];
    if (!bet?.title) {
      toast.error("Please enter a title first");
      return;
    }

    setGeneratingInsightIndex(betIndex);
    try {
      toast.loading("Generating insight...", { id: `gen-insight-${betIndex}` });

      const { data: responseData, error } = await supabase.functions.invoke("generate-big-bet-insight", {
        body: {
          accountData: data,
          bet: bet,
        },
      });

      if (error) throw error;
      if (!responseData?.success) throw new Error(responseData?.error || "Failed to generate insight");

      // Defensive: older versions sometimes returned { options: [...] } as a string.
      const rawInsight = (responseData.insight || "").toString();
      let nextInsight = rawInsight;

      const trimmed = rawInsight.trim();
      if (trimmed.startsWith("{") && trimmed.includes('"options"')) {
        try {
          const parsed = JSON.parse(trimmed);
          const opts = Array.isArray(parsed?.options) ? parsed.options : [];
          const first = opts.find((o: any) => typeof o === "string" && o.trim());
          if (first) nextInsight = first.trim();
        } catch {
          // ignore; keep raw string
        }
      }

      const newBets = [...(data.accountStrategy?.bigBets || [])];
      newBets[betIndex] = {
        ...newBets[betIndex],
        insight: nextInsight,
      };

      updateData("accountStrategy", { bigBets: newBets });
      toast.success("Insight generated!", { id: `gen-insight-${betIndex}` });
    } catch (error) {
      console.error("Insight generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate insight", { id: `gen-insight-${betIndex}` });
    } finally {
      setGeneratingInsightIndex(null);
    }
  };
  const addBigBet = () => {
    const newBet = {
      title: "",
      subtitle: "",
      sponsor: "",
      dealStatus: "Pipeline" as const,
      targetClose: "",
      netNewACV: "",
      steadyStateBenefit: "",
      insight: "",
      people: [],
      products: [],
    };
    updateData("accountStrategy", {
      bigBets: [...(data.accountStrategy.bigBets || []), newBet],
    });
  };

  const updateBigBet = (index: number, field: string, value: any) => {
    const newBets = [...data.accountStrategy.bigBets];
    newBets[index] = { ...newBets[index], [field]: value };
    updateData("accountStrategy", { bigBets: newBets });
  };

  const removeBigBet = (index: number) => {
    const newBets = data.accountStrategy.bigBets.filter((_: any, i: number) => i !== index);
    updateData("accountStrategy", { bigBets: newBets });
  };

  const addPersonToBet = (betIndex: number) => {
    const newBets = [...data.accountStrategy.bigBets];
    newBets[betIndex].people = [...(newBets[betIndex].people || []), { name: "", role: "" }];
    updateData("accountStrategy", { bigBets: newBets });
  };

  const updatePersonInBet = (betIndex: number, personIndex: number, field: string, value: string) => {
    const newBets = [...data.accountStrategy.bigBets];
    newBets[betIndex].people[personIndex] = { ...newBets[betIndex].people[personIndex], [field]: value };
    updateData("accountStrategy", { bigBets: newBets });
  };

  const removePersonFromBet = (betIndex: number, personIndex: number) => {
    const newBets = [...data.accountStrategy.bigBets];
    newBets[betIndex].people = newBets[betIndex].people.filter((_: any, i: number) => i !== personIndex);
    updateData("accountStrategy", { bigBets: newBets });
  };

  const addKeyExec = () => {
    updateData("accountStrategy", {
      keyExecutives: [...(data.accountStrategy.keyExecutives || []), { name: "", role: "" }],
    });
  };

  const updateKeyExec = (index: number, field: string, value: string) => {
    const newExecs = [...data.accountStrategy.keyExecutives];
    newExecs[index] = { ...newExecs[index], [field]: value };
    updateData("accountStrategy", { keyExecutives: newExecs });
  };

  const removeKeyExec = (index: number) => {
    const newExecs = data.accountStrategy.keyExecutives.filter((_: any, i: number) => i !== index);
    updateData("accountStrategy", { keyExecutives: newExecs });
  };

  return (
    <>
      {/* Strategy Narrative */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Account Strategy Narrative
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateStrategy}
              disabled={isGeneratingStrategy}
              className="gap-2"
            >
              {isGeneratingStrategy ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  AI Generate Strategy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Describe your overall strategy for this account. What's the big picture? How will ServiceNow help them achieve their goals? AI can help draft this based on your other inputs.
          </p>
          <Textarea
            value={data.accountStrategy?.strategyNarrative || ""}
            onChange={(e) => updateData("accountStrategy", { strategyNarrative: e.target.value })}
            rows={6}
            placeholder="Our strategy for [Account] focuses on..."
            className="bg-background"
          />
        </CardContent>
      </Card>

      {/* Key Executives for Big Bets Slide */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Key Executives (Execs Row)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addKeyExec} className="gap-2">
              <Plus className="w-3 h-3" />
              Add Executive
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            These executives will appear in the connected "Execs" row on the Big Bets slide.
          </p>
          <div className="space-y-2">
            {(data.accountStrategy?.keyExecutives || []).map((exec: any, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Name (e.g., Vincent Clerc)"
                  value={exec.name}
                  onChange={(e) => updateKeyExec(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Role (e.g., CEO MAERSK)"
                  value={exec.role}
                  onChange={(e) => updateKeyExec(index, "role", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyExec(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(!data.accountStrategy?.keyExecutives || data.accountStrategy.keyExecutives.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No executives added. Click "Add Executive" to add key stakeholders.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Big Bets */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Big Bets (Workstreams)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addBigBet} className="gap-2">
              <Plus className="w-3 h-3" />
              Add Big Bet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Define your key transformation workstreams. Each Big Bet will appear as a card on the Big Bets slide with title, status, close date, insight, financials, and people.
          </p>

          {(data.accountStrategy?.bigBets || []).map((bet: any, betIndex: number) => (
            <div key={betIndex} className="p-4 rounded-lg bg-secondary/30 border border-border/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Big Bet #{betIndex + 1}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateBigBet(betIndex)}
                    disabled={generatingBetIndex === betIndex}
                    className="gap-1"
                  >
                    {generatingBetIndex === betIndex ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        AI Generate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBigBet(betIndex)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                  <Input
                    value={bet.title}
                    onChange={(e) => updateBigBet(betIndex, "title", e.target.value)}
                    placeholder="e.g., Maersk Line Ocean – SFDC Takeout"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Subtitle</label>
                  <Input
                    value={bet.subtitle}
                    onChange={(e) => updateBigBet(betIndex, "subtitle", e.target.value)}
                    placeholder="e.g., CRM Modernisation & Service Cloud"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Executive Sponsor</label>
                  <Input
                    value={bet.sponsor || ""}
                    onChange={(e) => updateBigBet(betIndex, "sponsor", e.target.value)}
                    placeholder="e.g., John Smith, CIO"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Deal Status</label>
                  <Select
                    value={bet.dealStatus}
                    onValueChange={(value) => updateBigBet(betIndex, "dealStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active Pursuit">Active Pursuit</SelectItem>
                      <SelectItem value="Strategic Initiative">Strategic Initiative</SelectItem>
                      <SelectItem value="Foundation Growth">Foundation Growth</SelectItem>
                      <SelectItem value="Pipeline">Pipeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Target Close</label>
                  <Input
                    value={bet.targetClose}
                    onChange={(e) => updateBigBet(betIndex, "targetClose", e.target.value)}
                    placeholder="e.g., Q1 2026"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Net New ACV</label>
                  <Input
                    value={bet.netNewACV}
                    onChange={(e) => updateBigBet(betIndex, "netNewACV", e.target.value)}
                    placeholder="e.g., $5M"
                  />
                </div>
              <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Steady-State Benefit (Annual)</label>
                  <Input
                    value={bet.steadyStateBenefit}
                    onChange={(e) => updateBigBet(betIndex, "steadyStateBenefit", e.target.value)}
                    placeholder="e.g., $565M"
                  />
                </div>
              </div>

              {/* Products Field */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">ServiceNow Products (comma separated)</label>
                <Input
                  value={(bet.products || []).join(", ")}
                  onChange={(e) => updateBigBet(betIndex, "products", e.target.value.split(",").map((p: string) => p.trim()).filter(Boolean))}
                  placeholder="e.g., CSM, AI Control Tower, CPQ, ITSM"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Products involved in this workstream</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground">Insight</label>
                  {bet.title && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateInsight(betIndex)}
                      disabled={generatingInsightIndex === betIndex}
                      className="gap-1 h-6 text-xs px-2"
                    >
                      {generatingInsightIndex === betIndex ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          AI Generate Insight
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Textarea
                  value={bet.insight}
                  onChange={(e) => updateBigBet(betIndex, "insight", e.target.value)}
                  rows={3}
                  placeholder="Strategic context and rationale for this workstream..."
                />
              </div>

              {/* People for this Big Bet */}
              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-foreground">People (Stakeholders)</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addPersonToBet(betIndex)}
                    className="gap-1 h-7 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    Add Person
                  </Button>
                </div>
                <div className="space-y-2">
                  {(bet.people || []).map((person: any, personIndex: number) => (
                    <div key={personIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder="Name"
                        value={person.name}
                        onChange={(e) => updatePersonInBet(betIndex, personIndex, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Role"
                        value={person.role}
                        onChange={(e) => updatePersonInBet(betIndex, personIndex, "role", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePersonFromBet(betIndex, personIndex)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {(!bet.people || bet.people.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No people added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(!data.accountStrategy?.bigBets || data.accountStrategy.bigBets.length === 0) && (
            <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
              <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No Big Bets defined yet.</p>
              <p className="text-xs text-muted-foreground">Click "Add Big Bet" to create your first workstream.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
