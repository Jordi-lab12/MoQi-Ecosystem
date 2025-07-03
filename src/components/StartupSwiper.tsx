import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info, Sparkles, Zap } from "lucide-react";
import { StartupModal } from "./StartupModal";
import { useAppData } from "@/contexts/AppDataContext";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupSwiperProps {
  startups: Startup[];
  onComplete: (likedStartups: Startup[], feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const StartupSwiper = ({ startups, onComplete }: StartupSwiperProps) => {
  const { addSwiperInteraction, currentSwiperId, getCurrentSwiperProfile } = useAppData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'like' | 'dislike' | null>(null);

  const currentStartup = startups[currentIndex];
  const currentSwiperProfile = getCurrentSwiperProfile();

  const handleLike = () => {
    setSwipeDirection('like');
    const updatedLikedStartups = [...likedStartups, currentStartup];
    setLikedStartups(updatedLikedStartups);
    
    // Record the interaction immediately
    if (currentSwiperId && currentSwiperProfile) {
      addSwiperInteraction({
        swiperId: currentSwiperId,
        swiperName: currentSwiperProfile.name,
        startupId: currentStartup.id,
        coinAllocation: 0, // Will be set later in allocation phase
        feedbackPreference: 'all', // Default preference
        hasLiked: true
      });
    }
    
    setTimeout(() => {
      nextStartup();
      setSwipeDirection(null);
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection('dislike');
    
    // Record the dislike interaction immediately
    if (currentSwiperId && currentSwiperProfile) {
      addSwiperInteraction({
        swiperId: currentSwiperId,
        swiperName: currentSwiperProfile.name,
        startupId: currentStartup.id,
        coinAllocation: 0,
        feedbackPreference: 'no',
        hasLiked: false
      });
    }
    
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="w-full max-w-lg mx-auto">
        {/* Progress bar with streak */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-purple-600 text-lg">
                {currentIndex + 1}/{startups.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              <Zap className="w-4 h-4" />
              {likedStartups.length} in portfolio
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 h-4 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Startup card */}
        <Card 
          className={`relative overflow-visible shadow-2xl transition-all duration-300 cursor-pointer group mb-6 ${
            swipeDirection === 'like' 
              ? 'transform scale-105 rotate-6 border-4 border-green-400' 
              : swipeDirection === 'dislike'
              ? 'transform scale-95 -rotate-6 border-4 border-red-400'
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Swipe overlay */}
            {swipeDirection && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                swipeDirection === 'like' ? 'bg-green-500/80' : 'bg-red-500/80'
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
              <div className="bg-purple-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-bold">
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
            <p className="text-gray-700 mb-4 leading-relaxed text-lg">{currentStartup.description}</p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
                Est. {currentStartup.founded}
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                {currentStartup.employees} team
              </span>
            </div>

            <div className="text-center mt-3">
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
          >
            <X className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
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
