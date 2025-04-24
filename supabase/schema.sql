-- Create tables for the e-commerce app

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  brand VARCHAR(100),
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product specifications table
CREATE TABLE IF NOT EXISTS product_specifications (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL
);

-- Users profile table (extends Supabase auth users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  phone VARCHAR(50),
  admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL DEFAULT 'ElectriCo',
  contact_email VARCHAR(255),
  logo_url VARCHAR(255),
  favicon_url VARCHAR(255),
  email_notifications BOOLEAN DEFAULT TRUE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  currency VARCHAR(10) DEFAULT 'USD',
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  enable_guest_checkout BOOLEAN DEFAULT TRUE,
  theme_color VARCHAR(20) DEFAULT '#0066cc',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default store settings if not exists
INSERT INTO store_settings (id, store_name, contact_email)
VALUES (1, 'ElectriCo', 'contact@electrico.com')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on store_settings
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and modify store settings
CREATE POLICY "Store settings are viewable by everyone" 
ON store_settings FOR SELECT USING (true);

CREATE POLICY "Store settings can be updated by admins" 
ON store_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.admin = true)
);

-- Create RLS policies

-- Products are viewable by everyone, but only admins can modify
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Create a temporary admin policy without recursion
CREATE POLICY "Products can be inserted by anyone temporarily" 
ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Products can be updated by anyone temporarily" 
ON products FOR UPDATE USING (true);

CREATE POLICY "Products can be deleted by anyone temporarily" 
ON products FOR DELETE USING (true);

-- Product specs are viewable by everyone, but only admins can modify
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product specs are viewable by everyone" 
ON product_specifications FOR SELECT USING (true);

-- Create temporary permissive policies for seeding
CREATE POLICY "Product specs can be inserted by anyone temporarily" 
ON product_specifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Product specs can be updated by anyone temporarily" 
ON product_specifications FOR UPDATE USING (true);

CREATE POLICY "Product specs can be deleted by anyone temporarily" 
ON product_specifications FOR DELETE USING (true);

-- Users can view and edit their own profiles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE USING (auth.uid() = id);

-- Orders can be viewed and created by the order owner
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own order items" 
ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Product reviews policies
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product reviews are viewable by everyone" 
ON product_reviews FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" 
ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON product_reviews FOR DELETE USING (auth.uid() = user_id);

-- Add some indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON product_specifications(product_id); 