
import { createClient } from '@supabase/supabase-js';

// These should be stored in environment variables in a production app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 Supabase Configuration Error 🚨');
  console.error('Please set up your Supabase environment variables:');
  console.error('1. Click the green Supabase button on the top right');
  console.error('2. Connect your Supabase project');
  console.error('3. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  
  throw new Error(
    'Supabase environment variables are missing. Please connect your Supabase project in Lovable.'
  );
}

// Now we can safely create the client since we've validated the environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  products: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    brand: string;
    in_stock: boolean;
    created_at: string;
  };
  orders: {
    id: number;
    user_id: string;
    status: string;
    total: number;
    created_at: string;
  };
  order_items: {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
  };
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  product_reviews: {
    id: number;
    product_id: number;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
  };
  product_specifications: {
    id: number;
    product_id: number;
    name: string;
    value: string;
  };
};
