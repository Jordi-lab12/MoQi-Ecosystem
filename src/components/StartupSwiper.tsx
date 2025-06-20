
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Info } from "lucide-react";
import { StartupModal } from "./StartupModal";
import type { Startup } from "@/pages/Index";

interface StartupSwiperProps {
  startups: Startup[];
  onComplete: (likedStartups: Startup[]) => void;
}

export const StartupSwiper = ({ startups, onComplete }: StartupSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [showModal, setShowModal] = useState(false);

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
      onComplete(likedStartups);
    }
  };

  const progress = ((currentIndex + 1) / startups.length) * 100;

  if (!currentStartup) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Startup {currentIndex + 1} of {startups.length}</span>
            <span>{likedStartups.length} liked</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Startup card */}
        <Card className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
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
            <Button
              onClick={() => setShowModal(true)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              size="sm"
            >
              <Info className="w-4 h-4" />
            </Button>
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
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Button
            onClick={handleDislike}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-8 h-8" />
          </Button>
          <Button
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <Heart className="w-8 h-8" />
          </Button>
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
