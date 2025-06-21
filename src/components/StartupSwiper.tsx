
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info, MessageSquare, Users, UserX } from "lucide-react";
import { StartupModal } from "./StartupModal";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupSwiperProps {
  startups: Startup[];
  onComplete: (likedStartups: Startup[], feedbackType: FeedbackType) => void;
}

export const StartupSwiper = ({ startups, onComplete }: StartupSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("no");

  const currentStartup = startups[currentIndex];

  const handleLike = () => {
    setLikedStartups([...likedStartups, currentStartup]);
    nextStartup();
  };

  const handleDislike = () => {
    nextStartup();
  };

  const nextStartup = () => {
    if (currentIndex < startups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(likedStartups, feedbackType);
    }
  };

  const progress = ((currentIndex + 1) / startups.length) * 100;

  const feedbackOptions = [
    { type: "no" as FeedbackType, icon: UserX, label: "No feedback", color: "text-gray-500" },
    { type: "group" as FeedbackType, icon: Users, label: "Group feedback", color: "text-blue-500" },
    { type: "all" as FeedbackType, icon: MessageSquare, label: "All feedback", color: "text-green-500" }
  ];

  if (!currentStartup) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex gap-8">
        {/* Feedback Selector Sidebar */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 w-48">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Feedback Preference</h3>
            <p className="text-sm text-gray-600">How would you like to help startups?</p>
          </div>
          
          {feedbackOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = feedbackType === option.type;
            
            return (
              <button
                key={option.type}
                onClick={() => setFeedbackType(option.type)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-600' : option.color}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-md mx-auto">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Startup {currentIndex + 1} of {startups.length}</span>
              <span>{likedStartups.length} in portfolio</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Startup card - Now fully clickable */}
          <Card 
            className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={currentStartup.image} 
                alt={currentStartup.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{currentStartup.logo}</span>
                  <h2 className="text-2xl font-bold">{currentStartup.name}</h2>
                </div>
                <p className="text-lg opacity-90">{currentStartup.tagline}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white">
                <Info className="w-4 h-4" />
              </div>
            </div>

            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">{currentStartup.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentStartup.industry}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Founded {currentStartup.founded}
                </span>
              </div>
              <div className="text-center text-sm text-gray-500">
                Click anywhere to learn more
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDislike();
              }}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>

          {/* Mobile Feedback Selector */}
          <div className="md:hidden mt-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">Feedback Preference</h3>
            </div>
            <div className="flex gap-2">
              {feedbackOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = feedbackType === option.type;
                
                return (
                  <button
                    key={option.type}
                    onClick={() => setFeedbackType(option.type)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-purple-600' : option.color}`} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
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
