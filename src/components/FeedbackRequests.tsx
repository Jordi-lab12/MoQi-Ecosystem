
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, Users, Video, Phone, MapPin, Check, X } from "lucide-react";
import { format } from "date-fns";

interface FeedbackRequest {
  id: string;
  startupName: string;
  startupLogo: string;
  feedbackType: "Survey" | "1-to-1" | "Group call";
  description: string;
  date: Date;
  time: string;
  duration: string;
  location?: string;
  status: "pending" | "accepted" | "declined";
}

// Mock feedback requests data
const mockRequests: FeedbackRequest[] = [
  {
    id: "1",
    startupName: "EcoFlow",
    startupLogo: "🌱",
    feedbackType: "1-to-1",
    description: "We'd love to get your thoughts on our solar panel efficiency improvements",
    date: new Date(2025, 6, 8), // July 8, 2025
    time: "14:00",
    duration: "30 min",
    status: "pending",
  },
  {
    id: "2",
    startupName: "HealthMind",
    startupLogo: "🧠",
    feedbackType: "Group call",
    description: "Join our focus group to discuss mental wellness app features",
    date: new Date(2025, 6, 10), // July 10, 2025
    time: "16:30",
    duration: "45 min",
    location: "Video Call",
    status: "pending",
  },
  {
    id: "3",
    startupName: "FoodieBot",
    startupLogo: "🤖",
    feedbackType: "Survey",
    description: "Quick survey about your cooking preferences and habits",
    date: new Date(2025, 6, 12), // July 12, 2025
    time: "10:00",
    duration: "15 min",
    status: "accepted",
  },
];

export const FeedbackRequests = () => {
  const [requests, setRequests] = useState<FeedbackRequest[]>(mockRequests);
  const [isOpen, setIsOpen] = useState(false);

  const pendingRequests = requests.filter(req => req.status === "pending");
  const acceptedRequests = requests.filter(req => req.status === "accepted");

  const handleResponse = (requestId: string, response: "accepted" | "declined") => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: response } : req
      )
    );
  };

  const getTypeIcon = (type: FeedbackRequest['feedbackType']) => {
    switch (type) {
      case '1-to-1': return <Video className="w-4 h-4" />;
      case 'Group call': return <Users className="w-4 h-4" />;
      case 'Survey': return <Phone className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: FeedbackRequest['feedbackType']) => {
    switch (type) {
      case '1-to-1': return 'bg-blue-100 text-blue-800';
      case 'Group call': return 'bg-green-100 text-green-800';
      case 'Survey': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto relative"
        >
          <Bell className="w-8 h-8" />
          Feedback Requests
          {pendingRequests.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-6 h-6 flex items-center justify-center rounded-full">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Feedback Requests
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-800">
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{request.startupLogo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-purple-800">{request.startupName}</h4>
                            <Badge className={`${getTypeColor(request.feedbackType)} border-0 text-xs flex items-center gap-1`}>
                              {getTypeIcon(request.feedbackType)}
                              {request.feedbackType}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{request.description}</p>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(request.date, 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {request.time} ({request.duration})
                            </div>
                            {request.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {request.location}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleResponse(request.id, "accepted")}
                              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleResponse(request.id, "declined")}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Requests */}
          {acceptedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                Accepted Requests ({acceptedRequests.length})
              </h3>
              <div className="space-y-3">
                {acceptedRequests.map((request) => (
                  <Card key={request.id} className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{request.startupLogo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-green-800">{request.startupName}</h4>
                            <Badge className={`${getTypeColor(request.feedbackType)} border-0 text-xs flex items-center gap-1`}>
                              {getTypeIcon(request.feedbackType)}
                              {request.feedbackType}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                              Accepted
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{request.description}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(request.date, 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {request.time} ({request.duration})
                            </div>
                            {request.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {request.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          )}

          {/* Empty State */}
          {pendingRequests.length === 0 && acceptedRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No feedback requests at the moment</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
