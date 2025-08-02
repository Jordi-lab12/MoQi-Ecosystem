import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Trophy, Target, Users, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUnreadUpdates } from "@/hooks/useUnreadUpdates";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";

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

interface SwiperUpdateViewerProps {
  onBack: () => void;
  startupId: string;
  startupName: string;
}

export const SwiperUpdateViewer = ({ onBack, startupId, startupName }: SwiperUpdateViewerProps) => {
  const [updates, setUpdates] = useState<StartupUpdate[]>([]);
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
      
      // Mark all updates as read when viewer opens
      if (data && data.length > 0 && profile) {
        for (const update of data) {
          await markUpdateAsRead(update.id, startupId);
        }
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
          
          <Card className="text-center p-8">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">No Updates Yet</h2>
              <p className="text-muted-foreground mb-6">
                {startupName} hasn't published any weekly updates yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold">
              {startupName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{startupName}</h1>
              <p className="text-muted-foreground">Weekly Progress Updates</p>
            </div>
          </div>
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{update.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(update.week_ending)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Key Achievements */}
                {update.key_achievements && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-lg">Key Achievements</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.key_achievements}</p>
                  </div>
                )}

                {/* Metrics Update */}
                {update.metrics_update && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">Metrics & Progress</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.metrics_update}</p>
                  </div>
                )}

                {/* Team Highlights */}
                {update.team_highlights && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold text-lg">Team Highlights</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.team_highlights}</p>
                  </div>
                )}

                {/* Upcoming Goals */}
                {update.upcoming_goals && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-lg">Upcoming Goals</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.upcoming_goals}</p>
                  </div>
                )}

                {/* Challenges */}
                {update.challenges_faced && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold text-lg">Challenges Faced</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{update.challenges_faced}</p>
                  </div>
                )}

                {/* Images */}
                {update.images && update.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Visual Updates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {update.images.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Update image ${index + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};