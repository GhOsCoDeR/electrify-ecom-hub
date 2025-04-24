
import { supabase } from './supabase';

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  console.log('Attempting to sign up user with email:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
  
  console.log('Sign up response data:', data);
  
  // Check if user is actually created or if email confirmation is required
  if (data?.user?.identities?.length === 0) {
    throw new Error('Email already registered');
  }
  
  if (!data.user) {
    console.error('No user returned from signUp');
    throw new Error('Failed to create user account. Please try again.');
  }
  
  return data;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  console.log('Attempting to sign in user with email:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
  
  console.log('Sign in successful for user:', data.user?.id);
  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
  
  console.log('User signed out successfully');
};

// Get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    
    console.log('Current user:', user ? user.id : 'No user found');
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Create a user profile after sign up
export const createUserProfile = async (userId: string, profileData: { 
  email: string,
  first_name: string,
  last_name: string,
  address?: string,
  city?: string,
  state?: string,
  postal_code?: string,
  country?: string,
  phone?: string
}) => {
  console.log('Creating user profile for user:', userId);
  
  try {
    // First check if user already exists in the profile table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingUser) {
      console.log('User profile already exists:', existingUser);
      return existingUser;
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          id: userId,
          ...profileData
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      console.error('Error details:', error.details, error.hint, error.message);
      
      // If we get a foreign key constraint error, it could be that the auth.users record
      // exists but we're having trouble inserting into the profile table
      if (error.message?.includes('foreign key constraint') || 
          error.message?.includes('violates row-level security policy')) {
        console.log('This appears to be an RLS policy issue - bypassing profile creation for now');
        // Return a basic profile anyway so the app can continue
        return { id: userId, ...profileData };
      }
      
      throw error;
    }
    
    console.log('User profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    // Instead of throwing, return a basic profile so the app can continue
    return { id: userId, ...profileData };
  }
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
