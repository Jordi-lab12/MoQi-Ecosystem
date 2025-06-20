
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Coins } from "lucide-react";
import type { Startup } from "@/pages/Index";

interface CoinAllocationProps {
  startups: Startup[];
  onComplete: (allocations: Record<string, number>) => void;
}

export const CoinAllocation = ({ startups, onComplete }: CoinAllocationProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    startups.forEach(startup => {
      initial[startup.id] = 0;
    });
    return initial;
  });

  const totalCoins = Object.values(allocations).reduce((sum, coins) => sum + coins, 0);
  const remainingCoins = 100 - totalCoins;

  const updateAllocation = (startupId: string, value: number) => {
    const newValue = Math.max(0, Math.min(100, value));
    const otherTotal = Object.entries(allocations)
      .filter(([id]) => id !== startupId)
      .reduce((sum, [, coins]) => sum + coins, 0);
    
    const maxPossible = 100 - otherTotal;
    const finalValue = Math.min(newValue, maxPossible);
    
    setAllocations(prev => ({
      ...prev,
      [startupId]: finalValue
    }));
  };

  const distributeEqually = () => {
    const equalAmount = Math.floor(100 / startups.length);
    const remainder = 100 - (equalAmount * startups.length);
    
    const newAllocations: Record<string, number> = {};
    startups.forEach((startup, index) => {
      newAllocations[startup.id] = equalAmount + (index < remainder ? 1 : 0);
    });
    
    setAllocations(newAllocations);
  };

  const resetAllocations = () => {
    const newAllocations: Record<string, number> = {};
    startups.forEach(startup => {
      newAllocations[startup.id] = 0;
    });
    setAllocations(newAllocations);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Allocate Your Coins</h1>
          <p className="text-gray-600 mb-4">
            Distribute 100 coins among your liked startups based on your investment interest
          </p>
          
          {/* Coin counter */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Coins className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold">
              {remainingCoins} coins remaining
            </span>
          </div>

          {/* Quick actions */}
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={distributeEqually} variant="outline">
              Distribute Equally
            </Button>
            <Button onClick={resetAllocations} variant="outline">
              Reset All
            </Button>
          </div>
        </div>

        {/* Startup allocation cards */}
        <div className="grid gap-6 mb-8">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{startup.logo}</span>
                  {startup.name}
                  <span className="ml-auto text-lg text-gray-500">
                    {allocations[startup.id]} coins
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider
                      value={[allocations[startup.id]]}
                      onValueChange={([value]) => updateAllocation(startup.id, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={allocations[startup.id]}
                      onChange={(e) => updateAllocation(startup.id, parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="text-center"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{startup.tagline}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue button */}
        <div className="text-center">
          <Button
            onClick={() => onComplete(allocations)}
            disabled={totalCoins !== 100}
            className="px-8 py-3 text-lg"
          >
            {totalCoins === 100 ? "Continue to Feedback" : `Need ${100 - totalCoins} more coins`}
          </Button>
        </div>
      </div>
    </div>
  );
};
