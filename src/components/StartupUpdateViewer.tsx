import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUnreadUpdates } from "@/hooks/useUnreadUpdates";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { UpdateSidebar } from "./StartupUpdateViewer/UpdateSidebar";
import { UpdateArticle } from "./StartupUpdateViewer/UpdateArticle";
import { UpdateHeader } from "./StartupUpdateViewer/UpdateHeader";

interface StartupUpdate {
  id: string;
  title: string;
  week_ending: string;
  key_achievements: string;
  challenges_faced: string;
  metrics_update: string;
  upcoming_goals: string;
  team_highlights: string;
  images: string[];
  created_at: string;
}

interface StartupUpdateViewerProps {
  onBack: () => void;
  startupId: string;
  startupName: string;
}

export const StartupUpdateViewer = ({ onBack, startupId, startupName }: StartupUpdateViewerProps) => {
  const [updates, setUpdates] = useState<StartupUpdate[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<StartupUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { markUpdateAsRead } = useUnreadUpdates();
  const { profile } = useSupabaseData();

  useEffect(() => {
    fetchUpdates();
  }, [startupId]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_updates')
        .select('*')
        .eq('startup_id', startupId)
        .eq('is_published', true)
        .order('week_ending', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
      if (data && data.length > 0) {
        setSelectedUpdate(data[0]); // Show latest update by default
        // Mark the latest update as read when viewer opens
        if (profile) {
          await markUpdateAsRead(data[0].id, startupId);
        }
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSelect = async (update: StartupUpdate) => {
    setSelectedUpdate(update);
    if (profile) {
      await markUpdateAsRead(update.id, startupId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative">
        {/* Logo in top left corner */}
        <div className="absolute top-4 left-4 z-10">
          <img 
            src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
            alt="MoQi Logo" 
            className="w-20 h-20"
          />
        </div>
        
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
          <Card className="text-center p-8">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">No Updates Yet</h2>
              <p className="text-gray-600 mb-6">
                {startupName} hasn't published any weekly updates yet. Check back soon!
              </p>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden">
        <UpdateHeader onBack={onBack} startupName={startupName} isMobile />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen">
          <UpdateSidebar
            updates={updates}
            selectedUpdate={selectedUpdate}
            onUpdateSelect={handleUpdateSelect}
            onBack={onBack}
            startupName={startupName}
            isDesktop
          />
          {selectedUpdate && (
            <UpdateArticle
              update={selectedUpdate}
              startupName={startupName}
              layout="desktop"
            />
          )}
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Tablet Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold">
                {startupName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{startupName} Updates</h1>
                <p className="text-muted-foreground">Weekly progress reports</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="sticky top-6">
                <UpdateSidebar
                  updates={updates}
                  selectedUpdate={selectedUpdate}
                  onUpdateSelect={handleUpdateSelect}
                  onBack={onBack}
                  startupName={startupName}
                />
              </div>
            </div>

            <div className="col-span-3">
              {selectedUpdate && (
                <UpdateArticle
                  update={selectedUpdate}
                  startupName={startupName}
                  layout="tablet"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="px-4 py-6">
          <div className="grid gap-6">
            <UpdateSidebar
              updates={updates}
              selectedUpdate={selectedUpdate}
              onUpdateSelect={handleUpdateSelect}
              onBack={onBack}
              startupName={startupName}
            />

            {selectedUpdate && (
              <UpdateArticle
                update={selectedUpdate}
                startupName={startupName}
                layout="mobile"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};