import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, Target, Calendar, Bell } from "lucide-react";
import { MeetingCalendar } from "./MeetingCalendar";
import { FeedbackRequests } from "./FeedbackRequests";
import { Portfolio } from "./Portfolio";
import type { Startup, FeedbackType } from "@/pages/Index";

interface DashboardProps {
  onStartSwiping: () => void;
  likedStartups: Startup[];
  coinAllocations: Record<string, number>;
  feedbackPreferences: Record<string, FeedbackType>;
}

export const Dashboard = ({ onStartSwiping, likedStartups, coinAllocations, feedbackPreferences }: DashboardProps) => {
  const totalStartups = 5; // Replace with actual number of startups
  const investmentAmount = 1000; // Replace with actual investment amount

  const totalAllocated = Object.values(coinAllocations).reduce((acc, val) => acc + val, 0);
  const remainingAllocation = investmentAmount - totalAllocated;

  const topStartup = Object.entries(coinAllocations).sort(([, a], [, b]) => b - a)[0];
  const topStartupName = topStartup ? likedStartups.find(startup => startup.id === topStartup[0])?.name : "N/A";
  const topStartupAllocation = topStartup ? topStartup[1] : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome to Your Swiper Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Here's an overview of your activity and portfolio.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Startups Card */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Total Startups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold text-blue-600">
              <Users className="w-6 h-6 mr-2" />
              {totalStartups}
            </div>
          </CardContent>
        </Card>

        {/* Liked Startups Card */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Liked Startups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold text-green-600">
              <TrendingUp className="w-6 h-6 mr-2" />
              {likedStartups.length}
            </div>
          </CardContent>
        </Card>

        {/* Investment Allocation Card */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Investment Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${totalAllocated} / ${investmentAmount}
            </div>
            <p className="text-sm text-gray-500">
              Remaining: ${remainingAllocation}
            </p>
          </CardContent>
        </Card>

        {/* Top Startup Card */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Top Startup
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topStartupName ? (
              <>
                <div className="text-xl font-bold text-orange-600">{topStartupName}</div>
                <p className="text-sm text-gray-500">
                  Allocation: ${topStartupAllocation}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No allocations yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
        <Button 
          onClick={onStartSwiping}
          className="px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-4"
        >
          <Sparkles className="w-8 h-8" />
          Start Swiping
        </Button>
        
        <MeetingCalendar />
        
        <FeedbackRequests />
      </div>

      {/* Portfolio Section */}
      <Portfolio likedStartups={likedStartups} coinAllocations={coinAllocations} feedbackPreferences={feedbackPreferences} />
    </div>
  );
};
