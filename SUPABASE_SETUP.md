# Supabase Setup for Electrify E-commerce Hub

This guide will help you set up and configure Supabase as the database for the Electrify E-commerce Hub project.

## Prerequisites

- Supabase account (sign up at [https://supabase.com](https://supabase.com) if you don't have one)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Log in to your Supabase account
2. Click on "New Project"
3. Enter a name for your project (e.g., "electrify-ecom-hub")
4. Choose a database password (save this somewhere secure)
5. Choose the region closest to you for best performance
6. Click "Create New Project"

## Step 2: Get Your Supabase Credentials

1. Once your project is created, go to the project dashboard
2. Navigate to Project Settings > API
3. Copy the "Project URL" and "anon/public" key
4. These will be used in your environment variables

## Step 3: Configure Environment Variables

1. In the root of your project, open the `.env` file (or create it if it doesn't exist)
2. Update it with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql` into the query editor
4. Run the query to create all the required tables and policies

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under Email Auth, ensure "Enable Email Signup" is turned on
3. Under Email Templates, you can customize the email templates if desired
4. Under URL Configuration, set your site URL (e.g., `http://localhost:5173` for local development)
5. Set any Redirect URLs (e.g., `http://localhost:5173/login`)

## Step 6: Set Up Storage (Optional)

If you want to store product images in Supabase Storage:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "products"
3. Set the privacy level to public if you want images to be publicly accessible
4. Update the Storage RLS policies according to your needs

## Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Try to sign up for an account using the registration form
3. Check if the user is created in the Supabase Authentication dashboard
4. Try viewing or adding products to check if the database functionality is working

## Database Tables Overview

The schema creates the following tables:

- `products`: Stores information about products
- `product_specifications`: Stores additional specifications for products
- `users`: Extends Supabase Auth with additional user profile information
- `orders`: Stores order information
- `order_items`: Stores items within an order
- `product_reviews`: Stores product reviews

## Row Level Security (RLS)

RLS is configured to ensure:

- Products are viewable by everyone but can only be modified by admins
- Users can only view and edit their own profiles
- Admins can view all user profiles
- Users can only view and create their own orders
- Users can add reviews to products, but can only edit/delete their own reviews
- Admins have full access to all tables

## Adding Admin Users

To designate a user as an admin:

1. Go to SQL Editor in your Supabase dashboard
2. Run the following SQL (replacing the user ID):

```sql
UPDATE users SET admin = true WHERE id = 'user-uuid-here';
```

## Getting Help

If you encounter any issues with the Supabase setup, check the following resources:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub Repo](https://github.com/supabase/supabase)
- [Supabase Discord Community](https://discord.supabase.com) 