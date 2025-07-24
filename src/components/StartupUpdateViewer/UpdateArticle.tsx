import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, AlertTriangle, Users, Target } from "lucide-react";

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

interface UpdateArticleProps {
  update: StartupUpdate;
  startupName: string;
  layout: 'desktop' | 'tablet' | 'mobile';
}

export const UpdateArticle = ({ update, startupName, layout }: UpdateArticleProps) => {
  const isDesktop = layout === 'desktop';
  const isTablet = layout === 'tablet';

  if (isDesktop) {
    return (
      <div className="flex-1 overflow-y-auto w-full">
        <article className="w-full px-6 py-8">
          <header className="mb-12 w-full">
            <div className="flex items-center justify-between mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Week of {new Date(update.week_ending).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Published {new Date(update.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">{update.title}</h1>
            <p className="text-2xl text-muted-foreground">
              Weekly Progress Report • {startupName}
            </p>
          </header>

          <div className="w-full space-y-12">
            {update.key_achievements && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Key Achievements</h2>
                </div>
                <div className="bg-green-50 border-l-8 border-green-500 p-8 rounded-r-2xl">
                  <div className="space-y-4 text-xl leading-relaxed">
                    {update.key_achievements.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {update.metrics_update && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Performance Metrics</h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                  <div className="space-y-4 text-lg leading-relaxed">
                    {update.metrics_update.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {update.images && update.images.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Behind the Scenes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {update.images.map((image, index) => (
                    <figure key={index}>
                      <img
                        src={image}
                        alt={`${startupName} update ${index + 1}`}
                        className="w-full h-64 object-cover rounded-2xl border shadow-lg"
                      />
                      <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
                        {startupName} team in action
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {update.challenges_faced && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Challenges & Solutions</h2>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
                  <div className="space-y-4 text-xl leading-relaxed">
                    {update.challenges_faced.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {update.team_highlights && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Team Spotlight</h2>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
                  <div className="space-y-4 text-xl leading-relaxed">
                    {update.team_highlights.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {update.upcoming_goals && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Looking Ahead</h2>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8">
                  <div className="space-y-4 text-xl leading-relaxed">
                    <p className="font-semibold text-xl">Our focus for the upcoming week:</p>
                    {update.upcoming_goals.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          <footer className="border-t pt-8 mt-16">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-lg">Published by {startupName}</span>
              <span className="text-sm">
                {new Date(update.created_at).toLocaleDateString('en-US', {
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
      </div>
    );
  }

  // Tablet and Mobile use Card layout
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Week of {new Date(update.week_ending).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: isTablet ? undefined : 'numeric'
            })}
          </Badge>
          <span className="text-sm text-primary-foreground/80">
            Published {new Date(update.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{update.title}</h1>
        <p className="text-primary-foreground/90">Weekly Progress Report • {startupName}</p>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {update.key_achievements && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold">Key Achievements</h2>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="space-y-3">
                  {update.key_achievements.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {update.metrics_update && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">Performance Metrics</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-3">
                  {update.metrics_update.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {update.images && update.images.length > 0 && (
            <section>
              <div className={`grid ${isTablet ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {update.images.map((image, index) => (
                  <figure key={index}>
                    <img
                      src={image}
                      alt={`${startupName} update ${index + 1}`}
                      className={`w-full object-cover rounded-lg border shadow-sm ${
                        isTablet ? 'h-32' : 'h-48'
                      }`}
                    />
                    {!isTablet && (
                      <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                        Behind the scenes at {startupName}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {update.challenges_faced && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold">Challenges & Solutions</h2>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="space-y-3">
                  {update.challenges_faced.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {update.team_highlights && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold">Team Spotlight</h2>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-3">
                  {update.team_highlights.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {update.upcoming_goals && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold">Looking Ahead</h2>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="space-y-3">
                  {!isTablet && <p className="font-medium">Our focus for the upcoming week:</p>}
                  {update.upcoming_goals.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="border-t pt-6 mt-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Published by {startupName}</span>
            <span>
              {new Date(update.created_at).toLocaleDateString('en-US', {
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
  );
};