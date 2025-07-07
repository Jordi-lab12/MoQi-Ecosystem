import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MessageCircle, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";

interface FeedbackRequestsProps {
  onBack: () => void;
}

export const FeedbackRequests = ({ onBack }: FeedbackRequestsProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  
  // Note: This component needs to be updated with proper Supabase data fetching
  // For now, showing empty state

  const handleAcceptRequest = (requestId: string) => {
    // Note: Update with Supabase implementation
    console.log('Accept request:', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    // Note: Update with Supabase implementation
    console.log('Decline request:', requestId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-0"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 border-0"><XCircle className="w-3 h-3 mr-1" />Declined</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Feedback Requests
            </h1>
            <p className="text-gray-600">Manage your meeting requests from startups</p>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="shadow-lg border-purple-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-purple-800">{request.startupName}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(request.status)}
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {request.scheduledDate} at {request.scheduledTime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {request.message && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-700">
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        {request.message}
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Meeting
                      </Button>
                      <Button
                        onClick={() => handleDeclineRequest(request.id)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {request.status === 'accepted' && request.teamsLink && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 mb-3">
                        ✅ Meeting accepted! Join the call at the scheduled time:
                      </p>
                      <Button
                        onClick={() => window.open(request.teamsLink, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Teams Meeting
                      </Button>
                    </div>
                  )}

                  {request.status === 'declined' && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        ❌ You declined this meeting request.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Feedback Requests</h3>
              <p className="text-gray-500">
                When startups want to connect with you for feedback, their requests will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};