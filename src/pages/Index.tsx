import { useState } from "react";
import { StartupSwiper } from "@/components/StartupSwiper";
import { CoinAllocation } from "@/components/CoinAllocation";
import { ResultsOverview } from "@/components/ResultsOverview";
import { LoginScreen } from "@/components/LoginScreen";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStage, setCurrentStage] = useState<"swiping" | "allocation" | "results">("swiping");
  const [likedStartups, setLikedStartups] = useState<Startup[]>([]);
  const [coinAllocations, setCoinAllocations] = useState<Record<string, number>>({});
  const [feedbackPreferences, setFeedbackPreferences] = useState<Record<string, FeedbackType>>({});

  const handleLogin = () => {
    setIsLoggedIn(true);
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
    setCurrentStage("swiping");
    setLikedStartups([]);
    setCoinAllocations({});
    setFeedbackPreferences({});
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
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
