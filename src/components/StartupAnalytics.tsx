import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Coins, Target } from "lucide-react";

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

interface StartupAnalyticsProps {
  interactions: SwiperInteractionWithProfile[];
}

export const StartupAnalytics = ({ interactions }: StartupAnalyticsProps) => {
  const analytics = useMemo(() => {
    // Age distribution
    const ageGroups: Record<string, number> = {
      "18-22": 0,
      "23-27": 0,
      "28-32": 0,
      "33+": 0
    };

    // Gender distribution
    const genderDistribution: Record<string, number> = {
      "Male": 0,
      "Female": 0,
      "Other": 0,
      "Prefer not to say": 0
    };

    // Coin allocation distribution
    const coinRanges: Record<string, number> = {
      "0 coins": 0,
      "1-25 coins": 0,
      "26-50 coins": 0,
      "51-75 coins": 0,
      "76-100 coins": 0
    };

    interactions.forEach(interaction => {
      // Age analysis
      if (interaction.swiper_age) {
        const age = parseInt(interaction.swiper_age);
        if (age >= 18 && age <= 22) ageGroups["18-22"]++;
        else if (age >= 23 && age <= 27) ageGroups["23-27"]++;
        else if (age >= 28 && age <= 32) ageGroups["28-32"]++;
        else if (age >= 33) ageGroups["33+"]++;
      }

      // Gender analysis
      if (interaction.swiper_gender) {
        const gender = interaction.swiper_gender;
        if (gender.toLowerCase().includes('male') && !gender.toLowerCase().includes('female')) {
          genderDistribution["Male"]++;
        } else if (gender.toLowerCase().includes('female')) {
          genderDistribution["Female"]++;
        } else if (gender.toLowerCase().includes('other')) {
          genderDistribution["Other"]++;
        } else {
          genderDistribution["Prefer not to say"]++;
        }
      } else {
        genderDistribution["Prefer not to say"]++;
      }

      // Coin allocation analysis
      const coins = interaction.coin_allocation;
      if (coins === 0) coinRanges["0 coins"]++;
      else if (coins >= 1 && coins <= 25) coinRanges["1-25 coins"]++;
      else if (coins >= 26 && coins <= 50) coinRanges["26-50 coins"]++;
      else if (coins >= 51 && coins <= 75) coinRanges["51-75 coins"]++;
      else if (coins >= 76 && coins <= 100) coinRanges["76-100 coins"]++;
    });

    // Convert to chart data
    const ageData = Object.entries(ageGroups).map(([age, count]) => ({ age, count }));
    const genderData = Object.entries(genderDistribution)
      .filter(([_, count]) => count > 0)
      .map(([gender, count]) => ({ gender, count }));
    const coinData = Object.entries(coinRanges)
      .filter(([_, count]) => count > 0)
      .map(([range, count]) => ({ range, count }));

    return { ageData, genderData, coinData };
  }, [interactions]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (interactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No data available yet</p>
            <p className="text-sm">Analytics will appear when you get likes from swipers</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Age Distribution */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Age Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gender Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, count }) => `${gender}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Coin Allocation Distribution */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Coin Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.coinData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};