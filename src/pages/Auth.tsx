import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"swiper" | "startup">("swiper");
  
  // Profile fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  
  // Swiper fields
  const [age, setAge] = useState("");
  const [study, setStudy] = useState("");
  
  // Startup fields
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [usp, setUsp] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [industry, setIndustry] = useState("");
  const [founded, setFounded] = useState("");
  const [employees, setEmployees] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Check if user has a profile, if so redirect to main app
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile) {
            navigate('/');
          }
        } else {
          setUser(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        // Sign up
        // Generate a unique username by adding timestamp if needed
        const uniqueUsername = username + '_' + Date.now().toString().slice(-4);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name,
              username: uniqueUsername,
              role,
              ...(role === 'swiper' ? {
                age,
                study,
                gender: 'Male' // Default
              } : {
                tagline,
                description,
                usp,
                mission,
                vision,
                industry,
                founded,
                employees,
                logo: '🚀',
                image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`
              })
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Profile will be created automatically by trigger
          // Now update it with the additional fields
          const updateData: any = { role, name, username };
          
          if (role === 'swiper') {
            updateData.age = age;
            updateData.study = study;
            updateData.gender = 'Male';
          } else {
            updateData.tagline = tagline;
            updateData.description = description;
            updateData.usp = usp;
            updateData.mission = mission;
            updateData.vision = vision;
            updateData.industry = industry;
            updateData.founded = founded;
            updateData.employees = employees;
            updateData.logo = '🚀';
            updateData.image = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`;
          }
          
          // Profile will be created automatically by trigger with the metadata
          console.log('Profile created via trigger with user data');
          
          navigate('/');
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => navigate('/')} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoQi
              </CardTitle>
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <div className="w-8" />
          </div>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={role} onValueChange={(value: "swiper" | "startup") => setRole(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="swiper">Swiper (Student)</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="mt-1"
                    required
                  />
                </div>

                {role === 'swiper' ? (
                  <>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Your age"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="study">Study</Label>
                      <Input
                        id="study"
                        value={study}
                        onChange={(e) => setStudy(e.target.value)}
                        placeholder="What you study"
                        className="mt-1"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Your startup's tagline"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your startup"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="Your industry"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="founded">Founded</Label>
                      <Input
                        id="founded"
                        value={founded}
                        onChange={(e) => setFounded(e.target.value)}
                        placeholder="Year founded"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="employees">Employees</Label>
                      <Input
                        id="employees"
                        value={employees}
                        onChange={(e) => setEmployees(e.target.value)}
                        placeholder="Number of employees"
                        className="mt-1"
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isLoading}
            >
              {isLoading ? (
                "Loading..."
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </>
              )}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};