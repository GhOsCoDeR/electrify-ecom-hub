
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signIn, signOut, signUp, getUserProfile, createUserProfile } from '@/lib/auth';

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        console.log("No profile found for user:", userId);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser?.id) {
          await fetchUserProfile(currentUser.id);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        // Use setTimeout to avoid potential deadlocks with Supabase auth state changes
        setTimeout(() => {
          fetchUserProfile(currentUser.id);
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
      
      if (user?.id) {
        await fetchUserProfile(user.id);
        if (!profile) {
          throw new Error("Login failed");
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
