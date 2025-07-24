import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Target, Users, Trophy } from "lucide-react";
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
      {/* Mobile/Tablet Header */}
      <div className="md:hidden border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {startupName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{startupName} Updates</h1>
                <p className="text-sm text-muted-foreground">Weekly progress reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="w-80 border-r bg-muted/30 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <Button onClick={onBack} variant="ghost" size="sm" className="mb-4 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold">
                  {startupName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{startupName}</h1>
                  <p className="text-sm text-muted-foreground">Weekly Updates</p>
                </div>
              </div>
            </div>

            {/* Updates List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    onClick={() => {
                      setSelectedUpdate(update);
                      if (profile) {
                        markUpdateAsRead(update.id, startupId);
                      }
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedUpdate?.id === update.id
                        ? 'bg-primary/10 border-primary/30 shadow-sm'
                        : 'bg-white border-border hover:border-primary/40 hover:shadow-sm'
                    }`}
                  >
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{update.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(update.week_ending).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedUpdate && (
              <article className="max-w-4xl mx-auto p-8">
                {/* Desktop Article Header */}
                <header className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Week of {new Date(selectedUpdate.week_ending).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Published {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-4 leading-tight">{selectedUpdate.title}</h1>
                  <p className="text-xl text-muted-foreground">
                    Weekly Progress Report • {startupName}
                  </p>
                </header>

                {/* Desktop Article Content */}
                <div className="prose prose-lg max-w-none">
                  {/* Key Achievements */}
                  {selectedUpdate.key_achievements && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Key Achievements</h2>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                        <div className="text-foreground space-y-4 text-lg leading-relaxed">
                          {selectedUpdate.key_achievements.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Two-column layout for metrics and images */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                    {/* Metrics */}
                    {selectedUpdate.metrics_update && (
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">Metrics</h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <div className="text-foreground space-y-3">
                            {selectedUpdate.metrics_update.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Images */}
                    {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Gallery</h2>
                        <div className="space-y-4">
                          {selectedUpdate.images.slice(0, 2).map((image, index) => (
                            <figure key={index} className="group">
                              <img
                                src={image}
                                alt={`${startupName} update ${index + 1}`}
                                className="w-full h-40 object-cover rounded-xl border shadow-sm group-hover:shadow-md transition-shadow"
                              />
                            </figure>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Rest of content in single column */}
                  {selectedUpdate.challenges_faced && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Challenges & Solutions</h2>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <div className="text-foreground space-y-4 text-lg leading-relaxed">
                          {selectedUpdate.challenges_faced.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {selectedUpdate.team_highlights && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Team Spotlight</h2>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                        <div className="text-foreground space-y-4 text-lg leading-relaxed">
                          {selectedUpdate.team_highlights.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {selectedUpdate.upcoming_goals && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Looking Ahead</h2>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                        <div className="text-foreground space-y-4 text-lg leading-relaxed">
                          <p className="font-medium">Our focus for the upcoming week:</p>
                          {selectedUpdate.upcoming_goals.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                {/* Desktop Footer */}
                <footer className="border-t pt-6 mt-12">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                </footer>
              </article>
            )}
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-5xl mx-auto px-6 py-6">
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

          <div className="grid grid-cols-3 gap-8">
            {/* Tablet Sidebar */}
            <div className="col-span-1">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">All Updates ({updates.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        onClick={() => {
                          setSelectedUpdate(update);
                          if (profile) {
                            markUpdateAsRead(update.id, startupId);
                          }
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedUpdate?.id === update.id
                            ? 'bg-primary/5 border-primary/20 shadow-sm'
                            : 'border-border hover:border-primary/40 hover:bg-muted/50'
                        }`}
                      >
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">{update.title}</h3>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.week_ending).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tablet Main Content */}
            <div className="col-span-2">
              {selectedUpdate && (
                <Card className="overflow-hidden">
                  {/* Tablet Article Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Week of {new Date(selectedUpdate.week_ending).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Badge>
                      <span className="text-sm text-primary-foreground/80">
                        {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{selectedUpdate.title}</h1>
                    <p className="text-primary-foreground/90">Weekly Progress Report • {startupName}</p>
                  </div>

                  {/* Tablet Article Content */}
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      {selectedUpdate.key_achievements && (
                        <section className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-5 h-5 text-green-600" />
                            <h2 className="text-lg font-bold">Key Achievements</h2>
                          </div>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <div className="text-foreground space-y-2">
                              {selectedUpdate.key_achievements.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index} className="text-sm">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedUpdate.metrics_update && (
                        <section className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold">Metrics</h2>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-foreground space-y-2">
                              {selectedUpdate.metrics_update.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index} className="text-sm">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                        <section className="mb-6">
                          <div className="grid grid-cols-2 gap-3">
                            {selectedUpdate.images.map((image, index) => (
                              <figure key={index}>
                                <img
                                  src={image}
                                  alt={`${startupName} update ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                              </figure>
                            ))}
                          </div>
                        </section>
                      )}

                      {selectedUpdate.challenges_faced && (
                        <section className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <h2 className="text-lg font-bold">Challenges</h2>
                          </div>
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="text-foreground space-y-2">
                              {selectedUpdate.challenges_faced.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index} className="text-sm">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedUpdate.team_highlights && (
                        <section className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold">Team</h2>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="text-foreground space-y-2">
                              {selectedUpdate.team_highlights.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index} className="text-sm">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedUpdate.upcoming_goals && (
                        <section className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold">Upcoming Goals</h2>
                          </div>
                          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <div className="text-foreground space-y-2">
                              {selectedUpdate.upcoming_goals.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index} className="text-sm">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Tablet Footer */}
                    <div className="border-t pt-4 mt-6">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Published by {startupName}</span>
                        <span>
                          {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="px-4 py-6">
          <div className="grid gap-6">
            {/* Mobile Updates List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  All Updates ({updates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    onClick={() => {
                      setSelectedUpdate(update);
                      if (profile) {
                        markUpdateAsRead(update.id, startupId);
                      }
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedUpdate?.id === update.id
                        ? 'bg-primary/5 border-primary/20 shadow-sm'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50'
                    }`}
                  >
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{update.title}</h3>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.week_ending).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mobile Main Content */}
            {selectedUpdate && (
              <Card className="overflow-hidden">
                {/* Mobile Article Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Week of {new Date(selectedUpdate.week_ending).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Badge>
                    <span className="text-sm text-primary-foreground/80">
                      Published {new Date(selectedUpdate.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{selectedUpdate.title}</h1>
                  <p className="text-lg text-primary-foreground/90">
                    Weekly Progress Report • {startupName}
                  </p>
                </div>

                {/* Mobile Article Content */}
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {selectedUpdate.key_achievements && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Trophy className="w-5 h-5 text-green-600" />
                          <h2 className="text-xl font-bold text-foreground">Key Achievements</h2>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <div className="text-foreground space-y-3">
                            {selectedUpdate.key_achievements.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {selectedUpdate.metrics_update && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <h2 className="text-xl font-bold text-foreground">Performance Metrics</h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-foreground space-y-3">
                            {selectedUpdate.metrics_update.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                      <section className="mb-8">
                        <div className="grid grid-cols-1 gap-4">
                          {selectedUpdate.images.map((image, index) => (
                            <figure key={index} className="group">
                              <img
                                src={image}
                                alt={`${startupName} update ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                              />
                              <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                                Behind the scenes at {startupName}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      </section>
                    )}

                    {selectedUpdate.challenges_faced && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <h2 className="text-xl font-bold text-foreground">Challenges & Solutions</h2>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="text-foreground space-y-3">
                            {selectedUpdate.challenges_faced.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {selectedUpdate.team_highlights && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-purple-600" />
                          <h2 className="text-xl font-bold text-foreground">Team Spotlight</h2>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="text-foreground space-y-3">
                            {selectedUpdate.team_highlights.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {selectedUpdate.upcoming_goals && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Target className="w-5 h-5 text-indigo-600" />
                          <h2 className="text-xl font-bold text-foreground">Looking Ahead</h2>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="text-foreground space-y-3">
                            <p className="font-medium">
                              Our focus for the upcoming week:
                            </p>
                            {selectedUpdate.upcoming_goals.split('\n').map((paragraph, index) => (
                              paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Mobile Footer */}
                  <div className="border-t pt-6 mt-8">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};