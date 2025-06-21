
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info, MessageSquare, Users, UserX, Sparkles, Zap, ChevronDown } from "lucide-react";
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
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
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
    setShowFeedbackDropdown(false);
    if (currentIndex < startups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(likedStartups, feedbackPreferences);
    }
  };

  const setFeedbackForStartup = (startupId: string, feedbackType: FeedbackType) => {
    setFeedbackPreferences(prev => ({ ...prev, [startupId]: feedbackType }));
    setShowFeedbackDropdown(false);
  };

  const progress = ((currentIndex + 1) / startups.length) * 100;
  const currentFeedback = feedbackPreferences[currentStartup?.id] || "no";

  const feedbackOptions = [
    { type: "no" as FeedbackType, icon: UserX, label: "No help", emoji: "🤐" },
    { type: "group" as FeedbackType, icon: Users, label: "Group help", emoji: "👥" },
    { type: "all" as FeedbackType, icon: MessageSquare, label: "Full help", emoji: "💬" }
  ];

  const getCurrentFeedbackOption = () => {
    return feedbackOptions.find(option => option.type === currentFeedback) || feedbackOptions[0];
  };

  if (!currentStartup) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="w-full max-w-lg mx-auto">
        {/* Progress bar with streak */}
        <div className="mb-8">
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

        {/* Startup card - made bigger */}
        <Card 
          className={`relative overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group mb-8 ${
            swipeDirection === 'like' 
              ? 'transform scale-105 rotate-6 border-4 border-green-400' 
              : swipeDirection === 'dislike'
              ? 'transform scale-95 -rotate-6 border-4 border-red-400'
              : 'hover:scale-[1.02] hover:shadow-3xl'
          }`}
          onClick={() => setShowModal(true)}
        >
          <div className="relative h-80 overflow-hidden">
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
                <div className="text-white text-8xl font-bold animate-bounce">
                  {swipeDirection === 'like' ? '💖' : '👋'}
                </div>
              </div>
            )}

            {/* Top badges */}
            <div className="absolute top-6 right-6 flex gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors">
                <Info className="w-5 h-5" />
              </div>
              <div className="bg-purple-500/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-bold">
                {currentStartup.industry}
              </div>
            </div>

            {/* Bottom content - enhanced visibility */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl drop-shadow-2xl">{currentStartup.logo}</span>
                <div>
                  <h2 className="text-3xl font-bold drop-shadow-2xl mb-2">{currentStartup.name}</h2>
                  <p className="text-xl opacity-95 drop-shadow-xl font-medium">{currentStartup.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">{currentStartup.description}</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
                Est. {currentStartup.founded}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                {currentStartup.employees} team
              </span>
            </div>

            {/* Feedback selector */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
              <div className="text-sm font-medium mb-3 text-purple-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                How can you help? ✨
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFeedbackDropdown(!showFeedbackDropdown);
                  }}
                  className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCurrentFeedbackOption().emoji}</span>
                    <span className="font-medium">{getCurrentFeedbackOption().label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFeedbackDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFeedbackDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-purple-200 z-10">
                    {feedbackOptions.map((option) => (
                      <button
                        key={option.type}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeedbackForStartup(currentStartup.id, option.type);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Tap anywhere for full details
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons - bigger, no text */}
        <div className="flex justify-center gap-12">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDislike();
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
          >
            <X className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-200 hover:scale-110 group border-4 border-white"
          >
            <Heart className="w-10 h-10 group-hover:scale-125 transition-transform" />
          </Button>
        </div>

        {/* Bottom tip */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            💡 Set your help preference before swiping!
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
