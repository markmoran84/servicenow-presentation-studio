import { useAccountData } from "@/context/AccountDataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, DollarSign, Calendar, Globe, Users } from "lucide-react";

export function CompanyBasicsStep() {
  const { data, updateData } = useAccountData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Company Information</h2>
        <p className="text-lg text-muted-foreground">
          Tell us about the account. The more details you provide, the better your plan will be.
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-8">
        {/* Essential Info Card */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Essential Details</h3>
                <p className="text-sm text-muted-foreground">Required information</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accountName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="accountName"
                  value={data.basics.accountName}
                  onChange={(e) => updateData("basics", { accountName: e.target.value })}
                  placeholder="e.g., Acme Corporation"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={data.basics.industry}
                  onChange={(e) => updateData("basics", { industry: e.target.value })}
                  placeholder="e.g., Financial Services"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={data.basics.region}
                  onChange={(e) => updateData("basics", { region: e.target.value })}
                  placeholder="e.g., North America"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Account Tier</Label>
                <Select
                  value={data.basics.tier}
                  onValueChange={(value) => updateData("basics", { tier: value as "Strategic" | "Enterprise" | "Growth" })}
                >
                  <SelectTrigger id="tier" className="h-12">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategic">Strategic</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  value={data.basics.numberOfEmployees}
                  onChange={(e) => updateData("basics", { numberOfEmployees: e.target.value })}
                  placeholder="e.g., 50,000+"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewal">Renewal Date</Label>
                <Input
                  id="renewal"
                  value={data.basics.renewalDates}
                  onChange={(e) => updateData("basics", { renewalDates: e.target.value })}
                  placeholder="e.g., March 2025"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Info Card */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Financial Targets</h3>
                <p className="text-sm text-muted-foreground">Revenue and growth goals</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentACV">Current ACV</Label>
                <Input
                  id="currentACV"
                  value={data.basics.currentContractValue}
                  onChange={(e) => updateData("basics", { currentContractValue: e.target.value })}
                  placeholder="e.g., $8.5M ARR"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextFY">Next FY Target</Label>
                <Input
                  id="nextFY"
                  value={data.basics.nextFYAmbition}
                  onChange={(e) => updateData("basics", { nextFYAmbition: e.target.value })}
                  placeholder="e.g., $12M ARR"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="threeYear">3-Year Ambition</Label>
                <Input
                  id="threeYear"
                  value={data.basics.threeYearAmbition}
                  onChange={(e) => updateData("basics", { threeYearAmbition: e.target.value })}
                  placeholder="e.g., $25M ARR"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-muted-foreground">
        Don't worry if you don't have all the details — AI will help fill in gaps and make suggestions.
      </p>
    </div>
  );
}
