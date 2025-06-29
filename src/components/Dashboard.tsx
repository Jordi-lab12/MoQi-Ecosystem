
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

export const Dashboard = ({ onStartSwiping, likedStartups, coinAllocations, feedbackPreferences }: DashboardProps) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isWhyMoQiOpen, setIsWhyMoQiOpen] = useState(false);

  const handleContact = () => {
    // For now, just show an alert - can be replaced with actual contact functionality
    alert("Contact us at: hello@moqi.com");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-white via-[#D8CCEB]/20 to-[#60BEBB]/10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-10 h-10 text-[#60BEBB]" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#60BEBB] to-[#D8CCEB] bg-clip-text text-transparent">
              MoQi
            </h1>
            <Sparkles className="w-10 h-10 text-[#D8CCEB]" />
          </div>
          <p className="text-[#1E1E1E]/70 text-xl">Welcome back! Ready to discover amazing startups?</p>
        </div>

        {/* Main action button - central and biggest */}
        <div className="text-center mb-12">
          <Button 
            onClick={onStartSwiping}
            className="px-16 py-8 text-3xl font-bold rounded-3xl bg-gradient-to-r from-[#60BEBB] to-[#D8CCEB] hover:from-[#60BEBB]/90 hover:to-[#D8CCEB]/90 shadow-2xl hover:shadow-[#60BEBB]/25 transform hover:scale-110 transition-all duration-300 flex items-center gap-6 mx-auto text-white"
          >
            <Play className="w-10 h-10" />
            Start Swiping ✨
          </Button>
          <p className="text-[#1E1E1E]/60 mt-6 text-lg">Discover and invest in promising startups</p>
        </div>

        {/* Large central buttons for My Meetings and My Portfolio */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="text-center">
            <MeetingCalendar />
          </div>
          <div className="text-center">
            <Portfolio 
              likedStartups={likedStartups}
              coinAllocations={coinAllocations}
              feedbackPreferences={feedbackPreferences}
            />
          </div>
        </div>

        {/* Collapsible How it works section */}
        <div className="mb-8">
          <Collapsible open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full p-4 border-2 border-[#60BEBB]/30 hover:border-[#60BEBB] hover:bg-[#60BEBB]/10 text-[#1E1E1E] hover:text-[#1E1E1E] font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 bg-white"
              >
                <Info className="w-4 h-4" />
                How It Works
                {isHowItWorksOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-4 bg-white/80 backdrop-blur-sm border-[#60BEBB]/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D8CCEB]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-[#60BEBB]">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1E1E]">Swipe & Discover</p>
                      <p className="text-sm text-[#1E1E1E]/70">Browse through innovative startups and swipe right on the ones you like</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D8CCEB]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-[#60BEBB]">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1E1E]">Invest MoQi-points</p>
                      <p className="text-sm text-[#1E1E1E]/70">Distribute 100 MoQi-points among your selected startups based on your interest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D8CCEB]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-[#60BEBB]">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1E1E]">Get Connected</p>
                      <p className="text-sm text-[#1E1E1E]/70">Choose your feedback preferences and get matched with opportunities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Collapsible Why MoQi section */}
        <div className="mb-8">
          <Collapsible open={isWhyMoQiOpen} onOpenChange={setIsWhyMoQiOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full p-4 border-2 border-[#D8CCEB]/50 hover:border-[#D8CCEB] hover:bg-[#D8CCEB]/10 text-[#1E1E1E] hover:text-[#1E1E1E] font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 bg-white"
              >
                <TrendingUp className="w-4 h-4" />
                Why MoQi?
                {isWhyMoQiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-4 bg-white/80 backdrop-blur-sm border-[#D8CCEB]/50">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#60BEBB] flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-[#1E1E1E]">Curated Startups</p>
                        <p className="text-xs text-[#1E1E1E]/70">Hand-picked companies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D8CCEB] flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-[#1E1E1E]">Connect Directly</p>
                        <p className="text-xs text-[#1E1E1E]/70">Get in touch with founders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#60BEBB] flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-[#1E1E1E]">Personalized Feedback</p>
                        <p className="text-xs text-[#1E1E1E]/70">Choose how to engage</p>
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
          <Button 
            onClick={handleContact}
            variant="outline"
            className="px-4 py-2 border border-[#60BEBB]/30 hover:border-[#60BEBB] hover:bg-[#60BEBB]/10 text-[#1E1E1E] hover:text-[#1E1E1E] rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm bg-white"
          >
            <MessageCircle className="w-4 h-4" />
            Contact MoQi
          </Button>
        </div>
      </div>
    </div>
  );
};
