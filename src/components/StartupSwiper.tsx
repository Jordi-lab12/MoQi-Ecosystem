
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info, MessageSquare, Users, UserX, Sparkles, Zap } from "lucide-react";
import { StartupModal } from "./StartupModal";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupSwiperProps {
  startups: Startup[];
  onComplete: (likedStartups: Startup[], feedbackPreferences: Record<string, FeedbackType>) => void;
}

export const StartupSwiper = ({ startups, onComplete }: StartupSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});
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
      onComplete(likedStartups, feedbackPreferences);
    }
  };

  const setFeedbackForStartup = (startupId: string, feedbackType: FeedbackType) => {
    setFeedbackPreferences(prev => ({ ...prev, [startupId]: feedbackType }));
  };

  const progress = ((currentIndex + 1) / startups.length) * 100;
  const currentFeedback = feedbackPreferences[currentStartup?.id] || "no";

  const feedbackOptions = [
    { type: "no" as FeedbackType, icon: UserX, label: "No help", emoji: "🤐" },
    { type: "group" as FeedbackType, icon: Users, label: "Group help", emoji: "👥" },
    { type: "all" as FeedbackType, icon: MessageSquare, label: "Full help", emoji: "💬" }
  ];

  if (!currentStartup) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="w-full max-w-md mx-auto">
        {/* Progress bar with streak */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-purple-600">
                {currentIndex + 1}/{startups.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              <Zap className="w-3 h-3" />
              {likedStartups.length} in portfolio
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 h-3 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Startup card */}
        <Card 
          className={`relative overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group ${
            swipeDirection === 'like' 
              ? 'transform scale-105 rotate-6 border-4 border-green-400' 
              : swipeDirection === 'dislike'
              ? 'transform scale-95 -rotate-6 border-4 border-red-400'
              : 'hover:scale-[1.02] hover:shadow-3xl'
          }`}
          onClick={() => setShowModal(true)}
        >
          <div className="relative h-64 overflow-hidden">
            <img 
              src={currentStartup.image} 
              alt={currentStartup.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                swipeDirection ? 'blur-sm' : 'group-hover:scale-110'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
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
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors">
                <Info className="w-4 h-4" />
              </div>
              <div className="bg-purple-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold">
                {currentStartup.industry}
              </div>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{currentStartup.logo}</span>
                <h2 className="text-2xl font-bold">{currentStartup.name}</h2>
              </div>
              <p className="text-lg opacity-90 mb-3">{currentStartup.tagline}</p>
              
              {/* Integrated feedback selector */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xs font-medium mb-2 opacity-80">How can you help? ✨</div>
                <div className="flex gap-2">
                  {feedbackOptions.map((option) => {
                    const isSelected = currentFeedback === option.type;
                    return (
                      <button
                        key={option.type}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeedbackForStartup(currentStartup.id, option.type);
                        }}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'bg-white text-purple-600 shadow-lg transform scale-105' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm">{option.emoji}</span>
                          <span>{option.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <p className="text-gray-600 mb-4 leading-relaxed">{currentStartup.description}</p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
                Est. {currentStartup.founded}
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                {currentStartup.employees} team
              </span>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Tap anywhere for full details
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons with Gen-Z styling */}
        <div className="flex justify-center gap-8 mt-8">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDislike();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-200 hover:scale-110 group"
          >
            <div className="flex flex-col items-center">
              <X className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold mt-1">Nah</span>
            </div>
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-200 hover:scale-110 group"
          >
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 group-hover:scale-125 transition-transform" />
              <span className="text-xs font-bold mt-1">Vibe</span>
            </div>
          </Button>
        </div>

        {/* Bottom tip */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            💡 Pro tip: Set your help preference before swiping!
          </p>
        </div>
      </div>

      {showModal && (
        <StartupModal 
          startup={currentStartup} 
          onClose={() => setShowModal(false)}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </div>
  );
};
