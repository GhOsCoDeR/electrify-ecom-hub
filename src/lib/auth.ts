
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
  
  console.log('Signup response:', data.user);
  
  // Check if user is actually created or if email confirmation is required
  if (data?.user?.identities?.length === 0) {
    throw new Error('Email already registered');
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
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        // User doesn't exist, create the profile
        console.log('User profile does not exist, creating new profile');
      } else {
        console.error('Error checking existing user:', checkError);
        throw checkError;
      }
    }
    
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
      .select();
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    
    console.log('User profile created successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};
