# Supabase Configuration

This project uses Supabase as the backend database and authentication provider. This README provides instructions for configuring Supabase correctly to work with this application.

## Setup Instructions

### 1. Environment Variables

Make sure the following environment variables are set in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Required Database Tables

The application requires the following tables in your Supabase database:

- `products`: Stores product information
- `orders`: Stores order information
- `order_items`: Stores items within orders
- `users`: Stores user information
- `product_reviews`: Stores product reviews
- `product_specifications`: Stores detailed product specifications
- `store_settings`: Stores store configuration

### 3. Table Structure

The table structure should match the TypeScript types defined in `src/lib/supabase.ts`.

### 4. SQL Functions

For certain operations, SQL functions need to be created in your Supabase database. Run the following SQL in the Supabase SQL editor:

```sql
-- Create a function to update order status
CREATE OR REPLACE FUNCTION update_order_status(order_id INTEGER, new_status TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE orders
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = order_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Return true if at least one row was updated
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;
```

## Common Issues and Troubleshooting

### Order Status Updates Not Working

If you're experiencing issues with order status updates:

1. Check the console logs for specific error messages
2. Verify that your Supabase URL and API key are correct
3. Ensure the `orders` table has appropriate permissions for updates
4. Check if the `updated_at` column exists in your `orders` table
5. Verify you have the correct Row Level Security (RLS) policies configured

### Database Connection Issues

If the application cannot connect to the database:

1. Verify your Supabase URL and API key in the environment variables
2. Check if your Supabase project is active and not in maintenance mode
3. Test connectivity from your development environment to Supabase

### Tables Not Found

If you receive "relation does not exist" errors:

1. Make sure all required tables have been created
2. Check the table names match exactly (case-sensitive)
3. Ensure your Supabase user has access to these tables

## Supporting RLS Policies

For proper security, configure Row Level Security (RLS) policies in Supabase. Here are recommended policies:

### Orders Table

```sql
-- Authenticated users can read their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Only admins can update orders
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
```

## Support

For additional support, contact the development team.

# Adding SQL Functions to Supabase

To ensure the order status updates work properly, you need to add the following SQL functions to your Supabase database. These functions should be executed in the Supabase SQL Editor.

## Steps to Add SQL Functions:

1. Log in to your Supabase account
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Create a new query
5. Copy and paste the following SQL statements
6. Click "Run" to execute the query

```sql
-- Function 1: Standard order status update function
CREATE OR REPLACE FUNCTION update_order_status(order_id INTEGER, new_status TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE orders
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = order_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Return true if at least one row was updated
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Order status update function that bypasses RLS
-- This is useful if you're using Row Level Security
CREATE OR REPLACE FUNCTION update_order_status_public(p_order_id INTEGER, p_status TEXT)
RETURNS BOOLEAN
SECURITY DEFINER -- This means the function runs with the privileges of the user who created it
AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  -- Make sure the status value is valid
  IF p_status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status value: %', p_status;
  END IF;

  -- Perform the update
  UPDATE orders
  SET 
    status = p_status
  WHERE id = p_order_id;
  
  -- Check if any rows were updated
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Return true if at least one row was updated
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_order_status_public(INTEGER, TEXT) TO authenticated;
```

## Potential Issues and Solutions

If you're still experiencing issues with order updates, here are some things to check:

### 1. Check the Database Table Structure

Make sure your `orders` table has a column called `status` of type TEXT or VARCHAR. The structure should be:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### 2. Ensure RLS Policies Allow Updates

If you're using Row Level Security (RLS), make sure you have policies that allow updates:

```sql
-- Only authenticated users can update orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admins can update any order
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
```

### 3. Check for Console Errors

Open your browser's developer console (F12) to see if there are any specific error messages that can guide troubleshooting.

### 4. Try the SQL Function Directly

You can test if the function works by running this directly in the SQL Editor:

```sql
SELECT update_order_status_public(1, 'processing');
```

Replace `1` with an actual order ID from your database.

### Still Having Issues?

If you continue to experience problems, please contact support with the following information:
- Screenshots of any error messages
- Console logs
- Database schema information 