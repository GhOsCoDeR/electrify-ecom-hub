import { supabase } from './supabase';
import type { Tables } from './supabase';

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data;
};

export const getProductById = async (id: number) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_specifications (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const getProductsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
  
  return data;
};

// Orders
export const createOrder = async (
  userId: string, 
  items: Array<{ product_id: number; quantity: number; price: number }>, 
  total: number
) => {
  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      { user_id: userId, status: 'pending', total }
    ])
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }
  
  // Add order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error('Error adding order items:', itemsError);
    throw itemsError;
  }
  
  return order;
};

export const getOrdersByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
  
  return data;
};

// User profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, profile: Partial<Tables['users']>) => {
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
  
  return data;
};

// Reviews
export const getProductReviews = async (productId: number) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      users (first_name, last_name)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
  
  return data;
};

export const addProductReview = async (
  productId: number, 
  userId: string, 
  rating: number, 
  comment: string
) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert([
      { product_id: productId, user_id: userId, rating, comment }
    ])
    .select()
    .single();
  
  if (error) {
    console.error(`Error adding review for product ${productId}:`, error);
    throw error;
  }
  
  return data;
}; 