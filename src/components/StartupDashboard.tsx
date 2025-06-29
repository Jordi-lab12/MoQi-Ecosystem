import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Send,
  BarChart3,
  UserCheck
} from "lucide-react";
import { format } from "date-fns";

// Mock data for the startup
const mockVoterData = [
  { id: "1", name: "Emma Johnson", age: 22, gender: "Female", study: "Computer Science", moqiPoints: 25 },
  { id: "2", name: "Lucas Chen", age: 24, gender: "Male", study: "Business Administration", moqiPoints: 30 },
  { id: "3", name: "Sophie Mueller", age: 21, gender: "Female", study: "Design", moqiPoints: 15 },
  { id: "4", name: "Alex Thompson", age: 23, gender: "Male", study: "Engineering", moqiPoints: 40 },
  { id: "5", name: "Maria Rodriguez", age: 25, gender: "Female", study: "Marketing", moqiPoints: 35 },
  { id: "6", name: "David Kim", age: 22, gender: "Male", study: "Data Science", moqiPoints: 28 },
];

const genderData = [
  { name: "Female", value: 3, color: "#60BEBB" },
  { name: "Male", value: 3, color: "#D8CCEB" },
];

const ageData = [
  { age: "21-22", count: 3 },
  { age: "23-24", count: 2 },
  { age: "25+", count: 1 },
];

const pointsData = [
  { range: "10-20", count: 1 },
  { range: "21-30", count: 3 },
  { range: "31-40", count: 2 },
];

interface StartupDashboardProps {
  startupName?: string;
}

export const StartupDashboard = ({ startupName = "Your Startup" }: StartupDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVoters, setSelectedVoters] = useState<string[]>([]);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackDate, setFeedbackDate] = useState<Date>();
  const [feedbackTime, setFeedbackTime] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [studyFilter, setStudyFilter] = useState("all");

  const averagePoints = mockVoterData.reduce((sum, voter) => sum + voter.moqiPoints, 0) / mockVoterData.length;

  const filteredVoters = mockVoterData.filter(voter => {
    const ageMatch = ageFilter === "all" || 
      (ageFilter === "21-22" && voter.age >= 21 && voter.age <= 22) ||
      (ageFilter === "23-24" && voter.age >= 23 && voter.age <= 24) ||
      (ageFilter === "25+" && voter.age >= 25);
    
    const genderMatch = genderFilter === "all" || voter.gender === genderFilter;
    const studyMatch = studyFilter === "all" || voter.study === studyFilter;
    
    return ageMatch && genderMatch && studyMatch;
  });

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

  const handleSendFeedbackRequest = () => {
    if (selectedVoters.length === 0 || !feedbackType || !feedbackDate || !feedbackTime) {
      alert("Please fill in all required fields and select at least one voter.");
      return;
    }
    
    // Here you would typically send the feedback request to your backend
    alert(`Feedback request sent to ${selectedVoters.length} voters for ${feedbackType} on ${format(feedbackDate, "PPP")} at ${feedbackTime}`);
    
    // Reset form
    setSelectedVoters([]);
    setFeedbackType("");
    setFeedbackDate(undefined);
    setFeedbackTime("");
    setFeedbackDescription("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{startupName} Dashboard</h1>
          <p className="text-gray-600">Manage your startup's feedback and analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{mockVoterData.length}</div>
              <p className="text-xs text-gray-500">People who swiped right</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. MoQi Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{averagePoints.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Points per voter</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">78%</div>
              <p className="text-xs text-gray-500">Of total viewers</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Request Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <Card className="lg:col-span-2">
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
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Voters
                  </CardTitle>
                  <CardDescription>Filter the list of voters to find specific groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Age</label>
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
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
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
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Study</label>
                      <Select value={studyFilter} onValueChange={setStudyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All studies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All studies</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voter List */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Select Voters ({filteredVoters.length})
                      </CardTitle>
                      <CardDescription>Choose who you want to request feedback from</CardDescription>
                    </div>
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
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
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

              {/* Feedback Request Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Request Details</CardTitle>
                  <CardDescription>Set up your feedback session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Feedback Type</label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="1-to-1">1-to-1 Meeting</SelectItem>
                        <SelectItem value="group">Group Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={feedbackDate}
                            onSelect={setFeedbackDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Time</label>
                      <Input
                        type="time"
                        value={feedbackTime}
                        onChange={(e) => setFeedbackTime(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Description/Theme</label>
                    <Textarea
                      placeholder="Describe what you'd like to discuss or the theme of the feedback session..."
                      value={feedbackDescription}
                      onChange={(e) => setFeedbackDescription(e.target.value)}
                      className="border-gray-300"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSendFeedbackRequest}
                    className="w-full bg-[#60BEBB] hover:bg-[#4a9a96] text-white"
                    disabled={selectedVoters.length === 0 || !feedbackType || !feedbackDate || !feedbackTime}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback Request to {selectedVoters.length} {selectedVoters.length === 1 ? 'Person' : 'People'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
