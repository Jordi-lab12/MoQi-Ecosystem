
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Plus, Minus, ArrowRight, Zap, Target, Sparkles } from "lucide-react";
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

  const quickAllocate = (startupId: string, amount: number) => {
    if (remainingCoins >= amount) {
      updateAllocation(startupId, amount);
    }
  };

  const autoDistribute = () => {
    const evenAmount = Math.floor(remainingCoins / startups.length);
    const remainder = remainingCoins % startups.length;
    
    const newAllocations = { ...allocations };
    startups.forEach((startup, index) => {
      const extra = index < remainder ? 1 : 0;
      newAllocations[startup.id] += evenAmount + extra;
    });
    
    setAllocations(newAllocations);
  };

  const canComplete = totalAllocated === 100;

  return (
    <div className="min-h-screen p-4 relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Build Your Portfolio
            </h1>
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Distribute 100 coins across your selected startups ✨
          </p>
          
          {/* Coin Counter */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div 
              id="coin-source"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Coins className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{remainingCoins}</span>
              <span className="text-lg opacity-90">coins left</span>
            </div>
            
            {remainingCoins > 0 && (
              <Button
                onClick={autoDistribute}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
              >
                <Target className="w-4 h-4 mr-2" />
                Auto Split
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-8 mb-8">
          {startups.map((startup) => (
            <Card 
              key={startup.id} 
              id={`startup-${startup.id}`}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] border-2 hover:border-purple-200"
            >
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                      {startup.logo}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{startup.name}</div>
                      <p className="text-sm text-gray-600 font-normal leading-relaxed">
                        {startup.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold flex items-center gap-2 text-purple-600">
                        <Coins className="w-6 h-6 text-yellow-500" />
                        {allocations[startup.id]}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {allocations[startup.id]}% of portfolio
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                {/* Quick allocation buttons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2">
                    <Button
                      onClick={() => updateAllocation(startup.id, -5)}
                      disabled={allocations[startup.id] < 5}
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-xl border-2 hover:border-red-300 hover:bg-red-50 transition-all"
                    >
                      <span className="text-lg font-bold text-red-500">-5</span>
                    </Button>
                    
                    <Button
                      onClick={() => updateAllocation(startup.id, -1)}
                      disabled={allocations[startup.id] === 0}
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-xl p-0 border-2"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={allocations[startup.id]}
                      onChange={(e) => setDirectAllocation(startup.id, e.target.value)}
                      className="text-center font-bold text-xl w-24 h-12 border-2 rounded-xl focus:border-purple-400"
                    />
                    
                    <Button
                      onClick={() => updateAllocation(startup.id, 1)}
                      disabled={remainingCoins === 0}
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-xl p-0 border-2"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    
                    <Button
                      onClick={() => updateAllocation(startup.id, 5)}
                      disabled={remainingCoins < 5}
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 rounded-xl border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                    >
                      <span className="text-lg font-bold text-green-500">+5</span>
                    </Button>
                  </div>
                  
                  {/* Quick percentage buttons */}
                  <div className="flex gap-2">
                    {[10, 25].map((percent) => (
                      <Button
                        key={percent}
                        onClick={() => quickAllocate(startup.id, percent)}
                        disabled={remainingCoins < percent}
                        variant="outline"
                        size="sm"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 font-bold"
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-2xl h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-4 rounded-2xl transition-all duration-700 flex items-center justify-end pr-3 relative"
                    style={{ width: `${allocations[startup.id]}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                    {allocations[startup.id] > 15 && (
                      <span className="text-white text-sm font-bold relative z-10">
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
            className={`px-12 py-4 text-xl font-bold rounded-2xl flex items-center gap-3 mx-auto transition-all duration-300 ${
              canComplete 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {canComplete ? (
              <>
                <Zap className="w-6 h-6" />
                Complete Portfolio
                <ArrowRight className="w-6 h-6" />
              </>
            ) : (
              <>
                <Coins className="w-6 h-6" />
                Allocate All Coins
              </>
            )}
          </Button>
          
          {!canComplete && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                You need to allocate exactly 100 coins to continue
              </p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {remainingCoins} coins remaining
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Flying Coins Animation */}
      {flyingCoins.map((coin) => (
        <div
          key={coin.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: coin.x,
            top: coin.y,
            transform: 'translate(-50%, -50%)',
            animation: `flyToTarget-${coin.id} 1s ease-out forwards`,
          }}
        >
          <Coins className="w-8 h-8 text-yellow-500 drop-shadow-2xl animate-spin" />
        </div>
      ))}

      <style>
        {flyingCoins.map((coin) => `
          @keyframes flyToTarget-${coin.id} {
            0% {
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(calc(-50% + ${(coin.targetX - coin.x) * 0.5}px), calc(-50% + ${(coin.targetY - coin.y) * 0.5}px)) scale(1.5) rotate(180deg);
              opacity: 0.9;
            }
            100% {
              transform: translate(calc(-50% + ${coin.targetX - coin.x}px), calc(-50% + ${coin.targetY - coin.y}px)) scale(0.5) rotate(360deg);
              opacity: 0;
            }
          }
        `).join('\n')}
      </style>
    </div>
  );
};
