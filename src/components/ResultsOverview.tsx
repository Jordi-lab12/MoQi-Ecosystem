
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, RefreshCw, Heart, Star, MessageSquare, Users, UserX } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface ResultsOverviewProps {
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
  onRestart: () => void;
}

export const ResultsOverview = ({ 
  likedStartups, 
  coinAllocations, 
  feedbackPreferences, 
  onRestart 
}: ResultsOverviewProps) => {
  const getFeedbackLabel = (type: FeedbackType) => {
    switch (type) {
      case 'no': return 'No help';
      case 'group': return 'Group help';
      case 'all': return 'Full help';
      default: return 'No help';
    }
  };

  const getFeedbackIcon = (type: FeedbackType) => {
    switch (type) {
      case 'no': return UserX;
      case 'group': return Users;
      case 'all': return MessageSquare;
      default: return UserX;
    }
  };

  const sortedStartups = likedStartups.sort((a, b) => 
    (coinAllocations[b.id] || 0) - (coinAllocations[a.id] || 0)
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Startup Portfolio ✨
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Here's your final portfolio allocation across {likedStartups.length} innovative startups
          </p>
          
          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">{likedStartups.length}</div>
                  <div className="text-sm text-purple-600">Startups in Portfolio</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">100</div>
                  <div className="text-sm text-yellow-600">Coins Allocated</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    {likedStartups.filter(s => feedbackPreferences[s.id] !== 'no').length}
                  </div>
                  <div className="text-sm text-green-600">Getting Feedback</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Portfolio breakdown */}
        {likedStartups.length > 0 ? (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Portfolio Breakdown</h2>
            {sortedStartups.map((startup, index) => {
              const coins = coinAllocations[startup.id] || 0;
              const feedbackType = feedbackPreferences[startup.id] || 'no';
              const FeedbackIcon = getFeedbackIcon(feedbackType);
              
              return (
                <Card key={startup.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-4">
                        <div className="text-4xl p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                          {startup.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl font-bold">{startup.name}</span>
                            {index === 0 && coins > 0 && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                🏆 Top Holding
                              </Badge>
                            )}
                          </div>
                          <p className="text-base text-gray-600 font-normal">
                            {startup.tagline}
                          </p>
                        </div>
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-3xl font-bold flex items-center gap-2">
                          <Coins className="w-6 h-6 text-yellow-500" />
                          <span className="text-purple-600">{coins}</span>
                        </div>
                        <div className="text-sm text-gray-600">{coins}% of portfolio</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6">
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-2xl h-4 mb-4 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-4 rounded-2xl transition-all duration-700 flex items-center justify-end pr-3 relative"
                        style={{ width: `${coins}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                        {coins > 15 && (
                          <span className="text-white text-sm font-bold relative z-10">
                            {coins}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Description and feedback */}
                    <div className="flex justify-between items-end">
                      <p className="text-gray-600 leading-relaxed flex-1 mr-4">{startup.description}</p>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200">
                        <FeedbackIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          {getFeedbackLabel(feedbackType)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Empty Portfolio</h3>
              <p className="text-gray-600">
                You didn't add any startups to your portfolio this time. Try again to discover exciting opportunities!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        <div className="text-center">
          <Button 
            onClick={onRestart}
            className="px-12 py-4 text-xl font-bold rounded-2xl flex items-center gap-3 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-6 h-6" />
            Discover More Startups ✨
          </Button>
        </div>
      </div>
    </div>
  );
};
