
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
import { LogOut } from "lucide-react";

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
    setCurrentSwiper, 
    setCurrentStartup, 
    addSwiperInteraction,
    currentSwiperId,
    currentStartupId,
    startupProfiles,
    logout
  } = useAppData();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "allocation" | "results">("dashboard");
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});
  
  // Test mode for switching between views
  const [testMode, setTestMode] = useState(false);
  const [testRole, setTestRole] = useState<UserRole>("swiper");

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
  };

  const handleRegistration = (data: any) => {
    setUserData(data);
    
    if (data.role === "swiper") {
      const swiperId = `swiper_${Date.now()}`;
      addSwiperProfile({
        id: swiperId,
        name: data.name,
        age: data.age,
        study: data.study,
        gender: "Male" // Default for now, could be added to registration
      });
      setCurrentSwiper(swiperId);
    } else if (data.role === "startup") {
      const startupId = `startup_${Date.now()}`;
      // Generate a default image URL
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
        logo: "🚀", // Default logo
        image: defaultImage
      });
      setCurrentStartup(startupId);
    }
    
    setIsRegistered(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentStage("dashboard");
  };

  const handleLogout = () => {
    logout();
    setUserRole(null);
    setIsRegistered(false);
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
    setTestMode(false);
  };

  const handleStartSwiping = () => {
    setCurrentStage("swiping");
  };

  const handleSwipeComplete = (liked: Startup[], preferences: Record<string, FeedbackType>) => {
    setLikedStartups(liked);
    setFeedbackPreferences(preferences);
    if (liked.length > 0) {
      setCurrentStage("allocation");
    } else {
      setCurrentStage("results");
    }
  };

  const handleAllocationComplete = (allocations: Record<string, number>, finalFeedbackPreferences: Record<string, FeedbackType>) => {
    setCoinAllocations(allocations);
    setFeedbackPreferences(finalFeedbackPreferences);
    
    // Save interactions to shared data context
    if (currentSwiperId && userData) {
      Object.entries(allocations).forEach(([startupId, coinAllocation]) => {
        const startup = likedStartups.find(s => s.id === startupId);
        if (startup) {
          addSwiperInteraction({
            swiperId: currentSwiperId,
            swiperName: userData.name,
            startupId: startupId,
            coinAllocation: coinAllocation,
            feedbackPreference: finalFeedbackPreferences[startupId] || "no",
            hasLiked: true
          });
        }
      });
    }
    
    setCurrentStage("results");
  };

  const handleRestart = () => {
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
  };

  // Convert startup profiles to the format expected by StartupSwiper
  const availableStartups: Startup[] = startupProfiles.map(profile => ({
    ...profile
  }));

  // Test mode toggle
  if (testMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => setTestRole("swiper")}
            variant={testRole === "swiper" ? "default" : "outline"}
            className="bg-[#60BEBB] hover:bg-[#4a9a96] text-white"
          >
            Swiper View
          </Button>
          <Button
            onClick={() => setTestRole("startup")}
            variant={testRole === "startup" ? "default" : "outline"}
            className="bg-[#D8CCEB] hover:bg-[#c5b8e0] text-[#1E1E1E]"
          >
            Startup View
          </Button>
          <Button
            onClick={() => setTestMode(false)}
            variant="outline"
            className="border-gray-300"
          >
            Exit Test Mode
          </Button>
        </div>
        
        {testRole === "startup" ? (
          <StartupDashboard startupName={userData?.name} />
        ) : (
          <Dashboard 
            onStartSwiping={handleStartSwiping}
            likedStartups={likedStartups}
            coinAllocations={coinAllocations}
            feedbackPreferences={feedbackPreferences}
          />
        )}
      </div>
    );
  }

  if (!userRole) {
    return <WelcomePage onRoleSelected={handleRoleSelection} />;
  }

  if (!isRegistered) {
    return <RegistrationForm userRole={userRole} onComplete={handleRegistration} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show startup dashboard for startup users
  if (userRole === "startup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Logout and Test mode buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
          <Button
            onClick={() => setTestMode(true)}
            variant="outline"
            size="sm"
            className="border-gray-300 text-xs"
          >
            Test Mode
          </Button>
        </div>
        <StartupDashboard startupName={userData?.name} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Logout and Test mode buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
        <Button
          onClick={() => setTestMode(true)}
          variant="outline"
          size="sm"
          className="border-gray-300 text-xs"
        >
          Test Mode
        </Button>
      </div>

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
            <p className="text-gray-600 mb-6">There are no registered startups to swipe on yet. Please check back later or create a startup account.</p>
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
