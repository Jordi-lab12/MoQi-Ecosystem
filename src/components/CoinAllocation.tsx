import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowRight, Zap, Sparkles, MessageSquare, Users, UserX, ChevronDown } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface CoinAllocationProps {
  startups: Startup[];
  feedbackPreferences: Record<string, FeedbackType>;
  onComplete: (allocations: Record<string, number>, feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const CoinAllocation = ({ startups, feedbackPreferences: initialFeedbackPreferences, onComplete }: CoinAllocationProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    startups.reduce((acc, startup) => ({ ...acc, [startup.id]: 0 }), {})
  );
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>(initialFeedbackPreferences);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingCoins = 100 - totalAllocated;

  const updateAllocation = (startupId: string, change: number) => {
    const currentValue = allocations[startupId];
    const newValue = Math.max(0, Math.min(100, currentValue + change));
    
    if (newValue !== currentValue && (change < 0 || remainingCoins >= Math.abs(change))) {
      setAllocations(prev => ({ ...prev, [startupId]: newValue }));
    }
  };

  const setFeedbackForStartup = (startupId: string, feedbackType: FeedbackType) => {
    setFeedbackPreferences(prev => ({ ...prev, [startupId]: feedbackType }));
    setExpandedFeedback(null);
  };

  const handleComplete = () => {
    onComplete(allocations, feedbackPreferences);
  };

  const canComplete = totalAllocated === 100;

  const feedbackOptions = [
    { type: "no" as FeedbackType, icon: UserX, label: "No help", emoji: "🤐" },
    { type: "group" as FeedbackType, icon: Users, label: "Group help", emoji: "👥" },
    { type: "all" as FeedbackType, icon: MessageSquare, label: "Full help", emoji: "💬" }
  ];

  const getFeedbackOption = (type: FeedbackType) => {
    return feedbackOptions.find(option => option.type === type) || feedbackOptions[0];
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Build Your Portfolio
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg px-4">
            Distribute 100 coins across your selected startups ✨
          </p>
          
          {/* Coin Counter */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div 
              id="coin-source"
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-2xl text-lg sm:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{remainingCoins}</span>
              <span className="text-sm sm:text-lg opacity-90">coins left</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-8 mb-6 sm:mb-8">
          {startups.map((startup, index) => {
            const currentFeedback = feedbackPreferences[startup.id] || 'no';
            const feedbackOption = getFeedbackOption(currentFeedback);
            
            return (
              <Card 
                key={startup.id} 
                id={`startup-${startup.id}`}
                className="overflow-visible hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] border-2 hover:border-purple-200 relative"
                style={{ zIndex: startups.length - index + 10 }}
              >
                <CardHeader className="pb-2 sm:pb-4 bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <div className="text-2xl sm:text-4xl p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        {startup.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-2xl font-bold truncate">{startup.name}</div>
                        <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed line-clamp-2">
                          {startup.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-xl sm:text-3xl font-bold flex items-center gap-1 sm:gap-2 text-purple-600">
                          <Coins className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
                          {allocations[startup.id]}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 font-medium">
                          {allocations[startup.id]}% of portfolio
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4 sm:pb-6">
                  {/* Simplified allocation controls */}
                  <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
                    <Button
                      onClick={() => updateAllocation(startup.id, -10)}
                      disabled={allocations[startup.id] < 10}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      -10
                    </Button>
                    
                    <div className="flex-1 max-w-xs sm:max-w-md">
                      <div className="text-center mb-2">
                        <span className="text-2xl sm:text-4xl font-bold text-purple-600">
                          {allocations[startup.id]}
                        </span>
                        <span className="text-sm sm:text-xl text-gray-500 ml-1 sm:ml-2">coins</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-2xl h-4 sm:h-6 overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-4 sm:h-6 rounded-2xl transition-all duration-700 flex items-center justify-center relative"
                          style={{ width: `${allocations[startup.id]}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                          {allocations[startup.id] > 15 && (
                            <span className="text-white text-xs sm:text-sm font-bold relative z-10">
                              {allocations[startup.id]}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => updateAllocation(startup.id, 10)}
                      disabled={remainingCoins < 10}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      +10
                    </Button>
                  </div>

                  {/* Fixed feedback selector with proper z-index */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-blue-200 relative">
                    <div className="text-xs sm:text-sm font-medium mb-2 text-blue-700">Feedback preference:</div>
                    <div className="relative" style={{ zIndex: 1000 + index }}>
                      <button
                        onClick={() => setExpandedFeedback(expandedFeedback === startup.id ? null : startup.id)}
                        className="w-full flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-200 hover:border-blue-300 transition-colors relative z-10"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base">{feedbackOption.emoji}</span>
                          <span className="font-medium text-xs sm:text-sm">{feedbackOption.label}</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expandedFeedback === startup.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {expandedFeedback === startup.id && (
                        <div 
                          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-blue-200 overflow-hidden"
                          style={{ zIndex: 9999 }}
                        >
                          {feedbackOptions.map((option) => (
                            <button
                              key={option.type}
                              onClick={() => setFeedbackForStartup(startup.id, option.type)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                            >
                              <span>{option.emoji}</span>
                              <span className="font-medium">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleComplete}
            disabled={!canComplete}
            className={`px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-2xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 ${
              canComplete 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {canComplete ? (
              <>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                Complete Portfolio
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            ) : (
              <>
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                Allocate All Coins
              </>
            )}
          </Button>
          
          {!canComplete && (
            <div className="mt-4">
              <p className="text-xs sm:text-sm text-gray-500">
                You need to allocate exactly 100 coins to continue
              </p>
              <p className="text-base sm:text-lg font-bold text-purple-600 mt-1">
                {remainingCoins} coins remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
