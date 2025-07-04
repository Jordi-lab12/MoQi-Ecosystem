
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, MessageCircle, Calendar, Eye, Heart, Coins, Send, Clock, User } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";

interface StartupDashboardProps {
  startupName?: string;
}

export const StartupDashboard = ({ startupName }: StartupDashboardProps) => {
  const { 
    getSwiperInteractionsForStartup, 
    createFeedbackRequest, 
    currentStartupId,
    getCurrentStartupProfile,
    swiperProfiles,
    swiperInteractions
  } = useAppData();

  // Debug logging
  console.log("StartupDashboard - Current startup ID:", currentStartupId);
  console.log("StartupDashboard - All swiper interactions:", swiperInteractions);

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedSwiperId, setSelectedSwiperId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const currentStartup = getCurrentStartupProfile();
  const startupInteractions = currentStartupId ? getSwiperInteractionsForStartup(currentStartupId) : [];
  
  console.log("StartupDashboard - Current startup profile:", currentStartup);
  console.log("StartupDashboard - Startup interactions:", startupInteractions);
  
  // Get swipers who liked this startup and invested coins
  const swipersWhoLiked = startupInteractions.filter(interaction => 
    interaction.hasLiked && interaction.coinAllocation > 0
  );
  
  // Get swipers who are open to feedback (group or all) but may not have invested
  const swipersOpenToFeedback = swiperInteractions.filter(interaction => 
    interaction.startupId === currentStartupId && 
    (interaction.feedbackPreference === "group" || interaction.feedbackPreference === "all")
  );

  console.log("StartupDashboard - Swipers who liked:", swipersWhoLiked);
  console.log("StartupDashboard - Swipers open to feedback:", swipersOpenToFeedback);

  // Calculate total coins received
  const totalCoins = swipersWhoLiked.reduce((sum, interaction) => sum + interaction.coinAllocation, 0);
  
  // Calculate average coins per swiper
  const averageCoins = swipersWhoLiked.length > 0 ? Math.round(totalCoins / swipersWhoLiked.length) : 0;

  const handleSendFeedbackRequest = () => {
    if (!selectedSwiperId || !scheduledDate || !scheduledTime || !currentStartupId || !currentStartup) {
      return;
    }

    const selectedSwiper = swiperProfiles.find(s => s.id === selectedSwiperId);
    if (!selectedSwiper) return;

    createFeedbackRequest({
      startupId: currentStartupId,
      startupName: currentStartup.name,
      swiperId: selectedSwiperId,
      swiperName: selectedSwiper.name,
      feedbackType: "meeting",
      scheduledDate,
      scheduledTime,
      message: feedbackMessage,
      status: "pending"
    });

    // Reset form
    setSelectedSwiperId("");
    setFeedbackMessage("");
    setScheduledDate("");
    setScheduledTime("");
    setFeedbackDialogOpen(false);
  };

  if (!currentStartup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Startup Profile Not Found</h2>
          <p className="text-gray-600">Please make sure you're logged in as a startup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{currentStartup.logo}</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentStartup.name}
              </h1>
              <p className="text-gray-600 text-lg">{currentStartup.tagline}</p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">Debug Info:</h3>
          <p className="text-yellow-700">Total interactions: {startupInteractions.length}</p>
          <p className="text-yellow-700">Swipers who liked: {swipersWhoLiked.length}</p>
          <p className="text-yellow-700">Open to feedback: {swipersOpenToFeedback.length}</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Total Investors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{swipersWhoLiked.length}</div>
              <p className="text-xs text-gray-500">Who invested coins</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Total Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalCoins}</div>
              <p className="text-xs text-gray-500">MoQi-points received</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{averageCoins}</div>
              <p className="text-xs text-gray-500">Coins per investor</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Open to Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{swipersOpenToFeedback.length}</div>
              <p className="text-xs text-gray-500">Available for meetings</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Swiper Data */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Investors & Their Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {swipersWhoLiked.length > 0 ? (
                <div className="space-y-4">
                  {swipersWhoLiked.map((interaction) => {
                    const swiper = swiperProfiles.find(s => s.id === interaction.swiperId);
                    if (!swiper) return null;
                    
                    return (
                      <div key={interaction.swiperId} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-purple-600" />
                              <h4 className="font-semibold text-purple-800">{swiper.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{swiper.study} • Age {swiper.age}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-green-100 text-green-800 border-0">
                                <Coins className="w-3 h-3 mr-1" />
                                {interaction.coinAllocation} coins invested
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 border-0">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {interaction.feedbackPreference} feedback
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              Investment shows their confidence in your startup
                            </div>
                          </div>
                          <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedSwiperId(interaction.swiperId)}
                                size="sm"
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Request Meeting
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No investors yet</p>
                  <p className="text-sm">Swipers who invest coins in your startup will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Swipers Open to Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Available for Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {swipersOpenToFeedback.length > 0 ? (
                <div className="space-y-4">
                  {swipersOpenToFeedback.map((interaction) => {
                    const swiper = swiperProfiles.find(s => s.id === interaction.swiperId);
                    if (!swiper) return null;
                    
                    return (
                      <div key={interaction.swiperId} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <h4 className="font-semibold text-blue-800">{swiper.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{swiper.study} • Age {swiper.age}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-800 border-0">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {interaction.feedbackPreference} feedback
                              </Badge>
                              {interaction.coinAllocation > 0 && (
                                <Badge className="bg-green-100 text-green-800 border-0">
                                  <Coins className="w-3 h-3 mr-1" />
                                  {interaction.coinAllocation} coins
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Open to providing feedback and insights
                            </div>
                          </div>
                          <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedSwiperId(interaction.swiperId)}
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Request Meeting
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No one available for feedback yet</p>
                  <p className="text-sm">Swipers who opt for feedback will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Request Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Feedback Session
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleSendFeedbackRequest}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                disabled={!selectedSwiperId || !scheduledDate || !scheduledTime}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
