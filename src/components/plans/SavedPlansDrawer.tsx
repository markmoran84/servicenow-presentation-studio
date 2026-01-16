import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSavedPlans, SavedPlan } from '@/hooks/useSavedPlans';
import { useAccountData } from '@/context/AccountDataContext';
import { 
  FolderOpen, 
  Search, 
  Star, 
  StarOff, 
  Trash2, 
  Clock, 
  FileText,
  Loader2,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedPlansDrawer({ isOpen, onClose }: SavedPlansDrawerProps) {
  const { plans, loading, fetchPlans, deletePlan, toggleFavorite, markAsOpened } = useSavedPlans();
  const { updateData, setGeneratedPlan, setImprovedPresentation, setEnhancedPresentation } = useAccountData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen, fetchPlans]);

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoritePlans = filteredPlans.filter(p => p.is_favorite);
  const recentPlans = filteredPlans.filter(p => !p.is_favorite);

  const handleLoadPlan = async (plan: SavedPlan) => {
    try {
      // Load account data - cast through unknown to satisfy TypeScript
      const accountData = plan.account_data as unknown as Record<string, Record<string, unknown>>;
      if (accountData && typeof accountData === 'object') {
        Object.entries(accountData).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            updateData(key as 'basics' | 'history' | 'financial' | 'strategy' | 'opportunities' | 'painPoints' | 'engagement' | 'swot' | 'businessModel' | 'annualReport' | 'accountStrategy', value);
          }
        });
      }

      // Load generated plan if exists
      if (plan.generated_plan) {
        setGeneratedPlan(plan.generated_plan as unknown as Parameters<typeof setGeneratedPlan>[0]);
      }

      // Load presentations if they exist
      if (plan.improved_presentation) {
        setImprovedPresentation(plan.improved_presentation as unknown as Parameters<typeof setImprovedPresentation>[0]);
      }
      
      if (plan.enhanced_presentation) {
        setEnhancedPresentation(plan.enhanced_presentation as unknown as Parameters<typeof setEnhancedPresentation>[0]);
      }

      await markAsOpened(plan.id);
      toast.success(`Loaded "${plan.name}"`);
      onClose();
    } catch (err) {
      toast.error('Failed to load plan');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    const success = await deletePlan(deleteConfirmId);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  const PlanCard = ({ plan }: { plan: SavedPlan }) => (
    <div 
      className="group relative p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer"
      onClick={() => handleLoadPlan(plan)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
            <h4 className="font-medium truncate">{plan.name}</h4>
          </div>
          {plan.description && (
            <p className="text-sm text-muted-foreground truncate mb-2">
              {plan.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(plan.updated_at), { addSuffix: true })}
            </span>
            {plan.last_opened_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Opened {formatDistanceToNow(new Date(plan.last_opened_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(plan.id, plan.is_favorite);
            }}
          >
            {plan.is_favorite ? (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmId(plan.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle>My Plans</SheetTitle>
                <SheetDescription>
                  {plans.length} saved plan{plans.length !== 1 ? 's' : ''}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
            <div className="p-4 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-1">
                    {searchQuery ? 'No matching plans' : 'No saved plans yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try a different search term' : 'Create a plan and save it to see it here'}
                  </p>
                </div>
              ) : (
                <>
                  {favoritePlans.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Favorites
                      </h3>
                      <div className="space-y-2">
                        {favoritePlans.map(plan => (
                          <PlanCard key={plan.id} plan={plan} />
                        ))}
                      </div>
                    </div>
                  )}

                  {recentPlans.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent
                      </h3>
                      <div className="space-y-2">
                        {recentPlans.map(plan => (
                          <PlanCard key={plan.id} plan={plan} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your saved plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
