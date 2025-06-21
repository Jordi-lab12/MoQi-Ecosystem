
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X, Users, Calendar, ChevronDown, MessageSquare, UserX } from "lucide-react";
import { useState } from "react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupModalProps {
  startup: Startup;
  onClose: () => void;
  onLike: () => void;
  onDislike: () => void;
  feedbackPreference: FeedbackType;
  onFeedbackChange: (feedbackType: FeedbackType) => void;
}

export const StartupModal = ({ 
  startup, 
  onClose, 
  onLike, 
  onDislike, 
  feedbackPreference, 
  onFeedbackChange 
}: StartupModalProps) => {
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);

  const feedbackOptions = [
    { type: "no" as FeedbackType, icon: UserX, label: "No help", emoji: "🤐" },
    { type: "group" as FeedbackType, icon: Users, label: "Group help", emoji: "👥" },
    { type: "all" as FeedbackType, icon: MessageSquare, label: "Full help", emoji: "💬" }
  ];

  const getCurrentFeedbackOption = () => {
    return feedbackOptions.find(option => option.type === feedbackPreference) || feedbackOptions[0];
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{startup.logo}</span>
            {startup.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero image */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img 
              src={startup.image} 
              alt={startup.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Basic info */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{startup.tagline}</h3>
            <p className="text-gray-600 mb-4">{startup.description}</p>
            
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Founded {startup.founded}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {startup.employees} employees
              </div>
            </div>
          </div>

          {/* USP */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Unique Selling Proposition</h4>
            <p className="text-blue-800">{startup.usp}</p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Mission</h4>
              <p className="text-green-800 text-sm">{startup.mission}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Vision</h4>
              <p className="text-purple-800 text-sm">{startup.vision}</p>
            </div>
          </div>

          {/* Feedback selector */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="text-sm font-medium mb-2 text-purple-700">Feedback preference:</div>
            <div className="relative">
              <button
                onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
                className="w-full flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-purple-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{getCurrentFeedbackOption().emoji}</span>
                  <span className="font-medium text-sm">{getCurrentFeedbackOption().label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFeedbackDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFeedbackDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-purple-200 z-50 max-h-32 overflow-y-auto">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        onFeedbackChange(option.type);
                        setShowFeedbackDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-purple-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      <span>{option.emoji}</span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button
              onClick={() => {
                onDislike();
                onClose();
              }}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8"
            >
              <X className="w-4 h-4" />
              Pass
            </Button>
            <Button
              onClick={() => {
                onLike();
                onClose();
              }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8"
            >
              <Heart className="w-4 h-4" />
              Like
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
