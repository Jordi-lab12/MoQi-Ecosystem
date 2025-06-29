
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  BarChart3,
  UserCheck,
  Star,
  Filter,
  CheckCircle
} from "lucide-react";

interface StartupDashboardProps {
  startupData: {
    name: string;
    tagline: string;
    totalVotes: number;
    averagePoints: number;
    genderDistribution: { male: number; female: number; other: number };
    ageDistribution: { "18-25": number; "26-35": number; "36-45": number; "45+": number };
  };
}

export const StartupDashboard = ({ startupData }: StartupDashboardProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<any[]>([]);

  const handleRequestFeedback = () => {
    // Mock function - in real app would send notifications
    const newRequest = {
      id: Date.now(),
      type: selectedFilters.includes('group') ? 'Group Chat' : '1-to-1',
      targetUsers: Math.floor(Math.random() * 10) + 1,
      status: 'pending'
    };
    setFeedbackRequests([...feedbackRequests, newRequest]);
    alert(`Feedback request sent to ${newRequest.targetUsers} users!`);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-white via-[#D8CCEB]/20 to-[#60BEBB]/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">{startupData.name}</h1>
          <p className="text-[#1E1E1E]/70 text-lg">{startupData.tagline}</p>
        </div>

        {/* Statistics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#1E1E1E]/70 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#60BEBB]">{startupData.totalVotes}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#1E1E1E]/70 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Avg MoQi Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#D8CCEB]">{startupData.averagePoints}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#1E1E1E]/70 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#60BEBB]">
                {Math.round((startupData.averagePoints / 100) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#1E1E1E]/70 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Feedback Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#D8CCEB]">{feedbackRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E] flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#1E1E1E]/70">Male</span>
                <Badge className="bg-[#60BEBB]/20 text-[#60BEBB] hover:bg-[#60BEBB]/30">
                  {startupData.genderDistribution.male}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1E1E1E]/70">Female</span>
                <Badge className="bg-[#D8CCEB]/20 text-[#D8CCEB] hover:bg-[#D8CCEB]/30">
                  {startupData.genderDistribution.female}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1E1E1E]/70">Other</span>
                <Badge className="bg-[#1E1E1E]/20 text-[#1E1E1E] hover:bg-[#1E1E1E]/30">
                  {startupData.genderDistribution.other}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(startupData.ageDistribution).map(([range, percentage]) => (
                <div key={range} className="flex justify-between items-center">
                  <span className="text-[#1E1E1E]/70">{range}</span>
                  <Badge className="bg-[#60BEBB]/20 text-[#60BEBB] hover:bg-[#60BEBB]/30">
                    {percentage}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Request Section */}
        <Card className="bg-white border-[#60BEBB]/30 mb-8">
          <CardHeader>
            <CardTitle className="text-[#1E1E1E] flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Request Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-[#1E1E1E]/70 mb-3">Filter target audience:</p>
              <div className="flex flex-wrap gap-2">
                {['18-25', '26-35', 'male', 'female', 'computer-science', 'business', 'group', '1-to-1'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(filter)}
                    className={selectedFilters.includes(filter) 
                      ? "bg-[#60BEBB] hover:bg-[#60BEBB]/90 text-white" 
                      : "border-[#60BEBB]/30 text-[#1E1E1E] hover:bg-[#60BEBB]/10"
                    }
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="bg-[#60BEBB]/20" />
            
            <Button 
              onClick={handleRequestFeedback}
              className="bg-gradient-to-r from-[#60BEBB] to-[#D8CCEB] hover:from-[#60BEBB]/90 hover:to-[#D8CCEB]/90 text-white"
              disabled={selectedFilters.length === 0}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Send Feedback Request
            </Button>
          </CardContent>
        </Card>

        {/* Active Feedback Requests */}
        {feedbackRequests.length > 0 && (
          <Card className="bg-white border-[#60BEBB]/30">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E] flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Recent Feedback Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedbackRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-3 bg-[#60BEBB]/5 rounded-lg">
                    <div>
                      <p className="font-medium text-[#1E1E1E]">{request.type}</p>
                      <p className="text-sm text-[#1E1E1E]/70">{request.targetUsers} users targeted</p>
                    </div>
                    <Badge className="bg-[#D8CCEB]/20 text-[#D8CCEB]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
