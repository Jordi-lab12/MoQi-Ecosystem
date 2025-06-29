import { useState } from "react";
import { StartupSwiper } from "@/components/StartupSwiper";
import { CoinAllocation } from "@/components/CoinAllocation";
import { ResultsOverview } from "@/components/ResultsOverview";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { StartupDashboard } from "@/components/StartupDashboard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { WelcomePage, UserRole } from "@/components/WelcomePage";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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

// Mock startup statistics data
const mockStartupStats = {
  name: "EcoFlow",
  tagline: "Sustainable energy for everyone",
  totalVotes: 127,
  averagePoints: 73,
  genderDistribution: { male: 45, female: 52, other: 3 },
  ageDistribution: { "18-25": 35, "26-35": 40, "36-45": 20, "45+": 5 }
};

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<"dashboard" | "swiping" | "allocation" | "results">("dashboard");
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [allStartups] = useState<Startup[]>(mockStartups);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});
  
  // Role switcher for testing
  const [viewMode, setViewMode] = useState<"swiper" | "startup">("swiper");

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
  };

  const handleRegistration = (data: any) => {
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

  const toggleViewMode = () => {
    setViewMode(viewMode === "swiper" ? "startup" : "swiper");
  };

  if (!userRole) {
    return <WelcomePage onRoleSelected={handleRoleSelection} />;
  }

  if (!isRegistered) {
    return <RegistrationForm userRole={userRole} onComplete={handleRegistration} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#D8CCEB]/20 to-[#60BEBB]/10">
      {/* Role Switcher Button - Only for testing */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleViewMode}
          className="bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Switch to {viewMode === "swiper" ? "Startup" : "Swiper"} View
        </Button>
      </div>

      {viewMode === "startup" ? (
        <StartupDashboard startupData={mockStartupStats} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Index;
