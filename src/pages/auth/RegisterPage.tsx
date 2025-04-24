
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { createUserProfile } from "@/lib/auth";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [termsChecked, setTermsChecked] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const handleTermsChange = (checked: boolean) => {
    setTermsChecked(checked);
    setValue('terms', checked);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log("Starting registration process for:", data.email);
      
      // Register the user with Supabase Auth
      const userData = await signUp(data.email, data.password);
      console.log("Signup response:", userData);
      
      if (!userData) {
        console.error("No response data from signUp");
        throw new Error("Failed to create user account");
      }
      
      if (!userData.user) {
        console.error("No user data returned from signUp");
        throw new Error("Failed to create user account");
      }
      
      // Create the user profile in the database
      await createUserProfile(userData.user.id, {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName
      });
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. You can now log in.",
      });
      
      navigate("/login");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error messages
      if (error.message?.includes("Email already registered")) {
        setErrorMessage("This email is already registered. Please try logging in instead.");
      } else if (error.message?.includes("Password should be at least 6 characters")) {
        setErrorMessage("Password should be at least 6 characters.");
      } else if (error.message?.includes("duplicate key value violates unique constraint")) {
        setErrorMessage("This email is already registered. Please try logging in instead.");
      } else {
        setErrorMessage(error.message || "There was an error creating your account. Please try again.");
      }
      
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
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
          
          <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
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
                <Label htmlFor="password">Password</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsChecked}
                  onCheckedChange={handleTermsChange}
                  className="mt-1"
                  {...register("terms")}
                />
                <div>
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="text-electric-blue hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-electric-blue hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm">{errors.terms.message}</p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-electric-blue text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-electric-blue hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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

export default RegisterPage;
