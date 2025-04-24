
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signIn, signOut, signUp, getUserProfile, createUserProfile, ensureUserProfile } from '@/lib/auth';

type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
};

type AuthContextType = {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // First try to get the existing profile
      let userProfile = await getUserProfile(userId);
      
      // If no profile exists, create a minimal one
      if (!userProfile) {
        console.log("No profile found for user:", userId);
        console.log("Creating minimal profile with email:", email);
        
        try {
          userProfile = await createUserProfile(userId, {
            email: email,
            first_name: '',
            last_name: ''
          });
        } catch (profileError) {
          console.error("Error creating minimal profile:", profileError);
          // Continue - we'll handle this case in the login function
        }
      }
      
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser?.id && currentUser?.email) {
          await fetchUserProfile(currentUser.id, currentUser.email);
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id && currentUser?.email) {
        // Use setTimeout to avoid potential deadlocks with Supabase auth state changes
        setTimeout(() => {
          fetchUserProfile(currentUser.id, currentUser.email);
        }, 0);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await signIn(email, password);
      setUser(user);
      
      if (user?.id && user?.email) {
        // Create profile if it doesn't exist
        const userProfile = await fetchUserProfile(user.id, user.email);
        
        if (!userProfile) {
          // If profile still doesn't exist after attempt to create, handle the error
          console.error("Failed to get or create user profile");
        }
      }
      
      return { user, profile };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await signUp(email, password);
      setUser(user);
      return { user };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn: login,
        signUp: register,
        signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
