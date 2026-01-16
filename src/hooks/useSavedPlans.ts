import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface SavedPlan {
  id: string;
  name: string;
  description: string | null;
  account_data: Json;
  generated_plan: Json | null;
  improved_presentation: Json | null;
  enhanced_presentation: Json | null;
  is_favorite: boolean;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useSavedPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('saved_plans')
      .select('*')
      .order('updated_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setPlans(data as SavedPlan[]);
    setLoading(false);
  }, [user]);

  const savePlan = useCallback(async (
    name: string,
    accountData: Json,
    generatedPlan?: Json,
    improvedPresentation?: Json,
    enhancedPresentation?: Json,
    description?: string
  ) => {
    if (!user) {
      toast.error('Please sign in to save plans');
      return null;
    }

    setLoading(true);
    
    const { data, error: insertError } = await supabase
      .from('saved_plans')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        account_data: accountData,
        generated_plan: generatedPlan || null,
        improved_presentation: improvedPresentation || null,
        enhanced_presentation: enhancedPresentation || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      toast.error('Failed to save plan');
      setLoading(false);
      return null;
    }

    toast.success('Plan saved successfully!');
    await fetchPlans();
    setLoading(false);
    return data as SavedPlan;
  }, [user, fetchPlans]);

  const updatePlan = useCallback(async (
    planId: string,
    updates: {
      name?: string;
      description?: string | null;
      account_data?: Json;
      generated_plan?: Json | null;
      improved_presentation?: Json | null;
      enhanced_presentation?: Json | null;
      is_favorite?: boolean;
      last_opened_at?: string | null;
    }
  ) => {
    if (!user) return null;

    setLoading(true);
    
    const { data, error: updateError } = await supabase
      .from('saved_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      toast.error('Failed to update plan');
      setLoading(false);
      return null;
    }

    toast.success('Plan updated!');
    await fetchPlans();
    setLoading(false);
    return data as SavedPlan;
  }, [user, fetchPlans]);

  const deletePlan = useCallback(async (planId: string) => {
    if (!user) return false;

    setLoading(true);
    
    const { error: deleteError } = await supabase
      .from('saved_plans')
      .delete()
      .eq('id', planId);

    if (deleteError) {
      setError(deleteError.message);
      toast.error('Failed to delete plan');
      setLoading(false);
      return false;
    }

    toast.success('Plan deleted');
    await fetchPlans();
    setLoading(false);
    return true;
  }, [user, fetchPlans]);

  const toggleFavorite = useCallback(async (planId: string, isFavorite: boolean) => {
    return updatePlan(planId, { is_favorite: !isFavorite });
  }, [updatePlan]);

  const markAsOpened = useCallback(async (planId: string) => {
    if (!user) return;

    await supabase
      .from('saved_plans')
      .update({ last_opened_at: new Date().toISOString() })
      .eq('id', planId);
  }, [user]);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    savePlan,
    updatePlan,
    deletePlan,
    toggleFavorite,
    markAsOpened,
  };
}
