import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Info, MessageCircle, Play, Star, TrendingUp, Users, ChevronDown, ChevronUp } from "lucide-react";
import { MeetingCalendar } from "./MeetingCalendar";
import { Portfolio } from "./Portfolio";
import { Startup, FeedbackType } from "@/pages/Index";
interface DashboardProps {
  onStartSwiping: () => void;
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
}
export const Dashboard = ({
  onStartSwiping,
  likedStartups,
  coinAllocations,
  feedbackPreferences
}: DashboardProps) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isWhyStartupMixerOpen, setIsWhyStartupMixerOpen] = useState(false);
  const handleContact = () => {
    // For now, just show an alert - can be replaced with actual contact functionality
    alert("Contact us at: hello@moqi.com");
  };
  return <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-10 h-10 text-purple-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MoQi</h1>
            <Sparkles className="w-10 h-10 text-pink-500" />
          </div>
          <p className="text-gray-600 text-xl">Welcome back! Ready to discover amazing startups?</p>
        </div>

        {/* Main action button - central and biggest */}
        <div className="text-center mb-12">
          <Button onClick={onStartSwiping} className="px-16 py-8 text-3xl font-bold rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300 flex items-center gap-6 mx-auto">
            <Play className="w-10 h-10" />
            Start Swiping ✨
          </Button>
          <p className="text-gray-500 mt-6 text-lg">Discover and invest in promising startups</p>
        </div>

        {/* Large central buttons for My Meetings and My Portfolio */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="text-center">
            <MeetingCalendar />
          </div>
          <div className="text-center">
            <Portfolio likedStartups={likedStartups} coinAllocations={coinAllocations} feedbackPreferences={feedbackPreferences} />
          </div>
        </div>

        {/* Collapsible How it works section */}
        <div className="mb-8">
          <Collapsible open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full p-4 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 hover:text-purple-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                <Info className="w-4 h-4" />
                How It Works
                {isHowItWorksOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-4 bg-white/60 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Swipe & Discover</p>
                      <p className="text-sm text-gray-600">Browse through innovative startups and swipe right on the ones you like</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">Invest MoQi-points</p>
                      <p className="text-sm text-gray-600">Distribute 100 MoQi-points among your selected startups based on your interest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Get Connected</p>
                      <p className="text-sm text-gray-600">Choose your feedback preferences and get matched with opportunities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Collapsible Why StartupMixer section */}
        <div className="mb-8">
          <Collapsible open={isWhyStartupMixerOpen} onOpenChange={setIsWhyStartupMixerOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full p-4 border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 text-pink-700 hover:text-pink-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                <TrendingUp className="w-4 h-4" />
                Why StartupMixer?
                {isWhyStartupMixerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-4 bg-white/60 backdrop-blur-sm border-pink-200">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Curated Startups</p>
                        <p className="text-xs text-gray-600">Hand-picked companies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Connect Directly</p>
                        <p className="text-xs text-gray-600">Get in touch with founders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Personalized Feedback</p>
                        <p className="text-xs text-gray-600">Choose how to engage</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Contact button - smaller */}
        <div className="text-center">
          <Button onClick={handleContact} variant="outline" className="px-4 py-2 border border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 hover:text-purple-800 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm">
            <MessageCircle className="w-4 h-4" />
            Contact MoQi
          </Button>
        </div>
      </div>
    </div>;
};