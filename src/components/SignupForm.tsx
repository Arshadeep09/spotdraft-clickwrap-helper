import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Declare global types for SpotDraft SDK
declare global {
  interface Window {
    SdClickthrough: any;
  }
}

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sdClickthrough, setSdClickthrough] = useState<any>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Component mounted, checking for SpotDraft SDK...");
    
    // Check if SDK is already loaded
    if (window.SdClickthrough) {
      console.log("SDK already available, initializing...");
      initializeClickthrough();
      return;
    }

    // Listen for SDK load event
    const handleSDKLoaded = () => {
      console.log("sdClickthroughLoaded event fired");
      setSdkLoaded(true);
      initializeClickthrough();
    };

    // Add event listener
    window.addEventListener("sdClickthroughLoaded", handleSDKLoaded);

    // Fallback: check periodically if SDK is loaded
    let attempts = 0;
    const checkSDK = setInterval(() => {
      attempts++;
      console.log(`Checking for SDK, attempt ${attempts}`);
      
      if (window.SdClickthrough && !sdClickthrough) {
        console.log("SpotDraft SDK detected via polling");
        clearInterval(checkSDK);
        setSdkLoaded(true);
        initializeClickthrough();
      } else if (attempts >= 15) {
        console.warn("SpotDraft SDK failed to load after 15 attempts");
        clearInterval(checkSDK);
        // Show error state
        setSdkLoaded(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener("sdClickthroughLoaded", handleSDKLoaded);
      clearInterval(checkSDK);
    };
  }, []);

  const initializeClickthrough = async () => {
    try {
      console.log("Creating SdClickthrough instance with config:", {
        clickwrapId: "c6deb09d-a5d2-4214-84a8-e6b3ea1c5356",
        hostLocationDomId: "clickthrough-host",
        baseUrl: "https://api.me.spotdraft.com/"
      });
      
      const clickthrough = new window.SdClickthrough({
        clickwrapId: "c6deb09d-a5d2-4214-84a8-e6b3ea1c5356",
        hostLocationDomId: "clickthrough-host",
        baseUrl: "https://api.me.spotdraft.com/"
      });
      
      console.log("Calling clickthrough.init()...");
      
      // Wait for init to complete and handle the promise
      await clickthrough.init();
      
      setSdClickthrough(clickthrough);
      console.log("Clickthrough initialized successfully");
    } catch (error) {
      console.error("Error initializing Clickthrough:", error);
      console.log("SpotDraft API failed - keeping SDK loaded but clickthrough failed");
      // Don't reset sdkLoaded - let SpotDraft handle its own checkbox
      // Just keep sdClickthrough as null
      setSdClickthrough(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !password || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must contain a minimum of 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (sdClickthrough) {
        // Execute clickthrough contract
        const contractData = await sdClickthrough.submit({
          user_identifier: email,
          first_name: fullName.split(' ')[0],
          last_name: fullName.split(' ').slice(1).join(' '),
          user_email: email,
        });

        console.log("Clickthrough contract executed:", contractData);

        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Careem. Your account has been created and terms accepted.",
        });

        // Reset form
        setFullName("");
        setPassword("");
        setEmail("");
      } else {
        throw new Error("Clickthrough not initialized");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-careem relative overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-shape-1 rounded-3xl opacity-80 animate-float"></div>
        <div className="absolute top-32 right-16 w-48 h-48 bg-gradient-shape-2 rounded-2xl opacity-70 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-32 w-56 h-56 bg-gradient-shape-3 rounded-3xl opacity-75 animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-shape-4 rounded-2xl opacity-80 animate-float"></div>
        
        {/* Medium shapes */}
        <div className="absolute top-64 left-1/2 w-32 h-32 bg-gradient-shape-2 rounded-xl opacity-60 animate-float-delayed"></div>
        <div className="absolute top-20 right-1/3 w-24 h-24 bg-gradient-shape-3 rounded-lg opacity-70 animate-float-slow"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-gradient-shape-1 rounded-xl opacity-65 animate-float"></div>
        
        {/* Small shapes */}
        <div className="absolute top-48 left-2/3 w-16 h-16 bg-gradient-shape-4 rounded-lg opacity-50 animate-float-slow"></div>
        <div className="absolute bottom-64 right-1/4 w-20 h-20 bg-gradient-shape-2 rounded-lg opacity-60 animate-float-delayed"></div>
      </div>

      {/* Header */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
        <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">Help Center</span>
        </div>
        <Select defaultValue="english">
          <SelectTrigger className="w-32 border-none bg-white/10 backdrop-blur-sm text-white">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="arabic">العربية</SelectItem>
            <SelectItem value="urdu">اردو</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Main Form */}
          <Card className="bg-gradient-card backdrop-blur-sm shadow-careem border-0 relative">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="text-3xl font-bold text-primary">
                  Careem
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Sign up with Careem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your password must contain a minimum of 6 characters
                  </p>
                </div>

                {/* Clickthrough Terms Container - Only SpotDraft SDK checkbox */}
                <div className="pt-2 pb-4">
                  <div id="clickthrough-host" className="text-sm text-muted-foreground text-center min-h-[40px]">
                    {/* SpotDraft SDK will populate this container with its checkbox */}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-soft transition-all duration-300 hover:shadow-careem hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign up"}
                </Button>

                <p className="text-xs text-muted-foreground text-center pt-4">
                  This page is protected by reCAPTCHA and is subject to the Google Privacy Policy and Terms of Service
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;