
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, RefreshCw, Heart } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface ResultsOverviewProps {
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackType: FeedbackType;
  onRestart: () => void;
}

export const ResultsOverview = ({ 
  likedStartups, 
  coinAllocations, 
  feedbackType, 
  onRestart 
}: ResultsOverviewProps) => {
  const feedbackLabels = {
    no: "No feedback",
    group: "Group feedback only",
    all: "All feedback"
  };

  const sortedStartups = likedStartups.sort((a, b) => 
    (coinAllocations[b.id] || 0) - (coinAllocations[a.id] || 0)
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Investment Portfolio</h1>
          <p className="text-gray-600 mb-6">
            Here's your final allocation across {likedStartups.length} startups
          </p>
          
          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{likedStartups.length}</div>
                  <div className="text-sm text-gray-600">Startups Liked</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100</div>
                  <div className="text-sm text-gray-600">Coins Allocated</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{feedbackLabels[feedbackType]}</div>
                  <div className="text-sm text-gray-600">Feedback Preference</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Startup allocations */}
        {likedStartups.length > 0 ? (
          <div className="space-y-4 mb-8">
            {sortedStartups.map((startup, index) => {
              const coins = coinAllocations[startup.id] || 0;
              const percentage = coins;
              
              return (
                <Card key={startup.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-2xl">{startup.logo}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            {startup.name}
                            {index === 0 && coins > 0 && (
                              <Badge className="bg-yellow-500 text-white">
                                Top Pick
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-normal">
                            {startup.tagline}
                          </p>
                        </div>
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold flex items-center gap-1">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          {coins}
                        </div>
                        <div className="text-sm text-gray-600">{percentage}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Startups Selected</h3>
              <p className="text-gray-600">
                You didn't like any startups this time. Try again to discover more!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        <div className="text-center">
          <Button 
            onClick={onRestart}
            className="px-8 py-3 text-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Discover More Startups
          </Button>
        </div>
      </div>
    </div>
  );
};
