
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X, Users, Calendar } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface StartupModalProps {
  startup: Startup;
  onClose: () => void;
  onLike: () => void;
  onDislike: () => void;
  feedbackPreference?: FeedbackType;
  onFeedbackChange?: (feedbackType: FeedbackType) => void;
  showFeedbackSelector?: boolean;
}

export const StartupModal = ({ 
  startup, 
  onClose, 
  onLike, 
  onDislike, 
  showFeedbackSelector = false
}: StartupModalProps) => {
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
