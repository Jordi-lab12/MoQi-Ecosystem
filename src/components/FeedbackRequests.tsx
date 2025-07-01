
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MessageCircle, CheckCircle, X } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";

interface FeedbackRequestsProps {
  onBack: () => void;
}

export const FeedbackRequests = ({ onBack }: FeedbackRequestsProps) => {
  const { 
    currentSwiperId, 
    getFeedbackRequestsForSwiper, 
    updateFeedbackRequest 
  } = useAppData();

  const [requests, setRequests] = useState(() => {
    if (currentSwiperId) {
      return getFeedbackRequestsForSwiper(currentSwiperId);
    }
    // Mock data for demonstration
    return [
      {
        id: '1',
        startupId: '1',
        swiperId: 'demo',
        startupName: 'TechFlow AI',
        feedbackType: 'Product Feedback',
        scheduledDate: '2024-01-15',
        scheduledTime: '14:30',
        message: 'We would love to get your feedback on our new AI-powered workflow automation tool.',
        status: 'pending' as const
      },
      {
        id: '2',
        startupId: '2',
        swiperId: 'demo',
        startupName: 'GreenEnergy Solutions',
        feedbackType: 'Business Model Feedback',
        scheduledDate: '2024-01-18',
        scheduledTime: '10:00',
        message: 'Looking for insights on our renewable energy marketplace business model.',
        status: 'pending' as const
      },
      {
        id: '3',
        startupId: '3',
        swiperId: 'demo',
        startupName: 'HealthTech Innovations',
        feedbackType: 'Market Research',
        scheduledDate: '2024-01-12',
        scheduledTime: '16:00',
        status: 'accepted' as const,
        teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3Ameeting_example'
      }
    ];
  });

  const handleAccept = (requestId: string) => {
    const teamsLink = `https://teams.microsoft.com/l/meetup-join/19%3Ameeting_${requestId}`;
    
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const, teamsLink } : req
    ));
    
    if (currentSwiperId) {
      updateFeedbackRequest(requestId, { 
        status: 'accepted', 
        teamsLink 
      });
    }
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'declined' as const } : req
    ));
    
    if (currentSwiperId) {
      updateFeedbackRequest(requestId, { status: 'declined' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'declined':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const respondedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700"
          >
            ← Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Feedback Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Review and respond to feedback requests from startups
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="bg-white/80 backdrop-blur-sm border-purple-200 hover:border-purple-300 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-600" />
                          {request.startupName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Requesting: {request.feedbackType}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Scheduling Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.scheduledDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.scheduledTime}
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{request.message}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleAccept(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleDecline(request.id)}
                          variant="outline"
                          className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Responded Requests */}
        {respondedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Previous Responses ({respondedRequests.length})
            </h2>
            <div className="space-y-4">
              {respondedRequests.map((request) => (
                <Card key={request.id} className="bg-white/60 backdrop-blur-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {request.startupName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {request.feedbackType}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(request.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {request.scheduledTime}
                      </div>
                    </div>
                    {request.teamsLink && request.status === 'accepted' && (
                      <div className="mt-2">
                        <Button
                          onClick={() => window.open(request.teamsLink, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                        >
                          Join Teams Meeting
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200 text-center py-12">
            <CardContent>
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Feedback Requests</h3>
              <p className="text-gray-500">
                You haven't received any feedback requests yet. Keep swiping to discover more startups!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
