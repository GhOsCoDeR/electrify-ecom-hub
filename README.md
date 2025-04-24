# Royal Home Ghana

A modern eCommerce platform for home products, built with React, Vite, and Supabase.

## Deploying to Netlify

### Option 1: Deploy via Netlify Dashboard

1. Push your code to a GitHub repository
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select GitHub and choose your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in the Netlify dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
7. Click "Deploy site"

### Option 2: Deploy with Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Create a `.env.production.local` file with your Supabase credentials
5. Deploy your site: `netlify deploy --prod`

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Supabase credentials
4. Start the development server: `npm run dev`

## Features

- Modern UI with responsive design
- Admin dashboard for order and product management
- User authentication with Supabase
- Shopping cart functionality
- Order tracking and history
- Demo mode for testing without database permissions

## Technology Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase
- React Router
