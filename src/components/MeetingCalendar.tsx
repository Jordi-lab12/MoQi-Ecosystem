
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, X } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface Meeting {
  id: string;
  startupName: string;
  startupLogo: string;
  date: Date;
  time: string;
  duration: string;
  type: "Video Call" | "In Person" | "Phone Call";
  location?: string;
}

// Mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    startupName: "EcoFlow",
    startupLogo: "🌱",
    date: new Date(2025, 5, 30), // June 30, 2025
    time: "14:00",
    duration: "30 min",
    type: "Video Call",
  },
  {
    id: "2",
    startupName: "HealthMind",
    startupLogo: "🧠",
    date: new Date(2025, 6, 2), // July 2, 2025
    time: "10:30",
    duration: "45 min",
    type: "In Person",
    location: "Startup Hub, Berlin",
  },
  {
    id: "3",
    startupName: "FoodieBot",
    startupLogo: "🤖",
    date: new Date(2025, 6, 5), // July 5, 2025
    time: "16:00",
    duration: "30 min",
    type: "Video Call",
  },
];

export const MeetingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const getMeetingsForDate = (date: Date) => {
    return mockMeetings.filter(meeting => isSameDay(meeting.date, date));
  };

  const getDatesWithMeetings = () => {
    return mockMeetings.map(meeting => meeting.date);
  };

  const selectedDateMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const getTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'Video Call': return 'bg-blue-100 text-blue-800';
      case 'In Person': return 'bg-green-100 text-green-800';
      case 'Phone Call': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="px-6 py-3 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-semibold rounded-xl transition-all duration-300 flex items-center gap-3"
        >
          <CalendarIcon className="w-5 h-5" />
          My Meetings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Meeting Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Calendar */}
          <div>
            <Card className="border-2 border-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border p-3 pointer-events-auto"
                  modifiers={{
                    hasMeeting: getDatesWithMeetings()
                  }}
                  modifiersStyles={{
                    hasMeeting: {
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <div className="mt-3 text-xs text-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-200 rounded"></div>
                  Days with meetings
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings for selected date */}
          <div>
            <Card className="border-2 border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateMeetings.map((meeting) => (
                      <div key={meeting.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{meeting.startupLogo}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-purple-800 mb-1">{meeting.startupName}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                {meeting.time} ({meeting.duration})
                              </div>
                              {meeting.location && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  {meeting.location}
                                </div>
                              )}
                              <Badge className={`${getTypeColor(meeting.type)} border-0 text-xs`}>
                                {meeting.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No meetings scheduled for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
