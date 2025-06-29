
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

const mockStartups: Startup[] = [
  {
    id: "1",
    name: "EcoFlow",
    tagline: "Sustainable energy for everyone",
    description: "Revolutionary solar panel technology that's 40% more efficient",
    usp: "Patent-pending nano-coating technology that maximizes energy absorption",
    mission: "To make clean energy accessible and affordable for every household",
    vision: "A world powered entirely by renewable energy by 2030",
    industry: "Clean Energy",
    founded: "2023",
    employees: "15-25",
    logo: "🌱",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "HealthMind",
    tagline: "AI-powered mental wellness",
    description: "Personalized therapy recommendations using advanced AI algorithms",
    usp: "First platform to combine CBT, mindfulness, and AI for personalized mental health",
    mission: "To democratize access to quality mental health support worldwide",
    vision: "A society where mental wellness is prioritized and accessible to all",
    industry: "HealthTech",
    founded: "2022",
    employees: "8-15",
    logo: "🧠",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "FoodieBot",
    tagline: "Smart cooking assistant",
    description: "AI chef that creates recipes based on your ingredients and preferences",
    usp: "Advanced taste profile learning that adapts to your unique preferences",
    mission: "To eliminate food waste and make cooking enjoyable for everyone",
    vision: "Every kitchen equipped with intelligent cooking assistance",
    industry: "FoodTech",
    founded: "2023",
    employees: "5-10",
    logo: "🤖",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "LearnLive",
    tagline: "Interactive education platform",
    description: "Virtual reality classrooms that make learning immersive and engaging",
    usp: "First VR platform designed specifically for collaborative learning experiences",
    mission: "To transform education through immersive, interactive learning",
    vision: "A world where quality education is engaging and accessible globally",
    industry: "EdTech",
    founded: "2023",
    employees: "20-30",
    logo: "🎓",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "CityFlow",
    tagline: "Smart urban mobility",
    description: "AI-optimized traffic management system for smarter cities",
    usp: "Real-time traffic optimization that reduces commute times by up to 30%",
    mission: "To create more efficient and sustainable urban transportation",
    vision: "Cities with zero traffic congestion and minimal environmental impact",
    industry: "Smart Cities",
    founded: "2022",
    employees: "25-40",
    logo: "🚦",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
  }
];

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; age: string; study: string; role: UserRole } | null>(null);
  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "allocation" | "results">("dashboard");
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [allStartups] = useState<Startup[]>(mockStartups);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});
  
  // Test mode for switching between views
  const [testMode, setTestMode] = useState(false);
  const [testRole, setTestRole] = useState<UserRole>("swiper");

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
  };

  const handleRegistration = (data: { name: string; age: string; study: string; role: UserRole }) => {
    setUserData(data);
    setIsRegistered(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentStage("dashboard");
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
    setCurrentStage("results");
  };

  const handleRestart = () => {
    setCurrentStage("dashboard");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
  };

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
          <StartupDashboard />
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
        {/* Test mode button - only visible for demo purposes */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setTestMode(true)}
            variant="outline"
            size="sm"
            className="border-gray-300 text-xs"
          >
            Test Mode
          </Button>
        </div>
        <StartupDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Test mode button - only visible for demo purposes */}
      <div className="fixed top-4 right-4 z-50">
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
      
      {currentStage === "swiping" && (
        <StartupSwiper startups={mockStartups} onComplete={handleSwipeComplete} />
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
          allStartups={allStartups}
          likedStartups={likedStartups}
          coinAllocations={coinAllocations}
          feedbackPreferences={feedbackPreferences}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
