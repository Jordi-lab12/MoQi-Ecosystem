import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StartupSwiper } from "@/components/StartupSwiper";
import { CoinAllocation } from "@/components/CoinAllocation";
import { ResultsOverview } from "@/components/ResultsOverview";
import { Dashboard } from "@/components/Dashboard";
import { StartupDashboard } from "@/components/StartupDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserPlus } from "lucide-react";
import { useSupabaseData, Profile } from "@/contexts/SupabaseDataContext";
import { WelcomePage, UserRole } from "@/components/WelcomePage";

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

  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "allocation" | "results">("dashboard");
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
    setFeedbackPreferences(preferences);
    if (liked.length > 0) {
      setCurrentStage("allocation");
    } else {
      setCurrentStage("results");
    }
  };

  const handleAllocationComplete = async (allocations: Record<string, number>) => {
    console.log("Allocation complete:", allocations);
    setCoinAllocations(allocations);

    // Update interactions with coin allocations
    if (profile) {
      try {
        for (const [startupId, coinAllocation] of Object.entries(allocations)) {
          if (coinAllocation > 0) {
            // Note: We would need to update the existing interaction, but for now let's just store it locally
            // In a real implementation, you'd need to get the interaction ID and update it
          }
        }
      } catch (error) {
        console.error('Error updating coin allocations:', error);
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
          
          {currentStage === "swiping" && availableStartups.length > 0 && (
            <StartupSwiper startups={availableStartups} onComplete={handleSwipeComplete} />
          )}

          {currentStage === "swiping" && availableStartups.length === 0 && (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Startups Available</h2>
                <p className="text-gray-600 mb-6">You've swiped on all available startups!</p>
                <Button onClick={() => setCurrentStage("dashboard")} className="bg-purple-500 hover:bg-purple-600">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
          
          {currentStage === "allocation" && (
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
