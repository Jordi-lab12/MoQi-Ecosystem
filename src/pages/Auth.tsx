import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"swiper" | "startup">(
    (searchParams.get('role') as "swiper" | "startup") || "swiper"
  );
  
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload file to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('startup-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('startup-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Check if user has a profile, if so redirect to main app
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching profile in Auth:', error);
          }
          
          if (profile) {
            navigate('/');
          }
        } else {
          setUser(null);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Also check profile on initial load
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (profile && !error) {
          navigate('/');
        }
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
        console.log('Attempting login...');
        
        // Add timeout protection
        const loginPromise = supabase.auth.signInWithPassword({
          email,
          password
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout - please try again')), 10000)
        );
        
        const { error } = await Promise.race([loginPromise, timeoutPromise]) as any;
        console.log('Login result:', error ? 'Error' : 'Success');
        if (error) throw error;
        
        // Don't redirect here - let the auth state change handle it
        console.log('Login successful, waiting for redirect...');
      } else {
        // Sign up
        let imageUrl = '';
        
        // If startup and image file exists, upload it first
        if (role === 'startup' && imageFile) {
          setError("Uploading image...");
          imageUrl = await uploadImage(imageFile) || '';
          if (!imageUrl) {
            throw new Error('Failed to upload image. Please try again.');
          }
        }
        
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
                image: imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`
              })
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Profile will be created automatically by trigger with the metadata
          console.log('Profile created via trigger with user data');
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-2xl shadow-2xl">{/* Increased width for startup form */}
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
{!searchParams.get('role') && (
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
                )}

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
                        type="number"
                        value={age}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers
                          if (value === '' || /^\d+$/.test(value)) {
                            setAge(value);
                          }
                        }}
                        placeholder="Your age"
                        className="mt-1"
                        min="16"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="study">Study</Label>
                      <Select value={study} onValueChange={setStudy}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your field of study" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="psychology">Psychology</SelectItem>
                          <SelectItem value="economics">Economics</SelectItem>
                          <SelectItem value="medicine">Medicine</SelectItem>
                          <SelectItem value="law">Law</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="communications">Communications</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Compact Grid Layout for Startup Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your startup"
                        className="mt-1 h-20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="employees">Team Size</Label>
                        <Input
                          id="employees"
                          value={employees}
                          onChange={(e) => setEmployees(e.target.value)}
                          placeholder="Number of employees"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="usp">Unique Selling Point</Label>
                        <Textarea
                          id="usp"
                          value={usp}
                          onChange={(e) => setUsp(e.target.value)}
                          placeholder="What makes you unique?"
                          className="mt-1 h-16"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mission">Mission</Label>
                        <Textarea
                          id="mission"
                          value={mission}
                          onChange={(e) => setMission(e.target.value)}
                          placeholder="Your mission"
                          className="mt-1 h-16"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="vision">Vision</Label>
                      <Textarea
                        id="vision"
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        placeholder="Your vision"
                        className="mt-1 h-16"
                        required
                      />
                    </div>
                    
                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50/50">
                      <div className="text-center">
                        <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                          📸 Upload Startup Image *
                        </Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="mt-2"
                          required
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Choose an image from your computer to represent your startup
                        </p>
                        {imagePreview && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-green-600 mb-2">Preview:</p>
                            <img 
                              src={imagePreview} 
                              alt="Startup preview" 
                              className="w-24 h-24 mx-auto object-cover rounded-lg border-2 border-gray-200"
                            />
                          </div>
                        )}
                      </div>
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