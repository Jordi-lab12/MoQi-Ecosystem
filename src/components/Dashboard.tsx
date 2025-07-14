
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Info, MessageCircle, Play, Star, TrendingUp, Users, ChevronDown, ChevronUp } from "lucide-react";
import { MeetingCalendar } from "./MeetingCalendar";
import { Portfolio } from "./Portfolio";
import { FeedbackRequests } from "./FeedbackRequests";
import { Startup, FeedbackType } from "@/pages/Index";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  onStartSwiping: () => void;
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
  availableStartupsCount: number;
  totalStartupsCount: number;
  availableStartups: Startup[];
}

export const Dashboard = ({
  onStartSwiping,
  likedStartups,
  coinAllocations,
  feedbackPreferences,
  availableStartupsCount,
  totalStartupsCount,
  availableStartups
}: DashboardProps) => {
  const { getAllStartups, getSwipedStartupIds, profile } = useSupabaseData();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isWhyMoQiOpen, setIsWhyMoQiOpen] = useState(false);
  const [showFeedbackRequests, setShowFeedbackRequests] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Fetch pending feedback requests count for notification badge
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!profile || profile.role !== 'swiper') return;
      
      try {
        const { data, error } = await supabase
          .from('feedback_requests')
          .select('id')
          .eq('swiper_id', profile.id)
          .eq('status', 'pending');
        
        if (error) throw error;
        setPendingRequestsCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();

    // Set up real-time subscription for feedback requests
    if (profile?.role === 'swiper') {
      const channel = supabase
        .channel('feedback-requests-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'feedback_requests',
            filter: `swiper_id=eq.${profile.id}`
          },
          () => {
            fetchPendingRequests();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const handleContact = () => {
    // For now, just show an alert - can be replaced with actual contact functionality
    alert("Contact us at: hello@moqi.com");
  };

  if (showFeedbackRequests) {
    return <FeedbackRequests onBack={() => setShowFeedbackRequests(false)} />;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
          <Button 
            onClick={onStartSwiping} 
            disabled={availableStartups.length < 3}
            className={`px-16 py-8 text-3xl font-bold rounded-3xl shadow-2xl transform transition-all duration-300 flex items-center gap-6 mx-auto ${
              availableStartups.length < 3 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/25 hover:scale-110'
            }`}
          >
            <Play className="w-10 h-10" />
            {availableStartups.length < 3 
              ? `Need ${3 - availableStartups.length} more startups` 
              : 'Start Swiping ✨'
            }
          </Button>
          <p className="text-gray-500 mt-6 text-lg">
            {availableStartups.length >= 3 
              ? `Discover and invest in ${availableStartupsCount} new startups` 
              : availableStartups.length > 0
              ? `${availableStartups.length} startups available (minimum 3 required to start)`
              : totalStartupsCount > 0
              ? "You've seen all startups - check back for new ones!"
              : "No startups available to swipe on yet"
            }
          </p>
        </div>

        {/* Large central buttons for My Meetings, My Portfolio, and Feedback Requests */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <MeetingCalendar />
          </div>
          <div className="text-center">
            <Portfolio likedStartups={likedStartups} coinAllocations={coinAllocations} feedbackPreferences={feedbackPreferences} />
          </div>
          <div className="text-center">
            <div className="relative inline-block">
              <Button 
                onClick={() => setShowFeedbackRequests(true)}
                className="px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto"
              >
                <MessageCircle className="w-8 h-8" />
                Feedback Requests
              </Button>
              {pendingRequestsCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center"
                >
                  {pendingRequestsCount}
                </Badge>
              )}
            </div>
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

        <div className="mb-8">
          <Collapsible open={isWhyMoQiOpen} onOpenChange={setIsWhyMoQiOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full p-4 border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 text-pink-700 hover:text-pink-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                <TrendingUp className="w-4 h-4" />
                Why MoQi?
                {isWhyMoQiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

        <div className="text-center">
          <Button onClick={handleContact} variant="outline" className="px-4 py-2 border border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 hover:text-purple-800 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm">
            <MessageCircle className="w-4 h-4" />
            Contact MoQi
          </Button>
        </div>
      </div>
    </div>
  );
};
