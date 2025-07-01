import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Calendar as CalendarIcon,
  ArrowLeft,
  BarChart3,
  UserCheck,
  ArrowRight,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { useAppData } from "@/contexts/AppDataContext";

interface StartupDashboardProps {
  startupName?: string;
}

export const StartupDashboard = ({ startupName = "Your Startup" }: StartupDashboardProps) => {
  const { 
    currentStartupId, 
    getSwiperInteractionsForStartup, 
    swiperProfiles,
    createFeedbackRequest 
  } = useAppData();

  const [currentView, setCurrentView] = useState<"main" | "analytics" | "feedback-select" | "feedback-type" | "feedback-schedule">("main");
  const [selectedVoters, setSelectedVoters] = useState<string[]>([]);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackDate, setFeedbackDate] = useState<Date>();
  const [feedbackTime, setFeedbackTime] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  
  // Analytics filters
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [studyFilter, setStudyFilter] = useState("all");
  const [pointsFilter, setPointsFilter] = useState("all");

  // Get real voter data
  const getVoterData = () => {
    if (!currentStartupId) {
      // Mock data for demonstration
      return [
        { id: "1", name: "Emma Johnson", age: 22, gender: "Female", study: "Computer Science", moqiPoints: 25 },
        { id: "2", name: "Lucas Chen", age: 24, gender: "Male", study: "Business Administration", moqiPoints: 30 },
        { id: "3", name: "Sophie Mueller", age: 21, gender: "Female", study: "Design", moqiPoints: 15 },
        { id: "4", name: "Alex Thompson", age: 23, gender: "Male", study: "Engineering", moqiPoints: 40 },
        { id: "5", name: "Maria Rodriguez", age: 25, gender: "Female", study: "Marketing", moqiPoints: 35 },
      ];
    }

    const interactions = getSwiperInteractionsForStartup(currentStartupId);
    return interactions.map(interaction => {
      const profile = swiperProfiles.find(p => p.id === interaction.swiperId);
      return {
        id: interaction.swiperId,
        name: profile?.name || "Unknown",
        age: parseInt(profile?.age || "0"),
        gender: profile?.gender || "Unknown",
        study: profile?.study || "Unknown",
        moqiPoints: interaction.coinAllocation,
        feedbackPreference: interaction.feedbackPreference
      };
    }).filter(voter => voter.moqiPoints > 0 || voter.feedbackPreference !== "no");
  };

  const voterData = getVoterData();

  const filteredVoters = voterData.filter(voter => {
    const ageMatch = ageFilter === "all" || 
      (ageFilter === "21-22" && voter.age >= 21 && voter.age <= 22) ||
      (ageFilter === "23-24" && voter.age >= 23 && voter.age <= 24) ||
      (ageFilter === "25+" && voter.age >= 25);
    
    const genderMatch = genderFilter === "all" || voter.gender === genderFilter;
    const studyMatch = studyFilter === "all" || voter.study === studyFilter;
    const pointsMatch = pointsFilter === "all" ||
      (pointsFilter === "0-20" && voter.moqiPoints <= 20) ||
      (pointsFilter === "21-30" && voter.moqiPoints >= 21 && voter.moqiPoints <= 30) ||
      (pointsFilter === "31+" && voter.moqiPoints >= 31);
    
    return ageMatch && genderMatch && studyMatch && pointsMatch;
  });

  const averagePoints = filteredVoters.length > 0 ? 
    filteredVoters.reduce((sum, voter) => sum + voter.moqiPoints, 0) / filteredVoters.length : 0;

  const genderData = [
    { name: "Female", value: filteredVoters.filter(v => v.gender === "Female").length, color: "#60BEBB" },
    { name: "Male", value: filteredVoters.filter(v => v.gender === "Male").length, color: "#D8CCEB" },
  ];

  const ageData = [
    { age: "21-22", count: filteredVoters.filter(v => v.age >= 21 && v.age <= 22).length },
    { age: "23-24", count: filteredVoters.filter(v => v.age >= 23 && v.age <= 24).length },
    { age: "25+", count: filteredVoters.filter(v => v.age >= 25).length },
  ];

  const pointsData = [
    { range: "0-20", count: filteredVoters.filter(v => v.moqiPoints <= 20).length },
    { range: "21-30", count: filteredVoters.filter(v => v.moqiPoints >= 21 && v.moqiPoints <= 30).length },
    { range: "31+", count: filteredVoters.filter(v => v.moqiPoints >= 31).length },
  ];

  const handleVoterSelect = (voterId: string, checked: boolean) => {
    if (checked) {
      setSelectedVoters([...selectedVoters, voterId]);
    } else {
      setSelectedVoters(selectedVoters.filter(id => id !== voterId));
    }
  };

  const handleSelectAll = () => {
    if (selectedVoters.length === filteredVoters.length) {
      setSelectedVoters([]);
    } else {
      setSelectedVoters(filteredVoters.map(voter => voter.id));
    }
  };

  const clearFilters = () => {
    setAgeFilter("all");
    setGenderFilter("all");
    setStudyFilter("all");
    setPointsFilter("all");
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const handleSendFeedbackRequest = () => {
    if (selectedVoters.length === 0 || !feedbackType || !feedbackDate || !feedbackTime || !currentStartupId) {
      alert("Please fill in all required fields and select at least one voter.");
      return;
    }
    
    selectedVoters.forEach(voterId => {
      createFeedbackRequest({
        startupId: currentStartupId,
        startupName: startupName,
        swiperId: voterId,
        feedbackType: feedbackType,
        scheduledDate: format(feedbackDate, "yyyy-MM-dd"),
        scheduledTime: feedbackTime,
        message: feedbackDescription,
        status: 'pending'
      });
    });
    
    alert(`Feedback request sent to ${selectedVoters.length} voters for ${feedbackType} on ${format(feedbackDate, "PPP")} at ${feedbackTime}`);
    
    // Reset form and go back to main
    setSelectedVoters([]);
    setFeedbackType("");
    setFeedbackDate(undefined);
    setFeedbackTime("");
    setFeedbackDescription("");
    setCurrentView("main");
  };

  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">{startupName}</h1>
            <p className="text-gray-600 text-lg">Welcome to your startup dashboard</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
                <Users className="h-4 w-4 text-[#60BEBB]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">{voterData.length}</div>
                <p className="text-xs text-gray-500">People who swiped right</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. MoQi Points</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#60BEBB]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">{averagePoints.toFixed(1)}</div>
                <p className="text-xs text-gray-500">Points per voter</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-[#60BEBB]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">78%</div>
                <p className="text-xs text-gray-500">Of total viewers</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-[#60BEBB] hover:shadow-xl transition-all cursor-pointer group" onClick={() => setCurrentView("analytics")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-[#60BEBB] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-[#1E1E1E]">Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  View detailed statistics about your voters and their demographics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="bg-[#60BEBB] hover:bg-[#4a9a96] text-white w-full">
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#D8CCEB] hover:shadow-xl transition-all cursor-pointer group" onClick={() => setCurrentView("feedback-select")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-[#D8CCEB] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-[#1E1E1E]" />
                </div>
                <CardTitle className="text-2xl text-[#1E1E1E]">Request Feedback</CardTitle>
                <CardDescription className="text-gray-600">
                  Connect with your voters for surveys, 1-to-1s, or group calls
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="bg-[#D8CCEB] hover:bg-[#c5b8e0] text-[#1E1E1E] w-full">
                  Request Feedback
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "analytics") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentView("main")}
              className="mr-4 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Detailed insights about your voters</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Quick Filters
                </CardTitle>
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Age</label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "21-22", "23-24", "25+"].map(age => (
                      <Button
                        key={age}
                        variant={ageFilter === age ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAgeFilter(age)}
                        className={ageFilter === age ? "bg-[#60BEBB] hover:bg-[#4a9a96]" : ""}
                      >
                        {age === "all" ? "All" : age}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "Female", "Male"].map(gender => (
                      <Button
                        key={gender}
                        variant={genderFilter === gender ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGenderFilter(gender)}
                        className={genderFilter === gender ? "bg-[#60BEBB] hover:bg-[#4a9a96]" : ""}
                      >
                        {gender === "all" ? "All" : gender}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">MoQi Points</label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "0-20", "21-30", "31+"].map(points => (
                      <Button
                        key={points}
                        variant={pointsFilter === points ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPointsFilter(points)}
                        className={pointsFilter === points ? "bg-[#60BEBB] hover:bg-[#4a9a96]" : ""}
                      >
                        {points === "all" ? "All" : points}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Results</label>
                  <div className="text-lg font-semibold text-[#1E1E1E]">
                    {filteredVoters.length} voters
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg: {filteredVoters.length > 0 ? averagePoints.toFixed(1) : 0} pts
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60BEBB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>MoQi Points Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D8CCEB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "feedback-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentView("main")}
              className="mr-4 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">Select Voters</h1>
              <p className="text-gray-600">Choose who you want to request feedback from</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Voters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ages</SelectItem>
                    <SelectItem value="21-22">21-22 years</SelectItem>
                    <SelectItem value="23-24">23-24 years</SelectItem>
                    <SelectItem value="25+">25+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={pointsFilter} onValueChange={setPointsFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All points" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All points</SelectItem>
                    <SelectItem value="0-20">0-20 points</SelectItem>
                    <SelectItem value="21-30">21-30 points</SelectItem>
                    <SelectItem value="31+">31+ points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredVoters.length} of {voterData.length} voters
                </span>
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voter List */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Select Voters ({selectedVoters.length} selected)
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="border-gray-300"
                >
                  {selectedVoters.length === filteredVoters.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredVoters.map(voter => (
                  <div key={voter.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Checkbox
                      checked={selectedVoters.includes(voter.id)}
                      onCheckedChange={(checked) => handleVoterSelect(voter.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{voter.name}</span>
                        <Badge variant="secondary" className="bg-[#60BEBB] text-white">
                          {voter.moqiPoints} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {voter.age} years • {voter.gender} • {voter.study}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentView("feedback-type")}
              disabled={selectedVoters.length === 0}
              className="bg-[#60BEBB] hover:bg-[#4a9a96] text-white"
            >
              Next: Select Feedback Type
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "feedback-type") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentView("feedback-select")}
              className="mr-4 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">Choose Feedback Type</h1>
              <p className="text-gray-600">Select how you want to collect feedback from {selectedVoters.length} voters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              className={`cursor-pointer transition-all border-2 ${feedbackType === "survey" ? "border-[#60BEBB] bg-[#60BEBB]/5" : "border-gray-200 hover:border-[#60BEBB]/50"}`}
              onClick={() => setFeedbackType("survey")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#60BEBB] rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Survey</CardTitle>
                <CardDescription>
                  Send a digital survey to collect structured feedback
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 ${feedbackType === "1-to-1" ? "border-[#D8CCEB] bg-[#D8CCEB]/5" : "border-gray-200 hover:border-[#D8CCEB]/50"}`}
              onClick={() => setFeedbackType("1-to-1")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#D8CCEB] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-[#1E1E1E]" />
                </div>
                <CardTitle className="text-xl">1-to-1 Meeting</CardTitle>
                <CardDescription>
                  Schedule individual meetings for detailed discussions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 ${feedbackType === "group" ? "border-[#60BEBB] bg-[#60BEBB]/5" : "border-gray-200 hover:border-[#60BEBB]/50"}`}
              onClick={() => setFeedbackType("group")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#60BEBB] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Group Call</CardTitle>
                <CardDescription>
                  Host a group session with multiple participants
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentView("feedback-schedule")}
              disabled={!feedbackType}
              className="bg-[#60BEBB] hover:bg-[#4a9a96] text-white"
            >
              Next: Schedule Session
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "feedback-schedule") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentView("feedback-type")}
              className="mr-4 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">Schedule {feedbackType}</h1>
              <p className="text-gray-600">Set up your feedback session with {selectedVoters.length} voters</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {feedbackDate ? format(feedbackDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={feedbackDate}
                        onSelect={setFeedbackDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time</label>
                  <Select value={feedbackTime} onValueChange={setFeedbackTime}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Session Description/Theme</label>
                <Textarea
                  placeholder="Describe what you'd like to discuss or the theme of the feedback session..."
                  value={feedbackDescription}
                  onChange={(e) => setFeedbackDescription(e.target.value)}
                  className="border-gray-300"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1E1E1E] mb-2">Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Type:</strong> {feedbackType}</p>
                  <p><strong>Participants:</strong> {selectedVoters.length} voters</p>
                  <p><strong>Date:</strong> {feedbackDate ? format(feedbackDate, "PPP") : "Not selected"}</p>
                  <p><strong>Time:</strong> {feedbackTime || "Not selected"}</p>
                </div>
              </div>

              <Button
                onClick={handleSendFeedbackRequest}
                className="w-full bg-[#60BEBB] hover:bg-[#4a9a96] text-white"
                disabled={!feedbackDate || !feedbackTime}
              >
                Send Feedback Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};
