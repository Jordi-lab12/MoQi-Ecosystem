
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Star, TrendingUp, Calendar } from "lucide-react";
import { Startup, FeedbackType } from "@/pages/Index";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";

interface PortfolioProps {
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
}

export const Portfolio = ({ likedStartups, coinAllocations, feedbackPreferences }: PortfolioProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioStartups, setPortfolioStartups] = useState<Array<{ startup: Startup; allocation: number; date: string }>>([]);
  const { getLikedStartupsWithAllocations } = useSupabaseData();

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const data = await getLikedStartupsWithAllocations();
        // Convert to the format we need with date information
        const portfolioData = data.map(item => ({
          startup: item.startup,
          allocation: item.allocation,
          date: new Date().toISOString() // Using current date as fallback, ideally this would come from interaction date
        }));
        
        // Sort by date (most recent first)
        portfolioData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setPortfolioStartups(portfolioData);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      }
    };

    if (isOpen) {
      loadPortfolioData();
    }
  }, [isOpen, getLikedStartupsWithAllocations]);

  const getFeedbackLabel = (type: FeedbackType) => {
    switch (type) {
      case "no": return "No Feedback";
      case "group": return "Group Feedback";
      case "all": return "All Feedback";
      default: return "All Feedback";
    }
  };

  const getFeedbackColor = (type: FeedbackType) => {
    switch (type) {
      case "no": return "bg-gray-100 text-gray-800";
      case "group": return "bg-blue-100 text-blue-800";
      case "all": return "bg-green-100 text-green-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto"
        >
          <Briefcase className="w-8 h-8" />
          My Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            My Startup Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {portfolioStartups.length > 0 ? (
            <div className="space-y-4">
              {portfolioStartups.map((item, index) => {
                const feedback = feedbackPreferences[item.startup.id] || "all";
                
                return (
                  <Card key={item.startup.id} className="border-2 border-green-100 hover:border-green-200 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{item.startup.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-green-800">{item.startup.name}</h3>
                            <Badge className="bg-green-100 text-green-800 border-0">
                              #{index + 1}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.date)}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{item.startup.tagline}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold text-green-700">{item.allocation} MoQi-points</span>
                            </div>
                            <Badge className={`${getFeedbackColor(feedback)} border-0`}>
                              {getFeedbackLabel(feedback)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.startup.industry}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your portfolio is empty</p>
              <p className="text-sm">Start swiping to add startups to your portfolio!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
