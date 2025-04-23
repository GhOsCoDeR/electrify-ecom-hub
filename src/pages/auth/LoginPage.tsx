
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import WebsiteLayout from "@/components/layout/WebsiteLayout";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API request
    try {
      // In a real app, we would send the login data to an API
      console.log("Login data:", data);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to ElectriCo.",
      });
      
      // In a real app, we would redirect to the dashboard or homepage
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WebsiteLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">EC</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-electric-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register("rememberMe")} />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-electric-blue text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-electric-blue hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="w-full">
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default LoginPage;
