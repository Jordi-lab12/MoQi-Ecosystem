import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StartupSwiper } from "@/components/StartupSwiper";
import { FeedbackPreferences } from "@/components/FeedbackPreferences";
import { CoinAllocation } from "@/components/CoinAllocation";
import { ResultsOverview } from "@/components/ResultsOverview";
import { Dashboard } from "@/components/Dashboard";
import { StartupDashboard } from "@/components/StartupDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserPlus } from "lucide-react";
import { useSupabaseData, Profile } from "@/contexts/SupabaseDataContext";
import { WelcomePage, UserRole } from "@/components/WelcomePage";
import { supabase } from "@/integrations/supabase/client";

export type Startup = Profile;
export type FeedbackType = "no" | "individual" | "group" | "all";

const Index = () => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    loading, 
    getAllStartups,
    getSwipedStartupIds,
    createSwiperInteraction,
    getLikedStartupsWithAllocations,
    signOut
  } = useSupabaseData();

  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "feedback" | "allocation" | "results">("dashboard");
  const [availableStartups, setAvailableStartups] = useState<Startup[]>([]);
  const [allStartups, setAllStartups] = useState<Startup[]>([]);
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});

  // Load available startups for swipers
  useEffect(() => {
    if (profile?.role === 'swiper') {
      loadAvailableStartups();
    }
  }, [profile]);

  const loadAvailableStartups = async () => {
    try {
      const [allStartupsData, swipedIds] = await Promise.all([
        getAllStartups(),
        getSwipedStartupIds()
      ]);
      
      setAllStartups(allStartupsData);
      const available = allStartupsData.filter(startup => !swipedIds.includes(startup.id));
      setAvailableStartups(available);
    } catch (error) {
      console.error('Error loading startups:', error);
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    navigate(`/auth?role=${role}`);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
  };

  const handleStartSwiping = () => {
    // Check if at least 3 startups are available
    if (availableStartups.length < 3) {
      alert("You need at least 3 startups available to start swiping. Please wait for more startups to register.");
      return;
    }
    setCurrentStage("swiping");
  };

  const handleSwipeComplete = (liked: Startup[], preferences: Record<string, FeedbackType>) => {
    console.log("Swipe complete - liked startups:", liked);
    setLikedStartups(liked);
    
    if (liked.length > 0) {
      // Initialize feedback preferences with default 'all' values
      const initialPreferences: Record<string, FeedbackType> = {};
      liked.forEach(startup => {
        initialPreferences[startup.id] = 'all';
      });
      setFeedbackPreferences(initialPreferences);
      setCurrentStage("feedback");
    } else {
      setCurrentStage("results");
    }
  };

  const handleFeedbackComplete = (preferences: Record<string, FeedbackType>) => {
    console.log("Feedback preferences complete:", preferences);
    setFeedbackPreferences(preferences);
    
    if (likedStartups.length === 1) {
      // Auto-allocate 100 coins for single startup and go to results
      const allocations = { [likedStartups[0].id]: 100 };
      handleAllocationComplete(allocations);
    } else {
      setCurrentStage("allocation");
    }
  };

  const handleAllocationComplete = async (allocations: Record<string, number>) => {
    console.log("Allocation complete:", allocations);
    setCoinAllocations(allocations);

    // Update interactions with coin allocations and feedback preferences
    if (profile) {
      try {
        for (const [startupId, coinAllocation] of Object.entries(allocations)) {
          if (coinAllocation > 0) {
            // Get the feedback preference for this startup
            const feedbackPreference = feedbackPreferences[startupId] || 'all';
            
            // Update the existing interaction with the coin allocation and feedback preference
            const { error } = await supabase
              .from('swiper_interactions')
              .update({ 
                coin_allocation: coinAllocation,
                feedback_preference: feedbackPreference
              })
              .eq('swiper_id', profile.id)
              .eq('startup_id', startupId)
              .eq('has_liked', true);
            
            if (error) {
              console.error('Error updating interaction for startup:', startupId, error);
            } else {
              console.log(`Successfully updated ${coinAllocation} coins and '${feedbackPreference}' feedback preference for startup ${startupId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error updating interactions:', error);
      }
    }
    
    setCurrentStage("results");
  };

  const handleRestart = () => {
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
    loadAvailableStartups(); // Reload available startups
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome page if not logged in
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Top right buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <User className="w-4 h-4 mr-1" />
            Login
          </Button>
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-600 hover:bg-green-50"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Register
          </Button>
        </div>
        <WelcomePage onRoleSelected={handleRoleSelection} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Top right logout button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>

      {/* Show startup dashboard for startup users */}
      {profile.role === "startup" && (
        <StartupDashboard startupName={profile.name} />
      )}

      {/* Show swiper interface */}
      {profile.role === "swiper" && (
        <>
          {currentStage === "dashboard" && (
        <Dashboard 
          onStartSwiping={handleStartSwiping}
          likedStartups={likedStartups}
          coinAllocations={coinAllocations}
          feedbackPreferences={feedbackPreferences}
          availableStartupsCount={availableStartups.length}
          totalStartupsCount={allStartups.length}
          availableStartups={availableStartups}
        />
          )}
          
          {currentStage === "swiping" && (
            <StartupSwiper 
              startups={availableStartups} 
              onComplete={handleSwipeComplete}
            />
          )}

          {currentStage === "feedback" && (
            <FeedbackPreferences
              startups={likedStartups}
              initialPreferences={feedbackPreferences}
              onComplete={handleFeedbackComplete}
            />
          )}

          {currentStage === "allocation" && likedStartups.length > 1 && (
            <CoinAllocation 
              startups={likedStartups} 
              onComplete={handleAllocationComplete}
            />
          )}
          
          {currentStage === "results" && (
            <ResultsOverview 
              allStartups={availableStartups}
              likedStartups={likedStartups}
              coinAllocations={coinAllocations}
              feedbackPreferences={feedbackPreferences}
              onRestart={handleRestart}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
