import { useAccountData } from "@/context/AccountDataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Plus, 
  X, 
  Crown,
  User,
  Building
} from "lucide-react";

export function TeamStep() {
  const { data, updateData } = useAccountData();

  const addTeamMember = () => {
    const newMembers = [...(data.basics.coreTeamMembers || []), { firstName: "", lastName: "", title: "" }];
    updateData("basics", { coreTeamMembers: newMembers });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newMembers = [...data.basics.coreTeamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateData("basics", { coreTeamMembers: newMembers });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = data.basics.coreTeamMembers.filter((_, i) => i !== index);
    updateData("basics", { coreTeamMembers: newMembers });
  };

  // Use accountStrategy.keyExecutives instead of engagement.executives
  const addExecutive = () => {
    const newExecs = [...(data.accountStrategy?.keyExecutives || []), { name: "", role: "" }];
    updateData("accountStrategy", { keyExecutives: newExecs });
  };

  const updateExecutive = (index: number, field: string, value: string) => {
    const newExecs = [...(data.accountStrategy?.keyExecutives || [])];
    newExecs[index] = { ...newExecs[index], [field]: value };
    updateData("accountStrategy", { keyExecutives: newExecs });
  };

  const removeExecutive = (index: number) => {
    const newExecs = (data.accountStrategy?.keyExecutives || []).filter((_, i) => i !== index);
    updateData("accountStrategy", { keyExecutives: newExecs });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Team & Stakeholders</h2>
        <p className="text-lg text-muted-foreground">
          Add your account team members and key customer executives. 
          This step is optional but enhances your plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Your Team */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Account Team</h3>
                  <p className="text-sm text-muted-foreground">Who's working on this account?</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addTeamMember} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {(data.basics.coreTeamMembers || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No team members added</p>
                  <Button variant="ghost" size="sm" onClick={addTeamMember} className="mt-2">
                    Add your first team member
                  </Button>
                </div>
              ) : (
                data.basics.coreTeamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/30">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="First Name"
                        value={member.firstName}
                        onChange={(e) => updateTeamMember(index, "firstName", e.target.value)}
                        className="h-9"
                      />
                      <Input
                        placeholder="Last Name"
                        value={member.lastName}
                        onChange={(e) => updateTeamMember(index, "lastName", e.target.value)}
                        className="h-9"
                      />
                      <Input
                        placeholder="Title"
                        value={member.title}
                        onChange={(e) => updateTeamMember(index, "title", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeamMember(index)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Executives */}
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Executives</h3>
                  <p className="text-sm text-muted-foreground">Key stakeholders at the customer</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addExecutive} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {(data.accountStrategy?.keyExecutives || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No executives added</p>
                  <Button variant="ghost" size="sm" onClick={addExecutive} className="mt-2">
                    Add your first executive
                  </Button>
                </div>
              ) : (
                (data.accountStrategy?.keyExecutives || []).map((exec, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/30">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={exec.name}
                        onChange={(e) => updateExecutive(index, "name", e.target.value)}
                        className="h-9"
                      />
                      <Input
                        placeholder="Role"
                        value={exec.role}
                        onChange={(e) => updateExecutive(index, "role", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExecutive(index)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-muted-foreground">
        This information will be used in your executive engagement slides and team overview.
      </p>
    </div>
  );
}
