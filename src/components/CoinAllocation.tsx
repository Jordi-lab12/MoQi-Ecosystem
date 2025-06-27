
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowRight, Plus, Minus } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface CoinAllocationProps {
  startups: Startup[];
  feedbackPreferences: Record<string, FeedbackType>;
  onComplete: (allocations: Record<string, number>, feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const CoinAllocation = ({ startups, feedbackPreferences, onComplete }: CoinAllocationProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initialAllocations: Record<string, number> = {};
    startups.forEach((startup) => {
      initialAllocations[startup.id] = 0;
    });
    return initialAllocations;
  });

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const handleAddPoints = (startupId: string) => {
    if (totalAllocated + 10 <= 100) {
      setAllocations(prev => ({
        ...prev,
        [startupId]: prev[startupId] + 10
      }));
    }
  };

  const handleSubtractPoints = (startupId: string) => {
    if (allocations[startupId] >= 10) {
      setAllocations(prev => ({
        ...prev,
        [startupId]: prev[startupId] - 10
      }));
    }
  };

  const handleComplete = () => {
    onComplete(allocations, feedbackPreferences);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Distribute Your MoQi-points 💰
          </h1>
          <p className="text-gray-600 mb-6">
            Add or remove 10 MoQi-points at a time to your selected startups based on your interest level
          </p>
          
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Coins className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-700">{totalAllocated}/100</span>
                <span className="text-yellow-600">MoQi-points allocated</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-3 mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalAllocated}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 mb-8">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{startup.logo}</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{startup.name}</CardTitle>
                    <p className="text-gray-600">{startup.tagline}</p>
                    <p className="text-sm text-gray-500 mt-2">{startup.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-purple-600">{allocations[startup.id]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleSubtractPoints(startup.id)}
                        disabled={allocations[startup.id] === 0}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                        10
                      </Button>
                      <Button
                        onClick={() => handleAddPoints(startup.id)}
                        disabled={totalAllocated >= 100}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        10
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleComplete}
            disabled={totalAllocated !== 100}
            className="px-8 py-4 text-lg font-bold rounded-2xl flex items-center gap-3 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            Complete Allocation <ArrowRight className="w-5 h-5" />
          </Button>
          {totalAllocated !== 100 && (
            <p className="text-red-500 mt-4">
              Please allocate exactly 100 MoQi-points to continue ({100 - totalAllocated} MoQi-points remaining)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
