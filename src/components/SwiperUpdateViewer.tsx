import { useState, useEffect } from "react";
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
  const [selectedUpdateIndex, setSelectedUpdateIndex] = useState(0);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">No Updates Yet</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {startupName} hasn't published any weekly updates yet. Check back soon!
          </p>
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const currentUpdate = updates[selectedUpdateIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Centered Back Button */}
      <div className="w-full flex justify-center py-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </button>
      </div>

      {/* Article Content - Full Width and Height */}
      <article className="flex-1 w-full pl-0 pr-4 py-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-golden rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {startupName.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                {startupName}
              </h1>
              <p className="text-xl text-muted-foreground">Weekly Progress Update</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Calendar className="w-5 h-5" />
            <time className="text-lg">{formatDate(currentUpdate.week_ending)}</time>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground">{currentUpdate.title}</h2>
          
          {/* Update Navigation Dots */}
          {updates.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {updates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUpdateIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === selectedUpdateIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}
        </header>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          {/* Key Achievements */}
          {currentUpdate.key_achievements && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-golden/10 rounded-xl">
                  <Trophy className="w-6 h-6 text-golden" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Key Achievements</h3>
              </div>
              <div className="bg-golden/5 rounded-xl p-6 border border-golden/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{currentUpdate.key_achievements}</p>
              </div>
            </section>
          )}

          {/* Metrics Update */}
          {currentUpdate.metrics_update && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Metrics & Progress</h3>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{currentUpdate.metrics_update}</p>
              </div>
            </section>
          )}

          {/* Team Highlights */}
          {currentUpdate.team_highlights && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Team Highlights</h3>
              </div>
              <div className="bg-accent/5 rounded-xl p-6 border border-accent/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{currentUpdate.team_highlights}</p>
              </div>
            </section>
          )}

          {/* Upcoming Goals */}
          {currentUpdate.upcoming_goals && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple/10 rounded-xl">
                  <Target className="w-6 h-6 text-purple" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Upcoming Goals</h3>
              </div>
              <div className="bg-purple/5 rounded-xl p-6 border border-purple/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{currentUpdate.upcoming_goals}</p>
              </div>
            </section>
          )}

          {/* Challenges */}
          {currentUpdate.challenges_faced && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Challenges Faced</h3>
              </div>
              <div className="bg-destructive/5 rounded-xl p-6 border border-destructive/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{currentUpdate.challenges_faced}</p>
              </div>
            </section>
          )}

          {/* Images */}
          {currentUpdate.images && currentUpdate.images.length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Visual Updates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUpdate.images.map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={image} 
                      alt={`Update visual ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
};