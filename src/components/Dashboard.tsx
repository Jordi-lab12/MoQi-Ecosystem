
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Info, MessageCircle, Play, Star, TrendingUp, Users } from "lucide-react";

interface DashboardProps {
  onStartSwiping: () => void;
}

export const Dashboard = ({ onStartSwiping }: DashboardProps) => {
  const handleContact = () => {
    // For now, just show an alert - can be replaced with actual contact functionality
    alert("Contact us at: hello@startupmixer.com");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StartupMixer
            </h1>
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">Welcome back! Ready to discover amazing startups?</p>
        </div>

        {/* Main action button - central and biggest */}
        <div className="text-center mb-8">
          <Button 
            onClick={onStartSwiping}
            className="px-12 py-6 text-2xl font-bold rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300 flex items-center gap-4 mx-auto"
          >
            <Play className="w-8 h-8" />
            Start Swiping ✨
          </Button>
          <p className="text-sm text-gray-500 mt-3">Discover and invest in promising startups</p>
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* About the app */}
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Info className="w-5 h-5" />
                How It Works
              </CardTitle>
              <CardDescription>Learn about StartupMixer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">1</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Swipe & Discover</p>
                  <p className="text-xs text-gray-600">Browse through innovative startups and swipe right on the ones you like</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Invest Coins</p>
                  <p className="text-xs text-gray-600">Distribute 100 coins among your selected startups based on your interest</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Get Connected</p>
                  <p className="text-xs text-gray-600">Choose your feedback preferences and get matched with opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats/Features */}
          <Card className="bg-white/60 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-700">
                <TrendingUp className="w-5 h-5" />
                Why StartupMixer?
              </CardTitle>
              <CardDescription>Discover your next opportunity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-semibold text-sm">Curated Startups</p>
                  <p className="text-xs text-gray-600">Hand-picked innovative companies</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-sm">Connect Directly</p>
                  <p className="text-xs text-gray-600">Get in touch with founders and teams</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Personalized Feedback</p>
                  <p className="text-xs text-gray-600">Choose how you want to engage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact button */}
        <div className="text-center">
          <Button 
            onClick={handleContact}
            variant="outline"
            className="px-6 py-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 hover:text-purple-800 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};
