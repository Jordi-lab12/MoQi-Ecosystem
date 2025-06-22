
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, RefreshCw, Heart, Star, MessageSquare, Users, UserX } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface ResultsOverviewProps {
  likedStartups: Startup[];
  coinAllocation: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
  onRestart: () => void;
}

export const ResultsOverview = ({ 
  likedStartups, 
  coinAllocation, 
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
    (coinAllocation[b.id] || 0) - (coinAllocation[a.id] || 0)
  );

  const startupsWithFeedback = likedStartups.filter(s => {
    const feedback = feedbackPreferences[s.id] || 'no';
    return feedback !== 'no';
  }).length;

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Your Portfolio ✨
          </h1>
          
          {/* Compact summary stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
              <CardContent className="p-3 sm:p-4 text-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mx-auto mb-1" />
                <div className="text-lg sm:text-xl font-bold text-purple-700">{likedStartups.length}</div>
                <div className="text-xs text-purple-600">Startups</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
              <CardContent className="p-3 sm:p-4 text-center">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg sm:text-xl font-bold text-yellow-700">100</div>
                <div className="text-xs text-yellow-600">Coins</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
              <CardContent className="p-3 sm:p-4 text-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto mb-1" />
                <div className="text-lg sm:text-xl font-bold text-green-700">{startupsWithFeedback}</div>
                <div className="text-xs text-green-600">Feedback</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compact portfolio breakdown */}
        {likedStartups.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {sortedStartups.map((startup, index) => {
              const coins = coinAllocation[startup.id] || 0;
              const feedbackType = feedbackPreferences[startup.id] || 'no';
              const FeedbackIcon = getFeedbackIcon(feedbackType);
              
              return (
                <Card key={startup.id} className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Logo and basic info */}
                      <div className="text-2xl sm:text-3xl">{startup.logo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm sm:text-base truncate">{startup.name}</h3>
                          {index === 0 && coins > 0 && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              🏆 Top
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{startup.tagline}</p>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mt-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                            style={{ width: `${coins}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Coins and feedback */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          <span className="font-bold text-purple-600 text-sm sm:text-base">{coins}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                          <FeedbackIcon className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-700">{getFeedbackLabel(feedbackType)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mb-6 sm:mb-8">
            <CardContent className="text-center py-8 sm:py-12">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Empty Portfolio</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                You didn't add any startups to your portfolio this time. Try again to discover exciting opportunities!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action button */}
        <div className="text-center">
          <Button 
            onClick={onRestart}
            className="px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-xl font-bold rounded-2xl flex items-center gap-2 sm:gap-3 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6" />
            Discover More Startups ✨
          </Button>
        </div>
      </div>
    </div>
  );
};
