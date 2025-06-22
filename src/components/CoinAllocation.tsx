
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Coins, ArrowRight } from "lucide-react";
import { FeedbackSelector } from "./FeedbackSelector";
import type { Startup, FeedbackType } from "@/pages/Index";

interface CoinAllocationProps {
  startups: Startup[];
  feedbackPreferences: Record<string, FeedbackType>;
  onComplete: (allocations: Record<string, number>, feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const CoinAllocation = ({ startups, feedbackPreferences, onComplete }: CoinAllocationProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initialAllocations: Record<string, number> = {};
    const equalShare = Math.floor(100 / startups.length);
    const remainder = 100 - (equalShare * startups.length);
    
    startups.forEach((startup, index) => {
      initialAllocations[startup.id] = equalShare + (index < remainder ? 1 : 0);
    });
    
    return initialAllocations;
  });

  const [currentFeedbackPreferences, setCurrentFeedbackPreferences] = useState<Record<string, FeedbackType>>(feedbackPreferences);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const handleSliderChange = (startupId: string, value: number[]) => {
    const newValue = value[0];
    const currentValue = allocations[startupId];
    const difference = newValue - currentValue;
    
    if (difference === 0) return;
    
    const otherStartups = startups.filter(s => s.id !== startupId);
    const totalOtherAllocations = otherStartups.reduce((sum, s) => sum + allocations[s.id], 0);
    
    if (totalOtherAllocations === 0 && difference > 0) return;
    
    const newAllocations = { ...allocations };
    newAllocations[startupId] = newValue;
    
    // Distribute the difference proportionally among other startups
    if (difference !== 0 && otherStartups.length > 0) {
      let remaining = -difference;
      
      for (let i = 0; i < otherStartups.length && Math.abs(remaining) > 0; i++) {
        const startup = otherStartups[i];
        const currentAllocation = newAllocations[startup.id];
        
        if (remaining > 0) {
          // Adding coins to others
          const maxCanAdd = Math.min(remaining, 100 - currentAllocation);
          const toAdd = i === otherStartups.length - 1 ? remaining : Math.floor(maxCanAdd);
          newAllocations[startup.id] = currentAllocation + toAdd;
          remaining -= toAdd;
        } else {
          // Removing coins from others
          const maxCanRemove = Math.min(-remaining, currentAllocation);
          const toRemove = i === otherStartups.length - 1 ? -remaining : Math.floor(maxCanRemove);
          newAllocations[startup.id] = currentAllocation - toRemove;
          remaining += toRemove;
        }
      }
    }
    
    setAllocations(newAllocations);
  };

  const handleFeedbackChange = (startupId: string, feedbackType: FeedbackType) => {
    setCurrentFeedbackPreferences(prev => ({
      ...prev,
      [startupId]: feedbackType
    }));
  };

  const handleComplete = () => {
    onComplete(allocations, currentFeedbackPreferences);
  };

  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Distribute Your Coins 💰
          </h1>
          <p className="text-sm text-gray-600 mb-3">
            Allocate 100 coins among your selected startups
          </p>
          
          {/* Compact total display */}
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 mb-4">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-700">{totalAllocated}/100</span>
                <span className="text-sm text-yellow-600">coins allocated</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compact startup cards */}
        <div className="space-y-3 mb-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{startup.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-1">{startup.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{startup.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      <span className="font-bold text-purple-600 text-sm">{allocations[startup.id]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Compact slider */}
                <div className="mb-3">
                  <Slider
                    value={[allocations[startup.id]]}
                    onValueChange={(value) => handleSliderChange(startup.id, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                {/* Compact feedback selector */}
                <div className="relative z-10">
                  <FeedbackSelector
                    value={currentFeedbackPreferences[startup.id] || 'no'}
                    onChange={(value) => handleFeedbackChange(startup.id, value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action button */}
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            disabled={totalAllocated !== 100}
            className="px-6 py-3 text-base font-bold rounded-2xl flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            Complete Allocation <ArrowRight className="w-4 h-4" />
          </Button>
          {totalAllocated !== 100 && (
            <p className="text-xs text-red-500 mt-2">
              Please allocate exactly 100 coins to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
