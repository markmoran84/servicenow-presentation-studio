import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSavedPlans } from '@/hooks/useSavedPlans';
import { useAccountData } from '@/context/AccountDataContext';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Save, FileText } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface SavePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function SavePlanDialog({ isOpen, onClose, onSaved }: SavePlanDialogProps) {
  const { data } = useAccountData();
  const { savePlan, loading } = useSavedPlans();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState(data.basics.accountName || '');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;

    const result = await savePlan(
      name,
      data as unknown as Json,
      data.generatedPlan as unknown as Json,
      data.improvedPresentation as unknown as Json,
      data.enhancedPresentation as unknown as Json,
      description || undefined
    );

    if (result) {
      setName('');
      setDescription('');
      onClose();
      onSaved?.();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Save Account Plan</DialogTitle>
              <DialogDescription>
                Save your current work to access it later
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="e.g., Acme Corp FY2025 Strategy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Plan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
