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

          {/* Selected Update Details */}
          <div className="lg:col-span-3">
            {selectedUpdate && (
              <Card className="shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedUpdate.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Week ending {new Date(selectedUpdate.week_ending).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Key Achievements */}
                  {selectedUpdate.key_achievements && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">Key Achievements</h3>
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.key_achievements}</p>
                      </div>
                    </div>
                  )}

                  {/* Metrics Update */}
                  {selectedUpdate.metrics_update && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <h3 className="text-lg font-semibold">Metrics & Performance</h3>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.metrics_update}</p>
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {selectedUpdate.challenges_faced && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-semibold">Challenges & Solutions</h3>
                      </div>
                      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.challenges_faced}</p>
                      </div>
                    </div>
                  )}

                  {/* Upcoming Goals */}
                  {selectedUpdate.upcoming_goals && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">Upcoming Goals</h3>
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.upcoming_goals}</p>
                      </div>
                    </div>
                  )}

                  {/* Team Highlights */}
                  {selectedUpdate.team_highlights && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold">Team Highlights</h3>
                      </div>
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.team_highlights}</p>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedUpdate.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Update image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Published Date */}
                  <div className="text-sm text-gray-500 text-center pt-4 border-t">
                    Published on {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};