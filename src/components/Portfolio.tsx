
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Star, TrendingUp, Calendar, FileText, ArrowRight } from "lucide-react";
import { Startup, FeedbackType } from "@/pages/Index";
import { StartupUpdateViewer } from "./StartupUpdateViewer";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioProps {
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
}

export const Portfolio = ({ likedStartups, coinAllocations, feedbackPreferences }: PortfolioProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioStartups, setPortfolioStartups] = useState<Array<{ startup: Startup; allocation: number; date: string }>>([]);
  const [selectedStartupForUpdates, setSelectedStartupForUpdates] = useState<{ id: string; name: string } | null>(null);
  const [startupUpdates, setStartupUpdates] = useState<Record<string, { hasUpdates: boolean; latestUpdate?: any }>>({});
  const { getLikedStartupsWithAllocations } = useSupabaseData();

  const loadStartupUpdates = async (portfolioData: Array<{ startup: Startup; allocation: number; date: string }>) => {
    try {
      const startupIds = portfolioData.map(p => p.startup.id);
      if (startupIds.length === 0) return;

      const { data: updates, error } = await supabase
        .from('startup_updates')
        .select('startup_id, title, created_at, week_ending')
        .in('startup_id', startupIds)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group updates by startup and get latest for each
      const updatesByStartup: Record<string, { hasUpdates: boolean; latestUpdate?: any }> = {};
      
      startupIds.forEach(id => {
        const startupUpdates = updates?.filter(u => u.startup_id === id) || [];
        updatesByStartup[id] = {
          hasUpdates: startupUpdates.length > 0,
          latestUpdate: startupUpdates[0] || null
        };
      });

      setStartupUpdates(updatesByStartup);
    } catch (error) {
      console.error('Error loading startup updates:', error);
    }
  };

  useEffect(() => {
  const loadPortfolioData = async () => {
    try {
      const data = await getLikedStartupsWithAllocations();
      console.log('Portfolio data from database:', data);
      
      // Sort by date (most recent first)
      const portfolioData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      console.log('Portfolio data formatted:', portfolioData);
      setPortfolioStartups(portfolioData);
      
      // Load weekly updates for each startup
      await loadStartupUpdates(portfolioData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    }
  };

    // Load immediately when component opens or mounts
    loadPortfolioData();
    
    // Set up real-time subscription for portfolio updates
    const channel = supabase
      .channel('portfolio-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swiper_interactions'
        },
        () => {
          // Reload portfolio when any interaction changes
          loadPortfolioData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  if (selectedStartupForUpdates) {
    return (
      <StartupUpdateViewer
        onBack={() => setSelectedStartupForUpdates(null)}
        startupId={selectedStartupForUpdates.id}
        startupName={selectedStartupForUpdates.name}
      />
    );
  }

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
                             {startupUpdates[item.startup.id]?.hasUpdates && (
                               <Badge className="bg-blue-100 text-blue-800 border-0 animate-pulse">
                                 New Update!
                               </Badge>
                             )}
                           </div>
                           <p className="text-gray-600 mb-3">{item.startup.tagline}</p>
                           <div className="flex items-center gap-4 mb-3">
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
                           {startupUpdates[item.startup.id]?.hasUpdates && (
                             <Button
                               onClick={() => setSelectedStartupForUpdates({ id: item.startup.id, name: item.startup.name })}
                               variant="outline"
                               size="sm"
                               className="flex items-center gap-2 hover:bg-blue-50"
                             >
                               <FileText className="w-4 h-4" />
                               View Latest Update
                               <ArrowRight className="w-4 h-4" />
                             </Button>
                           )}
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
