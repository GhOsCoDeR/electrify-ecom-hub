import { supabase } from '@/integrations/supabase/client';

export { supabase };

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
  store_settings: {
    id: number;
    store_name: string;
    contact_email: string;
    logo_url: string | null;
    favicon_url: string | null;
    email_notifications: boolean;
    maintenance_mode: boolean;
    currency: string;
    tax_rate: number;
    shipping_fee: number;
    enable_guest_checkout: boolean;
    theme_color: string;
    created_at: string;
    updated_at: string;
  };
};
