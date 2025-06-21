
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Plus, Minus, ArrowRight } from "lucide-react";
import type { Startup } from "@/pages/Index";

interface CoinAllocationProps {
  startups: Startup[];
  onComplete: (allocations: Record<string, number>) => void;
}

interface FlyingCoin {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startupId: string;
}

export const CoinAllocation = ({ startups, onComplete }: CoinAllocationProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    startups.reduce((acc, startup) => ({ ...acc, [startup.id]: 0 }), {})
  );
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoin[]>([]);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingCoins = 100 - totalAllocated;

  const createFlyingCoin = (startupId: string, increment: boolean) => {
    const coinSource = document.getElementById('coin-source');
    const targetCard = document.getElementById(`startup-${startupId}`);
    
    if (!coinSource || !targetCard) return;

    const sourceRect = coinSource.getBoundingClientRect();
    const targetRect = targetCard.getBoundingClientRect();

    const newCoin: FlyingCoin = {
      id: `${Date.now()}-${Math.random()}`,
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
      targetX: targetRect.left + targetRect.width / 2,
      targetY: targetRect.top + targetRect.height / 2,
      startupId
    };

    setFlyingCoins(prev => [...prev, newCoin]);

    // Remove coin after animation
    setTimeout(() => {
      setFlyingCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
    }, 1000);
  };

  const updateAllocation = (startupId: string, change: number) => {
    const currentValue = allocations[startupId];
    const newValue = Math.max(0, Math.min(100, currentValue + change));
    
    if (newValue !== currentValue && (change < 0 || remainingCoins >= change)) {
      setAllocations(prev => ({ ...prev, [startupId]: newValue }));
      
      if (change > 0) {
        createFlyingCoin(startupId, true);
      }
    }
  };

  const setDirectAllocation = (startupId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const maxAllowable = allocations[startupId] + remainingCoins;
    const newValue = Math.max(0, Math.min(maxAllowable, numValue));
    setAllocations(prev => ({ ...prev, [startupId]: newValue }));
  };

  const canComplete = totalAllocated === 100;

  return (
    <div className="min-h-screen p-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Build Your Portfolio</h1>
          <p className="text-gray-600 mb-6">
            Allocate 100 coins across your selected startups
          </p>
          
          {/* Coin Counter */}
          <div 
            id="coin-source"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg"
          >
            <Coins className="w-6 h-6" />
            {remainingCoins} coins remaining
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          {startups.map((startup) => (
            <Card 
              key={startup.id} 
              id={`startup-${startup.id}`}
              className="overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{startup.logo}</span>
                    <div>
                      <div>{startup.name}</div>
                      <p className="text-sm text-gray-600 font-normal">
                        {startup.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold flex items-center gap-1">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        {allocations[startup.id]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {allocations[startup.id]}%
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    onClick={() => updateAllocation(startup.id, -1)}
                    disabled={allocations[startup.id] === 0}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 rounded-full p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={allocations[startup.id]}
                    onChange={(e) => setDirectAllocation(startup.id, e.target.value)}
                    className="text-center font-bold text-lg w-20"
                  />
                  
                  <Button
                    onClick={() => updateAllocation(startup.id, 1)}
                    disabled={remainingCoins === 0}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => updateAllocation(startup.id, 5)}
                      disabled={remainingCoins < 5}
                      variant="outline"
                      size="sm"
                    >
                      +5
                    </Button>
                    <Button
                      onClick={() => updateAllocation(startup.id, 10)}
                      disabled={remainingCoins < 10}
                      variant="outline"
                      size="sm"
                    >
                      +10
                    </Button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${allocations[startup.id]}%` }}
                  >
                    {allocations[startup.id] > 10 && (
                      <span className="text-white text-xs font-bold">
                        {allocations[startup.id]}%
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => onComplete(allocations)}
            disabled={!canComplete}
            className="px-8 py-3 text-lg flex items-center gap-2 mx-auto"
          >
            Complete Portfolio
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          {!canComplete && (
            <p className="text-sm text-gray-500 mt-2">
              You need to allocate exactly 100 coins to continue
            </p>
          )}
        </div>
      </div>

      {/* Flying Coins Animation */}
      {flyingCoins.map((coin) => (
        <div
          key={coin.id}
          className="fixed pointer-events-none z-50 animate-pulse"
          style={{
            left: coin.x,
            top: coin.y,
            transform: 'translate(-50%, -50%)',
            animation: `flyToTarget-${coin.id} 1s ease-out forwards`,
          }}
        >
          <Coins className="w-6 h-6 text-yellow-500 drop-shadow-lg" />
        </div>
      ))}

      <style>
        {flyingCoins.map((coin) => `
          @keyframes flyToTarget-${coin.id} {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(calc(-50% + ${(coin.targetX - coin.x) * 0.5}px), calc(-50% + ${(coin.targetY - coin.y) * 0.5}px)) scale(1.2);
              opacity: 0.8;
            }
            100% {
              transform: translate(calc(-50% + ${coin.targetX - coin.x}px), calc(-50% + ${coin.targetY - coin.y}px)) scale(0.5);
              opacity: 0;
            }
          }
        `).join('\n')}
      </style>
    </div>
  );
};
