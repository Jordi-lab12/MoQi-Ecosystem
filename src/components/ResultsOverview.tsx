
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, RefreshCw, Heart, Star, MessageSquare, Users, UserX, ThumbsDown } from "lucide-react";
import { FeedbackSelector } from "./FeedbackSelector";
import type { Startup, FeedbackType } from "@/pages/Index";

interface ResultsOverviewProps {
  allStartups: Startup[];
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
  onRestart: () => void;
}

export const ResultsOverview = ({ 
  allStartups,
  likedStartups, 
  coinAllocations, 
  feedbackPreferences, 
  onRestart 
}: ResultsOverviewProps) => {
  const [currentFeedbackPreferences, setCurrentFeedbackPreferences] = useState<Record<string, FeedbackType>>(feedbackPreferences);

  const handleFeedbackChange = (startupId: string, feedbackType: FeedbackType) => {
    setCurrentFeedbackPreferences(prev => ({
      ...prev,
      [startupId]: feedbackType
    }));
  };

  const getFeedbackLabel = (type: FeedbackType) => {
    switch (type) {
      case 'no': return 'No help';
      case 'group': return 'Group help';
      case 'all': return 'Full help';
      default: return 'Full help';
    }
  };

  const getFeedbackIcon = (type: FeedbackType) => {
    switch (type) {
      case 'no': return UserX;
      case 'group': return Users;
      case 'all': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const likedStartupIds = new Set(likedStartups.map(s => s.id));
  const dislikedStartups = allStartups.filter(s => !likedStartupIds.has(s.id));
  
  // Sort liked startups by MoQi-points (highest to lowest)
  const sortedLikedStartups = likedStartups.sort((a, b) => 
    (coinAllocations[b.id] || 0) - (coinAllocations[a.id] || 0)
  );

  const startupsWithFeedback = allStartups.filter(s => {
    const feedback = currentFeedbackPreferences[s.id] || 'all';
    return feedback !== 'no';
  }).length;

  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Your Portfolio ✨
          </h1>
          
          {/* Compact summary stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
              <CardContent className="p-2 text-center">
                <Star className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-700">{likedStartups.length}</div>
                <div className="text-xs text-purple-600">Liked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
              <CardContent className="p-2 text-center">
                <Coins className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-yellow-700">100</div>
                <div className="text-xs text-yellow-600">MoQi-points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
              <CardContent className="p-2 text-center">
                <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-700">{startupsWithFeedback}</div>
                <div className="text-xs text-green-600">Feedback</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liked startups with MoQi-points - ranked */}
        {likedStartups.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">💰 Your Startup Rankings</h2>
            {sortedLikedStartups.map((startup, index) => {
              const points = coinAllocations[startup.id] || 0;
              const feedbackType = currentFeedbackPreferences[startup.id] || 'all';
              const FeedbackIcon = getFeedbackIcon(feedbackType);
              
              return (
                <Card key={startup.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Ranking and logo */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="text-2xl">{startup.logo}</div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm truncate">{startup.name}</h3>
                          {index === 0 && points > 0 && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1 py-0">
                              🏆
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1 mb-2">{startup.tagline}</p>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${points}%` }}
                          />
                        </div>
                        
                        {/* Feedback selector */}
                        <div className="relative z-10">
                          <FeedbackSelector
                            value={feedbackType}
                            onChange={(value) => handleFeedbackChange(startup.id, value)}
                          />
                        </div>
                      </div>
                      
                      {/* Points */}
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-purple-600 text-lg">{points}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Disliked startups with feedback options */}
        {dislikedStartups.length > 0 && (
          <div className="space-y-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">👎 Startups You Passed On</h2>
            {dislikedStartups.map((startup) => {
              const feedbackType = currentFeedbackPreferences[startup.id] || 'all';
              
              return (
                <Card key={startup.id} className="overflow-hidden shadow-sm bg-gray-50 border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl opacity-50">{startup.logo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm truncate text-gray-600">{startup.name}</h3>
                          <ThumbsDown className="w-3 h-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{startup.tagline}</p>
                        
                        {/* Feedback selector */}
                        <div className="relative z-10">
                          <FeedbackSelector
                            value={feedbackType}
                            onChange={(value) => handleFeedbackChange(startup.id, value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {likedStartups.length === 0 && (
          <Card className="mb-6">
            <CardContent className="text-center py-6">
              <h3 className="text-lg font-semibold mb-2">Empty Portfolio</h3>
              <p className="text-gray-600 text-sm">
                You didn't add any startups to your portfolio this time. Try again to discover exciting opportunities!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action button */}
        <div className="text-center">
          <Button 
            onClick={onRestart}
            className="px-6 py-3 text-base font-bold rounded-2xl flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Discover More Startups ✨
          </Button>
        </div>
      </div>
    </div>
  );
};
