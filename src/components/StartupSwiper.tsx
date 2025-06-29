import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info, Sparkles, Zap } from "lucide-react";
import { StartupModal } from "./StartupModal";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupSwiperProps {
  startups: Startup[];
  onComplete: (likedStartups: Startup[], feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const StartupSwiper = ({ startups, onComplete }: StartupSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'like' | 'dislike' | null>(null);

  const currentStartup = startups[currentIndex];

  const handleLike = () => {
    setSwipeDirection('like');
    setLikedStartups([...likedStartups, currentStartup]);
    setTimeout(() => {
      nextStartup();
      setSwipeDirection(null);
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection('dislike');
    setTimeout(() => {
      nextStartup();
      setSwipeDirection(null);
    }, 300);
  };

  const nextStartup = () => {
    if (currentIndex < startups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Initialize feedback preferences to 'all' for all startups
      const initialFeedbackPreferences: Record<string, FeedbackType> = {};
      startups.forEach((startup) => {
        initialFeedbackPreferences[startup.id] = 'all';
      });
      onComplete(likedStartups, initialFeedbackPreferences);
    }
  };

  const progress = ((currentIndex + 1) / startups.length) * 100;

  if (!currentStartup) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-[#D8CCEB]/20 to-[#60BEBB]/10">
      <div className="w-full max-w-lg mx-auto">
        {/* Progress bar with streak */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#60BEBB]" />
              <span className="font-bold text-[#60BEBB] text-lg">
                {currentIndex + 1}/{startups.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#60BEBB] to-[#D8CCEB] text-white px-4 py-2 rounded-full text-sm font-bold">
              <Zap className="w-4 h-4" />
              {likedStartups.length} in portfolio
            </div>
          </div>
          <div className="w-full bg-[#1E1E1E]/10 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#60BEBB] to-[#D8CCEB] h-4 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Startup card */}
        <Card 
          className={`relative overflow-visible shadow-2xl transition-all duration-300 cursor-pointer group mb-6 bg-white border-[#60BEBB]/30 ${
            swipeDirection === 'like' 
              ? 'transform scale-105 rotate-6 border-4 border-[#60BEBB]' 
              : swipeDirection === 'dislike'
              ? 'transform scale-95 -rotate-6 border-4 border-[#1E1E1E]/30'
              : 'hover:scale-[1.02] hover:shadow-3xl'
          }`}
          onClick={() => setShowModal(true)}
        >
          <div className="relative h-48 overflow-hidden">
            <img 
              src={currentStartup.image} 
              alt={currentStartup.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                swipeDirection ? 'blur-sm' : 'group-hover:scale-110'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/80 via-[#1E1E1E]/30 to-transparent" />
            
            {/* Swipe overlay */}
            {swipeDirection && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                swipeDirection === 'like' ? 'bg-[#60BEBB]/80' : 'bg-[#1E1E1E]/60'
              }`}>
                <div className="text-white text-6xl font-bold animate-bounce">
                  {swipeDirection === 'like' ? '💖' : '👋'}
                </div>
              </div>
            )}

            {/* Top badges */}
            <div className="absolute top-4 right-4 flex gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors">
                <Info className="w-4 h-4" />
              </div>
              <div className="bg-[#60BEBB]/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-bold">
                {currentStartup.industry}
              </div>
            </div>

            {/* Bottom content - enhanced visibility */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl drop-shadow-2xl">{currentStartup.logo}</span>
                <div>
                  <h2 className="text-3xl font-bold drop-shadow-2xl mb-1">{currentStartup.name}</h2>
                  <p className="text-xl opacity-95 drop-shadow-xl font-medium">{currentStartup.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <p className="text-[#1E1E1E]/80 mb-4 leading-relaxed text-lg">{currentStartup.description}</p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-[#60BEBB]/10 text-[#60BEBB] rounded-full text-sm font-medium border border-[#60BEBB]/20">
                Est. {currentStartup.founded}
              </span>
              <span className="px-3 py-1 bg-[#D8CCEB]/10 text-[#D8CCEB] rounded-full text-sm font-medium border border-[#D8CCEB]/20">
                {currentStartup.employees} team
              </span>
            </div>

            <div className="text-center mt-3">
              <div className="text-xs text-[#1E1E1E]/50 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Tap anywhere for full details
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-center gap-12">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDislike();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E1E1E]/70 to-[#1E1E1E] hover:from-[#1E1E1E]/80 hover:to-[#1E1E1E] text-white shadow-2xl hover:shadow-[#1E1E1E]/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
          >
            <X className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#60BEBB] to-[#D8CCEB] hover:from-[#60BEBB]/90 hover:to-[#D8CCEB]/90 text-white shadow-2xl hover:shadow-[#60BEBB]/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
          >
            <Heart className="w-8 h-8 group-hover:scale-125 transition-transform" />
          </Button>
        </div>
      </div>

      {showModal && (
        <StartupModal 
          startup={currentStartup} 
          onClose={() => setShowModal(false)}
          onLike={handleLike}
          onDislike={handleDislike}
          showFeedbackSelector={false}
        />
      )}
    </div>
  );
};
