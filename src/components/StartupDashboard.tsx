import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, TrendingUp, MessageCircle, Calendar, Eye, Heart, Coins, Send, Clock, User } from "lucide-react";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { StartupAnalytics } from "./StartupAnalytics";
import { StartupImageUpload } from "./StartupImageUpload";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StartupDashboardProps {
  startupName?: string;
}

interface SwiperInteractionWithProfile {
  id: string;
  swiper_id: string;
  startup_id: string;
  has_liked: boolean;
  coin_allocation: number;
  feedback_preference: string;
  created_at: string;
  swiper_name: string;
  swiper_age?: string;
  swiper_study?: string;
  swiper_gender?: string;
}

export const StartupDashboard = ({ startupName }: StartupDashboardProps) => {
  const { profile } = useSupabaseData();
  const { toast } = useToast();
  const [swipersWhoLiked, setSwipersWhoLiked] = useState<SwiperInteractionWithProfile[]>([]);
  const [swipersOpenToFeedback, setSwipersOpenToFeedback] = useState<SwiperInteractionWithProfile[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [averageCoins, setAverageCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedSwiperId, setSelectedSwiperId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [feedbackSessionType, setFeedbackSessionType] = useState<'individual' | 'group'>('individual');
  const [teamsLink, setTeamsLink] = useState("");

  useEffect(() => {
    const loadSwiperData = async () => {
      if (!profile || profile.role !== 'startup') return;

      try {
        setLoading(true);
        
        console.log('Loading swiper data for startup:', profile.id, profile.name);
        
        // First get all interactions for this startup
        const { data: interactions, error: interactionsError } = await supabase
          .from('swiper_interactions')
          .select('*')
          .eq('startup_id', profile.id)
          .eq('has_liked', true);

        if (interactionsError) {
          console.error('Error fetching interactions:', interactionsError);
          throw interactionsError;
        }

        console.log('Found interactions:', interactions?.length || 0);

        if (!interactions || interactions.length === 0) {
          setSwipersWhoLiked([]);
          setSwipersOpenToFeedback([]);
          setTotalCoins(0);
          setAverageCoins(0);
          return;
        }

        // Get all swiper profile data separately for better reliability
        const swiperIds = interactions.map(i => i.swiper_id);
        const { data: swiperProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, age, study, gender')
          .in('id', swiperIds);

        if (profilesError) {
          console.error('Error fetching swiper profiles:', profilesError);
          throw profilesError;
        }

        console.log('Found swiper profiles:', swiperProfiles?.length || 0);

        // Combine interaction data with profile data
        const interactionsWithSwipers: SwiperInteractionWithProfile[] = interactions.map(interaction => {
          const swiperProfile = swiperProfiles?.find(p => p.id === interaction.swiper_id);
          return {
            ...interaction,
            swiper_name: swiperProfile?.name || 'Unknown Swiper',
            swiper_age: swiperProfile?.age,
            swiper_study: swiperProfile?.study,
            swiper_gender: swiperProfile?.gender
          };
        });

        console.log('Combined interactions with profiles:', interactionsWithSwipers);

        // Show all interactions that were liked, regardless of coin allocation
        setSwipersWhoLiked(interactionsWithSwipers);
        console.log('All liked interactions:', interactionsWithSwipers.length);

        // Filter those who gave coins (actual investors with coins)
        const investors = interactionsWithSwipers.filter(interaction => interaction.coin_allocation > 0);
        console.log('Investors with coins:', investors.length);

        // Filter those open to feedback (not 'no' preference)
        const openToFeedback = interactionsWithSwipers.filter(interaction => 
          interaction.feedback_preference !== 'no'
        );
        setSwipersOpenToFeedback(openToFeedback);
        console.log('Open to feedback:', openToFeedback.length);

        // Calculate statistics - sum of all coins allocated to this startup
        const total = interactionsWithSwipers.reduce((sum, interaction) => sum + interaction.coin_allocation, 0);
        const coinsInvestors = interactionsWithSwipers.filter(i => i.coin_allocation > 0);
        setTotalCoins(total);
        setAverageCoins(coinsInvestors.length > 0 ? Math.round(total / coinsInvestors.length) : 0);
        console.log('Total coins:', total, 'Average:', coinsInvestors.length > 0 ? Math.round(total / coinsInvestors.length) : 0);

      } catch (error) {
        console.error('Error loading swiper data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSwiperData();

    // Set up real-time subscription for swiper interactions
    if (profile?.role === 'startup') {
      console.log('Setting up real-time subscription for startup:', profile.id);
      const channel = supabase
        .channel('startup-interactions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'swiper_interactions',
            filter: `startup_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            // Reload data when interactions change
            loadSwiperData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const handleSendFeedbackRequest = async () => {
    if (!profile || !selectedSwiperId || !scheduledDate || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if the selected swiper's feedback preference matches the session type
    const selectedSwiper = swipersOpenToFeedback.find(s => s.swiper_id === selectedSwiperId);
    if (selectedSwiper) {
      if (feedbackSessionType === 'group' && selectedSwiper.feedback_preference !== 'all') {
        toast({
          title: "Invalid Session Type",
          description: "This swiper only accepts individual feedback sessions",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('feedback_requests')
        .insert({
          startup_id: profile.id,
          swiper_id: selectedSwiperId,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          message: feedbackMessage,
          teams_link: teamsLink,
          feedback_session_type: feedbackSessionType,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback request sent successfully!",
        variant: "default"
      });

      // Reset form
      setSelectedSwiperId("");
      setFeedbackMessage("");
      setScheduledDate("");
      setScheduledTime("");
      setTeamsLink("");
      setFeedbackSessionType('individual');
      setFeedbackDialogOpen(false);
    } catch (error) {
      console.error('Error sending feedback request:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback request",
        variant: "destructive"
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
               <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                 <Eye className="w-4 h-4" />
                 Total Likes
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-blue-600">{swipersWhoLiked.length}</div>
               <p className="text-xs text-gray-500">Swipers who liked you</p>
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

        {/* Analytics Dashboard */}
        <StartupAnalytics interactions={swipersWhoLiked} />

        {/* Profile Image Upload */}
        <StartupImageUpload 
          currentImage={profile.image || undefined}
          onImageUpdate={(url) => {
            // Update profile state would go here
            window.location.reload(); // Simple refresh for now
          }}
        />

        {/* Detailed Swiper Data */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Heart className="w-5 h-5 text-red-500" />
                 Swipers Who Liked You
               </CardTitle>
            </CardHeader>
            <CardContent>
              {swipersWhoLiked.length > 0 ? (
                <div className="space-y-4">
                  {swipersWhoLiked.map((interaction) => (
                    <div key={interaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {interaction.swiper_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{interaction.swiper_name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500">
                            {interaction.swiper_age && <span>Age: {interaction.swiper_age}</span>}
                            {interaction.swiper_study && <span>• {interaction.swiper_study}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                          <Coins className="w-4 h-4" />
                          {interaction.coin_allocation}
                        </div>
                        <Badge className="text-xs mt-1" variant="outline">
                          {interaction.feedback_preference}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                   <p>No likes yet</p>
                   <p className="text-sm">Swipers who like your startup will appear here</p>
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
                  {swipersOpenToFeedback.map((interaction) => (
                    <div key={interaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {interaction.swiper_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{interaction.swiper_name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500">
                            {interaction.swiper_age && <span>Age: {interaction.swiper_age}</span>}
                            {interaction.swiper_study && <span>• {interaction.swiper_study}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {interaction.feedback_preference === 'all' ? 'All Feedback' : 
                               interaction.feedback_preference === 'individual' ? '1-on-1 Only' : 
                               interaction.feedback_preference === 'group' ? 'Group Only' : 'No Preference'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                       <Button
                         onClick={() => {
                           setSelectedSwiperId(interaction.swiper_id);
                           setFeedbackDialogOpen(true);
                           // Set appropriate session type based on swiper's preference
                           if (interaction.feedback_preference === 'individual') {
                             setFeedbackSessionType('individual');
                           }
                         }}
                         size="sm"
                         className="bg-blue-500 hover:bg-blue-600"
                       >
                         <Calendar className="w-4 h-4 mr-1" />
                         Request Meeting
                       </Button>
                    </div>
                  ))}
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
                <Label>Feedback Session Type</Label>
                <RadioGroup 
                  value={feedbackSessionType} 
                  onValueChange={(value) => setFeedbackSessionType(value as 'individual' | 'group')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="text-sm">
                      1-on-1 Session (Individual feedback)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="text-sm">
                      Group Session (Multiple swipers)
                    </Label>
                  </div>
                </RadioGroup>
                {feedbackSessionType === 'group' && (
                  <p className="text-xs text-orange-600 mt-1">
                    Note: Only swipers who accept "all" feedback types can join group sessions
                  </p>
                )}
              </div>
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
              <TimeSlotPicker
                selectedDate={scheduledDate}
                selectedTime={scheduledTime}
                onTimeChange={setScheduledTime}
              />
              <div>
                <Label htmlFor="teamsLink">Teams Meeting Link (Optional)</Label>
                <Input
                  id="teamsLink"
                  type="url"
                  value={teamsLink}
                  onChange={(e) => setTeamsLink(e.target.value)}
                  placeholder="https://teams.microsoft.com/..."
                  className="mt-1"
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
