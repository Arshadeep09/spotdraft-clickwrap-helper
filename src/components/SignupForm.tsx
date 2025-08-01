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
  const { toast } = useToast();

  useEffect(() => {
    // Listen for SDK load event
    const handleSDKLoaded = () => {
      try {
        const clickthrough = new window.SdClickthrough({
          clickwrapId: "79c580c0-5782-4373-9556-d4612fc84a1b",
          hostLocationDomId: "clickthrough-host",
          baseUrl: "https://api.in.spotdraft.com/"
        });
        clickthrough.init();
        setSdClickthrough(clickthrough);
      } catch (error) {
        console.error("Error initializing Clickthrough:", error);
      }
    };

    window.addEventListener("sdClickthroughLoaded", handleSDKLoaded);

    return () => {
      window.removeEventListener("sdClickthroughLoaded", handleSDKLoaded);
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">Help Center</span>
        </div>
        <Select defaultValue="english">
          <SelectTrigger className="w-32 border-none bg-transparent">
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

      {/* Main Form */}
      <Card className="w-full max-w-md bg-gradient-card shadow-elegant border-0">
        <CardHeader className="text-center pb-6">
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

            {/* Clickthrough Terms Container */}
            <div className="py-4">
              <div id="clickthrough-host" className="text-sm text-muted-foreground text-center">
                {/* SpotDraft Clickthrough will render here */}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-soft transition-all duration-300 hover:shadow-elegant"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-4">
              By registering you agree to our Terms & Conditions
            </p>

            <p className="text-xs text-muted-foreground text-center">
              This page is protected by reCAPTCHA and is subject to the Google Privacy Policy and Terms of Service
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;