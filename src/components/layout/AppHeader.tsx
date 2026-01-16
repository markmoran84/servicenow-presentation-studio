import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { SavedPlansDrawer } from '@/components/plans/SavedPlansDrawer';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  FolderOpen, 
  Plus,
  ChevronDown,
  Sparkles,
  Menu
} from 'lucide-react';
import { toast } from 'sonner';

interface AppHeaderProps {
  onNewPlan?: () => void;
  currentPlanName?: string;
}

export function AppHeader({ onNewPlan, currentPlanName }: AppHeaderProps) {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [plansDrawerOpen, setPlansDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Signed out successfully');
    }
  };

  const openSignIn = () => {
    setAuthModalMode('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="h-full max-w-[1800px] mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight">AccountPlan<span className="text-primary">AI</span></h1>
              </div>
            </div>
            
            {/* Current plan indicator */}
            {currentPlanName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-xs text-muted-foreground">Editing:</span>
                <span className="text-sm font-medium truncate max-w-[200px]">{currentPlanName}</span>
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <>
                {/* My Plans Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPlansDrawerOpen(true)}
                  className="hidden sm:flex gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden md:inline">My Plans</span>
                </Button>

                {/* New Plan Button */}
                <Button
                  size="sm"
                  onClick={onNewPlan}
                  className="hidden sm:flex gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">New Plan</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                          {getInitials(user?.user_metadata?.full_name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium">{displayName}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setPlansDrawerOpen(true)} className="sm:hidden">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      My Plans
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onNewPlan} className="sm:hidden">
                      <Plus className="w-4 h-4 mr-2" />
                      New Plan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="sm:hidden" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={openSignIn} disabled={loading}>
                  Sign In
                </Button>
                <Button size="sm" onClick={openSignUp} disabled={loading}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authModalMode}
      />

      <SavedPlansDrawer
        isOpen={plansDrawerOpen}
        onClose={() => setPlansDrawerOpen(false)}
      />
    </>
  );
}
