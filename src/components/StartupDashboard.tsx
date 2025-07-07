import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, MessageCircle, Calendar, Eye, Heart, Coins, Send, Clock, User } from "lucide-react";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";

interface StartupDashboardProps {
  startupName?: string;
}

export const StartupDashboard = ({ startupName }: StartupDashboardProps) => {
  const { profile, getSwiperInteractions } = useSupabaseData();
  const [interactions, setInteractions] = useState<any[]>([]);
  
  useEffect(() => {
    const loadInteractions = async () => {
      if (profile?.id) {
        try {
          const data = await getSwiperInteractions(profile.id);
          setInteractions(data);
        } catch (error) {
          console.error('Error loading interactions:', error);
        }
      }
    };
    
    loadInteractions();
  }, [profile, getSwiperInteractions]);

  const startup = profile || { name: startupName || "Your Startup" };
  const feedbackRequests: any[] = []; // Note: Update with proper Supabase data fetching
  
  // Calculate statistics
  const totalLikes = interactions.filter(i => i.has_liked).length;
  const totalCoins = interactions.reduce((sum, i) => sum + i.coin_allocation, 0);
  const avgCoins = totalLikes > 0 ? Math.round(totalCoins / totalLikes) : 0;

  // Function to send feedback request
  const handleSendFeedbackRequest = (swiperId: string, swiperName: string, feedbackType: string, date: string, time: string, message: string) => {
    // Note: Update with proper Supabase implementation
    console.log('Send feedback request:', { swiperId, swiperName, feedbackType, date, time, message });
  };

  const FeedbackRequestModal = ({ interaction }: { interaction: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState("meeting");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
      handleSendFeedbackRequest(
        interaction.swiper_id,
        'Swiper', // Note: Get actual swiper name from profile
        feedbackType,
        date,
        time,
        message
      );
      setIsOpen(false);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Send className="w-4 h-4 mr-1" />
            Request Meeting
          </Button>
        </DialogTrigger>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              disabled={!date || !time}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{'logo' in startup ? startup.logo || '🚀' : '🚀'}</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {startup.name}
              </h1>
              <p className="text-gray-600 text-lg">{'tagline' in startup ? startup.tagline : 'Your startup tagline'}</p>
            </div>
          </div>
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
              <div className="text-2xl font-bold text-blue-600">{totalLikes}</div>
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
              <div className="text-2xl font-bold text-purple-600">{avgCoins}</div>
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
              <div className="text-2xl font-bold text-pink-600">{interactions.filter(i => i.feedback_preference !== 'no').length}</div>
              <p className="text-xs text-gray-500">Available for meetings</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Swiper Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Swiper Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.filter(i => i.has_liked).map((interaction) => (
                  <div key={interaction.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <h4 className="font-semibold text-purple-800">Swiper {interaction.swiper_id.substring(0, 8)}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-100 text-green-800 border-0">
                            <Coins className="w-3 h-3 mr-1" />
                            {interaction.coin_allocation} coins invested
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 border-0">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {interaction.feedback_preference} feedback
                          </Badge>
                        </div>
                        {interaction.feedback_preference === "group" && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-0 mr-2">
                            <Users className="w-3 h-3 mr-1" />
                            Group sessions only
                          </Badge>
                        )}
                        {interaction.feedback_preference === "all" && (
                          <Badge className="bg-green-100 text-green-800 border-0">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Open to 1-on-1
                          </Badge>
                        )}
                      </div>
                      <FeedbackRequestModal interaction={interaction} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No interactions yet</p>
                <p className="text-sm">Swipers who like your startup will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};