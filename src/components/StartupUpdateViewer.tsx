import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Target, Users, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative">
      {/* Logo in top left corner */}
      <div className="absolute top-4 left-4 z-10">
        <img 
          src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
          alt="MoQi Logo" 
          className="w-20 h-20"
        />
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {startupName} Updates
            </h1>
            <p className="text-gray-600">Weekly progress reports</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Updates List */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">All Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    onClick={() => setSelectedUpdate(update)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedUpdate?.id === update.id
                        ? 'bg-purple-100 border-purple-300'
                        : 'bg-white border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <h3 className="font-semibold text-sm truncate">{update.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(update.week_ending).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Article View */}
          <div className="lg:col-span-3">
            {selectedUpdate && (
              <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                {/* Article Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                      Week ending {new Date(selectedUpdate.week_ending).toLocaleDateString()}
                    </Badge>
                    <span className="text-sm text-gray-300">
                      {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold leading-tight mb-2">{selectedUpdate.title}</h1>
                  <p className="text-xl text-gray-300">Weekly Progress Report by {startupName}</p>
                </div>

                {/* Article Content */}
                <div className="p-8 prose prose-lg max-w-none">
                  {/* Lead paragraph */}
                  {selectedUpdate.key_achievements && (
                    <div className="mb-8">
                      <p className="text-xl leading-relaxed text-gray-700 font-medium border-l-4 border-green-500 pl-6 mb-6">
                        This week marked significant progress for {startupName}, with notable achievements across multiple fronts.
                      </p>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Achievements</h2>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                          {selectedUpdate.key_achievements.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metrics section woven into narrative */}
                  {selectedUpdate.metrics_update && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <div className="text-gray-700 leading-relaxed space-y-4">
                          {selectedUpdate.metrics_update.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images in the middle of the article */}
                  {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                    <div className="my-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedUpdate.images.map((image, index) => (
                          <figure key={index} className="mb-6">
                            <img
                              src={image}
                              alt={`${startupName} update ${index + 1}`}
                              className="w-full h-64 object-cover rounded-lg shadow-lg"
                            />
                            <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                              Behind the scenes at {startupName}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges section */}
                  {selectedUpdate.challenges_faced && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Overcoming Challenges</h2>
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        <p className="text-lg text-gray-600 italic mb-4">
                          "Every startup faces obstacles, but it's how we address them that defines our path forward."
                        </p>
                        {selectedUpdate.challenges_faced.split('\n').map((paragraph, index) => (
                          paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team highlights */}
                  {selectedUpdate.team_highlights && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Spotlight</h2>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="text-gray-700 leading-relaxed space-y-4">
                          {selectedUpdate.team_highlights.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Future goals */}
                  {selectedUpdate.upcoming_goals && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking Ahead</h2>
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        <p className="text-lg">
                          As we move into the next week, {startupName} has set ambitious goals:
                        </p>
                        {selectedUpdate.upcoming_goals.split('\n').map((paragraph, index) => (
                          paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article footer */}
                  <div className="border-t border-gray-200 pt-6 mt-10">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Published by {startupName}</span>
                      <span>
                        {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};