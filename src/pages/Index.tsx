import { useState } from "react";
import { StartupSwiper } from "@/components/StartupSwiper";
import { CoinAllocation } from "@/components/CoinAllocation";
import { ResultsOverview } from "@/components/ResultsOverview";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { WelcomePage, UserRole } from "@/components/WelcomePage";
import { StartupDashboard } from "@/components/StartupDashboard";
import { Button } from "@/components/ui/button";
import { AppDataProvider, useAppData } from "@/contexts/AppDataContext";
import { LogOut, User, UserPlus } from "lucide-react";

export type Startup = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  usp: string;
  mission: string;
  vision: string;
  industry: string;
  founded: string;
  employees: string;
  logo: string;
  image: string;
};

export type FeedbackType = "no" | "group" | "all";

const AppContent = () => {
  const { 
    addSwiperProfile, 
    addStartupProfile,
    addUserCredentials,
    setCurrentSwiper, 
    setCurrentStartup, 
    addSwiperInteraction,
    currentSwiperId,
    currentStartupId,
    startupProfiles,
    swiperInteractions,
    logout
  } = useAppData();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showRegistrationScreen, setShowRegistrationScreen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "allocation" | "results">("dashboard");
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});

  // Check if user is logged in
  const isLoggedIn = currentSwiperId || currentStartupId;
  const currentUserRole = currentSwiperId ? "swiper" : currentStartupId ? "startup" : null;

  // Debug logging
  console.log("Current user role:", currentUserRole);
  console.log("Current swiper ID:", currentSwiperId);
  console.log("Current startup ID:", currentStartupId);
  console.log("All swiper interactions:", swiperInteractions);

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    setShowRegistrationScreen(true);
  };

  const handleLogin = (role: 'swiper' | 'startup') => {
    setUserRole(role);
    setCurrentStage("dashboard");
    setShowLoginScreen(false);
  };

  const handleRegistration = (data: any) => {
    console.log("Registration data:", data);
    setUserData(data);
    
    if (data.role === "swiper") {
      const swiperId = `swiper_${Date.now()}`;
      console.log("Creating swiper with ID:", swiperId);
      
      addSwiperProfile({
        id: swiperId,
        name: data.name,
        age: data.age,
        study: data.study,
        gender: "Male", // Default for now
        username: data.username
      });
      
      addUserCredentials({
        username: data.username,
        password: data.password,
        role: "swiper",
        profileId: swiperId
      });
      
      setCurrentSwiper(swiperId);
      setUserRole("swiper");
    } else if (data.role === "startup") {
      const startupId = `startup_${Date.now()}`;
      console.log("Creating startup with ID:", startupId);
      const defaultImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`;
      
      addStartupProfile({
        id: startupId,
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        usp: data.usp,
        mission: data.mission,
        vision: data.vision,
        industry: data.industry,
        founded: data.founded,
        employees: data.employees,
        logo: "🚀", 
        image: defaultImage,
        username: data.username
      });
      
      addUserCredentials({
        username: data.username,
        password: data.password,
        role: "startup",
        profileId: startupId
      });
      
      setCurrentStartup(startupId);
      setUserRole("startup");
    }
    
    setShowRegistrationScreen(false);
    setCurrentStage("dashboard");
  };

  const handleLogout = () => {
    logout();
    setUserRole(null);
    setUserData(null);
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
    setShowLoginScreen(false);
    setShowRegistrationScreen(false);
  };

  const handleShowLogin = () => {
    setShowLoginScreen(true);
  };

  const handleShowRegistration = () => {
    setShowRegistrationScreen(true);
  };

  const handleStartSwiping = () => {
    setCurrentStage("swiping");
  };

  const handleSwipeComplete = (liked: Startup[], preferences: Record<string, FeedbackType>) => {
    console.log("Swipe complete - liked startups:", liked);
    console.log("Feedback preferences:", preferences);
    
    setLikedStartups(liked);
    setFeedbackPreferences(preferences);
    if (liked.length > 0) {
      setCurrentStage("allocation");
    } else {
      setCurrentStage("results");
    }
  };

  const handleAllocationComplete = (allocations: Record<string, number>, finalFeedbackPreferences: Record<string, FeedbackType>) => {
    console.log("Allocation complete:", allocations);
    console.log("Final feedback preferences:", finalFeedbackPreferences);
    
    setCoinAllocations(allocations);
    setFeedbackPreferences(finalFeedbackPreferences);
    
    if (currentSwiperId && userData) {
      console.log("Updating swiper interactions for swiper:", currentSwiperId);
      console.log("Current user data:", userData);
      Object.entries(allocations).forEach(([startupId, coinAllocation]) => {
        const startup = likedStartups.find(s => s.id === startupId);
        if (startup) {
          console.log("Updating interaction for startup:", startupId, "with allocation:", coinAllocation);
          const interaction = {
            swiperId: currentSwiperId,
            swiperName: userData.name,
            startupId: startupId,
            coinAllocation: coinAllocation,
            feedbackPreference: finalFeedbackPreferences[startupId] || "no",
            hasLiked: true
          };
          console.log("Updated interaction object:", interaction);
          addSwiperInteraction(interaction);
        }
      });
      
      // Log all interactions after updating
      setTimeout(() => {
        console.log("All swiper interactions after updating:", swiperInteractions);
      }, 100);
    }
    
    setCurrentStage("results");
  };

  const handleRestart = () => {
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
  };

  // Get startups that this swiper hasn't swiped yet
  const getAvailableStartups = (): Startup[] => {
    if (!currentSwiperId) return [];
    
    const swipedStartupIds = swiperInteractions
      .filter(interaction => interaction.swiperId === currentSwiperId)
      .map(interaction => interaction.startupId);
    
    return startupProfiles
      .filter(profile => !swipedStartupIds.includes(profile.id))
      .map(profile => ({ ...profile }));
  };

  const availableStartups = getAvailableStartups();

  console.log("Available startups:", availableStartups);

  // Show login screen
  if (showLoginScreen) {
    return <LoginScreen onLogin={handleLogin} onBack={() => setShowLoginScreen(false)} />;
  }

  // Show registration screen
  if (showRegistrationScreen) {
    return <RegistrationForm userRole={userRole!} onComplete={handleRegistration} onBack={() => setShowRegistrationScreen(false)} />;
  }

  // Show welcome page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Top right buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleShowLogin}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <User className="w-4 h-4 mr-1" />
            Login
          </Button>
          <Button
            onClick={handleShowRegistration}
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
      {currentUserRole === "startup" && (
        <StartupDashboard startupName={userData?.name} />
      )}

      {/* Show swiper interface */}
      {currentUserRole === "swiper" && (
        <>
          {currentStage === "dashboard" && (
            <Dashboard 
              onStartSwiping={handleStartSwiping}
              likedStartups={likedStartups}
              coinAllocations={coinAllocations}
              feedbackPreferences={feedbackPreferences}
            />
          )}
          
          {currentStage === "swiping" && availableStartups.length > 0 && (
            <StartupSwiper startups={availableStartups} onComplete={handleSwipeComplete} />
          )}

          {currentStage === "swiping" && availableStartups.length === 0 && (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Startups Available</h2>
                <p className="text-gray-600 mb-6">There are no registered startups to swipe on yet.</p>
                <Button onClick={() => setCurrentStage("dashboard")} className="bg-purple-500 hover:bg-purple-600">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
          
          {currentStage === "allocation" && (
            <CoinAllocation 
              startups={likedStartups} 
              feedbackPreferences={feedbackPreferences}
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

const Index = () => {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
};

export default Index;
