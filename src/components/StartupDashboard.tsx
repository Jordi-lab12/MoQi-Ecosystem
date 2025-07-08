
import { useState } from "react";
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
  const { profile } = useSupabaseData();
  
  // Simplified for display purposes
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedSwiperId, setSelectedSwiperId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Mock data for demonstration
  const swipersWhoLiked: any[] = [];
  const swipersOpenToFeedback: any[] = [];
  const totalCoins = 0;
  const averageCoins = 0;

  const handleSendFeedbackRequest = () => {
    console.log('Sending feedback request...');
    setFeedbackDialogOpen(false);
  };

  if (!profile || profile.role !== 'startup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Startup Dashboard</h2>
          <p className="text-gray-600">Please log in as a startup to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{profile.logo || '🚀'}</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-gray-600 text-lg">{profile.tagline || 'Your startup tagline'}</p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">Startup Dashboard:</h3>
          <p className="text-yellow-700">Profile loaded successfully!</p>
          <p className="text-yellow-700">Role: {profile.role}</p>
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
                  <p className="text-gray-500">No real data yet - this will show swipers who invested in your startup</p>
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
                  <p className="text-gray-500">No real data yet - this will show swipers open to feedback</p>
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
