# Deploying Royal Home Ghana to Netlify

This project is configured for easy deployment to Netlify. Follow these steps to deploy your Royal Home Ghana eCommerce application.

## Method 1: Deploy Using Our Script (Recommended)

The easiest way to deploy is using our included deploy script:

1. Make sure you have Node.js installed
2. Run the deploy command:
   ```
   npm run deploy
   ```
3. Follow the prompts from the Netlify CLI

This script will:
- Check if Netlify CLI is installed and install it if needed
- Build your project
- Log you in to Netlify if needed
- Deploy your site to Netlify

## Method 2: Manual Deployment via Netlify Dashboard

1. Push your code to a GitHub repository
2. Log in to your Netlify account at [app.netlify.com](https://app.netlify.com)
3. Click "New site from Git"
4. Select GitHub and authorize Netlify if needed
5. Select your repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Show advanced" and add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
8. Click "Deploy site"

## Environment Variables

Make sure to set these environment variables in Netlify:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Using a Custom Domain

To set up a custom domain:

1. Go to your site's dashboard in Netlify
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your domain

## Troubleshooting

### Build Errors

If your build fails, check the Netlify build logs for details. Common issues include:

- Missing environment variables
- Node version conflicts (we use Node 18 by default)
- Dependency issues

### Demo Mode

Remember that this application has a "Demo Mode" feature that allows the UI to work even if the database connection fails. This can be useful for demos or presentations.

To enable Demo Mode:
1. Click the "Demo Mode" button in the troubleshooting panel
2. Or click "Enable Demo Mode" when encountering a database error

### Database Access

If you encounter database permission issues after deployment:

1. Check your Supabase RLS policies
2. Verify that your Supabase anon key has the correct permissions
3. Follow the instructions in the README-supabase.md file to set up the required functions

For additional help, refer to the [Netlify Documentation](https://docs.netlify.com/) or [Supabase Documentation](https://supabase.io/docs/). 